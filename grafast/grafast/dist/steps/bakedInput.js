"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BakedInputStep = void 0;
exports.bakedInput = bakedInput;
exports.bakedInputRuntime = bakedInputRuntime;
const graphql_1 = require("graphql");
const step_js_1 = require("../step.js");
const applyInput_js_1 = require("./applyInput.js");
const index_js_1 = require("./index.js");
class BakedInputStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "BakedInputStep",
    }; }
    constructor(inputType, $value) {
        super();
        this.inputType = inputType;
        this.isSyncAndSafe = true;
        this.valueDepId = this.addUnaryDependency($value);
        if (!this._isUnary) {
            throw new Error(`bakedInput() must be unary`);
        }
        this._isUnaryLocked = true;
    }
    deduplicate(peers) {
        return peers.filter((p) => p.inputType === this.inputType);
    }
    unbatchedExecute(extra, value) {
        if (value == null)
            return value;
        return bakedInputRuntime(this.operationPlan.schema, this.inputType, value);
    }
}
exports.BakedInputStep = BakedInputStep;
/**
 * Takes a input type and matching value and performs runtime conversion of
 * that type to the internal representation (if any).
 */
function bakedInput(inputType, $value) {
    const nullableInputType = (0, graphql_1.getNullableType)(inputType);
    // Could have done this in `optimize()` but faster to do it here.
    if ((0, graphql_1.isListType)(nullableInputType) ||
        ((0, graphql_1.isInputObjectType)(nullableInputType) &&
            typeof nullableInputType.extensions?.grafast?.baked === "function")) {
        // Ooo, we're fancy! Do the thing!
        return (0, index_js_1.operationPlan)().withRootLayerPlan(() => new BakedInputStep(nullableInputType, $value));
    }
    else {
        // Nothing special, we just return the input.
        return $value;
    }
}
function bakedInputRuntime(schema, inputType, value) {
    if (value == null)
        return value;
    const nullableInputType = (0, graphql_1.getNullableType)(inputType);
    if ((0, graphql_1.isListType)(nullableInputType)) {
        if (Array.isArray(value)) {
            return value.map((v) => bakedInputRuntime(schema, nullableInputType.ofType, v));
        }
        else {
            throw new Error(`Failed to process input for type ${inputType} - expected array`);
        }
    }
    // Could have done this in `optimize()` but faster to do it here.
    const baked = (0, graphql_1.isInputObjectType)(nullableInputType)
        ? nullableInputType.extensions?.grafast?.baked
        : null;
    if (typeof baked !== "function") {
        // Nothing special, we just return the input.
        return value;
    }
    else {
        // Ooo, we're fancy! Do the thing!
        let applied = false;
        const bakedObj = baked(value, {
            type: nullableInputType,
            schema,
            applyChildren(parent) {
                applied = true;
                (0, applyInput_js_1.inputArgsApply)(schema, nullableInputType, parent, value, undefined);
            },
        });
        if (!applied) {
            (0, applyInput_js_1.inputArgsApply)(schema, nullableInputType, bakedObj, value, undefined);
        }
        return bakedObj;
    }
}
//# sourceMappingURL=bakedInput.js.map