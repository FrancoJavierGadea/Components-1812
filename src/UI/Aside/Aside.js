


export class Aside extends HTMLElement {

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
            <aside>
                <div class="aside-header">
                    <div class="aside-header-content">
                        <slot name="aside-header-content">Aside header</slot>
                    </div>
                    <button class="close-button">
                        <slot name="close-button-icon">Close</slot>
                    </button>
                </div>
                <div class="aside-content">
                    <slot name="aside-content">Aside content</slot>
                </div>
            </aside>
            <div class="content">
            
                <div class="content-wrapper">
                    <slot name="content">Main content</slot>
                </div>

                <button class="toggle-button">
                    <slot name="toggle-button-icon">Toggle</slot>
                </button>
            </div>
        `;

        Aside.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = styleSheet;

            this.shadowRoot.prepend(link);
        });

        Aside.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');

            styleElement.textContent = style;

            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Aside.stylesSheets.adopted;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.toggle-button').addEventListener('click', this.#handleToggle);
        this.shadowRoot.querySelector('.close-button').addEventListener('click', this.#handleClose);
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('.toggle-button').removeEventListener('click', this.#handleToggle);
        this.shadowRoot.querySelector('.close-button').removeEventListener('click', this.#handleClose);
    }


    set close(value) {

        value ? this.setAttribute('close', '') : this.removeAttribute('close');
    }
    get close() {

        return this.hasAttribute('close');
    }


    //MARK: Toggle
    /**
     * Open and close the aside aplying the 'closing' and 'opening' classes to shut the animations
     * @param {Boolean} force true to open, false to close, default null to toggle 
     */
    toggle(force){

        if(force != null){

            this.close = !Boolean(force);
        }
        else {

            this.close = !this.close;
        }

        this.classList.toggle('closing', this.close);
        this.classList.toggle('opening', !this.close);

        this.dispatchEvent(new CustomEvent('toggle', {
            bubbles: true,
            composed: true,
            detail: { close: this.close }
        }));
    }
    #handleToggle = () => {

        this.toggle();
    }
    #handleClose = () => {

        this.toggle(false);
    }
}