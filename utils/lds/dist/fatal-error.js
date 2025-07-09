"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FatalError extends Error {
    constructor(message, originalError) {
        super(message);
        this.fatal = true;
        Object.setPrototypeOf(this, new.target.prototype);
        this.originalError = originalError;
    }
}
exports.default = FatalError;
//# sourceMappingURL=fatal-error.js.map