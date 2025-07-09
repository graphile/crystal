import type { ExecutionDetails, GrafastResultsList, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import type { ConnectionCapableStep } from "./connection.js";
export declare class FirstStep<TData> extends UnbatchedStep<TData> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    constructor(parentPlan: Step<ReadonlyArray<TData>> | ConnectionCapableStep<Step<TData>, any>);
    execute({ indexMap, values: [values0], }: ExecutionDetails<[ReadonlyArray<TData>]>): GrafastResultsList<TData>;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, list: any[]): any;
    deduplicate(peers: FirstStep<TData>[]): FirstStep<TData>[];
    optimize(): any;
}
/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 */
export declare function first<TData>(plan: Step<ReadonlyArray<TData>> | ConnectionCapableStep<Step<TData>, any>): FirstStep<TData>;
//# sourceMappingURL=first.d.ts.map