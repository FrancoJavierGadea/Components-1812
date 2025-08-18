
/**
 * Lateral sliding panel (offcanvas).
 *
 * @element custom-offcanvas
 *
 * @attr {("left"|"right")} [variant="left"] - Panel position or visual style.
 * @attr {boolean} [open] - Whether the panel is open.
 * @attr {boolean} [handle-button] - Whether to show a floating handle button.
 *
 * @fires ready-links - Fired when all external stylesheet links have finished loading.
 * @fires ready - Dispatched when the component has finished initializing (end of connectedCallback).
 * 
 * @slot header - Header content.
 * @slot close-button - Icon or content for the close button.
 * @slot default - Panel body content.
 * @slot footer - Footer content.
 * @slot backdrop - Slot inside the backdrop.
 */
class Offcanvas extends HTMLElement {

    static VERSION = '0.0.1';
    static DEFAULT_TAG_NAME = 'custom-offcanvas';
    static DEFAULT_ICONS = {
        'close-button': `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>`,
        'handle-button': `<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" data-rotate-icon>
            <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"/>
        </svg>`
    };

    /**
     * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
     */
	static stylesSheets = {
		links: [],
		adopted: [],
		raw: [],
	};

    #offcanvas = null;

    constructor(){

        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="offcanvas">
                <div class="panel">
                    <div class="panel-header">
                        <slot name="header">
                            <h2 class="offcanvas-title">Offcanvas Title</h2>
                        </slot>
                        <button class="close-button" aria-label="Close">
                            <slot name="close-button">
                                ${Offcanvas.DEFAULT_ICONS['close-button']}
                            </slot>
                        </button>
                    </div>
                    <div class="panel-body">
                        <slot>
                            Offcanvas Body Content
                        </slot>
                    </div>
                    <div class="panel-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
                <div class="offcanvas-backdrop">
                    <!-- Handle button will be appended here if 'handle-button' attribute is set -->
                    <slot name="backdrop"></slot>
                </div>
            </div>
        `;

        this.#offcanvas = this.shadowRoot.querySelector('.offcanvas');

        //MARK: CSS and Styles
        Promise.allSettled(
			Offcanvas.stylesSheets.links.map((styleSheet) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = styleSheet;

				const { promise, resolve, reject } = Promise.withResolvers();

                //If it's already loaded (rare in shadow DOM, but possible)
                if(link.sheet){
                    resolve({ link, href: styleSheet, status: 'loaded' });
                }
                else {
                    link.addEventListener('load', () => resolve({ link, href: styleSheet, status: 'loaded' }));
                    link.addEventListener('error', () => reject({ link, href: styleSheet, status: 'error' }));
                }

				this.shadowRoot.prepend(link);

				return promise;
			})
		).then((results) => {
			this.dispatchEvent(
				new CustomEvent('ready-links', {
					detail: { results: results.map((r) => r.value || r.reason) },
				})
			);

			this.setAttribute('ready-links', '');
		});

		Offcanvas.stylesSheets.raw.forEach((style) => {
			const styleElement = document.createElement('style');
			styleElement.textContent = style;
			this.shadowRoot.prepend(styleElement);
		});

		this.shadowRoot.adoptedStyleSheets = Offcanvas.stylesSheets.adopted;
    }

    //MARK: Lifecycle Callbacks
    connectedCallback() {

        this.shadowRoot.querySelector('.close-button')
            .addEventListener('click', this.#handleClose);

        this.dispatchEvent(new CustomEvent('ready'));
		this.setAttribute('ready', '');
    }
    disconnectedCallback() {

        this.shadowRoot.querySelector('.close-button')
            ?.removeEventListener('click', this.#handleClose);

        this.#disposeHandleButton();
    }

    static observedAttributes = ['variant', 'open', 'handle-button'];

    attributeChangedCallback(name, oldValue, newValue) {

        if(name === 'variant'){
     
            this.variant ? this.#offcanvas?.setAttribute('variant', this.variant) : this.#offcanvas?.removeAttribute('variant');
            return;
        }
        if(name === 'open'){

            this.#offcanvas?.toggleAttribute('open', this.open);

            this.dispatchEvent( new CustomEvent('toggle', {
                detail: { open: this.open },
                bubbles: true,
                composed: true
            }));

            return;
        }
        if(name === 'handle-button'){

            if(this.handleButton){
                this.shadowRoot.querySelector('.offcanvas-backdrop')
                    .append(this.#renderHandleButton());
            }
            else {
                this.#disposeHandleButton();
            }
            return;
        }
    }

    //MARK: Public Methods
    show(){
        this.open = true;
    }
    hide(){
        this.open = false;
    }
    /** @param {boolean | undefined} force  */
    toggle(force){
        if(typeof force === 'boolean'){
            this.open = force;
        }
        else {
            this.open = !this.open;
        }
    }

    //MARK: Private Methods
    #renderHandleButton(){
        const handleButton = document.createElement('button');
        handleButton.classList.add('handle-button');

        handleButton.innerHTML = `<slot name="handle-button">
            ${Offcanvas.DEFAULT_ICONS['handle-button']}
        </slot>`;

        handleButton.addEventListener('click', this.#handleOpen);

        return handleButton;
    }
    #disposeHandleButton(){
        const handleButton = this.shadowRoot.querySelector('.handle-button');
        handleButton?.removeEventListener('click', this.#handleOpen);
        handleButton?.remove();
    }

    //MARK: Listeners handlers
    #handleOpen = (e) => {
        this.toggle();
    }
    #handleClose = (e) => {
        this.hide();
    }

    //MARK: Getters and Setters
    set variant(value) {
        value ? this.setAttribute('variant', value) : this.removeAttribute('variant');
    }
    get variant() {
        return this.getAttribute('variant');
    }

    set open(value) {
        this.toggleAttribute('open', value);
    }
    get open() {
        return this.hasAttribute('open');
    }

    set handleButton(value){
        this.toggleAttribute('handle-button', value);
    }
    get handleButton(){
        return this.hasAttribute('handle-button');
    }
}

export {Offcanvas};
export default Offcanvas;



