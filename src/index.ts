import { OverlayManager } from './lib/overlay-manager.ts';
import { DirectusFrame } from './lib/directus-frame.ts';
import { EditableElement, type EditableElementOptions } from './lib/editable-element.ts';
import { EditableStore } from './lib/editable-store.ts';

const editableStore = new EditableStore();
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

	const editableElements = EditableStore.scan(elements);
	const scopedItems: EditableElement[] = [];

	editableElements.forEach((element) => {
		const existingItem = editableStore.getItem(element);
		const item = existingItem ?? new EditableElement(element);

		item.applyOptions({ customClass, onSaved });

		scopedItems.push(item);
		if (!existingItem) editableStore.addItem(item);
	});

	return {
		remove() {
			editableStore.removeItems(scopedItems);
		},
		enable() {
			editableStore.enableItems(scopedItems);
		},
		disable() {
			editableStore.disableItems(scopedItems);
		},
	};
}

export function remove() {
	editableStore.removeItems();
}

export function disable() {
	const items = editableStore.disableItems();
	return {
		enable: () => editableStore.enableItems(items),
	};
}
