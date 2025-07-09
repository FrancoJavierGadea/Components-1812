

export class JSONTokenizer {

    constructor(){
        this.tokens = [];
    }

    //MARK: tokenize
    /**
     * 
     * @param {String} rawJSON 
     * @returns 
     */
    tokenize(rawJson){

        const minifyJson = this.clearJSON(rawJson);

        this.tokens = [];

        let contextStack = [];
        let role = 'key';
        let i = 0;

        while(i < minifyJson.length){

            const char = minifyJson[i];
            const currentContext = contextStack.at(-1);

            if(char === '{'){   
                contextStack.push('{');

                this.tokens.push({ type: 'brace', value: char, tags: ['brace', 'brace-open'] });

                role = 'key';

                i++; continue;
            }
            if(char === '}'){   
                contextStack.pop();

                this.tokens.push({ type: 'brace', value: char, tags: ['brace', 'brace-close'] });

                i++; continue;
            }
            if(char === '['){   
                contextStack.push('[');

                this.tokens.push({ type: 'bracket', value: char, tags: ['bracket', 'bracket-open'] });

                role = 'array-value';

                i++; continue;
            }
            if(char === ']'){   
                contextStack.pop();

                this.tokens.push({ type: 'bracket', value: char, tags: ['bracket', 'bracket-close'] });

                i++; continue;
            }
            if(char === ','){

                this.tokens.push({ type: 'comma', value: char, tags: ['comma'] });

                role = currentContext === '{' ? 'key' : 'array-value';

                i++; continue;
            }
            if(char === ':'){

                this.tokens.push({ type: 'colon', value: char, tags: ['colon'] });

                role = 'value';

                i++; continue;
            }
            //Detecta el inicio del string
            if(char === '"'){

                const { value, endIndex } = this._parseString(minifyJson, i);

                this.tokens.push({ type: 'string-open', value: char, tags: ['string', 'open', role] });
                this.tokens.push({ type: 'string', value, tags: ['string', role] });
                this.tokens.push({ type: 'string-close', value: char, tags: ['string', 'close', role] });

                i = endIndex + 1; continue;
            }
            //Boleanos
            if(char === 't' || char === 'f'){

                const { value, endIndex } = this._parseBoolean(minifyJson, i);

                this.tokens.push({ type: 'boolean', value, tags: ['boolean', role, value ? 'true' : 'false'] });

                i = endIndex + 1; continue;
            }
            //Null
            if(char === 'n'){
                
                const { value, endIndex } = this._parseNull(minifyJson, i);

                this.tokens.push({ type: 'null', value, tags: ['null', role] });

                i = endIndex + 1; continue;
            }
            //Numeros
            if (/[0-9\-]/.test(char)) {

                const { value, endIndex } = this._parseNumber(minifyJson, i);

                this.tokens.push({ type: 'number', value, tags: ['number', role] });

                i = endIndex + 1; continue;
            }
        }
    }

    //MARK: cleanJSON
    /**
     * 
     * @param {String} rawJSON 
     * @returns {String} A minified JSON string
     */
    clearJSON(rawJson){

        if(!rawJson){
            console.warn(`No raw JSON provided to clearJSON method.`);
            return;
        }

        const json = JSON.parse(rawJson);

        const minifyJson = JSON.stringify(json);

        return minifyJson;
    }


    //MARK: Parse Functions
    /**
     * @param {String} rawJson A raw json string
     * @param {number} startIndex The index of the opening `"` character
     * @returns {{value:string, raw:string, endIndex:number}} endIndex is the index of the `"` that closes the string
     */
    _parseString(rawJson, startIndex){

        let i = startIndex + 1;

        while(i < rawJson.length){

            //Omitimos los escapes de con \\
            if(rawJson.at(i) === '\\'){

                i += 2; continue;
            }

            //Detecta el final del string
            if(rawJson.at(i) === '"') break;
            
            i++;
        }

        const raw = rawJson.slice(startIndex, i + 1);

        return { value: JSON.parse(raw), raw, endIndex: i };
    }
    /**
     * @param {String} rawJson 
     * @param {number} startIndex The index of the first character of the number: `0-9` or `-`
     * @returns {{value:number, endIndex:number}} endIndex is the index of the last character of the number
     */
    _parseNumber(rawJson, startIndex){

        let i = startIndex;

        // Recorre mientras sea parte de un número
        while(i < rawJson.length && /[0-9eE\.\+\-]/.test(rawJson[i])){

            i++;
        }

        const raw = rawJson.slice(startIndex, i);

        return { value: Number(raw), raw, endIndex: i - 1 };
    }
    /**
     * @param {String} rawJson A raw json string
     * @param {number} startIndex The start index of `t` or `f` of `true` or `false` to extract
     * @returns {value:string, raw:string, endIndex:number} endIndex is the index of the last character of the token: `e`
     */
    _parseBoolean(rawJson, startIndex){

        if(rawJson.startsWith('true', startIndex)){

            return { value: true, raw: 'true', endIndex: startIndex + 3 };
        }
        if(rawJson.startsWith('false', startIndex)){

            return { value: false, raw: 'false', endIndex: startIndex + 4 };
        }
    }
    /**
     * @param {*} rawJson A raw json string
     * @param {*} startIndex The start index of `n` of `null` to extract
     * @returns {{value:null, raw:string, endIndex:number}} endIndex is the index of the last character of the token: `l`
     */
    _parseNull(rawJson, startIndex){

        if(rawJson.startsWith('null', startIndex)){

            return { value: null, raw: 'null', endIndex: startIndex + 3 };
        }
    }
}

export default JSONTokenizer;