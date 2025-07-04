import { BasicGrid } from "./BasicGrid.js";
const TAG_NAME = 'custom-basic-grid';

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, BasicGrid);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { TAG_NAME, BasicGrid };
export default BasicGrid;
