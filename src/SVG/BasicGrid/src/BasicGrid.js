

export class BasicGrid extends HTMLElement {

    /**
     * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
     */
    static stylesSheets = {
        links: [],
        adopted: [],
        raw: []
    };

    static defaults = {
        size: 10
    };


    static observedAttributes = ['size'];
    
    attributeChangedCallback(name, oldValue, newValue){

        if(name === 'size'){
            this.shadowRoot.querySelector('svg #grid').setAttribute('width',  newValue);
            this.shadowRoot.querySelector('svg #grid').setAttribute('height', newValue);
            this.shadowRoot.querySelector('svg #grid rect').setAttribute('width', newValue);
            this.shadowRoot.querySelector('svg #grid rect').setAttribute('height', newValue);
        }
    }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="none"  />
                </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)"  />
        </svg>
        `;

        BasicGrid.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        BasicGrid.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = BasicGrid.stylesSheets.adopted;
    }

    connectedCallback(){
        
        this.setAttribute('ready', '');
    }

    set size(value){
        this.setAttribute('size', value ?? BasicGrid.defaults.size);
    }
    get size(){
        return Number(this.getAttribute('size') ?? BasicGrid.defaults.size);
    }
}