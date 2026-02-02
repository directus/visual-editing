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
	payload: Record<string, unknown>;
};

export type AddToContextData = {
	key: string;
	editConfig: EditConfig;
	rect?: DOMRect;
};

export type HighlightElementData = {
	key?: string | null;
	collection?: string;
	item?: string | number;
	fields?: string[];
};

export type ConfirmData = {
	aiEnabled: boolean;
};

export type ReceiveAction = 'connect' | 'edit' | 'navigation' | 'addToContext';
export type SendAction = 'confirm' | 'showEditableElements' | 'saved' | 'highlightElement';
