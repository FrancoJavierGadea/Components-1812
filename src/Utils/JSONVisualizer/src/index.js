import JSONVisualizer from "./JSONVisualizer.js";
import JSONVisualizerRawCSS from "./JSONVisualizer.css?raw";
import JSONTokenizer from "./JSONTokenizer.js";

const TAG_NAME = 'custom-json-visualizer';

//Add styles
const JSONVisualizerCSS = new StyleSheet();

JSONVisualizerCSS.replaceSync(JSONVisualizerRawCSS);

JSONVisualizer.stylesSheets.adopted.push(JSONVisualizerCSS);

//Define JSON Tokenizer
JSONVisualizer.getTokens = (rawJson) => {

    const tokenizer = new JSONTokenizer(); 

    tokenizer.tokenize(rawJson);

    return tokenizer.tokens;
}


//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, JSONVisualizer);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {JSONVisualizer, TAG_NAME}
export default JSONVisualizer;
