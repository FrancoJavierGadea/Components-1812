export class JSONLine {

	#node = null;
	toggleActive = false;

	constructor(params = {}){

		const { 
			level, number, name, 
			className = "json-line", 
			showNumber = false,
			toggleControl = false 
		} = params;

		this.level = level;
		this.number = number;
		this.name = name;

		this.className = className;
		this.showNumber = showNumber;
		this.toggleControl = toggleControl;

		this.folded = false;
		this.foldedBy = null;

		this.tokens = [];

		this.rendered = false;
	}

	render({toggleIcon = null} = {}){

		this.rendered = true;

		this.#node = document.createElement("div");

		this.node.classList.add(this.className);

		this.node.setAttribute("level", this.level);
		this.node.style.setProperty("--level", this.level);

		this.node.setAttribute("number", this.number);
		this.node.style.setProperty("--number", this.number);

		if(this.folded) this.node.setAttribute("folded", this.foldedBy);
		if(this.name) this.node.setAttribute("name", this.name);

		//Render tokens
		const content = document.createElement("div");
		content.classList.add(`${this.className}-content`);

		for(let i = 0; i < this.tokens.length; i++){

			content.append( this.renderToken(this.tokens.at(i)) );
		}

		this.node.append(content);

		//Render Number
		if(this.showNumber){

			const span = document.createElement("span");
			span.classList.add(`${this.className}-number`);

			span.textContent = this.number;

			this.node.prepend(span);
		}

		//Render Toggle control
		if(this.toggleControl){

			this.node.insertBefore(this.renderToggleControl(toggleIcon), content);
		}

		return this.node;
	}
	renderToken(token = {}){
		const { type, value, tags = [] } = token;

		const span = document.createElement("span");
		span.classList.add(`${this.className}-token`);
		span.classList.add(type);

		span.textContent = String(value);

		span.setAttribute("tags", tags.join(" "));

		return span;
	}
	renderToggleControl(icon = null){

		const button = document.createElement("button");
		button.classList.add(`${this.className}-toggle-btn`);
		button.classList.toggle(`active`, this.toggleActive);

		if(icon) button.append(icon);

		button.addEventListener("click", this.#handleToggle);

		return button;
	}

	#handleToggle = (e) => {

		this.toggleActive = !this.toggleActive;

		const button = e.currentTarget;

		button.classList.toggle(`active`);

		this.node.dispatchEvent(new CustomEvent("toggle-line", {
			detail: {
				number: this.number,
				level: this.level
			},
			bubbles: true,
			composed: true
		}));
	}

	clearListeners(){
		this.node.querySelector(`${this.className}-toggle-btn`)?.removeEventListener("click", this.#handleToggle);
	}
	
	fold(foldedBy = null){
		this.foldedBy = foldedBy;
		this.folded = true;
		if(this.rendered) this.node.setAttribute("folded", this.foldedBy);
	}
	unfold(){
		this.foldedBy = null;
		this.folded = false;
		if(this.rendered) this.node.removeAttribute("folded");
	}

	//MARK: Getters
	get content(){

		if(!this.rendered) throw new Error(`JSONLine: Cannot get content before rendering. Please call render() first.`);
		
		return this.node.querySelector(`.${this.className}-content`);
	}

	get node(){

		if(!this.rendered) throw new Error(`JSONLine: Cannot get node before rendering. Please call render() first.`);

		return this.#node;
	}
}
