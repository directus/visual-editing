type SendAction = 'connect' | 'position' | 'edit';

export class DirectusFrame {
	private static readonly ERROR_PARENT_NOT_FOUND = 'Error sending message to Directus in parent frame:';
	private static origin: string | null = null;

	static send(action: SendAction, data?: unknown) {
		try {
			if (!DirectusFrame.origin) throw new Error();
			window.parent.postMessage({ action, data }, DirectusFrame.origin);
			return true;
		} catch (error) {
			// eslint-disable-next-line
			console.error(DirectusFrame.ERROR_PARENT_NOT_FOUND, error);
			return false;
		}
	}

	static connect(origin: string) {
		DirectusFrame.origin = origin;
		return DirectusFrame.send('connect');
	}
}
