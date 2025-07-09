"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSource = void 0;
// performance.now() is supported in most modern browsers, plus node.
exports.timeSource = typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance
    : Date;
//# sourceMappingURL=timeSource.js.map