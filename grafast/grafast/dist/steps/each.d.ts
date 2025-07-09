import type { ListCapableStep, Step } from "../step.js";
import { __ItemStep } from "./__item.js";
import type { ConnectionCapableStep, ItemsStep } from "./connection.js";
import type { __ListTransformStep } from "./listTransform.js";
/**
 * Transforms a list by wrapping each element in the list with the given mapper.
 */
export declare function each<TListStep extends (Step<readonly any[]> & Partial<ConnectionCapableStep<any, any>>) | ConnectionCapableStep<any, any>, TResultItemStep extends Step>(listStep: TListStep, mapper: (itemPlan: ItemsStep<TListStep> extends ListCapableStep<any, any> ? ReturnType<ItemsStep<TListStep>["listItem"]> : __ItemStep<any>) => TResultItemStep): __ListTransformStep<any, any, any, any>;
//# sourceMappingURL=each.d.ts.map