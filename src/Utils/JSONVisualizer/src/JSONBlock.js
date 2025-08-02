export class JSONBlock {

	#node = null;
	content = [];
	openLine = null;
	closeLine = null;
	folded = false;

	constructor(params = {}){

		const {className = 'json-block', level = 0, showContent = true} = params;

		this.className = className;
		this.level = level;
		this.showContent = showContent;
	}

	render(){
		
		this.#node = document.createElement("div");
		this.node.classList.add(this.className);

		this.node.setAttribute('level', this.level);
		this.node.style.setProperty('--level', this.level);

		//
		if(this.openLine){

			this.node.append( this.openLine.render() );
		}
		
		//Render Content
		const content = document.createElement("div");
		content.classList.add(`${this.className}-content`);

		this.node.append(content);

		if(this.showContent) this.renderContent();

		//
		if(this.closeLine){

			this.node.append( this.closeLine.render() );
		}

		return this.node;
	}
	renderContent(){

		const fragment = document.createDocumentFragment();

		for(let i = 0; i < this.content.length; i++){
	
			fragment.append( this.content.at(i).render() );
		}

		this.node.querySelector(`.${this.className}-content`).append(fragment);
	}

	fold(){

		this.folded = true;
		this.node?.setAttribute("folded", "");
	}
	unfold(){

		this.folded = false;
		this.node?.removeAttribute("folded");
	}

	dispose(){
		this.openLine?.dispose();
		this.closeLine?.dispose();

		for(let i = 0; i < this.content.length; i++){

			this.content.at(i).dispose();
		}
		
		this.#node?.remove();
		this.#node = null;
	}

	//MARK: Getters
	get node(){

		return this.#node;
	}
}
