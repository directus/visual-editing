import observeRect from '@reach/observe-rect';
import { OverlayManager } from './overlay-manager.ts';
import { OverlayElement } from './overlay-element.ts';

type Form = {
	collection: string;
	item: string | number;
	fields?: string[];
	mode: 'drawer';
};

type RectObserver = {
	observe(): void;
	unobserve(): void;
};

export type EditableElementOptions = {
	customClass?: string | undefined;
	onSaved?: ((payload: Record<string, any>) => void) | undefined;
};

export class EditableElement {
	private static readonly DATA_ATTRIBUTE_VALID_KEYS: Array<keyof Form> = ['collection', 'item', 'fields', 'mode'];

	public static readonly DATASET = 'directus';

	readonly element: HTMLElement;
	readonly key: string;
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
		this.overlayElement = OverlayManager.addElement(this.rect);

		// @ts-expect-error
		this.rectObserver = observeRect(this.element, this.onObserveRect.bind(this));
		this.rectObserver.observe();
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

			const key = keyValue[0] as keyof Form;
			if (!EditableElement.DATA_ATTRIBUTE_VALID_KEYS.includes(key)) return;

			const value = keyValue[1];

			if (key === 'fields') {
				result['fields'] = value.split(',');
				return;
			}

			result[key] = value;
		});

		return result as Form;
	}
}
