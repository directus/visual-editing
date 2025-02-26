import { DirectusFrame } from './lib/directus-frame.ts';
import { EditableElement, type EditableElementOptions, type Form } from './lib/editable-element.ts';
import { EditableStore } from './lib/editable-store.ts';
import { OverlayManager } from './lib/overlay-manager.ts';

const directusFrame = new DirectusFrame();

export async function scan({
	directusUrl,
	elements = undefined,
	customClass = undefined,
	onSaved = undefined,
}: {
	directusUrl: string;
	elements?: HTMLElement | HTMLElement[];
} & EditableElementOptions) {
	const conntected = directusFrame.connect(directusUrl);
	if (!conntected) return;

	const confirmed = await directusFrame.receiveConfirm();
	if (!confirmed) return;

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

export function toEditAttr(form: Form) {
	return EditableElement.objectToEditAttr(form);
}
