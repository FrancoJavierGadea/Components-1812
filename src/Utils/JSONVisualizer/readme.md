# JSON Visualizer custom element

<br>

## Examples

- **Codepen**: 
[Example 1](https://codepen.io/FrancoJavierGadea/pen/MYwNLWd)
[Example 2](https://codepen.io/FrancoJavierGadea/pen/jEPgdyR)

<br>

## Installation

#### NPM

```bash
npm install @components-1812/json-visualizer
```

- [`SVG Isolate package`](https://www.jsdelivr.com/package/npm/@components-1812/json-visualizer)

#### CDN

```html
<script type="module">
    import JSONVisualizer from 'https://cdn.jsdelivr.net/npm/@components-1812/json-visualizer@0.0.1/src/JSONVisualizer.min.js';

    //Load the stylesheet
    JSONVisualizer.stylesSheets.links.push('https://cdn.jsdelivr.net/npm/@components-1812/json-visualizer@0.0.1/src/JSONVisualizer.min.css');

    console.log(JSONVisualizer);

    customElements.define('custom-json-visualizer', JSONVisualizer);
</script>
```

- **jsdelivr**: [`SVG Isolate package`](https://www.jsdelivr.com/package/npm/@components-1812/svg-isolate)
[`SVGIsolate.js`](https://cdn.jsdelivr.net/npm/@components-1812/svg-isolate@0.0.1/src/SVGIsolate.min.js)
[`SVGIsolate.css`](https://cdn.jsdelivr.net/npm/@components-1812/svg-isolate@0.0.1/src/SVGIsolate.min.css)

- **unpkg**: [`SVG Isolate package`](https://app.unpkg.com/@components-1812/svg-isolate)
[`SVGIsolate.js`](https://unpkg.com/@components-1812/svg-isolate@0.0.1/src/SVGIsolate.js)
[`SVGIsolate.css`](https://unpkg.com/@components-1812/svg-isolate@0.0.1/src/SVGIsolate.css)

<br>

## Usage

If you use Vite or a framework based on Vite such as Astro, you can import the component in a client-side script file:

```js
import '@components-1812/svg-isolate';
```

and use it in your HTML:

```html
<custom-svg-isolate>
    <svg width="200" height="200"><!-- SVG content --></svg>
</custom-svg-isolate>

<custom-svg-isolate src="path/tocircle.svg"></custom-svg-isolate>
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
    import { SVGIsolate } from '@components-1812/svg-isolate/SVGIsolate.js';
    import SVGIsolateRawCSS from '@components-1812/svg-isolate/SVGIsolate.css?raw';

    const SVGIsolateCSS = new CSSStyleSheet();
    SVGIsolateCSS.replaceSync(SVGIsolateRawCSS);

    //Add the stylesheets to the component
    SVGIsolate.stylesSheets.adopted.push(SVGIsolateCSS);

    //Define the component
    import('@components-1812/svg-isolate/define');
    ```

<br>

- Using a `<style>` tag inside the shadow root of the component:

    ```js
    import { SVGIsolate } from '@components-1812/svg-isolate/SVGIsolate.js';
    import SVGIsolateRawCSS from '@components-1812/svg-isolate/SVGIsolate.css?raw';

    //Add the stylesheets to the component
    SVGIsolate.stylesSheets.raw.push(SVGIsolateRawCSS);

    //Define the component
    import('@components-1812/svg-isolate/define');
    ```

<br>

- Using a `<link>` tag inside the shadow root of the component:

    ```js
    import { SVGIsolate } from '@components-1812/svg-isolate/SVGIsolate.js';
    import SVGIsolateUrl from '@components-1812/svg-isolate/SVGIsolate.css?url';

    //Add the stylesheets to the component
    SVGIsolate.stylesSheets.links.push(SVGIsolateUrl);

    //Define the component
    import('@components-1812/svg-isolate/define');
    ```

<br>

> **Note:**
> 
> `import('@components-1812/svg-isolate/define')` calls `customElements.define('custom-svg-isolate', SVGIsolate);` in `define.js`


## CSS Variables

```css
--line-height: 1.25;
--line-elements-gap: 5px;
--line-white-space: normal;
--font: Consolas, "Courier New", monospace, sans-serif;
```

```css
--json-tab-size: 4ch;
```

#### Tokens theme colors
```css
--json-background: #222;
--json-foreground: #eee;

--json-key: #9cdcfe;           
--json-string: #ce9178;        
--json-number: #b5cea8;        
--json-boolean: #569cd6;       
--json-null: #dcdcaa;  

--json-brace: #ffd700;         
--json-bracket: #ffd700;       
--json-comma: #d4d4d4;         
--json-colon: #d4d4d4; 
```

#### Line Numbers

```css
--line-numbers-padding: 5px;
--line-numbers-color: #777;
--line-numbers-background: transparent;
--line-numbers-text-align: right;
--line-numbers-width: 2ch;
```

#### Indentation Guides

```css
--indentation-guides-lines-color: #444;
--indentation-guides-lines-width: 1px;
```

#### Copy button

```css
--copy-button-width: 40px;
--copy-button-height: 40px;
--copy-button-color: #777;
--copy-button-hover-color: #fff;
--copy-button-padding: 10px;
```

#### Toggle Lines buttons

```css
--toggle-button-width: 15px;
--toggle-button-color: #777;
--toggle-button-hover-color: #fff;
--toggle-button-padding: 0;
```


## Attributes

#### Reactive attributes

- `src`: url to requests a json file.

    At init time, if the `src` attribute is not set `json` attribute or textContent is used.

- `json`: A raw json

- `line-numbers`: render and show line numbers, set to `"none"` for hide

- `toggle-lines`: render and show toogle lines buttons, set to `"none"` for hide

- `indentation-guides-lines`: show indentation guides lines, set to `"none"` for hide

- `copy-button`: render and show copy button, set to `"none"` for hide





#### Ready attributes

- `ready`: Set when the component is ready, at the last of `connectedCallback()`
- `ready-links`: Set when the links added by `JSONVisualizer.stylesSheets.links` are loaded
- `ready-json`: Set when the json are loaded and rendered succefully



<br>

## License

This package is distributed under the [MIT license](./LICENSE).

### Credits

Default icons used in this package are sourced from the [Bootstrap Icons](https://icons.getbootstrap.com/) project, licensed under the MIT license.  
© 2019–2024 The Bootstrap Authors 

- [clipboard](https://icons.getbootstrap.com/icons/clipboard/)
- [chevron-down](https://icons.getbootstrap.com/icons/chevron-down/)
- [check](https://icons.getbootstrap.com/icons/check2/)