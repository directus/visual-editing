import { EditableStore } from './editable-store.ts';
import { OverlayManager } from './overlay-manager.ts';

export class OverlayElement {
	private noDimensions: boolean = false;
	private element: HTMLElement;

	readonly editButton: HTMLButtonElement;

	constructor(container?: HTMLElement) {
		this.element = this.createElement();
		this.editButton = this.createEditButton();
		this.createRectElement();

		container = container ?? OverlayManager.getGlobalOverlay();
		container.appendChild(this.element);

		if (EditableStore.highlightOverlayElements) this.toggleHighlight(true);
	}

	private createElement() {
		const element = document.createElement('div');
		element.classList.add(OverlayManager.RECT_CLASS_NAME);
		return element;
	}

	private createRectElement() {
		const rectInnerElement = document.createElement('div');
		rectInnerElement.classList.add(OverlayManager.RECT_INNER_CLASS_NAME);
		this.element.appendChild(rectInnerElement);
	}

	private createEditButton() {
		const editButton = document.createElement('button');
		editButton.type = 'button';
		editButton.classList.add(OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME);
		this.element.appendChild(editButton);
		return editButton;
	}

	updateRect(rect: DOMRect) {
		const hasDimensions = rect.width !== 0 && rect.height !== 0;

		if (!this.noDimensions && !hasDimensions) {
			this.noDimensions = true;
			this.disable();
			return;
		}

		if (this.noDimensions && hasDimensions) {
			this.noDimensions = false;
			this.enable();
		}

		this.element.style.width = `${rect.width}px`;
		this.element.style.height = `${rect.height}px`;
		this.element.style.transform = `translate(${rect.left}px,${rect.top}px)`;
	}

	setCustomClass(customClass: string | undefined) {
		if (customClass === undefined) return;

		const isValidClassName = /^[a-zA-Z_][\w-]*$/.test(customClass);
		if (isValidClassName) this.element.classList.add(customClass);
	}

	toggleHover(hover: boolean) {
		if (hover) this.element.classList.add(OverlayManager.RECT_HOVER_CLASS_NAME);
		else this.element.classList.remove(OverlayManager.RECT_HOVER_CLASS_NAME);
	}

	toggleHighlight(show: boolean) {
		if (show) this.element.classList.add(OverlayManager.RECT_HIGHLIGHT_CLASS_NAME);
		else this.element.classList.remove(OverlayManager.RECT_HIGHLIGHT_CLASS_NAME);
	}

	disable() {
		this.element.style.display = 'none';
	}

	enable() {
		this.element.style.removeProperty('display');
	}

	remove() {
		this.element.remove();
	}
}
