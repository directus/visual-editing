"use strict";var DirectusVisualEditing=(()=>{var g=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var y=Object.prototype.hasOwnProperty;var R=(t,e)=>{for(var i in e)g(t,i,{get:e[i],enumerable:!0})},b=(t,e,i,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of C(e))!y.call(t,r)&&r!==i&&g(t,r,{get:()=>e[r],enumerable:!(n=_(e,r))||n.enumerable});return t};var I=t=>b(g({},"__esModule",{value:!0}),t);var w={};R(w,{apply:()=>D,disable:()=>$,remove:()=>H,setAttr:()=>B});var N=["bottom","height","left","right","top","width"],O=function(e,i){return e===void 0&&(e={}),i===void 0&&(i={}),N.some(function(n){return e[n]!==i[n]})},E=new Map,S,L=function t(){var e=[];E.forEach(function(i,n){var r=n.getBoundingClientRect();O(r,i.rect)&&(i.rect=r,e.push(i))}),e.forEach(function(i){i.callbacks.forEach(function(n){return n(i.rect)})}),S=window.requestAnimationFrame(t)};function M(t,e){return{observe:function(){var n=E.size===0;E.has(t)?E.get(t).callbacks.push(e):E.set(t,{rect:void 0,hasRectChanged:!1,callbacks:[e]}),n&&L()},unobserve:function(){var n=E.get(t);if(n){var r=n.callbacks.indexOf(e);r>=0&&n.callbacks.splice(r,1),n.callbacks.length||E.delete(t),E.size||cancelAnimationFrame(S)}}}}var A=M;var o=class t{static CSS_VAR_Z_INDEX="--directus-visual-editing--overlay--z-index";static CSS_VAR_BORDER_SPACING="--directus-visual-editing--rect--border-spacing";static CSS_VAR_BORDER_WIDTH="--directus-visual-editing--rect--border-width";static CSS_VAR_BORDER_COLOR="--directus-visual-editing--rect--border-color";static CSS_VAR_BORDER_RADIUS="--directus-visual-editing--rect--border-radius";static CSS_VAR_HIGHLIGHT_OPACITY="--directus-visual-editing--rect-highlight--opacity";static CSS_VAR_BUTTON_WIDTH="--directus-visual-editing--edit-btn--width";static CSS_VAR_BUTTON_HEIGHT="--directus-visual-editing--edit-btn--height";static CSS_VAR_BUTTON_RADIUS="--directus-visual-editing--edit-btn--radius";static CSS_VAR_BUTTON_BG_COLOR="--directus-visual-editing--edit-btn--bg-color";static CSS_VAR_BUTTON_ICON_BG_IMAGE="--directus-visual-editing--edit-btn--icon-bg-image";static CSS_VAR_BUTTON_ICON_BG_SIZE="--directus-visual-editing--edit-btn--icon-bg-size";static ICON_EDIT=`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="%23ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>')`;static OVERLAY_ID="directus-visual-editing";static STYLE_ID="directus-visual-editing-style";static CONTAINER_RECT_CLASS_NAME="directus-visual-editing-overlay";static RECT_CLASS_NAME="directus-visual-editing-rect";static RECT_HIGHLIGHT_CLASS_NAME="directus-visual-editing-rect-highlight";static RECT_HOVER_CLASS_NAME="directus-visual-editing-rect-hover";static RECT_INNER_CLASS_NAME="directus-visual-editing-rect-inner";static RECT_EDIT_BUTTON_CLASS_NAME="directus-visual-editing-edit-button";static getGlobalOverlay(){let e=document.getElementById(t.OVERLAY_ID);if(e)return e;let i=document.createElement("div");return i.id=t.OVERLAY_ID,document.body.insertAdjacentElement("afterend",i),i}static addStyles(){if(document.getElementById(t.STYLE_ID))return;let i=document.createElement("style");i.id=t.STYLE_ID;let n=28,r=`var(${t.CSS_VAR_BORDER_SPACING}, ${Math.round(n*.333)}px)`,s=`var(${t.CSS_VAR_BORDER_WIDTH}, 2px)`;i.appendChild(document.createTextNode(`
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
					top: calc(-1 * ${r});
					left: calc(-1 * ${r});
					right: calc(-1 * ${r});
					bottom: calc(-1 * ${r});
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
					top: calc(-1 * ${r} + ${s} / 2);
					left: calc(-1 * ${r} + ${s} / 2);
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
			`)),document.head.appendChild(i)}};var h=class{hasNoDimensions=!1;element;container;editButton;constructor(){this.container=this.createContainer(),this.element=this.createElement(),this.editButton=this.createEditButton(),this.createRectElement(),o.getGlobalOverlay().appendChild(this.container),a.highlightOverlayElements&&this.toggleHighlight(!0),this.element.addEventListener("click",()=>this.editButton.click())}createContainer(){let e=document.createElement("div");return e.classList.add(o.CONTAINER_RECT_CLASS_NAME),e}createElement(){let e=document.createElement("div");return e.classList.add(o.RECT_CLASS_NAME),this.container.appendChild(e),e}createRectElement(){let e=document.createElement("div");e.classList.add(o.RECT_INNER_CLASS_NAME),this.element.appendChild(e)}createEditButton(){let e=document.createElement("button");return e.type="button",e.classList.add(o.RECT_EDIT_BUTTON_CLASS_NAME),this.element.appendChild(e),e}updateRect(e){let i=e.width!==0&&e.height!==0;if(!this.hasNoDimensions&&!i){this.hasNoDimensions=!0,this.disable();return}this.hasNoDimensions&&i&&(this.hasNoDimensions=!1,this.enable()),this.element.style.width=`${e.width}px`,this.element.style.height=`${e.height}px`,this.element.style.transform=`translate(${e.left}px,${e.top}px)`}setCustomClass(e){if(e===void 0)return;/^[a-zA-Z_][\w-]*$/.test(e)&&this.container.classList.add(e)}toggleHover(e){e?this.element.classList.add(o.RECT_HOVER_CLASS_NAME):this.element.classList.remove(o.RECT_HOVER_CLASS_NAME)}toggleHighlight(e){e?this.element.classList.add(o.RECT_HIGHLIGHT_CLASS_NAME):this.element.classList.remove(o.RECT_HIGHLIGHT_CLASS_NAME)}disable(){this.element.style.display="none"}enable(){this.element.style.removeProperty("display")}remove(){this.container.remove()}};var u=class t{static DATASET="directus";static DATA_ATTRIBUTE_VALID_KEYS=["collection","item","fields","mode"];optionsWritable=!0;element;key;editConfig;rectObserver;overlayElement;rect;hover=!1;disabled=!1;onSaved=void 0;constructor(e){this.element=e,this.element.addEventListener("mouseover",this.onMouseenter.bind(this)),this.element.addEventListener("mouseleave",this.onMouseleave.bind(this)),this.key=crypto.randomUUID(),this.editConfig=t.editAttrToObject(this.element.dataset[t.DATASET]),this.rect=this.element.getBoundingClientRect(),this.overlayElement=new h,this.overlayElement.updateRect(this.rect),this.overlayElement.editButton.addEventListener("click",this.onClickEdit.bind(this)),this.rectObserver=A(this.element,this.onObserveRect.bind(this)),this.rectObserver.observe()}static query(e){return e?(Array.isArray(e)?e:[e]).filter(n=>n instanceof HTMLElement).flatMap(n=>n.dataset[t.DATASET]!==void 0?n:Array.from(n.querySelectorAll(`[data-${t.DATASET}]`))).filter(n=>n!==null):Array.from(document.querySelectorAll(`[data-${t.DATASET}]`))}static objectToEditAttr(e){let i=[];for(let[n,r]of Object.entries(e))t.validEditConfigKey(n)&&(n==="fields"&&Array.isArray(r)?i.push(`${n}:${r.join(",")}`):i.push(`${n}:${r}`));return i.join(";")}static editAttrToObject(e){let i=e.split(";"),n={};return i.forEach(r=>{let s=r.split(":");if(s[0]===void 0||s?.[1]===void 0)return;let l=s[0].trim();if(!t.validEditConfigKey(l))return;let d=s[1];if(l==="fields"){n.fields=d.split(",").map(c=>c.trim());return}n[l]=d.trim()}),n}static validEditConfigKey(e){return t.DATA_ATTRIBUTE_VALID_KEYS.includes(e)}applyOptions({customClass:e,onSaved:i},n=!1){this.optionsWritable&&(n&&(this.optionsWritable=!1),this.overlayElement.setCustomClass(e),i!==void 0&&(this.onSaved=i))}removeHoverListener(){this.element.removeEventListener("mouseenter",this.onMouseenter.bind(this)),this.element.removeEventListener("mouseleave",this.onMouseleave.bind(this))}onClickEdit(){new v().send("edit",{key:this.key,editConfig:this.editConfig,rect:this.rect})}onMouseenter(e){this.toggleItemHover(!0,e)}onMouseleave(e){this.toggleItemHover(!1,e)}toggleItemHover(e,i){this.element!==i.currentTarget||this.hover===e||(this.hover=e,this.overlayElement.toggleHover(e))}onObserveRect(e){this.disabled||(this.rect=e,this.overlayElement.updateRect(e))}};var a=class t{static items=[];static highlightOverlayElements=!1;static getItem(e){return t.items.find(i=>i.element===e)}static getItemByKey(e){return t.items.find(i=>i.key===e)}static addItem(e){t.items.push(e)}static enableItems(e){(e??t.items).forEach(n=>{n.disabled=!1,n.rectObserver.observe(),n.overlayElement.enable()})}static disableItems(e){let i=e??t.items.filter(n=>!n.disabled);return i.forEach(n=>{n.disabled=!0,n.hover=!1,n.rectObserver.unobserve(),n.overlayElement.disable()}),[...i]}static removeItems(e){let i=e??t.items;i.forEach(n=>{n.rectObserver.unobserve(),n.overlayElement.remove(),n.removeHoverListener()}),t.items=t.items.filter(n=>!i.includes(n))}static highlightItems(e){this.highlightOverlayElements!==e&&(this.highlightOverlayElements=e,t.items.forEach(i=>{i.overlayElement.toggleHighlight(e)}))}};var v=class t{static SINGLETON;static ERROR_PARENT_NOT_FOUND="Error sending message to Directus in parent frame:";origin=null;confirmed=!1;constructor(){if(t.SINGLETON)return t.SINGLETON;t.SINGLETON=this,window?.addEventListener("message",this.receive.bind(this))}connect(e){return this.origin=e,this.send("connect")}send(e,i){try{if(!this.origin)throw new Error;return window.parent.postMessage({action:e,data:i},this.origin),!0}catch(n){return console.error(t.ERROR_PARENT_NOT_FOUND,n),!1}}sameOrigin(e,i){try{return e===new URL(i).origin}catch{return!1}}receive(e){if(!this.origin||!this.sameOrigin(e.origin,this.origin))return;let{action:i,data:n}=e.data;i==="confirm"&&(this.confirmed=!0),i==="showEditableElements"&&this.receiveShowEditableElements(n),i==="saved"&&this.receiveSaved(n)}receiveConfirm(){let e=0,i=10,n=100;return new Promise(r=>{let s=()=>{if(e>=i)return r(!1);e++,this.confirmed?r(!0):setTimeout(s,n)};s()})}receiveShowEditableElements(e){let i=!!e;a.highlightItems(i)}receiveSaved(e){let{key:i="",collection:n="",item:r=null,payload:s={}}=e,l=a.getItemByKey(i);if(l&&n&&typeof l.onSaved=="function"){l.onSaved({collection:n,item:r,payload:s});return}window.location.reload()}};var f=class t{static navigationInitialized=!1;static onNavigation(e){if(t.navigationInitialized)return;let i="",n="",r,s=d=>{clearTimeout(r),r=setTimeout(d,100)},l=()=>{let d=window.location.href,c=document.title,m=i!==d||n!==c;m&&(s(()=>e({url:d,title:c})),i=d,n=c),setTimeout(l,m?50:200)};l(),t.navigationInitialized=!0}};async function D({directusUrl:t,elements:e=void 0,customClass:i=void 0,onSaved:n=void 0}){let r=new v;if(!r.connect(t)||!await r.receiveConfirm())return;f.onNavigation(m=>r.send("navigation",m)),o.addStyles();let d=u.query(e),c=[];return d.forEach(m=>{let T=a.getItem(m),p=T??new u(m);p.applyOptions({customClass:i,onSaved:n},!!e),c.push(p),T||a.addItem(p)}),{remove(){a.removeItems(c)},enable(){a.enableItems(c)},disable(){a.disableItems(c)}}}function H(){a.removeItems()}function $(){let t=a.disableItems();return{enable(){a.enableItems(t)}}}function B(t){return u.objectToEditAttr(t)}return I(w);})();
//# sourceMappingURL=visual-editing.js.map