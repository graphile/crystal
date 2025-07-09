"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = filter;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const step_js_1 = require("../step.js");
const listTransform_js_1 = require("./listTransform.js");
const reduceCallback = (memo, entireItemValue, include) => {
    if (include) {
        memo.push(entireItemValue);
    }
    return memo;
};
const initialState = () => [];
/**
 * Filters a list plan to only include entries for which the `filterCallback`
 * plan results in a truthy value.
 */
function filter(listStep, filterCallback) {
    return (0, listTransform_js_1.listTransform)({
        listStep,
        itemPlanCallback: filterCallback,
        initialState,
        reduceCallback: reduceCallback,
        listItem: (0, step_js_1.isListCapableStep)(listStep)
            ? (itemPlan) => listStep.listItem(itemPlan)
            : undefined,
        meta: `filter:${chalk_1.default.yellow(listStep.id)}${filterCallback.name ? `/${filterCallback.name}` : ""}`,
    });
}
//# sourceMappingURL=filter.js.map