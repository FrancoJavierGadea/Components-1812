# JSON Visualizer custom element



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
--copy-btn-width: 40px;
--copy-btn-height: 40px;
--copy-btn-color: #777;
--copy-btn-hover-color: #fff;
--copy-btn-padding: 10px;
```

#### Toggle Lines buttons

```css
--toggle-btn-width: 15px;
--toggle-btn-color: #777;
--toggle-btn-hover-color: #fff;
--toggle-btn-padding: 0;
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

- `ready`: Set when the component is ready, and the json is loaded and render.