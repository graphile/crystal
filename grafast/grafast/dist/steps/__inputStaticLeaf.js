"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__InputStaticLeafStep = void 0;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const step_js_1 = require("../step.js");
const constant_js_1 = require("./constant.js");
const { valueFromAST } = graphql;
/**
 * Implements `InputStaticLeafStep`
 *
 * @see __InputDynamicScalarStep
 */
class __InputStaticLeafStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__InputStaticLeafStep",
    }; }
    constructor(inputType, value) {
        super();
        this.isSyncAndSafe = true;
        // `coerceInputValue` throws on coercion failure. NOTE: it's only safe for
        // us to call coerceInputValue because we already know this is a scalar,
        // *not* a variable, and not an object/list therefore cannot _contain_ a
        // variable. Otherwise we'd need to process it via
        // operationPlan.trackedVariableValuesStep.
        this.coercedValue = value != null ? valueFromAST(value, inputType) : value;
    }
    unbatchedExecute() {
        return this.coercedValue;
    }
    optimize() {
        return (0, constant_js_1.constant)(this.coercedValue, false);
    }
    /** @internal */
    eval() {
        return this.coercedValue;
    }
    /** @internal */
    evalIs(expectedValue) {
        return this.coercedValue === expectedValue;
    }
}
exports.__InputStaticLeafStep = __InputStaticLeafStep;
//# sourceMappingURL=__inputStaticLeaf.js.map