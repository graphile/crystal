import type { ExecutionDetails, GrafastResultsList, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
/**
 * Returns a reversed copy of the list.
 */
export declare function reverseArray<TData = any>(list: readonly TData[]): TData[];
/**
 * Reverses a list.
 */
export declare class ReverseStep<TData> extends UnbatchedStep<readonly TData[]> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    constructor(plan: Step<readonly TData[]>);
    execute({ indexMap, values: [values0], }: ExecutionDetails<[TData[]]>): GrafastResultsList<TData[]>;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, arr: TData[]): TData[];
    deduplicate(peers: ReverseStep<TData>[]): ReverseStep<TData>[];
}
/**
 * Reverses a list.
 */
export declare function reverse<TData>(plan: Step<readonly TData[]>): ReverseStep<TData>;
//# sourceMappingURL=reverse.d.ts.map