import type { Step } from "../step.js";
import type { ConnectionCapableStep, ItemsStep } from "./connection.js";
import type { __ListTransformStep, ListTransformItemPlanCallback } from "./listTransform.js";
export type GroupByPlanMemo = Map<unknown, unknown[]>;
/**
 * Takes a single dimensional list plan and a mapper that returns a grouping
 * key. Returns a plan that results in a Map where the keys are the grouping
 * keys and the values are lists of the original entries that match these
 * grouping keys.
 */
export declare function groupBy<TListStep extends Step<readonly any[]> | ConnectionCapableStep<any, any>, TItemStep extends Step<number>>(listStep: TListStep, mapper: ListTransformItemPlanCallback<ItemsStep<TListStep>, TItemStep>): __ListTransformStep<TListStep, TItemStep, GroupByPlanMemo, any>;
//# sourceMappingURL=groupBy.d.ts.map