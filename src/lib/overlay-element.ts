import { EditableStore } from './editable-store.ts';
import { OverlayManager } from './overlay-manager.ts';

export class OverlayElement {
	private hasNoDimensions: boolean = false;
	private element: HTMLElement;
	private container: HTMLElement;

	readonly editButton: HTMLButtonElement;

	constructor() {
		this.container = this.createContainer();
		this.element = this.createElement();
		this.editButton = this.createEditButton();
		this.createRectElement();

		OverlayManager.getGlobalOverlay().appendChild(this.container);

		if (EditableStore.highlightOverlayElements) this.toggleHighlight(true);

		this.element.addEventListener('click', () => this.editButton.click());
	}

	private createContainer() {
		const container = document.createElement('div');
		container.classList.add(OverlayManager.CONTAINER_RECT_CLASS_NAME);
		return container;
	}

	private createElement() {
		const element = document.createElement('div');
		element.classList.add(OverlayManager.RECT_CLASS_NAME);
		this.container.appendChild(element);
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

		if (!this.hasNoDimensions && !hasDimensions) {
			this.hasNoDimensions = true;
			this.disable();
			return;
		}

		if (this.hasNoDimensions && hasDimensions) {
			this.hasNoDimensions = false;
			this.enable();
		}

		this.element.style.width = `${rect.width}px`;
		this.element.style.height = `${rect.height}px`;
		this.element.style.transform = `translate(${rect.left}px,${rect.top}px)`;
	}

	setCustomClass(customClass: string | undefined) {
		if (customClass === undefined) return;

		const isValidClassName = /^[a-zA-Z_][\w-]*$/.test(customClass);
		if (isValidClassName) this.container.classList.add(customClass);
	}

	toggleHover(hover: boolean) {
		if (hover) this.element.classList.add(OverlayManager.RECT_HOVER_CLASS_NAME);
		else this.element.classList.remove(OverlayManager.RECT_HOVER_CLASS_NAME);
	}

	toggleParentHover(hover: boolean) {
		if (hover) this.element.classList.add(OverlayManager.RECT_PARENT_HOVER_CLASS_NAME);
		else this.element.classList.remove(OverlayManager.RECT_PARENT_HOVER_CLASS_NAME);
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
		this.container.remove();
	}
}
