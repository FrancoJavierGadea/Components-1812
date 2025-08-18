# Offcanvas custom element

# JSON Visualizer custom element

![](./assets/preview-2.webp)

## Examples

- [**Codepen**](https://codepen.io/collection/JYEwMK): 


- [**Stackblitz**]():



<br>

## Installation

#### NPM

```bash
npm install @components-1812/offcanvas
```

- [`JSON visualizer package`](https://www.npmjs.com/package/@components-1812/offcanvas)

#### CDN

```html
<script type="module">
    import Offcanvas from 'https://cdn.jsdelivr.net/npm/@components-1812/offcanvas@0.0.1/src/Offcanvas.min.js';

    //Load the stylesheet
    Offcanvas.stylesSheets.links.push('https://cdn.jsdelivr.net/npm/@components-1812/offcanvas@0.0.1/src/Offcanvas.min.css');

    console.log(Offcanvas);

    customElements.define('custom-offcanvas', Offcanvas);
</script>
```

- **jsdelivr**: [`Offcanvas package`](https://www.jsdelivr.com/package/npm/@components-1812/offcanvas)
[`Offcanvas.js`](https://cdn.jsdelivr.net/npm/@components-1812/offcanvas@0.0.1/src/Offcanvas.min.js)
[`Offcanvas.css`](https://cdn.jsdelivr.net/npm/@components-1812/offcanvas@0.0.1/src/Offcanvas.css)

- **unpkg**: [`Offcanvas package`](https://app.unpkg.com/@components-1812/offcanvas)
[`Offcanvas.js`](https://unpkg.com/@components-1812/offcanvas@0.0.1/src/Offcanvas.js)
[`Offcanvas.css`](https://unpkg.com/@components-1812/offcanvas@0.0.1/src/Offcanvas.css)

<br>

## Usage

If you use Vite or a framework based on Vite such as Astro, you can import the component in a client-side script file:

```js
import '@components-1812/offcanvas';
```

and use it in your HTML:

```html
<custom-offcanvas open variant="right global" handle-button>

    <!-- Panel content -->
    <div slot="header">Header</div>

    <div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
    </div>

    <div slot="footer">Footer</div>

    <!--Custom icons -->
    <div slot="close-button">❌</div>
    <div slot="handle-button" data-rotate-icon>➡️</div>

    <!-- Backdrop content -->
    <div slot="backdrop" style="position: absolute; top: 0; left: 0;">
        <p>This is the backdrop content.</p>
        <p>You can add any content here.</p>
    </div>
</custom-offcanvas>
```

> **Note:**
> 
> If you are using a builder or framework that doesn't support import `?raw`, you need to load the component and its stylesheets manually.
> 
> see [Adding CSS stylesheets manually](#adding-css-stylesheets-manually)


<br>

## Adding CSS stylesheets manually

If you want to add custom stylesheets to the component or need to load stylesheets from a different path, you can do it like this:

- ### AdoptedStyleSheets (recommended)

    Using your builder’s import raw method, `CSSStyleSheet`, and the component’s `AdoptedStyleSheets` property:

    ```js
    import Offcanvas from "@components-1812/offcanvas/Offcanvas.js";
    import OffcanvasRawCSS from "@components-1812/offcanvas/Offcanvas.css?raw";

    //Add the stylesheets to the component
    const OffcanvasCSS = new CSSStyleSheet();

    OffcanvasCSS.replaceSync(OffcanvasRawCSS);

    Offcanvas.stylesSheets.adopted.push(OffcanvasCSS);

    //Define the component
    import('@components-1812/offcanvas/define');
    ```

- ### Raw CSS in a `<style>` tag

    Using a `<style>` tag inside the shadow root of the component:

    ```js
    import Offcanvas from "@components-1812/offcanvas/Offcanvas.js";
    import OffcanvasRawCSS from "@components-1812/offcanvas/Offcanvas.css?raw";

    //Add the stylesheets to the component
    Offcanvas.stylesSheets.raw.push(OffcanvasCSS);

    //Define the component
    import('@components-1812/offcanvas/define');
    ```

- ### External CSS files in a `<link>` tag

    Using a `<link>` tag inside the shadow root of the component:

    ```js
    import Offcanvas from "@components-1812/offcanvas/Offcanvas.js";
    import OffcanvasCSS from "@components-1812/offcanvas/Offcanvas.css?url";

    //Add the stylesheets to the component
    Offcanvas.stylesSheets.links.push(OffcanvasCSS);

    //Define the component
    import('@components-1812/offcanvas/define');
    ```

> **Note:**
> 
> `import('@components-1812/offcanvas/define')` calls `customElements.define('custom-offcanvas', Offcanvas);` in `define.js`

<br>

## Customization: CSS Variables

```css
--offcanvas-position: absolute;
--offcanvas-z-index: 10000;

/* Panel */
--offcanvas-panel-width: 300px;
--offcanvas-panel-height: 100%;
--offcanvas-panel-padding: 10px;
--offcanvas-panel-transition: margin 0.3s ease-in-out;

--offcanvas-panel-header-padding: 10px;
--offcanvas-panel-body-padding: 10px;
--offcanvas-panel-footer-padding: 10px;

--offcanvas-panel-bg: #222;
--offcanvas-panel-color: #fff;

--offcanvas-panel-header-bg: #222;
--offcanvas-panel-header-color: #fff;

--offcanvas-panel-footer-bg: #222;
--offcanvas-panel-footer-color: #fff;

--offcanvas-panel-border-width: 1px;
--offcanvas-panel-border-style: solid;
--offcanvas-panel-border-color: #ccc;
--offcanvas-panel-border: var(--offcanvas-panel-border-width) var(--offcanvas-panel-border-style) var(--offcanvas-panel-border-color);

--offcanvas-panel-border-radius: 0px;

/* Backdrop */
--offcanvas-backdrop-bg: rgba(0, 0, 0, 0.5);
--offcanvas-backdrop-color: #fff;
--offcanvas-backdrop-transition: background-color 0.3s ease-in-out;

/* Close button */
--offcanvas-close-button-bg: transparent;
--offcanvas-close-button-color: #fff;
--offcanvas-close-button-font-size: 1.5rem;
--offcanvas-close-button-cursor: pointer;
--offcanvas-close-button-padding: 10px;
--offcanvas-close-button-border: none;
--offcanvas-close-button-width: 40px;
--offcanvas-close-button-height: 40px;

/* Handle button */
--offcanvas-handle-button-bg: #444;
--offcanvas-handle-button-color: #fff;
--offcanvas-handle-button-padding: 5px;
--offcanvas-handle-button-border: none;
--offcanvas-handle-button-cursor: pointer;
--offcanvas-handle-button-font-size: 1rem;
--offcanvas-handle-button-width: 50px;
--offcanvas-handle-button-height: 100px;
--offcanvas-handle-button-border-radius: 10px;
--offcanvas-handle-button-shadow: unset;
```



<br><br>


## Open and close

You can open the **offcanvas panel** using the `open` attribute:

```html
<custom-offcanvas open></custom-offcanvas>
```

Via JavaScript, you can use the `open` property (mirrored attribute):

```js
const offcanvas = document.querySelector('custom-offcanvas');

// Open the panel
offcanvas.open = true;

// Close the panel
offcanvas.open = false;
```
You can also control the panel with the methods: `.show()`, `.hide()`, `.toggle()`

```js
const offcanvas = document.querySelector('custom-offcanvas');

// Show the panel
offcanvas.show();

// Hide the panel
offcanvas.hide();

// Toggle the panel (switch state)
offcanvas.toggle();         // toggle current state
offcanvas.toggle(true);     // force open
offcanvas.toggle(false);    // force close
```

<br><br>

## Slots

The **default slot** is reserved for the **panel body**, which contains the main content.

You can also use the following named slots:

- `slot="header"` – for the panel header.

- `slot="footer"` – for the panel footer.

```html
<custom-offcanvas open variant="right" handle-button>
    <div slot="header">Header</div>
    <div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
    </div>
    <div slot="footer">Footer</div>
</custom-offcanvas>
```

#### Customizing Buttons

You can replace the default icons for the **close button** and the **handle button** (if present) using:

- `slot="close-button"`

- `slot="handle-button"`

para modificar los iconos por defecto del close button y el handle button (si esta) puedes usar `slot="close-button"` y `slot="handle-button"`

```html
<custom-offcanvas open variant="right" handle-button>
    <div slot="close-button">❌</div>
    <div slot="handle-button" data-rotate-icon>➡️</div>
</custom-offcanvas>
```

> **Note**
>
> For the **handle button**, you can add the attribute `data-rotate-icon` so that the icon always rotates to point in the correct direction according to the panel position and open/closed state.
>
> To work correctly, the icon must initially point to the **right**.

#### Backdrop

The `backdrop` slot allows you to add custom content positioned around the panel for richer interactions or decorations. 

Elements in this slot should use `position: absolute;` 

Since the `backdrop` changes size when the **panel** opens or closes, the elements will move together with the panel.

```html
<custom-offcanvas open variant="left" handle-button>

    <!-- Backdrop content -->
    <div slot="backdrop" style="position: absolute; top: 0; left: 0;">
        <p>This is the backdrop content.</p>
        <p>You can add any content here.</p>
    </div>

    <div slot="backdrop" style="position: absolute; bottom: 0; right: 0;">
        <p>This is another backdrop content.</p>
        <p>You can customize the backdrop as needed.</p>
    </div>
</custom-offcanvas>
```

You can also control the visibility of backdrop elements based on the panel state using attributes like:

- `data-hide-when-closed` – hides the element when the panel is closed.

- `data-hide-when-opened` – hides the element when the panel is open.

```html
<custom-offcanvas open variant="left" handle-button>

    <!-- Backdrop content -->
    <div slot="backdrop" style="position: absolute; top: 0; right: 0;" data-hide-when-closed>
        <p>This content will hide when the offcanvas is closed.</p>
    </div>

    <div slot="backdrop" style="position: absolute; bottom: 0; left: 0;" data-hide-when-opened>
        <p>This content will hide when the offcanvas is opened.</p>
    </div>
</custom-offcanvas>
```


<br><br>


## Global and Local Positioning

You can control whether the **offcanvas panel** is positioned relative to the `viewport` or inside its container using the `variant` attribute:

- `local` (default) – The panel is positioned `absolute` relative to its nearest positioned ancestor.

- `global` – The panel is positioned `fixed` relative to the viewport. This is useful for modals or overlays.

```html
<!-- Fixed to the viewport -->
<custom-offcanvas variant="top global"></custom-offcanvas>

<!-- Positioned inside a container -->
<div class="container" style="position: relative;">
    <custom-offcanvas variant="left local"></custom-offcanvas>
</div>
```

## Placement

The `variant` attribute defines the position of the **offcanvas panel**: `left`, `right`, `top`, `bottom` 

```html
<custom-offcanvas variant="left"></custom-offcanvas>
<custom-offcanvas variant="right"></custom-offcanvas>
<custom-offcanvas variant="top"></custom-offcanvas>
<custom-offcanvas variant="bottom"></custom-offcanvas>
```

## Panel scroll 

By default, the panel does not scroll. You can customize the scroll behavior using the following variants:

- `scroll-full`: The entire panel content scrolls.

- `scroll-inner`: All content scrolls except the header

- `scroll-body`: Only the body scrolls; header and footer remain fixed.

```html
<custom-offcanvas variant="scroll-full"></custom-offcanvas>
<custom-offcanvas variant="scroll-inner"></custom-offcanvas>
<custom-offcanvas variant="scroll-body"></custom-offcanvas>
```

## Handle button

By default, the component does not provide any control to open the panel; you must add it manually.

With the handle-button attribute, the component automatically adds a button inside the backdrop content, centered along the edge of the panel. This button allows users to open and close the panel.

```html
<custom-offcanvas variant="right" handle-button></custom-offcanvas>
```

<br><br>

## API

### Attributes

- `variant`: Panel position or visual style.

    - Panel position: `left`, `top`, `right`, `bottom`
    - Panel scroll: `scroll-full`, `scroll-inner`, `scroll-body`
    - Page position: `global`, `local`


- `open` (boolean, default false): Whether the panel is open.

- `handle-button` (boolean, default false): Whether to show a floating handle button.

### Properties

#### Mirrored

- `variant` (string): Panel position or visual style.

- `open` (boolean): Whether the panel is open.

- `handleButton` (boolean): Whether the handle button is visible.

### Methods

`show()`: Opens the panel (open = true).

`hide()`: Closes the panel (open = false).

`toggle(force?: boolean)`: Toggles the panel. If force is `true` or `false`, sets the panel state accordingly.

### Events

- `ready-links`: Fired when all external stylesheet links have finished loading. Provides a detail with the results of each stylesheet.

- `ready`: Dispatched when the component has finished initializing (end of connectedCallback)

### Static properties

`VERSION` (string): Component version (0.0.1).

`DEFAULT_TAG_NAME` (string): Default tag name (`custom-offcanvas`) use it to define the custom element in `index.js` and `define.js`

`DEFAULT_ICONS` (object): Default svg icons for `close-button` and `handle-button`.

```js
Offcanvas.DEFAULT_ICONS = {
    'close-button': `<svg>...</svg>`,
    'handle-button': `<svg data-rotate-icon>...</svg>`
}
```

`stylesSheets` (object): Contains `links`, `adopted`, and `raw` stylesheets to apply to the component.

```js
Offcanvas.stylesSheets = {
    links: [],//string url css source
    adopted: [],//CSSStyleSheet instances
    raw: [],//string raw css
};
```

### Slots

- `default`: Main content of the panel
- `header`: Header content of the panel
- `footer`: Footer content of the panel

- `close-button`: Icon or content for the close button in the header of the panel
- `handle-button`: Icon or content for the handle button if added

- `backdrop`: Content inside the backdrop (around the panel)


<br><br>

## License

This package is distributed under the [MIT license](./LICENSE).

## Credits

Default icons used in this package are sourced from the [Bootstrap Icons](https://icons.getbootstrap.com/) project, licensed under the MIT license.  
© 2019–2024 The Bootstrap Authors 

- [x-lg](https://icons.getbootstrap.com/icons/x-lg/)
- [arrow-bar-right](https://icons.getbootstrap.com/icons/arrow-bar-right/)
