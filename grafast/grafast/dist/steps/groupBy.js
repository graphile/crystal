"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = groupBy;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const step_js_1 = require("../step.js");
const each_js_1 = require("./each.js");
const listTransform_js_1 = require("./listTransform.js");
const reduceCallback = (memo, entireItemValue, idx) => {
    let list = memo.get(idx);
    if (!list) {
        list = [];
        memo.set(idx, list);
    }
    list.push(entireItemValue);
    return memo;
};
const initialState = () => new Map();
/**
 * Takes a single dimensional list plan and a mapper that returns a grouping
 * key. Returns a plan that results in a Map where the keys are the grouping
 * keys and the values are lists of the original entries that match these
 * grouping keys.
 */
function groupBy(listStep, mapper) {
    return (0, listTransform_js_1.listTransform)({
        listStep,
        itemPlanCallback: mapper,
        initialState,
        reduceCallback: reduceCallback,
        listItem: (0, step_js_1.isListCapableStep)(listStep)
            ? (itemPlan) => {
                return (0, each_js_1.each)(itemPlan, ($item) => listStep.listItem($item));
            }
            : undefined,
        meta: `groupBy:${chalk_1.default.yellow(listStep.id)}${mapper.name ? `/${mapper.name}` : ""}`,
    });
}
//# sourceMappingURL=groupBy.js.map