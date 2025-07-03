import { Axis } from "./Axis.js";
import AxisRawCSS from "./Axis.css?raw";

const TAG_NAME = 'custom-axis';

//Add the stylesheets to the component
const AxisCSS = new CSSStyleSheet();

AxisCSS.replaceSync(AxisRawCSS);

Axis.stylesSheets.adopted.push(AxisCSS);

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, Axis);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { Axis, AxisCSS };

export default Axis;

