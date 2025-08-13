

```js
export class ComponentName extends HTMLElement {

    /**
	 * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
	 */
	static stylesSheets = {
		links: [],
		adopted: [],
		raw: [],
	};

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = ``;

        //MARK: CSS and Styles
        Promise.allSettled(
			ComponentName.stylesSheets.links.map((styleSheet) => {
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

		ComponentName.stylesSheets.raw.forEach((style) => {
			const styleElement = document.createElement('style');
			styleElement.textContent = style;
			this.shadowRoot.prepend(styleElement);
		});

		this.shadowRoot.adoptedStyleSheets = ComponentName.stylesSheets.adopted;
    }
}
```