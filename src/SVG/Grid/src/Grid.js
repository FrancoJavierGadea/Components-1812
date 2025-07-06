

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


        if(['width', 'height'].includes(name)){

            this.#SVGRect = null;//Reset the svg rect cache
        }

        this.#updateGrid();
    }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
        <svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
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

        this.$SVG = (selector = '') => this.shadowRoot.querySelector(`svg ${selector}`);    
    }

    //MARK: Lifecycle callbacks
    connectedCallback(){

        this.#updateGrid();

        if(this.hasAttribute('radial-gradient')){

            const {centerX, centerY, radius} = this.#parseRadialGradientAttr();

            this.addRadialGradient({centerX, centerY, radius});

            if(this.hasAttribute('follow-mouse')){

                if(this.getAttribute('follow-mouse') === 'global'){

                    document.addEventListener('mousemove', this.#mouseMoveHandler);
                    document.addEventListener('mouseleave', this.#mouseLeaveHandler);
                    window.addEventListener('resize', this.#resizeHandler);
                }
                else{

                    this.$SVG().addEventListener('mousemove', this.#mouseMoveHandler);
                    this.$SVG().addEventListener('mouseleave', this.#mouseLeaveHandler);
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

        this.$SVG().setAttribute('width', this.width);
        this.$SVG().setAttribute('height', this.height);
        this.$SVG().setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);

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

        this.$SVG('.Grid').replaceChildren(horizontalLines, verticalLines);
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

        this.$SVG().prepend(defs);

        this.$SVG('.Grid').style.setProperty('--line-color', 'url(#grid-radial-gradient)');
    }
    #parseRadialGradientAttr(){

        const radialGradientAttr = this.getAttribute('radial-gradient') ?? '50%, 50%, 50%';

        const [centerX, centerY, radius] = radialGradientAttr.split(',').map((value) => value.trim());

        return {centerX, centerY, radius};
    }


    //MARK: Download SVG
    /**
     * Returns the URL of the SVG to download.
     * @returns {{url: string, clear: () => void}} An object containing the URL of the SVG and a function to clear the URL.
     */
    getSVGDownloadURL(){

        const SVG = this.$SVG().cloneNode(true);

        const styles = getComputedStyle(this);

        Object.entries({
            'stroke': '--line-color', 
            'stroke-width': '--line-width', 
            'stroke-opacity': '--line-opacity', 
            'stroke-dasharray': '--line-dasharray'
        })
        .forEach(([attribute, property]) => {

            const value = styles.getPropertyValue(property);

            SVG.style.setProperty(property, value);
            SVG.querySelector('.Grid').setAttribute(attribute, `var(${property})`);
        });

        //Generate the url to save the SVG
        const rawSVG = new XMLSerializer().serializeToString(SVG);
        const blob = new Blob([rawSVG], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        return { url, clear: () => URL.revokeObjectURL(url) };
    }
    /**
     * Downloads the SVG.
     * @param {{timeout: number, filename: string}} options
     * @param {number} options.timeout - The timeout to wait before revoking the URL.
     * @param {string} options.filename - The filename for the download.
     */
    downloadSVG(options = {}){

        const {timeout = 2500, filename = 'grid.svg'} = options;

        const {url, clear} = this.getSVGDownloadURL();

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        setTimeout(() => clear(), timeout);
    }


    //MARK: Handler events
    #SVGRect = null;//Cache the svg position to calculate the mouse position relative to the svg in global move

    #mouseMoveHandler = (e) => {

        this.#SVGRect ??= this.$SVG().getBoundingClientRect();

        const {top, left} = this.#SVGRect;
        const isGlobal = this.getAttribute('follow-mouse') === 'global';

        let x = isGlobal ? e.clientX - left : e.offsetX;
        let y = isGlobal ? e.clientY - top : e.offsetY;

        this.$SVG('#grid-radial-gradient').setAttribute('cx', x);
        this.$SVG('#grid-radial-gradient').setAttribute('cy', y);
        this.$SVG('#grid-radial-gradient').setAttribute('fx', x);
        this.$SVG('#grid-radial-gradient').setAttribute('fy', y);
    }
    #mouseLeaveHandler = () => {

        const {centerX, centerY} = this.#parseRadialGradientAttr();

        this.$SVG('#grid-radial-gradient').setAttribute('cx', centerX);
        this.$SVG('#grid-radial-gradient').setAttribute('cy', centerY);
        this.$SVG('#grid-radial-gradient').setAttribute('fx', centerX);
        this.$SVG('#grid-radial-gradient').setAttribute('fy', centerY);
    }
    #resizeHandler = () => {

        this.#SVGRect = null;
    }

    #clearListeners(){
        
        document.removeEventListener('mousemove', this.#mouseMoveHandler);
        document.removeEventListener('mouseleave', this.#mouseLeaveHandler);
        this.$SVG().removeEventListener('mousemove', this.#mouseMoveHandler);
        this.$SVG().removeEventListener('mouseleave', this.#mouseLeaveHandler);
        window.removeEventListener('resize', this.#resizeHandler);
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