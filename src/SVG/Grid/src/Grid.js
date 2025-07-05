

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
        <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <g class="Grid"></g>
        </svg>
        `;

        Promise.allSettled(
            Grid.stylesSheets.links.map((styleSheet) => {

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = styleSheet;

                const { promise, resolve, reject } = Promise.withResolvers();

                link.addEventListener('load', () => resolve({link, href: styleSheet, status: 'loaded'}));
                link.addEventListener('error', () => reject({link, href: styleSheet, status: 'error'}));

                this.shadowRoot.prepend(link);

                return promise;
            })
        )
        .then((results) => {

            this.dispatchEvent(new CustomEvent('ready-links', {
                detail: { results: results.map(r => r.value || r.reason) }
            }));

            this.setAttribute('ready-links', '');
        });

        Grid.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Grid.stylesSheets.adopted;
    }

    //MARK: Lifecycle callbacks
    connectedCallback(){

        this.#updateGrid();

        if(this.hasAttribute('radial-gradient')){

            const [centerX, centerY, radius] = this.getAttribute('radial-gradient').split(',').map((value) => value.trim());

            this.addRadialGradient({centerX, centerY, radius});

            if(this.hasAttribute('follow-mouse')){

                if(this.getAttribute('follow-mouse') === 'global'){

                    document.addEventListener('mousemove', this.#mouseMoveHandler);
                    document.addEventListener('mouseleave', this.#mouseLeaveHandler);
                }
                else{

                    this.addEventListener('mousemove', this.#mouseMoveHandler);
                    this.addEventListener('mouseleave', this.#mouseLeaveHandler);
                }
            }
        }


        this.dispatchEvent(new CustomEvent('ready'));
        this.setAttribute('ready', '');
    }   

    disconnectedCallback(){

        this.#clearListeners();
    }


    //MARK: update grid
    #updateGrid(){

        this.shadowRoot.querySelector('svg').setAttribute('width', this.width);
        this.shadowRoot.querySelector('svg').setAttribute('height', this.height);

        const horizontalLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        horizontalLines.classList.add('horizontal-lines');

        const verticalLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        verticalLines.classList.add('vertical-lines');

        for(let i = this.size; i < this.width; i += this.size){

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', `M ${i} 0 L ${i} ${this.height}`);

            verticalLines.append(path);
        }

        for(let i = this.size; i < this.height; i += this.size){

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', `M 0 ${i} L ${this.width} ${i}`);

            horizontalLines.append(path);
        }

        this.shadowRoot.querySelector('svg .Grid').replaceChildren(horizontalLines, verticalLines);
    }

    //MARK: add radial gradient
    /**
     * Adds a radial gradient effect to the grid lines.
     * 
     * @param {{centerX: string, centerY: string, radius: string}} params 
     */
    addRadialGradient(params = {}){

        const {centerX = '50%', centerY = '50%', radius = '50%'} = params;

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


    //MARK: Download SVG
    /**
     * Returns the URL of the SVG to download.
     * @returns {{url: string, clear: () => void}} An object containing the URL of the SVG and a function to clear the URL.
     */
    getDownloadURL(){

        const SVG = this.shadowRoot.querySelector('svg').cloneNode(true);

        ['--line-color', '--line-width', '--line-opacity', '--line-dasharray']
        .forEach((property) => {

            const value = getComputedStyle(this).getPropertyValue(property);

            SVG.style.setProperty(property, value);
        });

        SVG.querySelector('.Grid').setAttribute('stroke', 'var(--line-color)');
        SVG.querySelector('.Grid').setAttribute('stroke-width', 'var(--line-width)');
        SVG.querySelector('.Grid').setAttribute('stroke-opacity', 'var(--line-opacity)');
        SVG.querySelector('.Grid').setAttribute('stroke-dasharray', 'var(--line-dasharray)');

        //Generate the url to save the SVG
        const rawSVG = new XMLSerializer().serializeToString(SVG);
        const blob = new Blob([rawSVG], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        return { url, clear: () => URL.revokeObjectURL(url) };
    }
    downloadSVG(timeout = 2500){

        const {url, clear} = this.getDownloadURL();

        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid.svg';
        a.click();

        setTimeout(() => clear(), timeout);
    }


    //MARK: Handler events
    #mouseMoveHandler = (e) => {

        const x = this.getAttribute('follow-mouse') === 'global' ? e.clientX : e.offsetX;
        const y = this.getAttribute('follow-mouse') === 'global' ? e.clientY : e.offsetY;

        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cx', x);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cy', y);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fx', x);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fy', y);
    }
    #mouseLeaveHandler = () => {

        const [centerX, centerY, radius] = this.getAttribute('radial-gradient').split(',').map((value) => value.trim());

        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cx', centerX);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('cy', centerY);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fx', centerX);
        this.shadowRoot.querySelector('svg #grid-radial-gradient').setAttribute('fy', centerY);
    }

    #clearListeners(){
        
        document.removeEventListener('mousemove', this.#mouseMoveHandler);
        document.removeEventListener('mouseleave', this.#mouseLeaveHandler);
        this.removeEventListener('mousemove', this.#mouseMoveHandler);
        this.removeEventListener('mouseleave', this.#mouseLeaveHandler);
    }

    //MARK: Getters and Setters
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
}

export default Grid;