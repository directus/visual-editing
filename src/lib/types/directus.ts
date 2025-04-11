/** These types are shared with Directus */
/** Keep in sync with Directus */

// import { PrimaryKey } from '@directus/types';
type PrimaryKey = string | number;

export type EditConfig = {
	collection: string;
	item: PrimaryKey | null;
	fields?: string[];
	mode?: 'drawer' | 'modal' | 'popover';
};

export type SavedData = {
	key: string;
	collection: EditConfig['collection'];
	item: EditConfig['item'];
	payload: Record<string, any>;
};

export type ReceiveAction = 'connect' | 'edit' | 'navigation';

export type SendAction = 'confirm' | 'showEditableElements' | 'saved';
