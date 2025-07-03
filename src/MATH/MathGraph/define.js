import { MathGraph } from "./MathGraph.js";

const TAG_NAME = 'custom-math-graph';

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, MathGraph);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { MathGraph };

export default MathGraph;

