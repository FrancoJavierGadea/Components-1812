import {test} from "node:test";
import { JSONTokenizer } from "../src/JSONTokenizer.js";

const TARGETS = [
    {name: 'true', value: true},
    {name: 'false', value: false},
];


test('JSONTokenizer parse-boolean', async (t) => {

    for (const target of TARGETS) {

        const {name, value} = target;

        await t.test(name, (t) => {

            const rawJSON = JSON.stringify({value});
            const i = rawJSON.indexOf(`:`) + 1;
            const endIndex = rawJSON.lastIndexOf('e');

            const tokenizer = new JSONTokenizer();

            const result = tokenizer._parseBoolean(rawJSON, i);

            const expected = { value, raw: JSON.stringify(value), endIndex };

            t.assert.ok( ['t', 'f'].includes(rawJSON.at(i)) );
            t.assert.equal(rawJSON.at(result.endIndex), 'e');
            t.assert.deepEqual(result, expected);
        });
    }

});


test('JSONTokenizer parse-boolean: null', (t) => {

    const example = {        
        "null-value": null,
    };
    const rawJSON = JSON.stringify(example);

    const i = rawJSON.indexOf(`:n`) + 1;
    const endIndex = i + 3;

    const tokenizer = new JSONTokenizer();

    const result = tokenizer._parseNull(rawJSON, i);
    const expected = { value: null, raw: 'null', endIndex };

    t.assert.equal(rawJSON.at(i), 'n');
    t.assert.equal(rawJSON.at(result.endIndex), 'l');
    t.assert.deepEqual(result, expected);
});


