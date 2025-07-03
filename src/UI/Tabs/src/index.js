import { Tabs } from "./Tabs.js";
import TabsRawCSS from "./Tabs.css?raw";

const TAG_NAME = 'custom-tabs';

// Add the stylesheets to the component
const TabsCSS = new CSSStyleSheet();

TabsCSS.replaceSync(TabsRawCSS);

//Tabs.stylesSheets.raw.push(TabsRawCSS);
Tabs.stylesSheets.adopted.push(TabsCSS);

//Register the custom element
if (!customElements.get(TAG_NAME)) {

    customElements.define(TAG_NAME, Tabs);
}
else {

    console.warn(`Custom element "${TAG_NAME}" is already defined.`);
}

export { Tabs, TabsCSS, TAG_NAME };
export default Tabs;