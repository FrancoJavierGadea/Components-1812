

export class ThemeSwitch extends HTMLElement {
    /**
	 * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
	 */
	static stylesSheets = {
		links: [],
		adopted: [],
		raw: [],
	};

    static defaults = {
        themes: 'light,dark',
        target: 'html',
        themeAttribute: 'data-theme',
        theme: 'light',
        title: 'Toggle theme'
    }

    static observedAttributes = ['theme', 'themes', 'target', 'theme-attribute', 'title'];

    constructor(){
        super();
    
        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `<div class="ThemeSwitch">
            <button title="${this.title}">${this.theme}</button>
        </div>
        `;
    
        //MARK: Styles managment
		Promise.allSettled(
			ThemeSwitch.stylesSheets.links.map((styleSheet) => {
				const link = document.createElement("link");
				link.rel = "stylesheet";
				link.href = styleSheet;

				const { promise, resolve, reject } = Promise.withResolvers();

				link.addEventListener("load", () => resolve({ link, href: styleSheet, status: "loaded" }));
				link.addEventListener("error", () => reject({ link, href: styleSheet, status: "error" }));

				this.shadowRoot.prepend(link);

				return promise;
			})
		).then((results) => {
			this.dispatchEvent(
				new CustomEvent("ready-links", {
					detail: { results: results.map((r) => r.value || r.reason) },
				})
			);

			this.setAttribute("ready-links", "");
		});

		ThemeSwitch.stylesSheets.raw.forEach((style) => {
			const styleElement = document.createElement("style");
			styleElement.textContent = style;
			this.shadowRoot.prepend(styleElement);
		});

		this.shadowRoot.adoptedStyleSheets = ThemeSwitch.stylesSheets.adopted;
    }

    //MARK: Callback Lifecycle
    connectedCallback(){

        if(document.querySelector(this.target).hasAttribute(this.themeAttribute)){
            
            this.theme = document.querySelector(this.target).getAttribute(this.themeAttribute);
        }

        this.shadowRoot.querySelector('button').addEventListener('click', this.#handleClick);
    }

    disconnectedCallback(){

        this.shadowRoot.querySelector('button').removeEventListener('click', this.#handleClick);
    }

    attributeChangedCallback(name, oldValue, newValue){

        if(name === 'theme' && oldValue !== newValue){

            this.shadowRoot.querySelector('button').textContent = newValue;
            console.log(this.shadowRoot.querySelector('button').textContent)
        }
        if(name === 'title' && oldValue !== newValue){

            this.shadowRoot.querySelector('button').title = newValue;
        }
    }

    //MARK: Events
    #handleClick = (event) => {

        const themes = this.#parseThemes(this.themes);

        const currentIndex = themes.indexOf(this.theme);
        const nextIndex = (currentIndex + 1) % themes.length;

        this.changeTheme(themes[nextIndex]);
    }
    

    //MARK: change Theme
    changeTheme(theme){

        if(!this.themes.includes(theme)){
            console.warn('ThemeSwitch: Invalid theme provided. Available themes are:', this.themes);
            return;
        }
        if(this.theme === theme) return;

        console.log('changing theme to', theme);

        //Change Theme
        const target = document.querySelector(this.target);

        

        if (document.startViewTransition) {

            //target.style.viewTransitionName = 'change-theme';

            const transition = document.startViewTransition(() => {
                
                target?.setAttribute(this.themeAttribute, theme);
            });

            transition.finished.then(() => {
                this.theme = theme;
                console.log('transition finished');

                target.style.viewTransitionName = '';
            });
        } 
        else {
            target?.setAttribute(this.themeAttribute, theme);

            this.theme = theme;
        }

    }


    //MARK: Getters and Setters
    set theme(value){
        value ? this.setAttribute("theme", value) : this.removeAttribute("theme");
    }
    get theme(){
        return this.getAttribute("theme") ?? ThemeSwitch.defaults.theme;
    }

    set themes(value){
        value ? this.setAttribute("themes", value) : this.removeAttribute("themes");
    }
    get themes(){
        return this.getAttribute("themes") ?? ThemeSwitch.defaults.themes;
    }
    #parseThemes(themes){
        return themes.split(",").map(theme => theme.trim());
    }

    set target(value){
        value ? this.setAttribute("target", value) : this.removeAttribute("target");
    }
    get target(){
        return this.getAttribute("target") ?? ThemeSwitch.defaults.target;
    }

    set themeAttribute(value){
        value ? this.setAttribute("theme-attribute", value) : this.removeAttribute("theme-attribute");
    }
    get themeAttribute(){
        return this.getAttribute("theme-attribute") ?? ThemeSwitch.defaults.themeAttribute;
    }

    set title(value){
        value ? this.setAttribute("title", value) : this.removeAttribute("title");
    }
    get title(){
        return this.getAttribute("title") ?? ThemeSwitch.defaults.title;
    }


}

export default ThemeSwitch;