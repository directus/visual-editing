import type {
	EditConfig as DirectusEditConfig,
	ReceiveAction as DirectusReceiveAction,
	SendAction as DirectusSendAction,
	SavedData as DirectusSavedData,
} from './directus.ts';

export type EditConfigStrict = DirectusEditConfig;

export type EditConfig = EditConfigStrict & { fields?: string[] | string };

export type SendAction = DirectusReceiveAction;
export type ReceiveAction = DirectusSendAction;

export type ReceiveData = { action: ReceiveAction | null; data: unknown };

export type SavedData = DirectusSavedData;

export type EditableElementOptions = {
	customClass?: string | undefined;
	onSaved?: ((data: Omit<SavedData, 'key'>) => void) | undefined;
};
