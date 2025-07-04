# SVG Basic Grid


## Installation

```bash
npm install @components-1812/basic-grid
```

<br>

## Usage

If you use `Vite` or a framework based on `Vite` like `Astro` you can import the component in one client side script file

```js
import '@components-1812/basic-grid';
```

and use it in your html

```html
<custom-basic-grid></custom-basic-grid>

<custom-basic-grid size="20"></custom-basic-grid>
```

> if your using a builder or framework that doesn't support `import ?raw` you need load the stylesheets manually
> 
> see [Adding CSS stylesheets manually](#adding-css-stylesheets-manually)


<br>

## Adding CSS stylesheets manually

If you want add custom stylesheets to the component or you need to load stylesheets from a different path, you can do it like this:

- Using **import raw** method of your builder, `CSSStyleSheet` and `AdoptedStyleSheets` properties of the component

    ```js
    import { BasicGrid } from '@components-1812/basic-grid/BasicGrid.js';
    import BasicGridRawCSS from '@components-1812/basic-grid/src/BasicGrid.css?raw';

    const BasicGridCSS = new CSSStyleSheet();

    BasicGridCSS.replaceSync(BasicGridRawCSS);

    BasicGrid.stylesSheets.adopted.push(BasicGridCSS);

    import('@components-1812/basic-grid/define');
    ```

- Using `style` tag inside the shadow root of the component

    ```js
    import { BasicGrid } from '@components-1812/basic-grid/BasicGrid.js';
    import BasicGridRawCSS from '@components-1812/basic-grid/src/BasicGrid.css?raw';

    BasicGrid.stylesSheets.raw.push(BasicGridRawCSS);

    import('@components-1812/basic-grid/define');
    ```

- Using `link` element inside the shadow root of the component

    ```js
    import { BasicGrid } from '@components-1812/basic-grid/BasicGrid.js';
    import BasicGridUrl from '@components-1812/basic-grid/src/BasicGrid.css?url';

    BasicGrid.stylesSheets.links.push(BasicGridUrl);

    import('@components-1812/basic-grid/define');
    ```


<br>

## CSS Custom Properties

- `--line-color`: The color of the grid lines.
- `--line-width`: The width of the grid lines.
- `--line-opacity`: The opacity of the grid lines.
- `--line-dasharray`: The dasharray of the grid lines.


<br>

## Component Attributes

- `size`, `default: 10`: The size of the grid rects, the space between lines.






