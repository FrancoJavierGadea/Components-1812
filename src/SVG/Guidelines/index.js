import { Guidelines } from "./Guidelines.js";
import GuidelinesRawCSS from "./Guidelines.css?raw";

//Add the stylesheets to the component
const GuidelinesCSS = new CSSStyleSheet();

GuidelinesCSS.replaceSync(GuidelinesRawCSS);

Guidelines.stylesSheets.adopted.push(GuidelinesCSS);


//Register the custom element
if (!customElements.get('custom-guidelines')) {

    customElements.define('custom-guidelines', Guidelines);
}
else {

    console.warn('Custom element "custom-guidelines" is already defined.');
}

export { Guidelines, GuidelinesCSS };
export default Guidelines;
