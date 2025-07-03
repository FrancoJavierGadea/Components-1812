import { SimpleLightbox } from './SimpleLightbox.js';
import rawCss from './SimpleLightbox.css?raw';

//Add the stylesheets to the component
const SimpleLightboxCSS = new CSSStyleSheet();

SimpleLightboxCSS.replaceSync(rawCss);

SimpleLightbox.stylesSheets.adopted.push(SimpleLightboxCSS);

// Register the custom element
if (!customElements.get('custom-simple-lightbox')) {

    customElements.define('custom-simple-lightbox', SimpleLightbox);
}
else {
    console.warn('Custom element "custom-simple-lightbox" is already defined.');
}


export { SimpleLightbox, SimpleLightboxCSS };

export default SimpleLightbox;