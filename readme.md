> [!NOTE]  
> This document is WIP

# Directus Visual Editing Package

## Installation & Usage

- Install the package: `pnpm i @directus/visual-editing`
- Usage
  ```ts
  import { apply, remove, disable, setAttr } from '@directus/visual-editing';
  ```
- Add `data-directus` attributes to your elements and then call the `apply()` method to make them interactive
  - the `data-directus` content follows this syntax `collection:posts;item:12` or
    `collection:posts;item:12;fields:title,description;mode:drawer` … described in detail below
  - It is recommended to render only the `data-directus` attributes when using in Visual Editor. This can be done in
    several ways. This could be by adding query parameters like `?visual-editing=true&token=123` or something else that
    you would implement on your website. The reason is that it could expose data like primary keys that you might not
    want to show to the public.
- Call the `apply()` method to add all the `data-directus` elements
  ```ts
  apply({ directusUrl: 'http://localhost:8000' });
  // or
  apply({ directusUrl: 'http://localhost:8000', elements: titleEl, onSaved: () => refresh() });
  // or
  apply({ directusUrl: 'http://localhost:8000', elements: header, customClass: 'my-class' });
  ```
- Methods
  - `setAttr(options)` … a helper function to generate the value for the `data-directus` attributes
    - Example Vue
      ```vue
      <template>
      	<h1 :data-directus="setAttr({ collection: 'posts', item: post.id, fields: 'title', mode: 'popover' })">
      		{{ post.title }}
      	</h1>
      </template>
      ```
    - Options Parameter: `{ collection, item, fields, mode }`
      - `collection`: `string` … name of the collection
      - `item`: `PrimaryKey` (`string` | `number`) … the id of the item
      - `fields`: optional `string[] | string` … specify which field(s) to edit. If nothing is specified, all fields
        will be included.
      - `mode`: optional `'drawer' | 'modal' | 'popover'` … default is `drawer`
  - `apply(options)` … will find all elements with a `data-directus` attribute. It will also connect to your Directus
    instance and make sure it is used inside the Visual Editor. If you call this method multiple times on your page, the
    options will be overwritten unless you specify the `elements` parameter. Be sure to call this method after the
    `data-directus` attributes are rendered, otherwise they won’t be found.
    - Options Parameter: `{ directusUrl, elements, customClass, onSaved }`
      - `directusUrl`: `string` (required)
      - `elements`: Optional `HTMLElement | HTMLElement[]`. Could have one or more elements. If the elements themselves
        don’t contain a `data-directus` attribute, their children will be selected.
        - Once you specify elements, the options can’t be overwritten anymore.
        - You can use `elements` to scope a section of your page and apply different options than you might have applied
          to a global selection that already includes those elements. The returned object could then also be used to
          `disable`/`enable` or `remove` these scoped elements separately from the other elements.
      - `customClass`: Optional `string`. Adds a class to Overlay Elements (the rects, that are displayed above the
        website)
      - `onSaved`: Optional callback function `(data) => void`. Will be called after the fields are saved in Directus.
        If `onSaved` is not set, the current page will be reloaded by using `window.location.reload();`
        - `onSaved` parameters: `{ collection, item, payload }`
          - `collection`: `string`
          - `item`: `PrimaryKey` (`string` | `number`)
          - `payload`: `Record<string, any>` (the changed values)
    - Returns: `{ remove, enable, disable }` … for all selected elements you can use these methods
      - Make sure to `await` them
        ```ts
        const { remove, enable, disable } = await apply({ directusUrl });
        ```
        - `remove()` … remove the previously selected elements
        - `disable()` … disable the previously selected elements
        - `enable()` enable the previously _disabled_ elements
  - `remove` … removes all elements
    - Before leaving the page on client-side navigation, be sure to call the `remove` method
  - `disable` … disable all elements (i.e. they are temporarily not editable)
    - Returns: `{ enable }`
      - `enable()` … will enable all elements previously _disabled_
- If you have CSP configured, be sure to add `'frame-ancestors': ["'self'", process.env.DIRECTUS_URL],` to your policy —
  in other words, make your site available for use inside an iframe in Directus. If you're unsure where your CSP is
  defined, check your web server configuration files, your site's build configuration, or your hosting platform's
  security settings.

## Usage for Non-JS environments

For server-only rendered websites (like PHP)

- You can find the compiled version in [dist/visual-editing.js](dist/visual-editing.js)
- Include the package in your website
  ```html
  <script src="path-to/visual-editing.js" type="text/javascript"></script>
  ```
- Usage
  ```html
  <script type="text/javascript">
  	document.addEventListener('DOMContentLoaded', function () {
  		DirectusVisualEditing.apply({ directusUrl: 'http://localhost:8000' });
  	});
  </script>
  ```

## Rendering Modes

- Note to DX: Take a look at the test website to see how to deal with rendering modes.

## Customization

- IDs, class names and css vars
- By changing the z-index `-directus-visual-editing--overlay--z-index` you can display the overlay rects below
  sticky/fixed headers …
- Can add custom classes

- Customization

  - CSS Selectors

    ```css
    #directus-visual-editing {
    	/* Container div that contains all overlay rects */
    }

    .directus-visual-editing-overlay {
    	/* wraps the rect */
    }
    .directus-visual-editing-rect {
    	/* the element that will be positioned */
    }
    .directus-visual-editing-rect-highlight {
    	/* a modifier that highlights the element */
    }
    .directus-visual-editing-rect-hover {
    	/* class that applies when the original element is hovered */
    }
    .directus-visual-editing-rect-inner {
    	/* the element with the rectangle styles */
    }
    .directus-visual-editing-edit-button {
    	/* the edit button */
    }
    ```

  - CSS Vars
    ```css
    :root {
    	--directus-visual-editing--overlay--z-index: 999999999;
    	--directus-visual-editing--rect--border-spacing: 9px;
    	--directus-visual-editing--rect--border-width: 2px;
    	--directus-visual-editing--rect--border-color: #6644ff;
    	--directus-visual-editing--rect--border-radius: 6px;
    	--directus-visual-editing--rect-highlight--opacity: 0.333;
    	--directus-visual-editing--edit-btn--width: 28px;
    	--directus-visual-editing--edit-btn--height: 28px;
    	--directus-visual-editing--edit-btn--radius: 50%;
    	--directus-visual-editing--edit-btn--bg-color: #6644ff;
    	--directus-visual-editing--edit-btn--icon-bg-image: url('data:image/svg+xml,<svg>…</svg>');
    	--directus-visual-editing--edit-btn--icon-bg-size: 66.6%;
    }
    ```
  - Custom Classes
    - Can be added to all or to a subset of elements defined by the `apply({ customClass: 'my-class' })` function. This
      class will be applied to the `div.directus-visual-editing-overlay` Example:
      ```css
      .my-class {
      	--directus-visual-editing--overlay--z-index: 40;
      	--directus-visual-editing--rect--border-spacing: 14px;
      	--directus-visual-editing--rect--border-width: 4px;
      	--directus-visual-editing--rect--border-color: red;
      	--directus-visual-editing--rect--border-radius: 10px;
      	--directus-visual-editing--rect-visible--opacity: 0.5;
      	--directus-visual-editing--edit-btn--width: 20px;
      	--directus-visual-editing--edit-btn--height: 15px;
      	--directus-visual-editing--edit-btn--radius: 2px;
      	--directus-visual-editing--edit-btn--bg-color: lightgreen;
      	--directus-visual-editing--edit-btn--icon-bg-image: url('data:image/svg+xml,<svg>…</svg>');
      	--directus-visual-editing--edit-btn--icon-bg-size: contain;
      }
      ```

## Test Website

- In addition to the library, a test website is included in this repository to make it easy to set up a test
  environment.
- For detailed instructions on setting up the test environment, see the
  [test websites readme.md](test-website/readme.md).

## Publishing Note

- Always build the package before publishing to NPM or GitHub!

## License & Contribution Notes

- DX
