import type { ListCapableStep, Step } from "../step.js";
import type { __ItemStep } from "./__item.js";
import type { ConnectionCapableStep, ItemsStep } from "./connection.js";
import type { __ListTransformStep, ListTransformItemPlanCallback } from "./listTransform.js";
export type FilterPlanMemo = unknown[];
/**
 * Filters a list plan to only include entries for which the `filterCallback`
 * plan results in a truthy value.
 */
export declare function filter<TListStep extends Step<readonly any[]> | ConnectionCapableStep<any, any>, TItemStep extends Step<boolean>>(listStep: TListStep, filterCallback: ListTransformItemPlanCallback<ItemsStep<TListStep>, TItemStep>): __ListTransformStep<TListStep, TItemStep, FilterPlanMemo, TListStep extends ListCapableStep<any, any> ? ReturnType<TListStep["listItem"]> : __ItemStep<any>>;
//# sourceMappingURL=filter.d.ts.map