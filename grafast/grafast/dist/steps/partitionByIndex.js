"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partitionByIndex = partitionByIndex;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const step_js_1 = require("../step.js");
const each_js_1 = require("./each.js");
const listTransform_js_1 = require("./listTransform.js");
/**
 * For 0-based indexes
 *
 * @internal
 */
const reduceCallback0 = (memo, entireItemValue, idx) => {
    if (!memo[idx])
        memo[idx] = [];
    memo[idx].push(entireItemValue);
    return memo;
};
/**
 * For 1-based indexes
 *
 * @internal
 */
const reduceCallback1 = (memo, entireItemValue, idx1) => {
    const idx = idx1 - 1;
    if (!memo[idx])
        memo[idx] = [];
    memo[idx].push(entireItemValue);
    return memo;
};
const initialState = () => [];
/**
 * Takes a single dimensional list plan and a mapper that calculates a
 * (potentially duplicate) target index for each entry in the list. Returns a
 * plan that results in a two dimensional list of the items in the original
 * list partitioned (grouped) by their target index.
 *
 * If your datasource returns indexes that are 1-indexed then you may pass `1`
 * as the third argument and we'll account for this.
 *
 * @example For this data:
 *
 * ```jsonc
 * [
 *   {"array_idx": 1, "id": "b0b00000-0000-0000-0000-000000000b0b", "username": "Bob"},
 *   {"array_idx": 2, "id": "a11ce000-0000-0000-0000-0000000a11ce", "username": "Alice"}],
 *   {"array_idx": 2, "id": "cec111a0-0000-0000-0000-00000cec111a", "username": "Cecilia"}],
 * ]
 * ```
 *
 * partitioning by the array_idx (which is 1-indexed), would result in:
 *
 * ```jsonc
 * [
 *   [
 *     {"array_idx": 1, "id": "b0b00000-0000-0000-0000-000000000b0b", "username": "Bob"},
 *   ],
 *   [
 *     {"array_idx": 2, "id": "a11ce000-0000-0000-0000-0000000a11ce", "username": "Alice"}],
 *     {"array_idx": 2, "id": "cec111a0-0000-0000-0000-00000cec111a", "username": "Cecilia"}],
 *   ],
 * ]
 * ```
 *
 * Beware: the target indexes should not contain gaps.
 */
function partitionByIndex(listStep, mapper, startIndex = 0) {
    if (startIndex !== 0 && startIndex !== 1) {
        throw new Error(`partitionByIndex only supports 0- and 1-indexed lists currently; please use 'lambda' to convert your index`);
    }
    return (0, listTransform_js_1.listTransform)({
        listStep,
        itemPlanCallback: mapper,
        initialState,
        reduceCallback: startIndex === 1 ? reduceCallback1 : reduceCallback0,
        listItem: (0, step_js_1.isListCapableStep)(listStep)
            ? (itemPlan) => {
                return (0, each_js_1.each)(itemPlan, ($item) => listStep.listItem($item));
            }
            : undefined,
        meta: `partitionByIndex${startIndex}:${chalk_1.default.yellow(listStep.id)}${mapper.name ? `/${mapper.name}` : ""}`,
    });
}
//# sourceMappingURL=partitionByIndex.js.map