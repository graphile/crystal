"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastStep = void 0;
exports.last = last;
const step_js_1 = require("../step.js");
const connection_js_1 = require("./connection.js");
const list_js_1 = require("./list.js");
class LastStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "LastStep",
    }; }
    constructor(parentPlan) {
        super();
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.unbatchedExecute = (_extra, list) => {
            return list?.[list?.length - 1];
        };
        this.addDependency((0, connection_js_1.itemsOrStep)(parentPlan));
    }
    deduplicate(peers) {
        return peers;
    }
    optimize() {
        const parent = this.getDep(0);
        // The last of a list plan is just the last dependency of the list plan.
        if (parent instanceof list_js_1.ListStep) {
            return parent.last();
        }
        return this;
    }
}
exports.LastStep = LastStep;
/**
 * A plan that resolves to the last entry in the list returned by the given
 * plan.
 */
function last(plan) {
    return plan.operationPlan.cacheStep(plan, "GrafastInternal:last()", "", () => new LastStep(plan));
}
//# sourceMappingURL=last.js.map