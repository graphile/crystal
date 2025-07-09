"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideEffectStep = void 0;
exports.sideEffect = sideEffect;
const multistep_js_1 = require("../multistep.js");
const step_js_1 = require("../step.js");
/**
 * Calls the given callback function for each tuple
 */
class SideEffectStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "SideEffectStep",
    }; }
    constructor($plan, fn) {
        super();
        this.fn = fn;
        this.isSyncAndSafe = false;
        this.allowMultipleOptimizations = false;
        this.hasSideEffects = true;
        this.planDep = $plan != null ? this.addDependency($plan) : null;
    }
    toStringMeta() {
        return this.fn.displayName || this.fn.name;
    }
    unbatchedExecute(_extra, value) {
        return this.fn(value);
    }
}
exports.SideEffectStep = SideEffectStep;
/**
 * A plan that takes the input `$plan` and feeds each value through the `fn`
 * callback. Note: if you need to pass more than one value, pass a `ListStep`
 * as the `$plan` argument.
 */
function sideEffect(spec, fn) {
    if (fn.length > 1) {
        throw new Error("sideEffect callback should accept one argument, perhaps you forgot to destructure the arguments?");
    }
    const $in = (0, multistep_js_1.multistep)(spec);
    const $result = new SideEffectStep($in, fn);
    return $result;
}
//# sourceMappingURL=sideEffect.js.map