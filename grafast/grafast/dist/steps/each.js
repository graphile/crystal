"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.each = each;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const step_js_1 = require("../step.js");
const __item_js_1 = require("./__item.js");
const listTransform_js_1 = require("./listTransform.js");
const eachReduceCallback = (memo, item) => {
    memo.push(item);
    return memo;
};
const eachItemPlanCallback = (itemPlan) => itemPlan;
const eachInitialState = () => [];
const outerCache = new WeakMap();
const eachCallbackForListPlan = (listPlan, mapper) => {
    let innerCache = outerCache.get(listPlan);
    if (!innerCache) {
        innerCache = new WeakMap();
        outerCache.set(listPlan, innerCache);
    }
    let result = innerCache.get(mapper);
    if (!result) {
        result = (itemPlan) => mapper(listPlan.listItem(itemPlan));
        innerCache.set(mapper, result);
    }
    return result;
};
/**
 * Transforms a list by wrapping each element in the list with the given mapper.
 */
function each(listStep, mapper) {
    return (0, listTransform_js_1.listTransform)({
        listStep,
        itemPlanCallback: eachItemPlanCallback,
        initialState: eachInitialState,
        reduceCallback: eachReduceCallback,
        listItem: (0, step_js_1.isListCapableStep)(listStep)
            ? eachCallbackForListPlan(listStep, mapper)
            : mapper,
        meta: `each:${chalk_1.default.yellow(listStep.id)}${mapper.name ? `/${mapper.name}` : ""}`,
        optimize() {
            const layerPlan = this.subroutineLayer;
            const rootStep = layerPlan.rootStep;
            if (rootStep instanceof __item_js_1.__ItemStep &&
                rootStep.getParentStep().layerPlan !== layerPlan) {
                // We don't do anything; replace ourself with our parent
                return this.getListStep();
            }
            return this;
        },
        ...(listStep.connectionClone != null
            ? {
                connectionClone($connection, ...args) {
                    const $list = this.getListStep();
                    const $clonedList = $list.connectionClone($connection, ...args);
                    return each($clonedList, mapper);
                },
            }
            : null),
    });
}
//# sourceMappingURL=each.js.map