# Using another tokenizer

Si quieres utilzar otra biblioteca para tokenizar el json, como `Babel`

Puedes cambiar la propiedad estatica `JSONVisualizer.getTokens`

```js
import JSONVisualizer from "@components-1812/json-visualizer";

JSONVisualizer.getTokens = async (rawJson) => {

    return [];
}
```

Los tokens que retorna el array tienen el siguiente formato

```ts
type Token = {
    type:'brace-open' | 'brace-close' | 'bracket-open' | 'bracket-close' | 'colon' | 'comma' | 'string' | 'number' | 'boolean' | 'null',
    value:any,
    tags:Array<'brace' | 'bracket' | 'colon' | 'comma' | 'string' | 'number' | 'boolean' | 'null' | 'open' | 'close' | 'key' | 'value' | 'array-value'>,
}
```
> La propiedad type es indispensable para el correcto renderizado del json

> Las tags sirven para el highlight

<br>

### Ejemplo usando Babel standalone

```js
import JSONVisualizer from "@components-1812/json-visualizer";
import * as Babel from '@babel/standalone';

//Define JSON Tokenizer
JSONVisualizer.getTokens = async (rawJson) => {

    const {parse} = Babel.packages.parser;

    const tokenizer = parse(`(${rawJson})`, { tokens: true });

    const result = tokenizer.tokens.slice(1, -2);

    const tokens = [];
    
    for (let i = 0; i < result.length; i++) {

        const {type, value} = result[i];
        
        if(type.label === '{'){
            tokens.push({type: 'brace-open', value: '{', tags: ['brace']});
        }
        if(type.label === '}'){
            tokens.push({type: 'brace-close', value: '}', tags: ['brace']});
        }
        if(type.label === '['){
            tokens.push({type: 'bracket-open', value: '[', tags: ['bracket']});
        }
        if(type.label === ']'){
            tokens.push({type: 'bracket-close', value: ']', tags: ['bracket']});
        }
        if(type.label === ':'){
            tokens.push({type: 'colon', value: ':', tags: ['colon']});
        }
        if(type.label === ','){
            tokens.push({type: 'comma', value: ',', tags: ['comma']});
        }
        if(type.label === 'string'){
            tokens.push({type: 'string', value: `"${value}"`, tags: ['string']});
        }
        if(type.label === 'num'){
            tokens.push({type: 'number', value: value, tags: ['number']});
        }
        if(type.label === 'false' || type.label === 'true'){
            tokens.push({type: 'boolean', value: value, tags: ['boolean']});
        }
        if(type.label === 'null'){
            tokens.push({type: 'null', value: 'null', tags: ['null']});
        }
    }

    return tokens;
}

//Load the stylesheet
JSONVisualizer.stylesSheets.links.push(`path/to/styles.css`);

customElements.define('custom-json-visualizer', JSONVisualizer);
```