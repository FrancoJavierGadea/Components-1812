

export class Carousel extends HTMLElement {

    /**
     * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
     */
    static stylesSheets = {
        links: [],
        adopted: [],
        raw: []
    };

    currentSlide = {
        index: 0,
        slide: null
    }

    #currentSlide = 0

    constructor(){
        super();

        this.attachShadow({mode: "open"});

        this.shadowRoot.innerHTML = `
            <div class="carousel-track">
                
                <slot>Carousel content</slot>
                
            </div>
            <button class="next-button">
                <slot name="next-button-icon">Next</slot>
            </button>
            <button class="previous-button">
                <slot name="previous-button-icon">Previous</slot>
            </button>
        `;

        Carousel.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        Carousel.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Carousel.stylesSheets.adopted;
    }

    //MARK: ConnectedCallback
    connectedCallback(){

        this.#initSlides();

        this.shadowRoot.querySelector('.next-button').addEventListener('click', this.#handleNext);
        this.shadowRoot.querySelector('.previous-button').addEventListener('click', this.#handlePrivious);



        this.shadowRoot.querySelector('.carousel-track').addEventListener('transitionend', (e) => {
            
            if(this.#currentSlide < 0 || this.#currentSlide >= this.slides.length){

                const track = e.currentTarget;

                track.style.transition = 'initial';

                this.#currentSlide = this.#currentSlide < 0 ? this.slides.length - 1 : 0;
                this.style.setProperty('--current-slide', this.#currentSlide);

                void track.offsetWidth;
                
                track.style.transition = '';
            }

            if(this.#currentSlide >= this.slides.length){

                console.log('first')

                

                

                
            }
        });


        // For prevent FOUC (Flash Of Unstyled Content):
        // El componente se inicializa oculto (via style="visibility: hidden" en HTML),
        // y solo se muestra una vez que está completamente renderizado y estilizado.
        this.style.visibility = '';
        this.setAttribute('ready', '');

        console.log('ready')
    }

    disconnectedCallback(){

        this.slides = [];
        this.#slidesObserver.disconnect();
        this.#slidesObserver = null;

        this.shadowRoot.querySelector('.next-button').removeEventListener('click', this.#handleNext);
        this.shadowRoot.querySelector('.previous-button').removeEventListener('click', this.#handlePrivious);
    }


    /** @type {IntersectionObserver | null} */
    #slidesObserver = null;

    #initObserver(){

        this.#slidesObserver = new IntersectionObserver((slides = []) => {

            for(const slide of slides){
                
                if(slide.isIntersecting){
       
                    if(slide.target.hasAttribute('clone')){
                        
                        const index = Number(slide.target.getAttribute('data-slide-index'));

                        this.moveTo(index, 'instant');
                    }
                    else {

                        //console.log(slide.target);
                    }
                }
            }
    
        }, {root: this, rootMargin: '0px', threshold: 1.0});
    }

    #initSlides(){

        this.slides = [...this.querySelectorAll('[data-slide]')];

        const previousSlides = document.createDocumentFragment();
        const nextSlides = document.createDocumentFragment();

        this.slides.forEach((slide, index) => {

            slide.setAttribute('data-slide-index', index);

            if(index < 3){
                const cloned = slide.cloneNode(true);
                cloned.setAttribute('clone', 'next');

                nextSlides.append(cloned);
            }

            if(index >= this.slides.length - 3){

                const cloned = slide.cloneNode(true);
                cloned.setAttribute('clone', 'previous');

                previousSlides.append(cloned);
            }
        });

        this.append(nextSlides);
        this.prepend(previousSlides);
    }

    //MARK: Methods
    next(){

       this.#currentSlide++;
       this.style.setProperty('--current-slide', this.#currentSlide);

    }
    #handleNext = () => {
        this.next();
    }

    previous(){

        this.#currentSlide--;
        this.style.setProperty('--current-slide', this.#currentSlide);
    }
    #handlePrivious = () => {
        this.previous();
    }


    moveTo(index = 0, behavior = 'smooth'){




    }

    moveBy(distance = this.offsetWidth, behavior = 'smooth'){

        const track = this.shadowRoot.querySelector('.carousel-track');

        const old = Number(track.style.getPropertyValue('--translate'));

        track.style.setProperty('--translate', old +distance);
    }
}