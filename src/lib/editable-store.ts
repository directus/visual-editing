import { EditableElement } from './editable-element.ts';

export class EditableStore {
	private items: EditableElement[] = [];

	public static scan(elements: HTMLElement | HTMLElement[] | undefined) {
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

	getItem(element: Element) {
		return this.items.find((item) => item.element === element);
	}

	addItem(item: EditableElement) {
		this.items.push(item);
	}

	enableItems(selectedItems?: EditableElement[]) {
		const items = selectedItems ?? this.items;

		items.forEach((item) => {
			item.disabled = false;
			item.rectObserver.observe();
			item.overlayElement.enable();
		});
	}

	disableItems(selectedItems?: EditableElement[]) {
		const items = selectedItems ?? this.items.filter((item) => !item.disabled);

		items.forEach((item) => {
			item.disabled = true;
			item.hover = false;
			item.rectObserver.unobserve();
			item.overlayElement.disable();
		});

		return [...items];
	}

	removeItems(selectedItems?: EditableElement[]) {
		const items = selectedItems ?? this.items;

		items.forEach((item) => {
			item.rectObserver.unobserve();
			item.overlayElement.remove();
			item.removeHoverListener();
		});

		this.items = this.items.filter((item) => !items.includes(item));
	}
}
