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

export type Rect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

export type AddToContextData = {
	key: string;
	editConfig: EditConfig;
	displayValue: string;
	rect?: Rect;
};

export type HighlightElementData = {
	key: string | null;
};

export type ReceiveAction = 'connect' | 'edit' | 'navigation' | 'add-to-context';

export type SendAction = 'confirm' | 'showEditableElements' | 'saved' | 'highlight-element';
