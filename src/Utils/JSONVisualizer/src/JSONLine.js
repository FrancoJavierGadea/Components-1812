export class JSONLine {

	#node = null;
	tokens = [];

	toggleActive = false;
	toggleIcon = null;
	#toggleButton = null;

	constructor(params = {}){

		const { 
			level, number, 
			className = "json-line", 
			showNumber = false,
			toggleControl = false,
			toggleIcon = null,
			isOpenBlock = false,
			isCloseBlock = false 
		} = params;

		this.level = level;
		this.number = number;
		this.className = className;

		this.isOpenBlock = isOpenBlock;
		this.isCloseBlock = isCloseBlock;

		this.showNumber = showNumber;
		this.toggleControl = toggleControl;
		this.toggleIcon = toggleIcon;
	}

	//MARK:Render
	render(){
		if(this.#node){
			this.dispose();
		}

		this.#node = document.createElement("div");
		this.node.classList.add(this.className);

		this.node.setAttribute("level", this.level);
		this.node.style.setProperty("--level", this.level);

		this.node.setAttribute("number", this.number);
		this.node.style.setProperty("--number", this.number);

		//Render tokens
		const content = document.createElement("div");
		content.classList.add(`${this.className}-content`);

		for(let i = 0; i < this.tokens.length; i++){

			content.append( this.#renderToken(this.tokens.at(i)) );
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
		if(this.toggleControl && this.isOpenBlock){

			this.node.insertBefore(this.#renderToggleControl(), content);
		}

		return this.node;
	}
	#renderToken(token = {}){
		const { type, value, tags = [] } = token;

		const span = document.createElement("span");
		span.classList.add(`${this.className}-token`);
		span.classList.add(type);

		span.textContent = String(value);

		span.setAttribute("tags", tags.join(" "));

		return span;
	}
	#renderToggleControl(){

		this.#toggleButton = document.createElement("button");
		this.#toggleButton.classList.add(`${this.className}-toggle-button`);
		this.#toggleButton.classList.toggle(`active`, this.toggleActive);

		const icon = document.createElement("span");
		icon.classList.add(`${this.className}-toggle-icon`);

		if(this.toggleIcon){

			icon.append(this.toggleIcon);
		}
		else {

			icon.textContent = "v";
		}

		this.#toggleButton.append(icon);

		this.#toggleButton.addEventListener("click", this.#handleToggle);

		return this.#toggleButton;
	}

	#handleToggle = (e) => {

		this.toggleActive = !this.toggleActive;

		const button = e.currentTarget;

		button.classList.toggle(`active`);

		this.node.dispatchEvent(new CustomEvent("toggle-lines", {
			detail: {
				line: this
			},
			bubbles: true,
			composed: true
		}));
	}

	//MARK:Clear
	dispose(){
		this.clearListeners();
		this.#node?.remove();
		this.#node = null;

		this.tokens = [];
		this.toggleIcon = null;
		this.toggleActive = false;
		this.isOpenBlock = false;
		this.isCloseBlock = false;
	}
	clearListeners(){
		this.#toggleButton?.removeEventListener("click", this.#handleToggle);
		this.#toggleButton = null;
	}	

	addToken(token = {}){

		if(!this.isOpenBlock){
			this.isOpenBlock = ['brace-open', 'bracket-open'].includes(token.type);
		}
		if(!this.isCloseBlock){
			this.isCloseBlock = ['brace-close', 'bracket-close'].includes(token.type);
		}

		this.tokens.push(token);
	}

	//MARK: Getters
	get node(){

		return this.#node;
	}
}