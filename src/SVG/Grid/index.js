import { Grid } from "./Grid.js";
import GridRawCSS from "./Grid.css?raw";

const TAG_NAME = 'custom-grid';

//Add the stylesheets to the component
const GridCSS = new CSSStyleSheet();

GridCSS.replaceSync(GridRawCSS);

Grid.stylesSheets.adopted.push(GridCSS);

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, Grid);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { Grid, GridCSS };
export default Grid;    