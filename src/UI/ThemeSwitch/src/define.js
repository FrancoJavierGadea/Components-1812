import { ThemeSwitch } from "./ThemeSwitch.js";

const TAG_NAME = 'custom-theme-switch';

//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, ThemeSwitch);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {ThemeSwitch, TAG_NAME}
export default ThemeSwitch;
