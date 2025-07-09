"use strict";
/*
 * Due to the following Jest issue, GraphQL's `instanceof Error` test
 * cannot pass for Node assertions. So we have to define our own.
 *
 * https://github.com/facebook/jest/issues/2549
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.strictEqual = strictEqual;
/** Equivalent to `assert.ok(...)` */
function ok(val, message) {
    if (!val) {
        throw new Error(message);
    }
}
/** Equivalent to `assert.strictEqual(...)` */
function strictEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message + ` (${actual} !== ${expected})`);
    }
}
//# sourceMappingURL=assert.js.map