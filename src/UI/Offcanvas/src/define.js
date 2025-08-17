import Offcanvas from "./Offcanvas.js";

const TAG_NAME = 'custom-offcanvas';

//Define the custom element
if(!customElements.get(TAG_NAME)){

    customElements.define(TAG_NAME, Offcanvas);
}
else {

    console.warn(`Custom element with tag name "${TAG_NAME}" is already defined.`);
}

export {Offcanvas, TAG_NAME}
export default Offcanvas;