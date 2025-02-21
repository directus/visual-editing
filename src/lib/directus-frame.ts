import { EditableStore } from './editable-store.ts';
import type { Form } from './editable-element.ts';

type SendAction = 'connect' | 'position' | 'edit';
type ReceiveAction = 'saved';
type ReceiveData = { action: ReceiveAction | null; data: unknown };


export type SavedData = {
	key: string;
	form: Pick<Form, 'collection' | 'item'> | null;
	edits: Record<string, any>;
};

/**
 * *Singleton* class to handle communication with Directus in parent frame.
 */
export class DirectusFrame {
	private static SINGLETON?: DirectusFrame;
	private static readonly ERROR_PARENT_NOT_FOUND = 'Error sending message to Directus in parent frame:';

	private origin: string | null = null;

	constructor() {
		if (DirectusFrame.SINGLETON) return DirectusFrame.SINGLETON;
		DirectusFrame.SINGLETON = this;

		window.addEventListener('message', this.receive.bind(this));
	}

	connect(origin: string) {
		this.origin = origin;
		return this.send('connect');
	}

	send(action: SendAction, data?: unknown) {
		try {
			if (!this.origin) throw new Error();
			window.parent.postMessage({ action, data }, this.origin);
			return true;
		} catch (error) {
			// eslint-disable-next-line
			console.error(DirectusFrame.ERROR_PARENT_NOT_FOUND, error);
			return false;
		}
	}

	receive(event: MessageEvent) {
		const { action, data }: ReceiveData = event.data;

		if (action === 'saved') this.receiveSaved(data);
	}

	private receiveSaved(data: unknown) {
		const { key = '', form = null, edits = {} } = data as SavedData;

		const item = EditableStore.getItemByKey(key);

		if (item && form !== null && typeof item.onSaved === 'function') {
			item.onSaved({ form, edits });
			return;
		}

		window.location.reload();
	}
}
