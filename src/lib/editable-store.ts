import { EditableElement } from './editable-element.ts';

export class EditableStore {
	private static items: EditableElement[] = [];
	static highlightOverlayElements = false;
	private static highlightedKey: string | null = null;

	static getItem(element: Element) {
		return EditableStore.items.find((item) => item.element === element);
	}

	static getItemByKey(key: EditableElement['key']) {
		return EditableStore.items.find((item) => item.key === key);
	}

	static getHoveredItems() {
		return EditableStore.items.filter((item) => item.hover);
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

	static highlightItems(show: boolean) {
		if (this.highlightOverlayElements === show) return;

		this.highlightOverlayElements = show;

		EditableStore.items.forEach((item) => {
			item.overlayElement.toggleHighlight(show);
		});
	}

	static highlightElement(key: string | null) {
		if (this.highlightedKey !== null) {
			EditableStore.getItemByKey(this.highlightedKey)?.overlayElement.toggleAiContext(false);
		}

		this.highlightedKey = key;

		if (key !== null) {
			EditableStore.getItemByKey(key)?.overlayElement.toggleAiContext(true);
		}
	}

	static setElementInAiContext(key: string, inContext: boolean) {
		EditableStore.getItemByKey(key)?.overlayElement.toggleAiContext(inContext);
	}
}
