"use strict";var DirectusVisualEditing=(()=>{var S=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var R=(t,e)=>{for(var i in e)S(t,i,{get:e[i],enumerable:!0})},y=(t,e,i,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of C(e))!g.call(t,n)&&n!==i&&S(t,n,{get:()=>e[n],enumerable:!(r=p(e,n))||r.enumerable});return t};var N=t=>y(S({},"__esModule",{value:!0}),t);var B={};R(B,{apply:()=>M,disable:()=>D,remove:()=>H,setAttr:()=>$});var b=["bottom","height","left","right","top","width"],I=function(e,i){return e===void 0&&(e={}),i===void 0&&(i={}),b.some(function(r){return e[r]!==i[r]})},d=new Map,A,O=function t(){var e=[];d.forEach(function(i,r){var n=r.getBoundingClientRect();I(n,i.rect)&&(i.rect=n,e.push(i))}),e.forEach(function(i){i.callbacks.forEach(function(r){return r(i.rect)})}),A=window.requestAnimationFrame(t)};function L(t,e){return{observe:function(){var r=d.size===0;d.has(t)?d.get(t).callbacks.push(e):d.set(t,{rect:void 0,hasRectChanged:!1,callbacks:[e]}),r&&O()},unobserve:function(){var r=d.get(t);if(r){var n=r.callbacks.indexOf(e);n>=0&&r.callbacks.splice(n,1),r.callbacks.length||d.delete(t),d.size||cancelAnimationFrame(A)}}}}var T=L;var o=class t{static CSS_VAR_Z_INDEX="--directus-visual-editing--overlay--z-index";static CSS_VAR_BORDER_SPACING="--directus-visual-editing--rect--border-spacing";static CSS_VAR_BORDER_WIDTH="--directus-visual-editing--rect--border-width";static CSS_VAR_BORDER_COLOR="--directus-visual-editing--rect--border-color";static CSS_VAR_BORDER_RADIUS="--directus-visual-editing--rect--border-radius";static CSS_VAR_HOVER_OPACITY="--directus-visual-editing--rect-hover--opacity";static CSS_VAR_HIGHLIGHT_OPACITY="--directus-visual-editing--rect-highlight--opacity";static CSS_VAR_BUTTON_WIDTH="--directus-visual-editing--edit-btn--width";static CSS_VAR_BUTTON_HEIGHT="--directus-visual-editing--edit-btn--height";static CSS_VAR_BUTTON_RADIUS="--directus-visual-editing--edit-btn--radius";static CSS_VAR_BUTTON_BG_COLOR="--directus-visual-editing--edit-btn--bg-color";static CSS_VAR_BUTTON_ICON_BG_IMAGE="--directus-visual-editing--edit-btn--icon-bg-image";static CSS_VAR_BUTTON_ICON_BG_SIZE="--directus-visual-editing--edit-btn--icon-bg-size";static ICON_EDIT=`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="%23ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>')`;static OVERLAY_ID="directus-visual-editing";static STYLE_ID="directus-visual-editing-style";static CONTAINER_RECT_CLASS_NAME="directus-visual-editing-overlay";static RECT_CLASS_NAME="directus-visual-editing-rect";static RECT_HIGHLIGHT_CLASS_NAME="directus-visual-editing-rect-highlight";static RECT_PARENT_HOVER_CLASS_NAME="directus-visual-editing-rect-parent-hover";static RECT_HOVER_CLASS_NAME="directus-visual-editing-rect-hover";static RECT_INNER_CLASS_NAME="directus-visual-editing-rect-inner";static RECT_EDIT_BUTTON_CLASS_NAME="directus-visual-editing-edit-button";static getGlobalOverlay(){let e=document.getElementById(t.OVERLAY_ID);if(e)return e;let i=document.createElement("div");return i.id=t.OVERLAY_ID,document.body.insertAdjacentElement("afterend",i),i}static addStyles(){if(document.getElementById(t.STYLE_ID))return;let i=document.createElement("style");i.id=t.STYLE_ID;let r=28,n=`var(${t.CSS_VAR_BORDER_SPACING}, ${Math.round(r*.333)}px)`,s=`var(${t.CSS_VAR_BORDER_WIDTH}, 2px)`;i.appendChild(document.createTextNode(`
				#${t.OVERLAY_ID} {
					display: contents;
				}
				.${t.CONTAINER_RECT_CLASS_NAME} {
					pointer-events: none;
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: var(${t.CSS_VAR_Z_INDEX}, 999999999);
				}
				.${t.RECT_CLASS_NAME} {
					position: absolute;
				}
				.${t.RECT_INNER_CLASS_NAME} {
					position: absolute;
					box-sizing: border-box;
					top: calc(-1 * ${n});
					left: calc(-1 * ${n});
					right: calc(-1 * ${n});
					bottom: calc(-1 * ${n});
					border: ${s} solid var(${t.CSS_VAR_BORDER_COLOR}, #6644ff);
					border-radius: var(${t.CSS_VAR_BORDER_RADIUS}, 6px);
					opacity: 0;
				}
				.${t.RECT_CLASS_NAME}.${t.RECT_HOVER_CLASS_NAME} .${t.RECT_INNER_CLASS_NAME} {
					--hover-opacity: var(${t.CSS_VAR_HOVER_OPACITY}, 0.333);
					opacity: var(--hover-opacity);
				}
				.${t.RECT_CLASS_NAME}.${t.RECT_PARENT_HOVER_CLASS_NAME} .${t.RECT_INNER_CLASS_NAME} {
					opacity: calc(var(--hover-opacity) / 3);
				}
				.${t.RECT_HIGHLIGHT_CLASS_NAME} {
					pointer-events: all;
					cursor: pointer;
				}
				.${t.RECT_HIGHLIGHT_CLASS_NAME} .${t.RECT_INNER_CLASS_NAME}  {
					opacity: var(${t.CSS_VAR_HIGHLIGHT_OPACITY}, 0.333);
				}
				.${t.RECT_EDIT_BUTTON_CLASS_NAME}:visited,
				.${t.RECT_EDIT_BUTTON_CLASS_NAME}:active,
				.${t.RECT_EDIT_BUTTON_CLASS_NAME}:hover,
				.${t.RECT_EDIT_BUTTON_CLASS_NAME}:focus,
				.${t.RECT_EDIT_BUTTON_CLASS_NAME} {
					all: initial;
					pointer-events: all;
					cursor: pointer;
					position: absolute;
					z-index: 1;
					top: calc(-1 * ${n} + ${s} / 2);
					left: calc(-1 * ${n} + ${s} / 2);
					transform: translate(-50%, -50%);
					width: var(${t.CSS_VAR_BUTTON_WIDTH}, ${r}px);
					height: var(${t.CSS_VAR_BUTTON_HEIGHT}, ${r}px);
					border-radius: var(${t.CSS_VAR_BUTTON_RADIUS}, 50%);
					background-color: var(${t.CSS_VAR_BUTTON_BG_COLOR}, #6644ff);
					background-image: var(${t.CSS_VAR_BUTTON_ICON_BG_IMAGE}, ${t.ICON_EDIT});
					background-size: var(${t.CSS_VAR_BUTTON_ICON_BG_SIZE}, 66.6%);
					background-position: center;
					background-repeat: no-repeat;
					opacity: 0;
				}
				.${t.RECT_EDIT_BUTTON_CLASS_NAME}:hover,
				.${t.RECT_CLASS_NAME}.${t.RECT_HOVER_CLASS_NAME}:not(.${t.RECT_PARENT_HOVER_CLASS_NAME}) .${t.RECT_EDIT_BUTTON_CLASS_NAME},
				.${t.RECT_HIGHLIGHT_CLASS_NAME}:hover .${t.RECT_EDIT_BUTTON_CLASS_NAME} {
					opacity: 1;
				}
				.${t.RECT_EDIT_BUTTON_CLASS_NAME}:hover ~ .${t.RECT_INNER_CLASS_NAME},
				.${t.RECT_HIGHLIGHT_CLASS_NAME}:hover .${t.RECT_INNER_CLASS_NAME} {
					opacity: 1;
				}
			`)),document.head.appendChild(i)}};var u=class{hasNoDimensions=!1;element;container;editButton;constructor(){this.container=this.createContainer(),this.element=this.createElement(),this.editButton=this.createEditButton(),this.createRectElement(),o.getGlobalOverlay().appendChild(this.container),a.highlightOverlayElements&&this.toggleHighlight(!0),this.element.addEventListener("click",()=>this.editButton.click())}createContainer(){let e=document.createElement("div");return e.classList.add(o.CONTAINER_RECT_CLASS_NAME),e}createElement(){let e=document.createElement("div");return e.classList.add(o.RECT_CLASS_NAME),this.container.appendChild(e),e}createRectElement(){let e=document.createElement("div");e.classList.add(o.RECT_INNER_CLASS_NAME),this.element.appendChild(e)}createEditButton(){let e=document.createElement("button");return e.type="button",e.classList.add(o.RECT_EDIT_BUTTON_CLASS_NAME),this.element.appendChild(e),e}updateRect(e){let i=e.width!==0&&e.height!==0;if(!this.hasNoDimensions&&!i){this.hasNoDimensions=!0,this.disable();return}this.hasNoDimensions&&i&&(this.hasNoDimensions=!1,this.enable()),this.element.style.width=`${e.width}px`,this.element.style.height=`${e.height}px`,this.element.style.transform=`translate(${e.left}px,${e.top}px)`}setCustomClass(e){if(e===void 0)return;/^[a-zA-Z_][\w-]*$/.test(e)&&this.container.classList.add(e)}toggleHover(e){e?this.element.classList.add(o.RECT_HOVER_CLASS_NAME):this.element.classList.remove(o.RECT_HOVER_CLASS_NAME)}toggleParentHover(e){e?this.element.classList.add(o.RECT_PARENT_HOVER_CLASS_NAME):this.element.classList.remove(o.RECT_PARENT_HOVER_CLASS_NAME)}toggleHighlight(e){e?this.element.classList.add(o.RECT_HIGHLIGHT_CLASS_NAME):this.element.classList.remove(o.RECT_HIGHLIGHT_CLASS_NAME)}disable(){this.element.style.display="none"}enable(){this.element.style.removeProperty("display")}remove(){this.container.remove()}};var E=class t{static DATASET="directus";static DATA_ATTRIBUTE_VALID_KEYS=["collection","item","fields","mode"];optionsWritable=!0;element;key;editConfig;rectObserver;overlayElement;rect;hover=!1;disabled=!1;onSaved=void 0;constructor(e){this.element=e,this.element.addEventListener("mouseover",this.onMouseenter.bind(this)),this.element.addEventListener("mouseleave",this.onMouseleave.bind(this)),this.key=crypto.randomUUID(),this.editConfig=t.editAttrToObject(this.element.dataset[t.DATASET]),this.rect=this.element.getBoundingClientRect(),this.overlayElement=new u,this.overlayElement.updateRect(this.rect),this.overlayElement.editButton.addEventListener("click",this.onClickEdit.bind(this)),this.rectObserver=T(this.element,this.onObserveRect.bind(this)),this.rectObserver.observe()}static query(e){return e?(Array.isArray(e)?e:[e]).filter(r=>r instanceof HTMLElement).flatMap(r=>r.dataset[t.DATASET]!==void 0?r:Array.from(r.querySelectorAll(`[data-${t.DATASET}]`))).filter(r=>r!==null):Array.from(document.querySelectorAll(`[data-${t.DATASET}]`))}static objectToEditAttr(e){let i=[];for(let[r,n]of Object.entries(e))t.validEditConfigKey(r)&&(r==="fields"&&Array.isArray(n)?i.push(`${r}:${n.join(",")}`):i.push(`${r}:${n}`));return i.join(";")}static editAttrToObject(e){let i=e.split(";"),r={};return i.forEach(n=>{let s=n.split(":");if(s[0]===void 0||s?.[1]===void 0)return;let l=s[0].trim();if(!t.validEditConfigKey(l))return;let v=s[1];if(l==="fields"){r.fields=v.split(",").map(c=>c.trim());return}r[l]=v.trim()}),r}static validEditConfigKey(e){return t.DATA_ATTRIBUTE_VALID_KEYS.includes(e)}applyOptions({customClass:e,onSaved:i},r=!1){this.optionsWritable&&(r&&(this.optionsWritable=!1),this.overlayElement.setCustomClass(e),i!==void 0&&(this.onSaved=i))}removeHoverListener(){this.element.removeEventListener("mouseenter",this.onMouseenter.bind(this)),this.element.removeEventListener("mouseleave",this.onMouseleave.bind(this))}onClickEdit(){new m().send("edit",{key:this.key,editConfig:this.editConfig,rect:this.rect})}onMouseenter(e){this.toggleItemHover(!0,e)}onMouseleave(e){this.toggleItemHover(!1,e)}toggleItemHover(e,i){this.element!==i.currentTarget||this.hover===e||(this.hover=e,this.setParentsHover(),this.overlayElement.toggleHover(e))}setParentsHover(){let e=a.getHoveredItems();e.forEach(i=>{let n=e.filter(s=>s.element!==i.element).some(s=>i.element.contains(s.element));i.overlayElement.toggleParentHover(n)})}onObserveRect(e){this.disabled||(this.rect=e,this.overlayElement.updateRect(e))}};var a=class t{static items=[];static highlightOverlayElements=!1;static getItem(e){return t.items.find(i=>i.element===e)}static getItemByKey(e){return t.items.find(i=>i.key===e)}static getHoveredItems(){return t.items.filter(e=>e.hover)}static addItem(e){t.items.push(e)}static enableItems(e){(e??t.items).forEach(r=>{r.disabled=!1,r.rectObserver.observe(),r.overlayElement.enable()})}static disableItems(e){let i=e??t.items.filter(r=>!r.disabled);return i.forEach(r=>{r.disabled=!0,r.hover=!1,r.rectObserver.unobserve(),r.overlayElement.disable()}),[...i]}static removeItems(e){let i=e??t.items;i.forEach(r=>{r.rectObserver.unobserve(),r.overlayElement.remove(),r.removeHoverListener()}),t.items=t.items.filter(r=>!i.includes(r))}static highlightItems(e){this.highlightOverlayElements!==e&&(this.highlightOverlayElements=e,t.items.forEach(i=>{i.overlayElement.toggleHighlight(e)}))}};var m=class t{static SINGLETON;static ERROR_PARENT_NOT_FOUND="Error sending message to Directus in parent frame:";origin=null;confirmed=!1;constructor(){if(t.SINGLETON)return t.SINGLETON;t.SINGLETON=this,window?.addEventListener("message",this.receive.bind(this))}connect(e){return this.origin=e,this.send("connect")}send(e,i){try{if(!this.origin)throw new Error;return window.parent.postMessage({action:e,data:i},this.origin),!0}catch(r){return console.error(t.ERROR_PARENT_NOT_FOUND,r),!1}}sameOrigin(e,i){try{return e===new URL(i).origin}catch{return!1}}receive(e){if(!this.origin||!this.sameOrigin(e.origin,this.origin))return;let{action:i,data:r}=e.data;i==="confirm"&&(this.confirmed=!0),i==="showEditableElements"&&this.receiveShowEditableElements(r),i==="saved"&&this.receiveSaved(r)}receiveConfirm(){let e=0,i=10,r=100;return new Promise(n=>{let s=()=>{if(e>=i)return n(!1);e++,this.confirmed?n(!0):setTimeout(s,r)};s()})}receiveShowEditableElements(e){let i=!!e;a.highlightItems(i)}receiveSaved(e){let{key:i="",collection:r="",item:n=null,payload:s={}}=e,l=a.getItemByKey(i);if(l&&r&&typeof l.onSaved=="function"){l.onSaved({collection:r,item:n,payload:s});return}window.location.reload()}};async function M({directusUrl:t,elements:e=void 0,customClass:i=void 0,onSaved:r=void 0}){let n=new m;if(!n.connect(t)||!await n.receiveConfirm())return;o.addStyles();let v=E.query(e),c=[];return v.forEach(f=>{let _=a.getItem(f),h=_??new E(f);h.applyOptions({customClass:i,onSaved:r},!!e),c.push(h),_||a.addItem(h)}),{remove(){a.removeItems(c)},enable(){a.enableItems(c)},disable(){a.disableItems(c)}}}function H(){a.removeItems()}function D(){let t=a.disableItems();return{enable(){a.enableItems(t)}}}function $(t){return E.objectToEditAttr(t)}return N(B);})();
//# sourceMappingURL=visual-editing.js.map