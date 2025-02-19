export class OverlayElement {
	static readonly HOVER_CLASS_NAME = 'directus-visual-editing-rect-hover';

	private noDimensions: boolean = false;
	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;
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
		if (hover) this.element.classList.add(OverlayElement.HOVER_CLASS_NAME);
		else this.element.classList.remove(OverlayElement.HOVER_CLASS_NAME);
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
