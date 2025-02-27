export class OverlayManager {
	private static readonly CSS_VAR_Z_INDEX = '--directus-visual-editing--overlay--z-index';
	private static readonly CSS_VAR_BORDER_SPACING = '--directus-visual-editing--rect--border-spacing';
	private static readonly CSS_VAR_BORDER_WIDTH = '--directus-visual-editing--rect--border-width';
	private static readonly CSS_VAR_BORDER_COLOR = '--directus-visual-editing--rect--border-color';
	private static readonly CSS_VAR_BORDER_RADIUS = '--directus-visual-editing--rect--border-radius';
	private static readonly CSS_VAR_HIGHLIGHT_OPACITY = '--directus-visual-editing--rect-highlight--opacity';
	private static readonly CSS_VAR_BUTTON_WIDTH = '--directus-visual-editing--edit-btn--width';
	private static readonly CSS_VAR_BUTTON_HEIGHT = '--directus-visual-editing--edit-btn--height';
	private static readonly CSS_VAR_BUTTON_RADIUS = '--directus-visual-editing--edit-btn--radius';
	private static readonly CSS_VAR_BUTTON_BG_COLOR = '--directus-visual-editing--edit-btn--bg-color';
	private static readonly CSS_VAR_BUTTON_ICON_BG_IMAGE = '--directus-visual-editing--edit-btn--icon-bg-image';
	private static readonly CSS_VAR_BUTTON_ICON_BG_SIZE = '--directus-visual-editing--edit-btn--icon-bg-size';

	// For icons use https://fonts.google.com/icons?icon.set=Material+Icons&icon.color=%23ffffff
	private static readonly ICON_EDIT = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="%23ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>')`;

	private static readonly OVERLAY_ID = 'directus-visual-editing';
	private static readonly STYLE_ID = 'directus-visual-editing-style';

	static readonly CONTAINER_RECT_CLASS_NAME = 'directus-visual-editing-overlay';
	static readonly RECT_CLASS_NAME = 'directus-visual-editing-rect';
	static readonly RECT_HIGHLIGHT_CLASS_NAME = 'directus-visual-editing-rect-highlight';
	static readonly RECT_HOVER_CLASS_NAME = 'directus-visual-editing-rect-hover';
	static readonly RECT_INNER_CLASS_NAME = 'directus-visual-editing-rect-inner';
	static readonly RECT_EDIT_BUTTON_CLASS_NAME = 'directus-visual-editing-edit-button';

	static getGlobalOverlay(): HTMLElement {
		const existingOverlay = document.getElementById(OverlayManager.OVERLAY_ID);
		if (existingOverlay) return existingOverlay;

		const globalOverlay = document.createElement('div');
		globalOverlay.id = OverlayManager.OVERLAY_ID;
		document.body.insertAdjacentElement('afterend', globalOverlay);

		return globalOverlay;
	}

	static addStyles(): void {
		const existingStyle = document.getElementById(OverlayManager.STYLE_ID);
		if (existingStyle) return;

		const style = document.createElement('style');
		style.id = OverlayManager.STYLE_ID;

		const buttonWidth = 28;
		const borderSpacing = `var(${OverlayManager.CSS_VAR_BORDER_SPACING}, ${Math.round(buttonWidth * 0.333)}px)`;
		const borderWidth = `var(${OverlayManager.CSS_VAR_BORDER_WIDTH}, 2px)`;

		style.appendChild(
			document.createTextNode(`
				#${OverlayManager.OVERLAY_ID} {
					display: contents;
				}
				.${OverlayManager.CONTAINER_RECT_CLASS_NAME} {
					pointer-events: none;
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: var(${OverlayManager.CSS_VAR_Z_INDEX}, 999999999);
				}
				.${OverlayManager.RECT_CLASS_NAME} {
					position: absolute;
				}
				.${OverlayManager.RECT_INNER_CLASS_NAME} {
					position: absolute;
					box-sizing: border-box;
					top: calc(-1 * ${borderSpacing});
					left: calc(-1 * ${borderSpacing});
					right: calc(-1 * ${borderSpacing});
					bottom: calc(-1 * ${borderSpacing});
					border: ${borderWidth} solid var(${OverlayManager.CSS_VAR_BORDER_COLOR}, #6644ff);
					border-radius: var(${OverlayManager.CSS_VAR_BORDER_RADIUS}, 6px);
					opacity: 0;
				}
				.${OverlayManager.RECT_HIGHLIGHT_CLASS_NAME} {
					pointer-events: all;
					cursor: pointer;
				}
				.${OverlayManager.RECT_HIGHLIGHT_CLASS_NAME} .${OverlayManager.RECT_INNER_CLASS_NAME} {
					opacity: var(${OverlayManager.CSS_VAR_HIGHLIGHT_OPACITY}, 0.333);
				}
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME}:visited,
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME}:active,
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME}:hover,
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME}:focus,
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME} {
					all: initial;
					pointer-events: all;
					cursor: pointer;
					position: absolute;
					z-index: 1;
					top: calc(-1 * ${borderSpacing} + ${borderWidth} / 2);
					left: calc(-1 * ${borderSpacing} + ${borderWidth} / 2);
					transform: translate(-50%, -50%);
					width: var(${OverlayManager.CSS_VAR_BUTTON_WIDTH}, ${buttonWidth}px);
					height: var(${OverlayManager.CSS_VAR_BUTTON_HEIGHT}, ${buttonWidth}px);
					border-radius: var(${OverlayManager.CSS_VAR_BUTTON_RADIUS}, 50%);
					background-color: var(${OverlayManager.CSS_VAR_BUTTON_BG_COLOR}, #6644ff);
					background-image: var(${OverlayManager.CSS_VAR_BUTTON_ICON_BG_IMAGE}, ${OverlayManager.ICON_EDIT});
					background-size: var(${OverlayManager.CSS_VAR_BUTTON_ICON_BG_SIZE}, 66.6%);
					background-position: center;
					background-repeat: no-repeat;
					opacity: 0;
				}
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME}:hover,
				.${OverlayManager.RECT_CLASS_NAME}.${OverlayManager.RECT_HOVER_CLASS_NAME} .${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME},
				.${OverlayManager.RECT_HIGHLIGHT_CLASS_NAME}:hover .${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME} {
					opacity: 1;
				}
				.${OverlayManager.RECT_EDIT_BUTTON_CLASS_NAME}:hover ~ .${OverlayManager.RECT_INNER_CLASS_NAME},
				.${OverlayManager.RECT_HIGHLIGHT_CLASS_NAME}:hover .${OverlayManager.RECT_INNER_CLASS_NAME} {
					opacity: 1;
				}
			`),
		);

		document.head.appendChild(style);
	}
}
