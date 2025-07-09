"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolymorphicBranchStep = void 0;
exports.polymorphicBranch = polymorphicBranch;
const index_js_1 = require("../index.js");
const step_js_1 = require("../step.js");
const constant_js_1 = require("./constant.js");
class PolymorphicBranchStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "PolymorphicBranchStep",
    }; }
    constructor($step, matchers) {
        super();
        this.isSyncAndSafe = true;
        this.addDependency($step);
        this.typeNames = Object.keys(matchers);
        this.matchers = Object.fromEntries(Object.entries(matchers).map(([typeName, matcher]) => {
            const fixedMatcher = {
                match: matcher.match ?? ((obj) => obj.__typename === typeName),
                plan: matcher.plan ?? (($obj) => $obj),
            };
            return [typeName, fixedMatcher];
        }));
    }
    planForType(objectType) {
        const matcher = this.matchers[objectType.name];
        const $step = this.getDep(0, true);
        if (matcher) {
            if (typeof matcher.plan === "function") {
                return matcher.plan($step);
            }
            else {
                return $step;
            }
        }
        else {
            // TODO: should this be an error?
            return (0, constant_js_1.constant)(null);
        }
    }
    execute({ indexMap, values: [values0], }) {
        return indexMap((i) => {
            const obj = values0.at(i);
            let match = null;
            if (obj != null) {
                for (const typeName of this.typeNames) {
                    if (this.matchers[typeName].match(obj)) {
                        match = typeName;
                        break;
                    }
                }
            }
            return match !== null ? (0, index_js_1.polymorphicWrap)(match, obj) : null;
        });
    }
}
exports.PolymorphicBranchStep = PolymorphicBranchStep;
function polymorphicBranch($step, matchers) {
    return new PolymorphicBranchStep($step, matchers);
}
//# sourceMappingURL=polymorphicBranch.js.map