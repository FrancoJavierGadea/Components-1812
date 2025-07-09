import {test} from "node:test";
import { JSONTokenizer } from "../src/JSONTokenizer.js";

const TARGETS = [
    {name: 'basic string', message: 'hello world'},
    {name: 'empty string', message: ''},
    {name: 'string with spaces', message: '  hello world  '},
    {name: 'string with numbers', message: '12345'},
    {name: 'string with special characters', message: '!@#$%^&*()_+-='},
    {name: 'string with unicode characters', message: '你好世界'},
    {name: 'string with escaped quote', message: 'hello \\"world\\""'},
    {name: 'string with escaped backslash', message: 'hello \\\\world\\\\'},
    {name: 'string with escaped newline', message: 'hello \\nworld'},
    {name: 'string with escaped tab', message: 'hello \\tworld'},
    {name: 'long string', message: 'a'.repeat(1000)},
    {name: 'string with mixed content', message: 'Hello 123 !@# 你好 \\" \\\\ \\n \\t World.'},
    {name: 'string with emoji', message: 'hello 👋 world 🌍'},
    {name: 'string with leading/trailing spaces', message: '  trimmed  '},
    {name: 'string with multiple escaped characters', message: 'line1\\nline2\\t\\\"quote\\\"\\\\backslash'},
    {name: 'string with control characters', message: 'null\\u0000backspace\\u0008formfeed\\u000c'},
    {name: 'string with complex unicode escape', message: 'smiley\\uD83D\\uDE00'},
    {name: 'string with mixed case', message: 'HeLlO wOrLd'},
    {name: 'string with numbers and symbols', message: 'Price: $12.99!'},
    {name: 'string with only spaces', message: '   '},
    {name: 'string with only escaped characters', message: '\\n\\t\\r\\b\\f\\\\\\\"\\/'},
    {name: 'string with escaped unicode', message: 'Euro sign: \\u20AC'},
    {name: 'string with surrogate pairs', message: 'Astral plane character: \\uD800\\uDC00'},
    {name: 'string with mixed valid and invalid escapes (should parse valid)', message: 'valid\\n\\xinvalid'}, // JSON.parse handles invalid escapes by ignoring them or throwing, depending on context. Here, it should parse the valid part.
    {name: 'string with backslashes not for escape', message: 'C:\\Users\\Name\\File.txt'},
    {name: 'string with URL', message: 'https://example.com?param=value&another=param'},
    {name: 'string with HTML entities', message: '&amp;&lt;&gt;&quot;'},
    {name: 'string with leading escaped quote', message: '\\"start'},
    {name: 'string with trailing escaped quote', message: 'end\\"'},
    {name: 'string with escaped slash', message: 'path\\/to\\/file'},
    {name: 'string with multiple consecutive escaped characters', message: 'a\\\\\\\"b'},
    {name: 'string with only one character', message: 'a'},
    {name: 'json in json', message: '{"key": "value"}'},
    {name: 'message with quotes', message: 'This is a string with "escaped quotes" and a newline\n character.'},

]


test('JSONTokenizer parse-string', async (t) => {

    for (const target of TARGETS) {

        const {name, message} = target;

        await t.test(name, (t) => {

            const rawJSON = JSON.stringify({message});
            const i = rawJSON.indexOf(`:"`) + 1;
            const endIndex = rawJSON.lastIndexOf(`"`);

            const tokenizer = new JSONTokenizer();

            const result = tokenizer._parseString(rawJSON, i);
            const expected = { value: message, raw: rawJSON.slice(i, endIndex + 1), endIndex };

            t.assert.equal(rawJSON.at(i), '"');
            t.assert.equal(rawJSON.at(result.endIndex), '"');
            t.assert.deepEqual(result, expected);
        });
    }
});
