import SwitchInput from "./SwitchInput.js";

const TAG_NAME = 'custom-switch-input';

//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, SwitchInput);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {SwitchInput, TAG_NAME}
export default SwitchInput;