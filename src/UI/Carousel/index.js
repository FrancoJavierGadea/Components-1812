
import { Carousel } from './Carousel.js';
import CarouselRawCSS from './Carousel.css?raw';

//Add the stylesheets to the component
const CarouselCSS = new CSSStyleSheet();

CarouselCSS.replaceSync(CarouselRawCSS);

//Aside.stylesSheets.adopted.push(CarouselCSS);
Carousel.stylesSheets.raw.push(CarouselRawCSS);

// Register the custom element
if (!customElements.get('custom-carousel')) {

    customElements.define('custom-carousel', Carousel);
}
else{
    console.warn('Custom element "custom-carousel" is already defined.');
}


export { Carousel, CarouselCSS };

export default Carousel;