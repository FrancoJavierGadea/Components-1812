
import {performance} from "node:perf_hooks";
import JSONTokenizer from "../../src/JSONTokenizer.js";

const bigJsonArray = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    active: i % 2 === 0,
    age: 18 + (i % 50),
    tags: [`tag${i % 5}`, `group${i % 10}`],
    meta: {
        score: Math.random() * 100,
        created: new Date().toISOString(),
        preferences: {
            newsletter: i % 3 === 0,
            notifications: i % 5 !== 0
        }
    }
}));

const rawJson = JSON.stringify(bigJsonArray, null, 2);

const tokenizer = new JSONTokenizer();

const total = 10;

console.log(`JSON length: ${rawJson.length}`);
console.log(`Iterations: ${total}`);

// Test with strict: true
let start = performance.now();

for (let i = 0; i < total; i++){

    tokenizer.clearJSON(rawJson, { strict: true });
}

let end = performance.now();

console.log(`minify with {strict: true} took ${(end - start).toFixed(2)} ms`);

// Test with strict: false
start = performance.now();

for (let i = 0; i < total; i++) {
    tokenizer.clearJSON(rawJson, { strict: false });
}
end = performance.now();

console.log(`minify with {strict: false} took ${(end - start).toFixed(2)} ms`);



/**
 * Previous tests
 * 
 * JSON length: 3612135
 * Iterations: 1
 * minify with {strict: true} took 31.56 ms
 * minify with {strict: false} took 261.19 ms
 * 
 * JSON length: 3612235
 * Iterations: 10
 * minify with {strict: true} took 281.03 ms
 * minify with {strict: false} took 2378.56 ms
 */