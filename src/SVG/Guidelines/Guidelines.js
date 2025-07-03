


export class Guidelines extends HTMLElement {

    static stylesSheets = {
        adopted: [],
        raw: [],
        links: [],
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">

            </svg>
        `;

        Guidelines.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        Guidelines.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Guidelines.stylesSheets.adopted;
    }

    connectedCallback() {

        if(this.followMouse){

            this.createGuidelines({x: 0, y: 0, name: 'follow-mouse', id: 'follow-mouse'});

            this.addEventListener('mousemove', this.#mouseMoveHandler);
            this.addEventListener('mouseleave', this.#mouseLeaveHandler);
        }
    }

    disconnectedCallback() {

        this.removeEventListener('mousemove', this.#mouseMoveHandler);
        this.removeEventListener('mouseleave', this.#mouseLeaveHandler);
    }


    createGuidelines({x = 0, y = 0, name = 'Guidelines', id} = {}) {

        const guidelines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        guidelines.classList.add('Guidelines');

        guidelines.setAttribute('data-name', name);
        guidelines.setAttribute('id', id);

        guidelines.innerHTML = `
            <g class="Guidelines-x">
                <path d="M 0 ${y} L ${x} ${y}"/>
                <foreignObject x="0" y="${y}" width="${x}" height="50">
                    <div class="Guidelines-x-label">${x}</div>
                </foreignObject>
            </g>

            <g class="Guidelines-y">
                <path d="M ${x} 0 L ${x} ${y}"/>
                <foreignObject x="${x}" y="0" width="50" height="${y}">
                    <div class="Guidelines-y-label">${y}</div>
                </foreignObject>
            </g>
        `;

        this.shadowRoot.querySelector('svg').append(guidelines);
    }

    updateGuidelines({x = 0, y = 0, name = 'Guidelines', id} = {}) {

        const guidelines = this.shadowRoot.querySelectorAll(id ? `svg #${id}` : `svg[data-name="${name}"]`);

        for(const guideline of guidelines){

            guideline.querySelector('.Guidelines-x path').setAttribute('d', `M 0 ${y} L ${x} ${y}`);
            guideline.querySelector('.Guidelines-y path').setAttribute('d', `M ${x} 0 L ${x} ${y}`);

            guideline.querySelector('.Guidelines-x foreignObject').setAttribute('width', x);
            guideline.querySelector('.Guidelines-x foreignObject').setAttribute('y', y);
            
            guideline.querySelector('.Guidelines-y foreignObject').setAttribute('x', x);
            guideline.querySelector('.Guidelines-y foreignObject').setAttribute('height', y);

            guideline.querySelector('.Guidelines-x-label').textContent = x;
            guideline.querySelector('.Guidelines-y-label').textContent = y;
        }
    }

    #mouseMoveHandler(e) {

        const {offsetX: x, offsetY: y} = e;


        this.updateGuidelines({x, y, name: 'follow-mouse', id: 'follow-mouse'});
    }
    #mouseLeaveHandler() {

        this.updateGuidelines({x: 0, y: 0, name: 'follow-mouse', id: 'follow-mouse'});
    }   


    set followMouse(value) {

        value ? this.setAttribute('follow-mouse', '') : this.removeAttribute('follow-mouse');
    }
    get followMouse() {

        return this.hasAttribute('follow-mouse');
    }
}