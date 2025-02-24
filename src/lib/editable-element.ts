import observeRect from '@reach/observe-rect';
import { OverlayElement } from './overlay-element.ts';
import type { SavedData } from './directus-frame.ts';

export type Form = {
	collection: string;
	item: string | number | null;
	fields?: string[];
	mode: 'drawer';
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
	private static readonly DATA_ATTRIBUTE_VALID_KEYS: Array<keyof Form> = ['collection', 'item', 'fields', 'mode'];

	readonly element: HTMLElement;
	readonly key: string; // A unique key to identify editable elements – not to be confused with the primary key
	readonly form: Form;
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
		this.form = this.strToObject(this.element.dataset[EditableElement.DATASET]!);

		this.rect = this.element.getBoundingClientRect();
		this.overlayElement = new OverlayElement(this.key, this.rect, this.form);

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

	applyOptions({ customClass, onSaved }: EditableElementOptions) {
		this.overlayElement.setCustomClass(customClass);
		if (onSaved !== undefined) this.onSaved = onSaved;
	}

	removeHoverListener() {
		this.element.removeEventListener('mouseenter', this.onMouseenter.bind(this));
		this.element.removeEventListener('mouseleave', this.onMouseleave.bind(this));
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

	private strToObject(str: string) {
		const pairs = str.split(';');
		const result: Record<string, any> = {};

		pairs.forEach((pair) => {
			const keyValue = pair.split(':');
			if (keyValue[0] === undefined || keyValue?.[1] === undefined) return;

			const key = keyValue[0].trim() as keyof Form;
			if (!EditableElement.DATA_ATTRIBUTE_VALID_KEYS.includes(key)) return;

			const value = keyValue[1];

			if (key === 'fields') {
				result['fields'] = value.split(',').map((field) => field.trim());
				return;
			}

			result[key] = value.trim();
		});

		return result as Form;
	}
}
