import Offcanvas from "./Offcanvas.js";
import OffcanvasRawCSS from './Offcanvas.css?raw';

//Added the css
const OffcanvasCSS = new CSSStyleSheet();

OffcanvasCSS.replaceSync(OffcanvasRawCSS);

Offcanvas.stylesSheets.adopted.push(OffcanvasCSS);

//Define the custom element
if(!customElements.get(Offcanvas.DEFAULT_TAG_NAME)){

    customElements.define(Offcanvas.DEFAULT_TAG_NAME, Offcanvas);
}
else {

    console.warn(`Custom element with tag name "${Offcanvas.DEFAULT_TAG_NAME}" is already defined.`);
}

export {Offcanvas}
export default Offcanvas;