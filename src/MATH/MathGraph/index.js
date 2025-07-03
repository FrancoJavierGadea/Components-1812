import { MathGraph } from "./MathGraph.js";
import MathGraphRawCSS from "./MathGraph.css?raw";

const TAG_NAME = 'custom-math-graph';

//Add the stylesheets to the component
const MathGraphCSS = new CSSStyleSheet();

MathGraphCSS.replaceSync(MathGraphRawCSS);

MathGraph.stylesSheets.adopted.push(MathGraphCSS);

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, MathGraph);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { MathGraph, MathGraphCSS };

export default MathGraph;

