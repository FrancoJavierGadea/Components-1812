import { Grid } from "./Grid.js";
const TAG_NAME = 'custom-grid';

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, Grid);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { TAG_NAME, Grid };
export default Grid;
