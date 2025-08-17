# Offcanvas custom element



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