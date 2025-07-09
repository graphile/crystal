"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstStep = void 0;
exports.first = first;
const step_js_1 = require("../step.js");
const connection_js_1 = require("./connection.js");
const list_js_1 = require("./list.js");
class FirstStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "FirstStep",
    }; }
    constructor(parentPlan) {
        super();
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.addDependency((0, connection_js_1.itemsOrStep)(parentPlan));
    }
    execute({ indexMap, values: [values0], }) {
        return indexMap((i) => values0.at(i)?.[0]);
    }
    unbatchedExecute(_extra, list) {
        return list?.[0];
    }
    deduplicate(peers) {
        return peers;
    }
    optimize() {
        const parent = this.getDep(0);
        // The first of a list plan is just the first dependency of the list plan.
        if (parent instanceof list_js_1.ListStep) {
            return parent.first();
        }
        return this;
    }
}
exports.FirstStep = FirstStep;
/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 */
function first(plan) {
    return plan.operationPlan.cacheStep(plan, "GrafastInternal:first()", "", () => new FirstStep(plan));
}
//# sourceMappingURL=first.js.map