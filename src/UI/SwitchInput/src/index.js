import SwitchInput from "./SwitchInput.js";
import SwitchInputRawCSS from "./SwitchInput.css?raw";

const TAG_NAME = 'custom-switch-input';

//Add styles
const SwitchInputCSS = new CSSStyleSheet();

SwitchInputCSS.replaceSync(SwitchInputRawCSS);

SwitchInput.stylesSheets.adopted.push(SwitchInputCSS);

//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, SwitchInput);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {SwitchInput, TAG_NAME}
export default SwitchInput;