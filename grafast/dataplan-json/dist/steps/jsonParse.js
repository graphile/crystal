"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParseStep = void 0;
exports.jsonParse = jsonParse;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const grafast_1 = require("grafast");
/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
class JSONParseStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/json",
        exportName: "JSONParseStep",
    }; }
    constructor($stringPlan) {
        super();
        // We're not safe because if parsing JSON fails we'll include a rejected
        // promise.
        this.isSyncAndSafe = false;
        this.addDependency($stringPlan);
    }
    toStringMeta() {
        return chalk_1.default.bold.yellow(String(this.getDep(0).id));
    }
    get(key) {
        return (0, grafast_1.access)(this, [key]);
    }
    at(index) {
        return (0, grafast_1.access)(this, [index]);
    }
    deduplicate(_peers) {
        // We're all the same
        return _peers;
    }
    execute({ indexMap, values: [stringDep], }) {
        return indexMap((i) => {
            const v = stringDep.at(i);
            if (typeof v === "string") {
                try {
                    return JSON.parse(v);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            }
            else if (v == null) {
                return null;
            }
            else {
                return Promise.reject(new Error(`JSONParseStep: expected string to parse, but received ${Array.isArray(v) ? "array" : typeof v}`));
            }
        });
    }
}
exports.JSONParseStep = JSONParseStep;
/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
function jsonParse($string) {
    return new JSONParseStep($string);
}
(0, grafast_1.exportAs)("@dataplan/json", jsonParse, "jsonParse");
//# sourceMappingURL=jsonParse.js.map