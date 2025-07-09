import type { ExecutionDetails, StepOptimizeOptions, UnbatchedExecutionExtra, UnwrapPlanTuple } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { ConstantStep } from "./constant.js";
interface ListStepCacheConfig {
    identifier?: string;
    cacheSize?: number;
}
export declare class ListStep<const TPlanTuple extends readonly Step[]> extends UnbatchedStep<UnwrapPlanTuple<TPlanTuple>> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    optimizeMetaKey: string;
    private cacheSize;
    private valueCount;
    constructor(list: TPlanTuple, cacheConfig?: ListStepCacheConfig);
    toStringMeta(): string;
    execute({ indexMap, values }: ExecutionDetails): readonly UnwrapPlanTuple<TPlanTuple>[];
    unbatchedExecute(_extra: UnbatchedExecutionExtra, ...values: any[]): UnwrapPlanTuple<TPlanTuple>;
    deduplicatedUnbatchedExecute({ meta: inMeta }: UnbatchedExecutionExtra, ...values: any[]): UnwrapPlanTuple<TPlanTuple>;
    deduplicate(peers: ListStep<TPlanTuple>[]): ListStep<TPlanTuple>[];
    optimize(opts: StepOptimizeOptions): this | ConstantStep<any[]>;
    finalize(): void;
    /**
     * Get the original plan at the given index back again.
     */
    at<TIndex extends keyof TPlanTuple & number>(index: TIndex): TPlanTuple[TIndex];
    first(): TPlanTuple[0] | import("./__flag.js").__FlagStep<TPlanTuple[0]>;
    last(): TPlanTuple[number] | import("./__flag.js").__FlagStep<TPlanTuple[number]>;
}
/**
 * Takes a list of plans and turns it into a single plan that represents the
 * list of their values.
 */
export declare function list<const TPlanTuple extends readonly Step[]>(list: TPlanTuple, cacheConfig?: ListStepCacheConfig): ListStep<TPlanTuple>;
export {};
//# sourceMappingURL=list.d.ts.map