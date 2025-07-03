import { Tabs } from "./Tabs.js";

const TAG_NAME = 'custom-tabs';

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, Tabs);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { TAG_NAME, Tabs };
export default Tabs;
