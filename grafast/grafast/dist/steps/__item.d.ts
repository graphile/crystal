import type { GrafastResultsList, JSONValue } from "../index.js";
import { $$deepDepSkip } from "../interfaces.js";
import type { Step } from "../step.js";
import { $$noExec, UnbatchedStep } from "../step.js";
/**
 * An __ItemStep is an internal plan (users must never construct it
 * themselves!) that Grafast uses to refer to an individual item within a list
 * or stream.
 */
export declare class __ItemStep<TData> extends UnbatchedStep<TData> {
    readonly depth: number;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    [$$noExec]: boolean;
    constructor(parentPlan: Step<TData> | Step<TData[]>, depth?: number);
    toStringMeta(): string;
    planJSONExtra(): Record<string, JSONValue | undefined> | undefined;
    getParentStep(): Step;
    [$$deepDepSkip](): Step;
    execute(): GrafastResultsList<TData>;
    unbatchedExecute(): TData;
    finalize(): void;
}
//# sourceMappingURL=__item.d.ts.map