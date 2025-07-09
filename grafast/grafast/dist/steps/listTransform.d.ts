import type { ConnectionCapableStep, ExecutionDetails } from "../index.js";
import type { GrafastResultsList } from "../interfaces.js";
import { $$deepDepSkip } from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { Step } from "../step.js";
import { __ItemStep } from "./__item.js";
import type { ItemsStep } from "./connection.js";
export type ListTransformReduce<TMemo, TItemPlanData> = (memo: TMemo, entireItemValue: unknown, itemPlanData: TItemPlanData) => TMemo;
export type ListTransformItemPlanCallback<TListStep extends Step<readonly any[]>, TDepsStep extends Step> = (listItemPlan: ItemsStep<TListStep> extends ListCapableStep<any, any> ? ReturnType<ItemsStep<TListStep>["listItem"]> : __ItemStep<any>) => TDepsStep;
export interface ListTransformOptions<TListStep extends Step<readonly any[]> | ConnectionCapableStep<Step<any>, any>, TDepsStep extends Step, TMemo, TItemStep extends Step | undefined = undefined> {
    listStep: TListStep;
    itemPlanCallback: ListTransformItemPlanCallback<ItemsStep<TListStep>, TDepsStep>;
    initialState(): TMemo;
    reduceCallback: ListTransformReduce<TMemo, TDepsStep extends Step<infer U> ? U : never>;
    listItem?(itemPlan: Step): TItemStep;
    finalizeCallback?(data: TMemo): TMemo;
    meta?: string;
    optimize?: (this: __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep>) => Step;
    connectionClone?: ConnectionCapableStep<TListStep, any>["connectionClone"];
}
/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Grafast. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * It's recommended that you don't use this directly, please use one of the
 * functions that uses this under the hood such as `filter()`.
 */
export declare class __ListTransformStep<TListStep extends Step<readonly any[]> | ConnectionCapableStep<any, any> = Step<readonly any[]> | ConnectionCapableStep<any, any>, TDepsStep extends Step = Step, TMemo = any, TItemStep extends Step | undefined = Step | undefined> extends Step<TMemo> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private listStepDepId;
    private rawListStepDepId;
    itemPlanCallback: ListTransformItemPlanCallback<ItemsStep<TListStep>, TDepsStep>;
    initialState: () => TMemo;
    reduceCallback: ListTransformReduce<TMemo, TDepsStep extends Step<infer U> ? U : never>;
    finalizeCallback?: (data: TMemo) => TMemo;
    listItem?: (itemPlan: __ItemStep<this>) => TItemStep;
    private meta;
    connectionClone?: ConnectionCapableStep<TListStep, any>["connectionClone"];
    /** Set during query planning.  */
    itemStepId: number;
    constructor(options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>);
    toStringMeta(): string | null;
    getListStep(): TListStep;
    [$$deepDepSkip](): TListStep;
    dangerouslyGetListPlan(): TListStep;
    deduplicate(peers: __ListTransformStep<any, any, any, any>[]): __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep>[];
    optimize(): Step;
    execute({ indexForEach, indexMap, values, extra, }: ExecutionDetails<[any[] | null | undefined | Error]>): Promise<GrafastResultsList<TMemo>>;
}
/**
 * **Experimental.**
 *
 * A "special" plan that has custom handling in Grafast. Used for turning lists
 * into other things (or maybe more lists!).
 *
 * {@page ~grafast/steps/listTransform.md}
 */
export declare function listTransform<TListStep extends Step<readonly any[]> | ConnectionCapableStep<any, any>, TDepsStep extends Step, TMemo, TItemStep extends Step | undefined = undefined>(options: ListTransformOptions<TListStep, TDepsStep, TMemo, TItemStep>): __ListTransformStep<TListStep, TDepsStep, TMemo, TItemStep>;
//# sourceMappingURL=listTransform.d.ts.map