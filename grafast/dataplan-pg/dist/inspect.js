"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspect = void 0;
try {
    exports.inspect = require("util").inspect;
    if (typeof exports.inspect !== "function") {
        throw new Error("Failed to load inspect");
    }
}
catch {
    exports.inspect = Object.assign((obj) => {
        return Array.isArray(obj) ||
            !obj ||
            Object.getPrototypeOf(obj) === null ||
            Object.getPrototypeOf(obj) === Object.prototype
            ? String(JSON.stringify(obj))
            : String(obj);
    }, { custom: Symbol.for("nodejs.util.inspect.custom") });
}
//# sourceMappingURL=inspect.js.map