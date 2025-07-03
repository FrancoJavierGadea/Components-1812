
import { Aside } from './Aside.js';
import rawCss from './Aside.css?raw';

//Add the stylesheets to the component
const AsideCSS = new CSSStyleSheet();

AsideCSS.replaceSync(rawCss);

//Aside.stylesSheets.adopted.push(AsideCSS);
Aside.stylesSheets.raw.push(rawCss);

// Register the custom element
if (!customElements.get('custom-aside')) {

    customElements.define('custom-aside', Aside);
}
else{
    console.warn('Custom element "custom-aside" is already defined.');
}


export { Aside, AsideCSS };

export default Aside;