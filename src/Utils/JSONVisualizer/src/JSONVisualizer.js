import {JSONLine} from "./JSONLine.js";

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

	lines = [];

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<div class="JSONVisualizer"></div>
			<slot name="toggle-icon">
				<template>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
					</svg>
				</template>
			</slot>
			<slot name="copy-icon">
				<template>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
						<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
					</svg>
				</template>
			</slot>
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
			}

			this.loadJSON({raw: this.json});
		}
	}

  	disconnectedCallback(){

		for(let i = 0; i < this.lines.length; i++){

			this.lines.at(i).clearListeners?.();
		}

		this.shadowRoot.querySelector('.copy-btn')?.removeEventListener("click", this.#handleCopy);
	}

  	//MARK: loadJSON
	async loadJSON(options = {}){

		const { src, raw, method,  } = options;

		if(src){
			try {

				const response = await fetch(src, {
					method: method || 'GET',
				});

				if(response.ok){

					const result = await response.json();
					this.json = result;
	
					await this.renderJSON(this.json);
				}
			} 
			catch (error) {
				
			}
		}
		else {
			this.json = raw;

			await this.renderJSON(this.json);
		}

		this.dispatchEvent(new CustomEvent("ready"));
		this.setAttribute("ready", "");
	}

	//MARK: renderJSON
  	async renderJSON(rawJSON) {
		if (!rawJSON) {
			console.warn(`No JSON provided to renderJSON method.`);
			return;
		}
		if (!JSONVisualizer.getTokens) {
			console.warn(`JSONVisualizer.getTokens is not defined. Please ensure that the JSONTokenizer`);
			return;
		}

		//Create Lines
		this.lines = [];

    	const tokens = await JSONVisualizer.getTokens(rawJSON);

		let currentLine = null;
		let level = 0;
		let lineNumber = 1;
		
    	for (let i = 0; i < tokens.length; i++) {

      		const { type, value, tags } = tokens.at(i);

      		// Decide if se debe crear una nueva línea ANTES
			if(["brace-close", "bracket-close"].includes(type)) {

				const previousToken = tokens.at(i - 1);

				if ( !["brace-open", "bracket-open", "comma"].includes(previousToken?.type) ) {

					currentLine = null;
				}
			}
			if(["brace-close", "bracket-close"].includes(type)) level--;

			//Crear una nueva linea si no existe
			if(!currentLine) {

				currentLine = new JSONLine({ 
					className: "line", 
					level, 
					number: lineNumber++, 
					showNumber: this.lineNumbers !== 'none' 
				});

				this.lines.push(currentLine);
			}

			//Crear span del token
			currentLine.tokens.push({ type, value, tags });

			if (["brace-close", "bracket-close"].includes(type)) {

				const nextToken = tokens.at(i + 1);

				if (nextToken?.type === "comma") {

					// Agregar la coma en la misma línea
					currentLine.tokens.push(nextToken);

					// Saltar el token de coma y crear una nueva linea
					i++;
					currentLine = null; continue;
				}
      		}

			if(["brace-open", "bracket-open"].includes(type)){

				if(this.toggleLines !== 'none'){
					currentLine.toggleControl = true;
					currentLine.toggleActive = level + 1 >= this.renderDeep;
				};

				level++;
			};

			// Decide si se debe crear nueva línea DESPUÉS
			if(["brace-open","brace-close","bracket-open","bracket-close","comma"].includes(type)) currentLine = null;
    	}

		//Render JSON
		const JSONContent = document.createElement("div");
    	JSONContent.classList.add("JSON-content");

		for(let i = 0; i < this.lines.length; i++){

			const line = this.lines.at(i);

			if(line.level < this.renderDeep){

				JSONContent.append( line.render({toggleIcon: this.#createIcon("toggle-icon")}) );
			}

		}

    	this.shadowRoot.querySelector(".JSONVisualizer").replaceChildren(JSONContent);
		this.shadowRoot.querySelector(".JSONVisualizer").style.setProperty("--line-number-width", `${String(this.lines.length).length}ch`);

		this.addEventListener("toggle-line", this.#toggleLines);

		if(this.copyButton !== 'none') this.shadowRoot.append( this.#createCopyButton('copy-btn') );
  	}
	#createIcon(name){

		const iconContainer = document.createElement("div");
		iconContainer.classList.add(name);

		const slot = this.shadowRoot.querySelector(`slot[name="${name}"`);

		const iconTemplate = slot.assignedNodes().at(0) ?? slot.querySelector("template");
		
		const icon = iconTemplate.content.cloneNode(true);

		iconContainer.append(icon);

		return iconContainer;
	}

	//MARK: Toggle Lines
	#toggleLines = (e) => {

		const {number, level} = e.detail;

		let fragment = null;
		let lastLine = null;

		for(let i = number; i < this.lines.length; i++){

			const line = this.lines.at(i);

			if(line.level > level){

				if(!line.rendered){

					fragment ??= document.createDocumentFragment();
					fragment.append( line.render() );

					lastLine = line.number;
					continue;
				}

				if(line.folded){

					if(line.foldedBy === number){
			
						line.unfold();
					}
				}
				else {

					line.fold(number);
				}
			}
			else {
				break;
			};
		}

		if(fragment){
			this.shadowRoot.querySelector(".JSONVisualizer .JSON-content").insertBefore(fragment, this.lines.at(lastLine).node);
		}
	}

	//MARK: Copy Button
	#createCopyButton(name = 'copy-btn'){
		
		const btn = document.createElement("button");
		btn.classList.add(name);

		btn.append( this.#createIcon("copy-icon") );

		btn.addEventListener("click", this.#handleCopy);

		return btn;
	}
	#handleCopy = (e) => {

		navigator.clipboard.writeText(JSON.stringify(this.data, null, 2))
		.then(() => {
			this.dispatchEvent(new CustomEvent("copied", { detail: { data: this.data } }));
			console.log("JSON copied to clipboard");
		})
		.catch((error) => {
			console.error("Failed to copy JSON:", error);
		});
	}

	
	//MARK: Getters and Setters
	set json(value) {

		if(value) {

			this.data = typeof value === "string" ? JSON.parse(value) : value;
		
			this.setAttribute("json", JSON.stringify(this.data));
		} 
		else {
			this.removeAttribute("json");
			this.data = null;
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

	set toggleLines(value) {
		value ? this.setAttribute("toggle-lines", "") : this.removeAttribute("toggle-lines");
	}
	get toggleLines() {
		return this.getAttribute("toggle-lines");
	}

	set indentationGuideLines(value) {
		value ? this.setAttribute("indentation-guide-lines", "") : this.removeAttribute("indentation-guide-lines");
	}
	get indentationGuideLines() {
		return this.getAttribute("indentation-guide-lines");
	}

	set copyButton(value) {
		value ? this.setAttribute("copy-button", "") : this.removeAttribute("copy-button");
	}
	get copyButton() {
		return this.getAttribute("copy-button");
	}

	get renderDeep(){
		return 2;
	}

	set src(value){
		value ? this.setAttribute("src", value) : this.removeAttribute("src");
	}
	get src(){
		return this.getAttribute("src");
	}
}

export default JSONVisualizer;