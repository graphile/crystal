"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = isPromiseLike;
function isPromiseLike(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.then === "function");
}
//# sourceMappingURL=utils.js.map