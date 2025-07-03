

export class MathGraph extends HTMLElement {

    static defaults = {
        minX: -10,
        maxX: 10,
        minY: -10,
        maxY: 10,
        scale: 10,
        step: 0.1,
        precision: 2
    }

    static stylesSheets = {
        raw: [],
        adopted: [],
        links: []
    }   

    static parseLatex = null;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            
            </svg>
        `;

        MathGraph.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        MathGraph.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = MathGraph.stylesSheets.adopted;
    }

    connectedCallback() {

        
        if(this.fx){
            
            (async () => {
    
                try {
    
                    await this.drawLatexFunction({latex: this.fx});
                } 
                catch (error) {
    
                    console.warn(error);
                }
                
                this.setAttribute('ready', true);
            })();
          
            return;
        }

        this.setAttribute('ready', true);
    }

    disconnectedCallback() {
        
    }


    
    //MARK: Methods
    async drawLatexFunction(options = {}){

        if(!MathGraph.parseLatex){

            throw new Error('MathGraph.parseLatex is not defined');
        }

        const {latex, step = this.step, precision = this.precision, name, id} = options;

        const fx = await MathGraph.parseLatex(latex);

        this.drawFunction({ fx, step, precision, name, id });
    }

    drawFunction(options = {}){

        const {fx, step = this.step, precision = this.precision, name, id} = options;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('Math-function');

        name && path.setAttribute('data-name', name);
        id && path.setAttribute('id', id);

        //MARK: Draw the function
        let d = '';

        for(let x = this.minX; x <= this.maxX; x += step){
            
            const y = fx(x);

            const {x: px, y: py} = this.toPixel(x, y);

            d += x === this.minX ? 
                `M ${px.toFixed(precision)} ${py.toFixed(precision)}` : 
                `L ${px.toFixed(precision)} ${py.toFixed(precision)}`;
        }

        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');

        this.shadowRoot.querySelector('svg').append(path);
    }

    
    toPixel(x, y) {

        const origin = this.getOrigin();

        return {
            x: x * this.scale + origin.x,
            y: -y * this.scale + origin.y
        } 
    }

    getOrigin() {
        return {
            x: this.offsetWidth / 2,
            y: this.offsetHeight / 2
        }
    }
    
    //MARK: Getters and Setters
    get minX() {
        return Number(this.getAttribute('min-x') ?? MathGraph.defaults.minX);
    }
    set minX(value) {
        value ? this.setAttribute('min-x', value) : this.removeAttribute('min-x');
    }

    get maxX() {
        return Number(this.getAttribute('max-x') ?? MathGraph.defaults.maxX);
    }
    set maxX(value) {
        value ? this.setAttribute('max-x', value) : this.removeAttribute('max-x');
    }

    get minY() {
        return Number(this.getAttribute('min-y') ?? MathGraph.defaults.minY);
    }
    set minY(value) {
        value ? this.setAttribute('min-y', value) : this.removeAttribute('min-y');
    }

    get maxY() {
        return Number(this.getAttribute('max-y') ?? MathGraph.defaults.maxY);
    }
    set maxY(value) {
        value ? this.setAttribute('max-y', value) : this.removeAttribute('max-y');
    }

    get scale() {
        return Number(this.getAttribute('scale') ?? MathGraph.defaults.scale);
    }
    set scale(value) {
        value ? this.setAttribute('scale', value) : this.removeAttribute('scale');
    }

    set fx(value){
        value ? this.setAttribute('fx', value) : this.removeAttribute('fx');
    }
    get fx(){
        return this.getAttribute('fx');
    }

    set step(value){
        value ? this.setAttribute('step', value) : this.removeAttribute('step');
    }
    get step(){
        return Number(this.getAttribute('step') ?? MathGraph.defaults.step);
    }

    set precision(value){
        value ? this.setAttribute('precision', value) : this.removeAttribute('precision');
    }
    get precision(){
        return Number(this.getAttribute('precision') ?? MathGraph.defaults.precision);
    }
}