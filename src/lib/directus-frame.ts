import { EditableStore } from './editable-store.ts';
import type { HighlightElementData, ConfirmData } from './types/directus.ts';
import type { SendAction, ReceiveData, SavedData } from './types/index.ts';

/**
 * *Singleton* class to handle communication with Directus in parent frame.
 */
export class DirectusFrame {
	private static SINGLETON?: DirectusFrame;
	private static readonly ERROR_PARENT_NOT_FOUND = 'Error sending message to Directus in parent frame:';

	private origin: string | null = null;
	private confirmed = false;
	private aiEnabled = false;

	constructor() {
		if (DirectusFrame.SINGLETON) return DirectusFrame.SINGLETON;
		DirectusFrame.SINGLETON = this;

		window?.addEventListener('message', this.receive.bind(this));
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

	private sameOrigin(origin: string, url: string) {
		try {
			return origin === new URL(url).origin;
		} catch {
			return false;
		}
	}

	receive(event: MessageEvent) {
		if (!this.origin || !this.sameOrigin(event.origin, this.origin)) {
			return;
		}

		const { action, data }: ReceiveData = event.data;

		if (action === 'confirm') this.receiveConfirmAction(data);
		if (action === 'showEditableElements') this.receiveShowEditableElements(data);
		if (action === 'saved') this.receiveSaved(data);
		if (action === 'highlightElement') this.receiveHighlightElement(data);
	}

	private receiveConfirmAction(data: unknown) {
		this.confirmed = true;
		this.aiEnabled = !!(data as ConfirmData)?.aiEnabled;
	}

	isAiEnabled() {
		return this.aiEnabled;
	}

	receiveConfirm() {
		let attempts = 0;
		const maxAttempts = 10;
		const timeout = 100;

		return new Promise<boolean>((resolve) => {
			const checkConfirmed = () => {
				if (attempts >= maxAttempts) return resolve(false);
				attempts++;

				if (this.confirmed) resolve(true);
				else setTimeout(checkConfirmed, timeout);
			};

			checkConfirmed();
		});
	}

	private receiveShowEditableElements(data: unknown) {
		const show = !!data;
		EditableStore.highlightItems(show);
	}

	private receiveSaved(data: unknown) {
		const { key = '', collection = '', item = null, payload = {} } = data as SavedData;

		const storeItem = EditableStore.getItemByKey(key);

		if (storeItem && collection && typeof storeItem.onSaved === 'function') {
			storeItem.onSaved({ collection, item, payload });
			return;
		}

		window.location.reload();
	}

	private receiveHighlightElement(data: unknown) {
		if (!data || typeof data !== 'object') {
			EditableStore.highlightElement(null);
			return;
		}

		const { key, collection, item, fields } = data as HighlightElementData;

		if (key === null) {
			EditableStore.highlightElement(null);
		} else if (collection && item !== undefined) {
			EditableStore.highlightElement(fields ? { collection, item, fields } : { collection, item });
		} else if (typeof key === 'string') {
			EditableStore.highlightElement({ key });
		}
	}
}
