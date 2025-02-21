import { OverlayManager } from './lib/overlay-manager.ts';
import { DirectusFrame } from './lib/directus-frame.ts';
import { EditableElement, type EditableElementOptions } from './lib/editable-element.ts';
import { EditableStore } from './lib/editable-store.ts';

const directusFrame = new DirectusFrame();

export function scan({
	directusUrl,
	elements = undefined,
	customClass = undefined,
	onSaved = undefined,
}: {
	directusUrl: string;
	elements?: HTMLElement | HTMLElement[];
} & EditableElementOptions) {
	const success = directusFrame.connect(directusUrl);
	if (success === false) return;

	OverlayManager.addStyles();

	const editableElements = EditableElement.query(elements);
	const scopedItems: EditableElement[] = [];

	editableElements.forEach((element) => {
		const existingItem = EditableStore.getItem(element);
		const item = existingItem ?? new EditableElement(element);

		item.applyOptions({ customClass, onSaved });

		scopedItems.push(item);
		if (!existingItem) EditableStore.addItem(item);
	});

	return {
		remove() {
			EditableStore.removeItems(scopedItems);
		},
		enable() {
			EditableStore.enableItems(scopedItems);
		},
		disable() {
			EditableStore.disableItems(scopedItems);
		},
	};
}

export function remove() {
	EditableStore.removeItems();
}

export function disable() {
	const items = EditableStore.disableItems();
	return {
		enable() {
			EditableStore.enableItems(items);
		},
	};
}
