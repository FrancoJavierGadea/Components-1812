# SVG Grid


## Installation

```bash
npm install @components-1812/grid
```

<br>

## Usage

If you use `Vite` or a framework based on `Vite` like `Astro` you can import the component in one client side script file

```js
import '@components-1812/grid';
```

and use it in your html

```html
<custom-grid></custom-grid>

<custom-grid size="20"></custom-grid>
```

> if your using a builder or framework that doesn't support `import ?raw` you need load the stylesheets manually
> 
> see [Adding CSS stylesheets manually](#adding-css-stylesheets-manually)


<br>

## Adding CSS stylesheets manually

If you want add custom stylesheets to the component or you need to load stylesheets from a different path, you can do it like this:

- Using **import raw** method of your builder, `CSSStyleSheet` and `AdoptedStyleSheets` properties of the component

    ```js
    import { Grid } from '@components-1812/grid/Grid.js';
    import GridRawCSS from '@components-1812/grid/src/Grid.css?raw';

    const GridCSS = new CSSStyleSheet();

    GridCSS.replaceSync(GridRawCSS);

    Grid.stylesSheets.adopted.push(GridCSS);

    import('@components-1812/grid/define');
    ```

- Using `style` tag inside the shadow root of the component

    ```js
    import { Grid } from '@components-1812/grid/Grid.js';
    import GridRawCSS from '@components-1812/grid/src/Grid.css?raw';

    Grid.stylesSheets.raw.push(GridRawCSS);

    import('@components-1812/grid/define');
    ```

- Using `link` element inside the shadow root of the component

    ```js
    import { Grid } from '@components-1812/grid/Grid.js';
    import GridUrl from '@components-1812/grid/src/Grid.css?url';

    Grid.stylesSheets.links.push(GridUrl);

    import('@components-1812/grid/define');
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






