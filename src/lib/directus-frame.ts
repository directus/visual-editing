type Action = 'connect' | 'position';

export class DirectusFrame {
	private static readonly ERROR_PARENT_NOT_FOUND = 'Error sending message to Directus in parent frame:';
	private origin: string | null = null;

	private send(action: Action, data?: unknown) {
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

	connect(origin: string) {
		this.origin = origin;
		return this.send('connect');
	}
}
