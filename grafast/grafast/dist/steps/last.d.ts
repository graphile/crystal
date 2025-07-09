import type { UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import type { ConnectionCapableStep } from "./connection.js";
export declare class LastStep<TData> extends UnbatchedStep<TData> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    constructor(parentPlan: Step<ReadonlyArray<TData>> | ConnectionCapableStep<Step<TData>, any>);
    unbatchedExecute: (_extra: UnbatchedExecutionExtra, list: ReadonlyArray<TData>) => TData;
    deduplicate(peers: LastStep<TData>[]): LastStep<TData>[];
    optimize(): any;
}
/**
 * A plan that resolves to the last entry in the list returned by the given
 * plan.
 */
export declare function last<TData>(plan: Step<ReadonlyArray<TData>> | ConnectionCapableStep<Step<TData>, any>): LastStep<TData>;
//# sourceMappingURL=last.d.ts.map