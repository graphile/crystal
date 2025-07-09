"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantStep = void 0;
exports.constant = constant;
const inspect_js_1 = require("../inspect.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const index_js_1 = require("./index.js");
/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
class ConstantStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ConstantStep",
    }; }
    constructor(data, isSensitive = typeof data !== "boolean" && data != null) {
        super();
        this.data = data;
        this.isSensitive = isSensitive;
        this.isSyncAndSafe = true;
        const t = typeof data;
        if (data == null ||
            t === "boolean" ||
            t === "number" ||
            (t === "string" && t.length < 200)) {
            this.peerKey = t + "|" + String(data);
        }
    }
    toStringMeta() {
        // ENHANCE: use nicer simplification
        return this.isSensitive
            ? `[HIDDEN]`
            : (0, inspect_js_1.inspect)(this.data, {
                compact: Infinity,
                breakLength: Infinity,
            })
                .replace(/[\r\n]/g, " ")
                .replaceAll("[Object: null prototype] ", "§")
                .slice(0, 60);
    }
    planJSONExtra() {
        if (this.isSensitive)
            return;
        const data = this.data;
        if (data === null) {
            return {
                constant: {
                    type: "null",
                },
            };
        }
        else if (data === undefined ||
            typeof data === "boolean" ||
            typeof data === "number" ||
            typeof data === "string") {
            return {
                constant: {
                    type: typeof data,
                },
            };
        }
    }
    deduplicate(peers) {
        return peers.filter((p) => p.data === this.data);
    }
    execute({ count }) {
        return (0, utils_js_1.arrayOfLength)(count, this.data);
    }
    /** @internal */
    eval() {
        return this.data;
    }
    /** @internal */
    evalIs(value) {
        return this.data === value;
    }
    /** @internal */
    evalIsEmpty() {
        return (typeof this.data === "object" &&
            this.data !== null &&
            Object.keys(this.data).length === 0);
    }
    /** @internal */
    evalLength() {
        return Array.isArray(this.data) ? this.data.length : null;
    }
    /** @internal */
    evalKeys() {
        if (this.data == null || typeof this.data !== "object") {
            return null;
        }
        else {
            const data = this.data;
            return Object.keys(data).filter((k) => data[k] !== undefined);
        }
    }
    unbatchedExecute() {
        return this.data;
    }
    isNull() {
        return this.data === null;
    }
    isUndefined() {
        return this.data === undefined;
    }
    get(key) {
        const value = typeof this.data === "object" &&
            this.data !== null &&
            Object.hasOwn(this.data, key)
            ? this.data[key]
            : undefined;
        return constant(value);
    }
    at(index) {
        const value = Array.isArray(this.data) ? this.data[index] : undefined;
        return constant(value);
    }
}
exports.ConstantStep = ConstantStep;
function isTemplateStringsArray(data) {
    return (Array.isArray(data) &&
        "raw" in data &&
        Array.isArray(data.raw));
}
function constant(data, isSecret) {
    if (isTemplateStringsArray(data)) {
        if (data.length !== 1) {
            throw new Error("constant`...` doesn't currently support placeholders; please use 'constant(`...`)' instead");
        }
        return constant(data[0], false);
    }
    const opPlan = (0, index_js_1.operationPlan)();
    const makeConst = () => (0, index_js_1.operationPlan)().withRootLayerPlan(() => new ConstantStep(data, isSecret));
    const t = typeof data;
    if (data == null ||
        t === "boolean" ||
        t === "string" ||
        t === "number" ||
        t === "symbol") {
        return opPlan.cacheStep(opPlan.contextStep, isSecret ? `constant-secret` : `constant`, data, makeConst);
    }
    else {
        return makeConst();
    }
}
// Have to overwrite the getDepOrConstant method due to circular dependency
step_js_1.Step.prototype.getDepOrConstant = function (depId, fallback) {
    return this.maybeGetDep(depId) ?? constant(fallback, false);
};
//# sourceMappingURL=constant.js.map