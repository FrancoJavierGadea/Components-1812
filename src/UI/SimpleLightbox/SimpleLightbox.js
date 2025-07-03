

export class SimpleLightbox extends HTMLElement {

    /**
     * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component. default: ['/styles/ImageOverlay.css']
     */
    static stylesSheets = {
        links: [],
        adopted: [],
        raw: []
    };

    constructor() {
        super();

       this.attachShadow({ mode: 'open' });

       this.shadowRoot.innerHTML = `

            <img src="${this.src}" alt="${this.alt}">

            <div class="top-controls">
                <button class="close-button" title="Close">
                    <slot name="close-icon">Close</slot>
                </button>   
            </div>

            <button class="next-button" title="Next">
                <slot name="next-icon">Next</slot>
            </button>

            <button class="previous-button" title="Previous">
                <slot name="previous-icon">Previous</slot>
            </button>
        `;

        SimpleLightbox.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = styleSheet;

            this.shadowRoot.prepend(link);
        });

        SimpleLightbox.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');

            styleElement.textContent = style;

            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = SimpleLightbox.stylesSheets.adopted;
    }

    connectedCallback(){

        this.shadowRoot.querySelector('.close-button').addEventListener('click', this.close);
        this.shadowRoot.querySelector('.next-button').addEventListener('click', this.next);
        this.shadowRoot.querySelector('.previous-button').addEventListener('click', this.previous);
    }

    disconnectedCallback() {

        this.shadowRoot.querySelector('.close-button').removeEventListener('click', this.close);
        this.shadowRoot.querySelector('.next-button').removeEventListener('click', this.next);
        this.shadowRoot.querySelector('.previous-button').removeEventListener('click', this.previous);
    }

    //MARK: Set Location
    /**
     * Sets initial location and size of the overlay for image the animation.
     * @param {Object} options
     * @param {number} options.width - The width of the image.
     * @param {number} options.height - The height of the image.
     * @param {number} [options.top=0] - The top position on the viewport.
     * @param {number} [options.left=0] - The left position on the viewport.
     */
    setLocation({ width = window.innerWidth, height = window.innerHeight, top = 0, left = 0 }) {

        this.style.width = `${width}px`;
        this.style.height = `${height}px`;
        this.style.top = `${top}px`;
        this.style.left = `${left}px`;
    }

    

    //MARK: Getters and Setters
    set src(src) {
        this.setAttribute('src', src);
        this.shadowRoot.querySelector('img')?.setAttribute('src', src);
    }
    get src() {

        return this.getAttribute('src');
    }

    set alt(alt) {
        this.setAttribute('alt', alt);
        this.shadowRoot.querySelector('img')?.setAttribute('alt', alt);
    }
    get alt() {

        return this.getAttribute('alt') || 'Image not found';
    }

    set targetGallery(targetGallery) {

        this.setAttribute('target-gallery', targetGallery);
    }
    get targetGallery() {

        return this.getAttribute('target-gallery');
    }


    close = () => {

        this.remove();

        this.dispatchEvent(new CustomEvent('close', {
            detail: {
                src: this.src,
                alt: this.alt,
                targetGallery: this.targetGallery
            }
        }));
    };

    //MARK: Next
    /**
     * Gets all images marked width data-gallery attribute with the same value as targetGallery.
     * Iterates through the images to find the next image in the gallery.
     * If the next image is found, updates the src and alt attributes of the overlay.
     * @returns {void}
     */
    next = () => {

        if (!this.targetGallery) {

            console.warn('No target gallery specified for ImageOverlay');
            return;
        }

        const gallery = document.querySelectorAll(`img[data-gallery="${this.targetGallery}"]`);

        const nextImage = {index: null, img: null, isLast: false};

        gallery.forEach((img, index) => {

            if(img.getAttribute('src') === this.src) {
                
                nextImage.index = index + 1, 
                nextImage.img = gallery.item(index + 1),
                nextImage.isLast = index + 2 >= gallery.length 
            }
        });

        if(nextImage.img) {

            this.src = nextImage.img.getAttribute('src');
            this.alt = nextImage.img.getAttribute('alt') || 'Image not found';

            this.dispatchEvent(new CustomEvent('next', {
                detail: {
                    src: this.src,
                    alt: this.alt,
                    targetGallery: this.targetGallery,
                    ...nextImage
                }
            }));
        }
        else {

            console.warn('No next image found in the gallery');
        }

        this.shadowRoot.querySelector('.next-button').disabled = nextImage.isLast;
        this.shadowRoot.querySelector('.previous-button').disabled = false;
    }

    //MARK: Previous
    /**
     * Gets all images marked with data-gallery attribute with the same value as targetGallery.
     * Iterates through the images to find the previous image in the gallery.
     * If the previous image is found, updates the src and alt attributes of the overlay.
     * @returns {void}
     */
    previous = () =>{

        if (!this.targetGallery) {

            console.warn('No target gallery specified for ImageOverlay');
            return;
        }

        const gallery = document.querySelectorAll(`img[data-gallery="${this.targetGallery}"]`);

        const previousImage = {index: null, img: null, isFirst: false};

        gallery.forEach((img, index) => {

            if (img.getAttribute('src') === this.src) {
                
                previousImage.index = index - 1;
                previousImage.img = gallery.item(index - 1);
                previousImage.isFirst = index - 1 <= 0;
            }
        });

        if(previousImage.img) {

            this.src = previousImage.img.getAttribute('src');
            this.alt = previousImage.img.getAttribute('alt') || 'Image not found';

            this.dispatchEvent(new CustomEvent('previous', {
                detail: {
                    src: this.src,
                    alt: this.alt,
                    targetGallery: this.targetGallery,
                    ...previousImage
                }
            }));
        }
        else {

            console.warn('No previous image found in the gallery');
        }

        this.shadowRoot.querySelector('.previous-button').disabled = previousImage.isFirst;
        this.shadowRoot.querySelector('.next-button').disabled = false;
    }
}