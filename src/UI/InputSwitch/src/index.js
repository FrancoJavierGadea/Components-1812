import InputSwitch from "./InputSwitch.js";
import InputSwitchRawCSS from "./InputSwitch.css?raw";

const TAG_NAME = 'custom-input-switch';

//Add styles
const InputSwitchCSS = new CSSStyleSheet();

InputSwitchCSS.replaceSync(InputSwitchRawCSS);

InputSwitch.stylesSheets.adopted.push(InputSwitchCSS);

//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, InputSwitch);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {InputSwitch, TAG_NAME}
export default InputSwitch;