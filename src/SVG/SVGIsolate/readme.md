# SVG Isolate Custom Element

![preview](./assets/preview.webp)
> In this example we have 4 svg: `circle.svg`, `triangle.svg`, `hexagon.svg` and `heart.svg` 
>
> Each one is using the same clipPath id `id="clipPath"` and this generates a conflict in the **light DOM**. 
>
> But using the `<custom-svg-isolate>` wrapper we can isolate the svg in **shadow DOM** and avoid ids and classes conflicts.

<br>

## Attributes

#### Reactive attributes

- `src`: Path to the svg file. Changes trigger the `loadSVG` method.

    At init time, if the `src` attribute is not set, the svg in the light DOM is used.

    ```html
    <custom-svg-isolate>
        <svg width="200" height="200"><!-- SVG content --></svg>
    </custom-svg-isolate>
    ```

<br>

#### Ready attributes

- `ready`: Set when the component is ready, and the svg is loaded in the shadow DOM. Set every time you change the `src` attribute or call `loadSVG` method.

- `ready-links`: Set when the links stylesheets are loaded.

<br>

## Events

- `ready`: Dispatched when the component is ready, and the svg is loaded in the shadow DOM. shoot every time you change the `src` attribute or call `loadSVG` method.

- `ready-links`: Dispatched when the links stylesheets are loaded.

<br>

## Methods

- `async loadSVG(src)`: Load an svg from a path and replace the current svg in the shadow DOM.

<br>

## License

MIT


