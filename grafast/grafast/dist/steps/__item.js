"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ItemStep = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const interfaces_js_1 = require("../interfaces.js");
const step_js_1 = require("../step.js");
/**
 * An __ItemStep is an internal plan (users must never construct it
 * themselves!) that Grafast uses to refer to an individual item within a list
 * or stream.
 */
class __ItemStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__ItemStep",
    }; }
    constructor(parentPlan, depth = 0) {
        super();
        this.depth = depth;
        this.isSyncAndSafe = true;
        this[_a] = true;
        this.addDependency(parentPlan);
        this._isUnary = false;
        this._isUnaryLocked = true;
    }
    toStringMeta() {
        return chalk_1.default.bold.yellow(String(this.dependencies[0].id));
    }
    planJSONExtra() {
        return {
            transformStepId: this.transformStepId,
        };
    }
    getParentStep() {
        return this.getDep(0);
    }
    [(_a = step_js_1.$$noExec, interfaces_js_1.$$deepDepSkip)]() {
        return this.getDep(0);
    }
    execute() {
        throw new Error("__ItemStep must never execute");
    }
    unbatchedExecute() {
        throw new Error("__ItemStep must never execute");
    }
    finalize() {
        super.finalize();
        if (this.transformStepId != null) {
            this.transformStepId = this.operationPlan.dangerouslyGetStep(this.transformStepId).id;
        }
    }
}
exports.__ItemStep = __ItemStep;
//# sourceMappingURL=__item.js.map