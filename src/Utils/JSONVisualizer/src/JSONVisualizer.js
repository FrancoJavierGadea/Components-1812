export class JSONVisualizer extends HTMLElement {
	/**
	 * @type {{links:string[], adopted:CSSStyleSheet[], raw:string[]}} Stylesheets to be applied to the component
	 */
	static stylesSheets = {
		links: [],
		adopted: [],
		raw: [],
	};

 	static getTokens = null;

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<div class="JSONVisualizer"></div>
		`;

		//MARK: Styles managment
		Promise.allSettled(
			JSONVisualizer.stylesSheets.links.map((styleSheet) => {
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

		JSONVisualizer.stylesSheets.raw.forEach((style) => {
			const styleElement = document.createElement("style");
			styleElement.textContent = style;
			this.shadowRoot.prepend(styleElement);
		});

		this.shadowRoot.adoptedStyleSheets = JSONVisualizer.stylesSheets.adopted;
	}

	//MARK: callback lifecycle
	connectedCallback() {

		if(this.src){

			this.loadJSON({src: this.src});
		}
		else {

			if(!this.json){
				this.json = this.textContent;
				this.textContent = "";
			}

			this.loadJSON({rawJSON: this.json});
		}
	}

  	disconnectedCallback(){}

  	//MARK: loadJSON
	async loadJSON({src, rawJSON} = {}){

		if(src){
			try {
				const json = await (await fetch(src)).json();
				this.json = json;

				await this.renderJSON(this.json);
			} 
			catch (error) {
				
			}
		}
		else {
			this.json = rawJSON;

			await this.renderJSON(this.json);
		}

		this.dispatchEvent(new CustomEvent("ready"));
		this.setAttribute("ready", "");
	}

	//MARK: renderJSON
  	async renderJSON(rawJSON) {
		if (!rawJSON) {
			console.warn(`No JSON provided to renderJSON method.`);
		}
		if (!JSONVisualizer.getTokens) {
			console.warn(`JSONVisualizer.getTokens is not defined. Please ensure that the JSONTokenizer`);
			return;
		}

    	const tokens = await JSONVisualizer.getTokens(rawJSON);

    	const JSONContent = document.createElement("div");
    	JSONContent.classList.add("JSON-content");

		let currentLine = null;
		let level = 0;
		let lineNumber = 1;

    	for (let i = 0; i < tokens.length; i++) {
      		const { type, value, tags } = tokens.at(i);

      		// Decide if se debe crear una nueva línea ANTES
			if(["brace-close", "bracket-close"].includes(type)) {
				if ( !["brace-open", "bracket-open", "comma"].includes(tokens.at(i - 1)?.type) ) {
					currentLine = null;
				}
			}
			if(["brace-close", "bracket-close"].includes(type)) level--;

			// Crear línea si no existe
			if (!currentLine) {
				currentLine = this.#createLine({ level, number: lineNumber++ });
				JSONContent.append(currentLine);
			}

			// Crear span del token
			currentLine.querySelector(".line-content").append(this.#createSpan({ type, value, tags }));

			if (["brace-close", "bracket-close"].includes(type)) {
				const nextToken = tokens.at(i + 1);

				if (nextToken?.type === "comma") {
					const { type, value, tags } = nextToken;

					// Agregar la coma en la misma línea
					currentLine.querySelector(".line-content").append(this.#createSpan({ type, value, tags }));

					// Saltar el token de coma
					i++;

					// Crear nueva línea después de la coma
					currentLine = null; continue;
				}
      		}

			// Decide si se debe crear nueva línea DESPUÉS
			if (["brace-open","brace-close","bracket-open","bracket-close","comma"].includes(type)) {
				currentLine = null;
			}

      		if (["brace-open", "bracket-open"].includes(type)) level++;
    	}

    	this.shadowRoot.querySelector(".JSONVisualizer").replaceChildren(JSONContent);
  	}
	#createSpan({ type, value, tags = [] } = {}) {

		const span = document.createElement("span");
		span.classList.add(type);
		span.textContent = value !== null ? value : "null";
		span.setAttribute("tags", tags.join(" "));

		return span;
	}
	#createLine({ level, number = 0 } = {}) {

		const line = document.createElement("div");
		line.classList.add("line");
		line.setAttribute("level", level);
		line.style.setProperty("--level", level);

		if(this.lineNumbers !== 'none'){

			const lineNumber = document.createElement("div");
			lineNumber.classList.add("line-number");
			lineNumber.textContent = number;

			line.append(lineNumber);
		};

		const content = document.createElement("div");
		content.classList.add("line-content");

		line.append(content);

		return line;
	}

	//MARK: Getters and Setters
	set json(value) {
		if(value) {
			if(typeof value !== "string") value = JSON.stringify(value);
		
			this.setAttribute("json", value);
		} 
		else {
			this.removeAttribute("json");
		}
	}
	get json() {
		return this.getAttribute("json");
	}

	
	set lineNumbers(value) {
		value ? this.setAttribute("line-numbers", "") : this.removeAttribute("line-numbers");
	}
	get lineNumbers() {
		return this.getAttribute("line-numbers");
	}

	set src(value){
		value ? this.setAttribute("src", value) : this.removeAttribute("src");
	}
	get src(){
		return this.getAttribute("src");
	}
}

export default JSONVisualizer;
