![npm](https://img.shields.io/npm/v/@components-1812/grid)
![jsDelivr hits](https://data.jsdelivr.com/v1/package/npm/@components-1812/grid/badge)


# SVG Grid Custom Element

A **web component** that generates an **SVG-based** grid of lines with optional **radial gradient** effects, ideal for creating dynamic backgrounds or overlay patterns.

![Example](./assets/grid-540p.svg)

## Examples

- **CodePen**:
[Example 1](https://codepen.io/FrancoJavierGadea/pen/jEPgwWr)
[Example 2](https://codepen.io/FrancoJavierGadea/pen/NPqQoXm)
[Example 3](https://codepen.io/FrancoJavierGadea/pen/jEPgdQO)

<br>

## Installation

#### NPM

```bash
npm install @components-1812/grid
```

- [`Grid package`](https://www.npmjs.com/package/@components-1812/grid)

#### CDN

```html
<script type="module">
    import Grid from "https://cdn.jsdelivr.net/npm/@components-1812/grid@0.0.4/src/Grid.min.js";

    //Add the stylesheets to the component
    Grid.stylesSheets.links.push("https://cdn.jsdelivr.net/npm/@components-1812/grid@0.0.4/src/Grid.min.css");

    console.log(Grid);

    //Define the component
    customElements.define('custom-grid', Grid);
</script>
```

- **jsdelivr**: [`Grid package`](https://www.jsdelivr.com/package/npm/@components-1812/grid)
[`Grid.js`](https://cdn.jsdelivr.net/npm/@components-1812/grid@0.0.4/src/Grid.min.js)
[`Grid.css`](https://cdn.jsdelivr.net/npm/@components-1812/grid@0.0.4/src/Grid.min.css)

- **unpkg**: [`Grid package`](https://app.unpkg.com/@components-1812/grid)
[`Grid.js`](https://unpkg.com/@components-1812/grid@0.0.4/src/Grid.js)
[`Grid.css`](https://unpkg.com/@components-1812/grid@0.0.4/src/Grid.css)

<br>

## Usage

If you use Vite or a framework based on Vite such as Astro, you can import the component in a client-side script file:

```js
import '@components-1812/grid';
```

and use it in your HTML:

```html
<custom-grid size="20"></custom-grid>

<custom-grid size="30" radial-gradient="50%, 50%, 50%" follow-mouse="global"></custom-grid>

<custom-grid width="960" height="540" size="20" 
    radial-gradient="65%, 40%, 15%" follow-mouse
></custom-grid>
```

> **Note:**
> 
> If you are using a builder or framework that doesn't support import ?raw, you need to load the component and its stylesheets manually.
> 
> see [Adding CSS stylesheets manually](#adding-css-stylesheets-manually)


<br>

## Adding CSS stylesheets manually

If you want to add custom stylesheets to the component or need to load stylesheets from a different path, you can do it like this:

- Using your builder’s import raw method, `CSSStyleSheet`, and the component’s `AdoptedStyleSheets` property:

    ```js
    import { Grid } from '@components-1812/grid/Grid.js';
    import GridRawCSS from '@components-1812/grid/src/Grid.css?raw';

    const GridCSS = new CSSStyleSheet();
    GridCSS.replaceSync(GridRawCSS);

    //Add the stylesheets to the component
    Grid.stylesSheets.adopted.push(GridCSS);

    //Define the component
    import('@components-1812/grid/define');
    ```

<br>

- Using a `<style>` tag inside the shadow root of the component:

    ```js
    import { Grid } from '@components-1812/grid/Grid.js';
    import GridRawCSS from '@components-1812/grid/src/Grid.css?raw';

    //Add the stylesheets to the component
    Grid.stylesSheets.raw.push(GridRawCSS);

    //Define the component
    import('@components-1812/grid/define');
    ```

<br>

- Using a `<link>` tag inside the shadow root of the component:

    ```js
    import { Grid } from '@components-1812/grid/Grid.js';
    import GridUrl from '@components-1812/grid/src/Grid.css?url';

    //Add the stylesheets to the component
    Grid.stylesSheets.links.push(GridUrl);

    //Define the component
    import('@components-1812/grid/define');
    ```

<br>

> **Note:**
> 
> `import('@components-1812/grid/define')` calls `customElements.define('custom-grid', Grid);` in `define.js`

<br>

## CSS Custom Properties

- `--line-color`: The color of the grid lines.
- `--line-width`: The width of the grid lines.
- `--line-opacity`: The opacity of the grid lines.
- `--line-dasharray`: The dasharray of the grid lines.

<br>


## Component Attributes

#### Reactive attributes:

- `size` (default: 10): The size of the grid cells, i.e. the space between lines.

- `width` (default: 1920): The width of the grid.

- `height` (default: 1080): The height of the grid.

<br>

#### Init only attributes:

- `radial-gradient`:  Adds a radial gradient effect to the grid. The value should be a string in the format `"centerX, centerY, radius"`.

    Internally, this calls the `addRadialGradient` method in connectedCallback:

    ```js
    this.addRadialGradient({centerX, centerY, radius});
    ```


- `follow-mouse`: Moves the radial gradient effect to follow the mouse position. Only works if radial-gradient is set.

    By default, the mouse position is relative to the component, and event handlers are added to the component itself.

    You can use `follow-mouse="global"` to make it relative to the viewport, adding event handlers to the `document` to work globally:

    ```html
    <custom-grid radial-gradient="50, 50, 100" follow-mouse></custom-grid>

    <custom-grid radial-gradient="50%, 50%, 50%" follow-mouse="global"></custom-grid>
    ```

#### Ready attributes:

- `ready-links`: Set when all linked stylesheets are loaded or failed to load.

- `ready`: Set when the component initialization has finished, at the end of `connectedCallback`.

> **Note:**
> 
> To prevent FOUC (Flash of Unstyled Content), you can use the ready attributes to wait until the component is ready before displaying it:
> 
> ```css
> custom-grid:not([ready]), 
> custom-grid:not([ready-links]) {
>     display: none;
> }
> ```

<br>

## Events

- `ready-links`: Dispatched when all linked stylesheets have either loaded successfully or failed.

```js
document.querySelector('custom-grid').addEventListener('ready-links', (e) => {

    const { results } = e.detail;

    console.log(results);//[{link: HTMLLinkElement, href: string, status: 'loaded' | 'error'}, ...]
});
```

- `ready`: Dispatched when the component initialization has finished, at the end of `connectedCallback`.

<br>


## Methods

- `addRadialGradient()`: Adds a radial gradient effect to the grid lines.

    ```js
    const grid = document.querySelector('custom-grid')
    
    grid.addRadialGradient({centerX: '50%', centerY: '50%', radius: '50%'});
    ```

- `getSVGDownloadURL()`: Returns the URL of the SVG to download.

    ```js
    const grid = document.querySelector('custom-grid')

    const {url, clear} = grid.getSVGDownloadURL();

    //Clear the URL when you're done with it. Internally uses URL.revokeObjectURL(url);
    clear();
    ```

- `downloadSVG()`: Downloads the SVG to the user's computer.

    ```js
    const grid = document.querySelector('custom-grid')

    //Internally creates a anchor tag and shoots the download
    //Wait the timeout berfore clearing the URL 
    grid.downloadSVG({timeout: 2500, filename: 'grid.svg'});
    ```

<br>


## Static properties

- `Grid.defaults`: Default values for the component attributes.

```js
console.log(Grid.defaults);//{size: 10, width: 1920, height: 1080}
```

- `Grid.stylesSheets`: Stylesheets to be applied to the component in the `constructor` method.

```js
console.log(Grid.stylesSheets);//{links: [], adopted: [], raw: []}

//Insert links tags in the shadow root and wait they load to shoot the ready-links event
Grid.stylesSheets.links.push('path/to/stylesheet.css');

//Insert adopted stylesheets in the shadow root: shadowRoot.adoptedStyleSheets = Grid.stylesSheets.adopted;
Grid.stylesSheets.adopted.push(new CSSStyleSheet());

//Insert style tags in the shadow root with the raw stylesheets
Grid.stylesSheets.raw.push(`
    :host{
        display: block;
    }
`);
```

<br>


## License

MIT