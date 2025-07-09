import type { ExecutionDetails, GrafastResultsList, UnbatchedExecutionExtra } from "../interfaces.js";
import { $$proxy } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
/**
 * @experimental
 *
 * Never build this class directly.
 */
export declare class ProxyStep<T> extends UnbatchedStep<T> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private $depId;
    constructor($dep: Step<T>, $actualDep: Step);
    toStringMeta(): string | null;
    addDependency(step: Step): number;
    execute({ count, values: [values0], }: ExecutionDetails<[T]>): GrafastResultsList<T>;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, value: T): T;
    stream: undefined;
}
declare module "../step.js" {
    interface Step {
        [$$proxy]?: any;
    }
}
/**
 * @experimental
 *
 * This could change at any time, may impact performance, and just, generally,
 * needs more work. You shouldn't need this in the vast majority of cases.
 */
export declare function proxy<TData, TStep extends Step<TData>>($step: TStep, $actualDep?: Step): TStep & {
    addDependency(step: Step): number;
};
//# sourceMappingURL=proxy.d.ts.map