"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeError = exports.$$inhibit = void 0;
exports.flagError = flagError;
exports.isFlaggedValue = isFlaggedValue;
exports.isSafeError = isSafeError;
const dev_js_1 = require("./dev.js");
const inspect_js_1 = require("./inspect.js");
const interfaces_js_1 = require("./interfaces.js");
const $$flagged = Symbol("grafastFlaggedValue");
function flaggedValueToString() {
    if (this.flags & interfaces_js_1.FLAG_ERROR && this.value instanceof Error) {
        return String(this.value);
    }
    else if (this.flags & interfaces_js_1.FLAG_INHIBITED && this.value === null) {
        return "INHIBIT";
    }
    else {
        return `${this.flags}/${(0, inspect_js_1.inspect)(this.value)}`;
    }
}
function flaggedValue(flags, value, planId) {
    if (dev_js_1.isDev) {
        if (value === null && !(flags & interfaces_js_1.FLAG_NULL)) {
            throw new Error(`flaggedValue called with null, but not flagged as null.`);
        }
        if (value === null && !(flags & interfaces_js_1.FLAG_INHIBITED)) {
            throw new Error(`flaggedValue called with null, but not flagged as inhibited.`);
        }
    }
    return {
        [$$flagged]: true,
        flags,
        value,
        planId,
        toString: flaggedValueToString,
    };
}
exports.$$inhibit = flaggedValue(interfaces_js_1.FLAG_NULL | interfaces_js_1.FLAG_INHIBITED, null, null);
/**
 * Used to wrap error values to have Grafast treat them as if they were
 * thrown/rejected (rather than just regular values).
 */
function flagError(value, planId = null) {
    return flaggedValue(interfaces_js_1.FLAG_ERROR, value, planId);
}
/**
 * Is this a flagged value?
 *
 * @internal
 */
function isFlaggedValue(value) {
    return Object.hasOwn(value, $$flagged);
}
class SafeError extends Error {
    static { _a = interfaces_js_1.$$safeError; }
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "SafeError",
    }; }
    constructor(message, extensions = undefined, errorOptions) {
        super(message, errorOptions);
        this.extensions = extensions;
        this[_a] = true;
        Object.setPrototypeOf(this, SafeError.prototype);
    }
}
exports.SafeError = SafeError;
function isSafeError(error) {
    return error[interfaces_js_1.$$safeError];
}
//# sourceMappingURL=error.js.map