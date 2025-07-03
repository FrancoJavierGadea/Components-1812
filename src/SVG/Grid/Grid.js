

export class Grid extends HTMLElement {

    /**
     * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
     */
    static stylesSheets = {
        links: [],
        adopted: [],
        raw: []
    };

    static defaults = {
        size: 10,
        width: 1920,
        height: 1080,
    };


    static observedAttributes = ['size', 'width', 'height'];
    
    attributeChangedCallback(name, oldValue, newValue){

        this.#updateGrid();
    }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <g class="Grid"></g>
        </svg>
        `;

        Grid.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        Grid.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Grid.stylesSheets.adopted;
    }

    connectedCallback(){

        this.#updateGrid();

        if(this.radialGradient){

            const [centerX, centerY, radius] = this.radialGradient.split(',').map((value) => value.trim());

            this.addRadialGradient({centerX, centerY, radius});

            if(this.followMouse){

                this.addEventListener('mousemove', this.#mouseMoveHandler);
                this.addEventListener('mouseleave', this.#mouseLeaveHandler);
            }
        }

        this.setAttribute('ready', '');

    }   

    disconnectedCallback(){

        this.removeEventListener('mousemove', this.#mouseMoveHandler);
        this.removeEventListener('mouseleave', this.#mouseLeaveHandler);
    }


    #updateGrid(){

        const horizontalLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        horizontalLines.classList.add('horizontal-lines');

        const verticalLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        verticalLines.classList.add('vertical-lines');

        for(let i = 0; i < this.width; i += this.size){

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', `M ${i} 0 L ${i} ${this.height}`);

            horizontalLines.appendChild(path);
        }

        for(let i = 0; i < this.height; i += this.size){

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', `M 0 ${i} L ${this.width} ${i}`);

            verticalLines.appendChild(path);
        }

        this.shadowRoot.querySelector('svg .Grid').replaceChildren(horizontalLines, verticalLines);
    }

    addRadialGradient({centerX = '50%', centerY = '50%', radius = '50%' } = {}){

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        defs.innerHTML = `

            <linearGradient id="grid-linear-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--line-color)" stop-opacity="1" />
                <stop offset="100%" stop-color="var(--line-color)" stop-opacity="0" />
            </linearGradient>

            <radialGradient id="grid-radial-gradient" 
                cx="${centerX}" cy="${centerY}" r="${radius}" fx="${centerX}" fy="${centerY}"
                href="#grid-linear-gradient" gradientUnits="userSpaceOnUse"
            />
        `;

        this.shadowRoot.querySelector('svg').prepend(defs);

        this.shadowRoot.querySelector('svg .Grid').style.setProperty('--line-color', 'url(#grid-radial-gradient)');
    }

    #mouseMoveHandler = (e) => {

        const { offsetX: x, offsetY: y } = e;

        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cx', x);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cy', y);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fx', x);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fy', y);
    }
    #mouseLeaveHandler = () => {

        const [centerX, centerY, radius] = this.radialGradient.split(',').map((value) => value.trim());

        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cx', centerX);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cy', centerY);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fx', centerX);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fy', centerY);
    }

    set size(value){
        value ? this.setAttribute('size', value) : this.removeAttribute('size');
    }
    get size(){
        return Number(this.getAttribute('size') ?? Grid.defaults.size);
    }

    set width(value){
        value ? this.setAttribute('width', value) : this.removeAttribute('width');
    }
    get width(){
        return Number(this.getAttribute('width') ?? Grid.defaults.width);
    }

    set height(value){
        value ? this.setAttribute('height', value) : this.removeAttribute('height');
    }
    get height(){
        return Number(this.getAttribute('height') ?? Grid.defaults.height);
    }

    set radialGradient(value){
       value ? this.setAttribute('radial-gradient', value) : this.removeAttribute('radial-gradient');
    }
    get radialGradient(){
        return this.getAttribute('radial-gradient');
    }

    set followMouse(value){
        value ? this.setAttribute('follow-mouse', '') : this.removeAttribute('follow-mouse');
    }
    get followMouse(){
        return this.hasAttribute('follow-mouse');
    }
}