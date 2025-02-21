import { EditableElement } from './editable-element.ts';

export class EditableStore {
	private static items: EditableElement[] = [];

	static getItem(element: Element) {
		return EditableStore.items.find((item) => item.element === element);
	}

	static getItemByKey(key: EditableElement['key']) {
		return EditableStore.items.find((item) => item.key === key);
	}

	static addItem(item: EditableElement) {
		EditableStore.items.push(item);
	}

	static enableItems(selectedItems?: EditableElement[]) {
		const items = selectedItems ?? EditableStore.items;

		items.forEach((item) => {
			item.disabled = false;
			item.rectObserver.observe();
			item.overlayElement.enable();
		});
	}

	static disableItems(selectedItems?: EditableElement[]) {
		const items = selectedItems ?? EditableStore.items.filter((item) => !item.disabled);

		items.forEach((item) => {
			item.disabled = true;
			item.hover = false;
			item.rectObserver.unobserve();
			item.overlayElement.disable();
		});

		return [...items];
	}

	static removeItems(selectedItems?: EditableElement[]) {
		const items = selectedItems ?? EditableStore.items;

		items.forEach((item) => {
			item.rectObserver.unobserve();
			item.overlayElement.remove();
			item.removeHoverListener();
		});

		EditableStore.items = EditableStore.items.filter((item) => !items.includes(item));
	}
}
