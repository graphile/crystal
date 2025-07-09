"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReverseStep = void 0;
exports.reverseArray = reverseArray;
exports.reverse = reverse;
const step_js_1 = require("../step.js");
/**
 * Returns a reversed copy of the list.
 */
function reverseArray(list) {
    if (!Array.isArray(list)) {
        throw new Error(`Attempted to reverse an array, but what was passed wasn't an array`);
    }
    const l = list.length;
    const newList = [];
    for (let i = 0; i < l; i++) {
        newList[i] = list[l - i - 1];
    }
    return newList;
}
/**
 * Reverses a list.
 */
class ReverseStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ReverseStep",
    }; }
    constructor(plan) {
        super();
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.addDependency(plan);
    }
    execute({ indexMap, values: [values0], }) {
        return indexMap((i) => {
            const arr = values0.at(i);
            return arr == null ? arr : reverseArray(arr);
        });
    }
    unbatchedExecute(_extra, arr) {
        return arr == null ? arr : reverseArray(arr);
    }
    deduplicate(peers) {
        return peers;
    }
}
exports.ReverseStep = ReverseStep;
/**
 * Reverses a list.
 */
function reverse(plan) {
    return plan.operationPlan.cacheStep(plan, "GrafastInternal:reverse()", "", () => new ReverseStep(plan));
}
//# sourceMappingURL=reverse.js.map