import COLOR_PATTERNS from "./utils/color-patterns.js";
import URL_PATTERNS from "./utils/url-patterns.js";


/**
 * @typedef {'brace-open' | 'brace-close' | 'bracket-open' | 'bracket-close' | 'colon' | 'comma' | 'string' | 'number' | 'boolean' | 'null'} TokenType
 * @typedef {'brace' | 'bracket' | 'colon' | 'comma' | 'string' | 'number' | 'boolean' | 'null' | 'false'  | 'true' | 'open' | 'close'} TokenTypeTag
 * @typedef {'key' | 'value' | 'array-value'} TokenRole
 * @typedef {'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'named'} TokenColor
 * @typedef {'color-hex' | 'color-rgb' | 'color-rgba' | 'color-hsl' | 'color-hsla' | 'color-named'} TokenColorTag
 * @typedef {'http' | 'https' | 'ftp' | 'www' | 'domain' | 'relative' | 'mail' | 'phone'} TokenUrl
 * @typedef {'url-http' | 'url-https' | 'url-ftp' | 'url-www' | 'url-domain' | 'url-relative' | 'url-mail' | 'url-phone'} TokenUrlTag
 * @typedef {TokenTypeTag | TokenRole | TokenColorTag | TokenUrlTag } TokenTag
 * 
 * @typedef {Object} Token
 * @property {TokenType} type
 *     The specific type of the token, representing different JSON syntax elements.
 * @property {string | boolean | number | null} value
 *     The actual value of the token. This can be any JSON value.
 * @property {Array<TokenTag>} tags
 *     A list of additional tags that describe the token's role or category.
 * @property {TokenColor} [color]
 *     The color type if the token represents a color value.
 * @property {TokenUrl} [url]
 *     The URL type if the token represents a URL.
 */


//MARK: JSONTokenizer
export class JSONTokenizer {

    static version = "0.0.3";

    static URL_PATTERNS = URL_PATTERNS;
    static COLOR_PATTERNS = COLOR_PATTERNS;

    /**
     * @type {Token[]}
     */
    tokens = [];

    constructor(){}

    //MARK: tokenize
    /**
     * 
     * @param {String} rawJSON 
     * @returns 
     */
    tokenize(rawJson, options = {}){

        const {detectURL = false, detectColor = true, strict = false} = options;

        const minifyJson = this.clearJSON(rawJson, {strict});

        this.tokens = [];

        let contextStack = [];
        let role = 'key';
        let i = 0;

        while(i < minifyJson.length){

            const char = minifyJson[i];
            const currentContext = contextStack.at(-1);

            if(char === '{'){   
                contextStack.push('{');

                this.tokens.push({ type: 'brace-open', value: char, tags: ['brace', 'open'] });

                role = 'key';

                i++; continue;
            }
            if(char === '}'){   
                contextStack.pop();

                this.tokens.push({ type: 'brace-close', value: char, tags: ['brace', 'close'] });

                i++; continue;
            }
            if(char === '['){   
                contextStack.push('[');

                this.tokens.push({ type: 'bracket-open', value: char, tags: ['bracket', 'open'] });

                role = 'array-value';

                i++; continue;
            }
            if(char === ']'){   
                contextStack.pop();

                this.tokens.push({ type: 'bracket-close', value: char, tags: ['bracket', 'close'] });

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

                const token = { type: 'string', value, tags: ['string', role] };

                if(detectURL){
                    const result = this._isURL(value);

                    if(result.isURL){
                        token.tags.push(`url-${result.type}`);
                        token.url = result.type;
                    }
                }
                if(detectColor){
                    const result = this._isColor(value);

                    if(result.isColor){
                        token.tags.push(`color-${result.type}`);
                        token.color = result.type;
                    }
                }

                this.tokens.push({ type: 'string-open', value: char, tags: ['string', 'open', role] });
                this.tokens.push(token);
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
    clearJSON(rawJson, options = {}){

        if(!rawJson || typeof rawJson !== 'string'){
            
           throw new Error('Invalid JSON input. Expected a string.');
        }

        const  {strict = false} = options;

        if(strict){

            const json = JSON.parse(rawJson);
            const minifyJson = JSON.stringify(json);
    
            return minifyJson;
        }
        else {
            return this._minifyJSON(rawJson);
        }
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

    /** MARK: _isURL
     * 
     * @param {string} string 
     * @returns {{isURL:boolean, type: 'http' | 'https' | 'ftp' | 'www' | 'domain' | 'relative' | 'mail' | 'phone' | null}} type is the URL type if `isURL` is true
     */
    _isURL(string = ''){

        if(!string) return { isURL: false, type: null};
        if(typeof string !== 'string') return { isURL: false, type: null };
        
        for (const url of Object.values(JSONTokenizer.URL_PATTERNS)){

            if(url.test(string)){

                return { isURL: true, type: url.type };
            }
        }

        return { isURL: false, type: null };
    }

    /** MARK:_isColor
     * @param {string} string 
     * @returns {{isColor:boolean, type:'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'named' | null}} type is the color type if `isColor` is true
     */
    _isColor(string = ''){

        if(!string) return { isColor: false, type: null };
        if(typeof string !== 'string') return { isColor: false, type: null };

        for(const color of Object.values(JSONTokenizer.COLOR_PATTERNS)){

            if(color.test(string)){

                if(color.validRange && !color.validRange(string)){

                    return { isColor: false, type: null };
                }

                return { isColor: true, type: color.type };
            }
        }

        return { isColor: false, type: null };
    }

    _minifyJSON(input) {

        let result = '';
        let inString = false;
        let escape = false;

        for (let i = 0; i < input.length; i++) {

            const char = input[i];

            if(inString){

                result += char;

                //Reset escape
                if(escape){

                    escape = false;
                }
                else {

                    if(char === '\\') escape = true;
                    if(char === '"') inString = false;
                }
            } 
            else {

                //
                if( !(/\s/.test(char)) ) result += char;
                
                if(char === '"') inString = true;
            }
        }

        return result;
    }

}

export default JSONTokenizer;