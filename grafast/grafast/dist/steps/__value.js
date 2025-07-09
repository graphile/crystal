"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ValueStep = void 0;
const step_js_1 = require("../step.js");
const access_js_1 = require("./access.js");
/**
 * Implements `__ValueStep(operationPlan)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValueStepId` and `PopulateValueStep`.
 */
class __ValueStep extends step_js_1.Step {
    static { _a = step_js_1.$$noExec; }
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__ValueStep",
    }; }
    constructor(isImmutable) {
        super();
        this.isSyncAndSafe = true;
        this[_a] = true;
        this._isImmutable = isImmutable;
    }
    toStringMeta() {
        switch (this) {
            case this.operationPlan.rootValueStep:
                return "rootValue";
            case this.operationPlan.variableValuesStep:
                return "variableValues";
            case this.operationPlan.contextStep:
                return "context";
            default:
                return null;
        }
    }
    execute() {
        // This is still an "executable plan"; we just side-step execution internally.
        throw new Error(`GrafastInternalError<7696a514-f452-4d47-92d3-85aeb5b23f48>: ${this} is a __ValueStep and thus must never execute`);
    }
    get(attrName) {
        return this.cacheStep("get", attrName, () => (0, access_js_1.access)(this, [attrName]));
    }
    at(index) {
        return this.cacheStep("at", index, () => (0, access_js_1.access)(this, [index]));
    }
}
exports.__ValueStep = __ValueStep;
//# sourceMappingURL=__value.js.map