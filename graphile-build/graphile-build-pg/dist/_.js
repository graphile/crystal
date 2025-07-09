"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniq = uniq;
// PERF: benchmark this; might be faster to use `Array.from()` or an explicit
// for loop with set existance check
/**
 * Returns a new array containing only the unique elements of `list`.
 */
function uniq(list) {
    return [...new Set(list)];
}
//# sourceMappingURL=_.js.map