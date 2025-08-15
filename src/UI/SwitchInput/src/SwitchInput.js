

export class SwitchInput extends HTMLElement {

    static formAssociated = true;

    /**
	 * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
	 */
	static stylesSheets = {
		links: [],
		adopted: [],
		raw: [],
	};

    #input = null;

    constructor() {
        super();

        this._internals = this.attachInternals();
        //this.tabIndex = 0;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <label>
                <input type="checkbox" ${this.checked ? 'checked' : ''} />
                <div class="switch">
                    <div class="track">
                        <div class="track-item">
                            <slot name="track"></slot>
                        </div>
                        <div class="thumb">
                            <div class="thumb-item">
                                <slot name="thumb"></slot>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content"><slot></slot></div>
            </label>
        `;

        this.#input = this.shadowRoot.querySelector('input');

        //MARK: CSS and Styles
        Promise.allSettled(
			SwitchInput.stylesSheets.links.map((styleSheet) => {
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

		SwitchInput.stylesSheets.raw.forEach((style) => {
			const styleElement = document.createElement('style');
			styleElement.textContent = style;
			this.shadowRoot.prepend(styleElement);
		});

		this.shadowRoot.adoptedStyleSheets = SwitchInput.stylesSheets.adopted;
    }


    //MARK: Callback life cycle
    static observedAttributes = ['checked', 'disabled'];

    attributeChangedCallback(name, oldValue, newValue){

        console.log({name, oldValue, newValue});

        if(name === 'checked'){

            this._internals.setFormValue(this.checked ? this.value : null, this.checked ? 'checked' : 'unchecked');
            return;
        }
        if(name === 'disabled'){
            this.disabled = newValue !== null;
            return;
        }
    }
    connectedCallback(){

        this.#input.addEventListener('change', this.#handleChange);
    }
    disconnectedCallback(){

        this.#input.removeEventListener('change', this.#handleChange);
    }
    

    //MARK: Methods
    //'change' event is not composed, but 'input' event is composed
    #handleChange = (e) => {

        const input = e.currentTarget;
        
        this.checked = input.checked;

        this.dispatchEvent(new Event('change', { bubbles: true }));
    }

    //MARK: Form API
    //Required so form.reset() works
    formResetCallback() {
        this.checked = false;
        this.#input.checked = false;
        this._internals.setFormValue('');
    }

    //MARK: Getters and Setters
    set rounded(value){
        this.toggleAttribute('rounded', value);
    }
    get rounded(){
        return this.hasAttribute('rounded');
    }

    set checked(value){
        this.toggleAttribute('checked', value);
    }
    get checked(){
        return this.hasAttribute('checked');
    }

    set disabled(value){
        this.toggleAttribute('disabled', value);
    }
    get disabled(){
        return this.hasAttribute('disabled');
    }

    set required(value){
        this.toggleAttribute('required', value);
    }
    get required(){
        return this.hasAttribute('required');
    }

    set name(value){
        value ? this.setAttribute('name', value) : this.removeAttribute('name');
    }
    get name(){
        return this.getAttribute('name');
    }

    set value(value){
        value ? this.setAttribute('value', value) : this.removeAttribute('value');
    }
    get value(){
        return this.getAttribute('value') ?? 'on';//same are native checkbox
    }
}

export default SwitchInput;