import observeRect from '@reach/observe-rect';
import { DirectusFrame, type SavedData } from './directus-frame.ts';
import { OverlayElement } from './overlay-element.ts';

export type EditConfig = {
	collection: string;
	item: string | number | null;
	fields?: string[];
	mode?: 'drawer' | 'modal' | 'popover';
};

type RectObserver = {
	observe(): void;
	unobserve(): void;
};

export type EditableElementOptions = {
	customClass?: string | undefined;
	onSaved?: ((data: Omit<SavedData, 'key'>) => void) | undefined;
};

export class EditableElement {
	private static readonly DATASET = 'directus';
	private static readonly DATA_ATTRIBUTE_VALID_KEYS: Array<keyof EditConfig> = ['collection', 'item', 'fields', 'mode'];

	readonly element: HTMLElement;
	readonly key: string; // A unique key to identify editable elements – not to be confused with the primary key
	readonly editConfig: EditConfig;
	readonly rectObserver: RectObserver;
	readonly overlayElement: OverlayElement;

	rect: DOMRect;
	hover = false;
	disabled = false;
	onSaved: EditableElementOptions['onSaved'] = undefined;

	constructor(element: HTMLElement) {
		this.element = element;
		this.element.addEventListener('mouseover', this.onMouseenter.bind(this));
		this.element.addEventListener('mouseleave', this.onMouseleave.bind(this));

		this.key = crypto.randomUUID();
		this.editConfig = EditableElement.editAttrToObject(this.element.dataset[EditableElement.DATASET]!);

		this.rect = this.element.getBoundingClientRect();
		this.overlayElement = new OverlayElement();
		this.overlayElement.updateRect(this.rect);
		this.overlayElement.editButton.addEventListener('click', this.onClickEdit.bind(this));

		// @ts-expect-error
		this.rectObserver = observeRect(this.element, this.onObserveRect.bind(this));
		this.rectObserver.observe();
	}

	static query(elements: HTMLElement | HTMLElement[] | undefined) {
		if (elements === undefined)
			return Array.from(document.querySelectorAll(`[data-${EditableElement.DATASET}]`)) as HTMLElement[];

		const elementsArray = Array.isArray(elements) ? elements : [elements];
		return elementsArray
			.filter((element) => element instanceof HTMLElement)
			.map((element) => {
				if (element.dataset[EditableElement.DATASET] !== undefined) return element;
				const childElement = element.querySelector(`[data-${EditableElement.DATASET}]`);
				return childElement as HTMLElement;
			})
			.filter((element) => element !== null);
	}

	static objectToEditAttr(editConfig: EditConfig): string {
		const dataAttr: string[] = [];

		for (const [key, value] of Object.entries(editConfig)) {
			if (!EditableElement.validEditConfigKey(key as keyof EditConfig)) continue;

			if (key === 'fields' && Array.isArray(value)) {
				dataAttr.push(`${key}:${value.join(',')}`);
			} else {
				dataAttr.push(`${key}:${value}`);
			}
		}

		return dataAttr.join(';');
	}

	private static editAttrToObject(str: string) {
		const pairs = str.split(';');
		const result: Record<string, any> = {};

		pairs.forEach((pair) => {
			const keyValue = pair.split(':');
			if (keyValue[0] === undefined || keyValue?.[1] === undefined) return;

			const key = keyValue[0].trim() as keyof EditConfig;
			if (!EditableElement.validEditConfigKey(key)) return;

			const value = keyValue[1];

			if (key === 'fields') {
				result['fields'] = value.split(',').map((field) => field.trim());
				return;
			}

			result[key] = value.trim();
		});

		return result as EditConfig;
	}

	private static validEditConfigKey(key: keyof EditConfig) {
		return EditableElement.DATA_ATTRIBUTE_VALID_KEYS.includes(key);
	}

	applyOptions({ customClass, onSaved }: EditableElementOptions) {
		this.overlayElement.setCustomClass(customClass);
		if (onSaved !== undefined) this.onSaved = onSaved;
	}

	removeHoverListener() {
		this.element.removeEventListener('mouseenter', this.onMouseenter.bind(this));
		this.element.removeEventListener('mouseleave', this.onMouseleave.bind(this));
	}

	private onClickEdit() {
		new DirectusFrame().send('edit', { key: this.key, editConfig: this.editConfig, rect: this.rect });
	}

	private onMouseenter(event: MouseEvent) {
		this.toggleItemHover(true, event);
	}

	private onMouseleave(event: MouseEvent) {
		this.toggleItemHover(false, event);
	}

	private toggleItemHover(hover: boolean, event: MouseEvent) {
		if (this.element !== event.currentTarget || this.hover === hover) return;
		this.hover = hover;
		this.overlayElement.toggleHover(hover);
	}

	private onObserveRect(rect: DOMRect) {
		if (this.disabled) return;
		this.rect = rect;
		this.overlayElement.updateRect(rect);
	}
}
