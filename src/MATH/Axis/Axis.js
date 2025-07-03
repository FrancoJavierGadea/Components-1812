

export class Axis extends HTMLElement {

    static defaults = {
        minX: -10,
        maxX: 10,
        minY: -10,
        maxY: 10,
        scale: 10,
        step: 0.1
    };

    static stylesSheets = {
        raw: [],
        adopted: [],
        links: []
    }   

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            
            </svg>
        `;

        Axis.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        Axis.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Axis.stylesSheets.adopted;
    }

    connectedCallback() {
        this.drawAxisX();
        //this.drawAxisY();
    }

    disconnectedCallback() {
        
    }

    drawAxisX() {
        const {width} = this.getAxisSize();
        const origin = this.getOrigin();

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('Axis', 'Axis-x');
        
        const axisLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        axisLine.setAttribute('d', `M ${origin.x - width / 2} ${origin.y} L ${origin.x + width / 2} ${origin.y}`);
        axisLine.setAttribute('fill', 'none');


        const axisTicks = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        axisTicks.setAttribute('fill', 'none');

        let d = '';
        const tickLength = 10;
        const tickWidth = width / (this.maxX - this.minX);

        for(let x = this.minX; x <= this.maxX; x += 1){

            const px = (origin.x - width / 2) + tickWidth * (x - this.minX);

            d += `M ${px} ${origin.y - tickLength / 2} L ${px} ${origin.y + tickLength / 2}`;
        }

        axisTicks.setAttribute('d', d);

        g.append(axisLine, axisTicks);

        this.shadowRoot.querySelector('svg').append(g);
    }

    drawAxisY() {
        const {height} = this.getAxisSize();
        const origin = this.getOrigin();

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('Axis', 'Axis-y');

        path.setAttribute('d', `M ${origin.x} ${origin.y - height / 2} L ${origin.x} ${origin.y + height / 2}`);
        path.setAttribute('fill', 'none');

        this.shadowRoot.querySelector('svg').append(path);
    }

    getAxisSize() {
        return {
            width: (this.maxX - this.minX) * this.scale,
            height: (this.maxY - this.minY) * this.scale
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
        return Number(this.getAttribute('min-x') ?? Axis.defaults.minX);
    }
    set minX(value) {
        value ? this.setAttribute('min-x', value) : this.removeAttribute('min-x');
    }

    get maxX() {
        return Number(this.getAttribute('max-x') ?? Axis.defaults.maxX);
    }
    set maxX(value) {
        value ? this.setAttribute('max-x', value) : this.removeAttribute('max-x');
    }

    get minY() {
        return Number(this.getAttribute('min-y') ?? Axis.defaults.minY);
    }
    set minY(value) {
        value ? this.setAttribute('min-y', value) : this.removeAttribute('min-y');
    }

    get maxY() {
        return Number(this.getAttribute('max-y') ?? Axis.defaults.maxY);
    }
    set maxY(value) {
        value ? this.setAttribute('max-y', value) : this.removeAttribute('max-y');
    }

    get scale() {
        return Number(this.getAttribute('scale') ?? Axis.defaults.scale);
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
        return Number(this.getAttribute('step') ?? Axis.defaults.step);
    }
}

export default Axis;
