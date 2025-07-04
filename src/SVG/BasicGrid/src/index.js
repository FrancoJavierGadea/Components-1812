import { BasicGrid } from "./BasicGrid.js";
import BasicGridRawCSS from "./BasicGrid.css?raw";

const TAG_NAME = 'custom-basic-grid';

//Add the stylesheets to the component
const BasicGridCSS = new CSSStyleSheet();

BasicGridCSS.replaceSync(BasicGridRawCSS);

BasicGrid.stylesSheets.adopted.push(BasicGridCSS);

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, BasicGrid);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { BasicGrid, BasicGridCSS, TAG_NAME };
export default BasicGrid;    