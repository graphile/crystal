import type { Step } from "../step.js";
import type { ConnectionCapableStep, ItemsStep } from "./connection.js";
import type { __ListTransformStep, ListTransformItemPlanCallback } from "./listTransform.js";
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
export declare function partitionByIndex<TListStep extends Step<readonly any[]> | ConnectionCapableStep<any, any>, TItemStep extends Step<number>>(listStep: TListStep, mapper: ListTransformItemPlanCallback<ItemsStep<TListStep>, TItemStep>, startIndex?: 0 | 1): __ListTransformStep<TListStep, TItemStep, unknown[][], any>;
//# sourceMappingURL=partitionByIndex.d.ts.map