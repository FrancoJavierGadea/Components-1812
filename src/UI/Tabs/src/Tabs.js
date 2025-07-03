

export class Tabs extends HTMLElement {

    /**
     * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
     */
    static stylesSheets = {
        links: [],
        adopted: [],
        raw: []
    };

    currentTab = null;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <ul class="tabs-controls">
                
            </ul>
            <div class="tabs-content">
                <slot>Tabs content</slot>
            </div>
        `;

        Tabs.stylesSheets.links.forEach((styleSheet) => {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet;
            this.shadowRoot.prepend(link);
        });

        Tabs.stylesSheets.raw.forEach((style) => {

            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.shadowRoot.prepend(styleElement);
        });

        this.shadowRoot.adoptedStyleSheets = Tabs.stylesSheets.adopted;
    }

    //MARK: connectedCallback
    connectedCallback(){

        this.tabs = this.querySelectorAll('[data-tab]');

        const fragment = document.createDocumentFragment();

        this.tabs.forEach((tabElement, index) => {

            const tabName = tabElement.getAttribute('data-tab');

            const button = document.createElement('button');

            button.setAttribute('data-tab-index', index);

            if(tabElement.hasAttribute('show')){

                this.currentTab = {index, tabName};
                button.setAttribute('show', '');
            }

            button.addEventListener('click', this.#handleShow);

            //Add slot with tab id to button
            const slot = document.createElement('slot');
            slot.textContent = tabName;
            slot.setAttribute('name', `button-${tabName}`);

            //Creating a li and append de button
            const li = document.createElement('li');
            
            button.append(slot);
            li.append(button);
            fragment.append(li);
        });

        this.shadowRoot.querySelector('.tabs-controls').append(fragment);

        // For prevent FOUC (Flash Of Unstyled Content):
        // El componente se inicializa oculto (via style="visibility: hidden" en HTML),
        // y solo se muestra una vez que está completamente renderizado y estilizado.
        this.style.visibility = '';
        this.setAttribute('ready', '');
    }

    disconnectedCallback(){

        this.shadowRoot.querySelectorAll('.tabs-controls button').forEach(button => {

            button.removeEventListener('click', this.#handleShow);
        });
    }


    //MARK: Show
    show(tabIndex = 0){

        this.tabs.forEach((tabElement, index) => {

            if(tabIndex === index){

                tabElement.setAttribute('show', '');
                this.shadowRoot.querySelector(`button[data-tab-index="${tabIndex}"]`).setAttribute('show', '');

                this.currentTab = {
                    index,
                    tabName: tabElement.getAttribute('data-tab') 
                }
            }
            else {

                tabElement.removeAttribute('show');
                this.shadowRoot.querySelector(`button[data-tab-index="${index}"]`).removeAttribute('show');
            }
        });

        this.dispatchEvent(new CustomEvent('show-tab', {
            bubbles: true,
            composed: true,
            detail: { ...this.currentTab }
        }));
    }
    #handleShow = (e) => {

        const index = Number(e.currentTarget.getAttribute('data-tab-index'));

        this.show(index);
    }

    //MARK: Getters and Setter
    set position(position){
        position ? this.setAttribute('position', position) : this.removeAttribute(position);
    }
    get position(){
        return this.getAttribute('position') ?? 'default';
    }

    set variant(variant){
        variant ? this.setAttribute('variant', variant) : this.removeAttribute(variant);
    }
    get variant(){
        return this.getAttribute('variant') ?? 'default';
    }

    set fill(fill){
        fill ? this.setAttribute('fill', '') : this.removeAttribute('fill');
    }
    get fill(){
        return this.hasAttribute('fill');
    }
}