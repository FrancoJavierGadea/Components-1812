import InputSwitch from "./InputSwitch.js";

const TAG_NAME = 'custom-input-switch';


//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, InputSwitch);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {InputSwitch, TAG_NAME}
export default InputSwitch;