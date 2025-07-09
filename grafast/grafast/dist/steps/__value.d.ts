import type { GrafastResultsList } from "../index.js";
import { $$noExec, Step } from "../step.js";
import type { AccessStep } from "./access.js";
/**
 * Implements `__ValueStep(operationPlan)` which is never executed; it's purely
 * internal - we populate the value as part of the algorithm - see
 * `GetValueStepId` and `PopulateValueStep`.
 */
export declare class __ValueStep<TData> extends Step<TData> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    [$$noExec]: boolean;
    constructor(isImmutable: boolean);
    toStringMeta(): string | null;
    execute(): GrafastResultsList<TData>;
    get<TAttr extends keyof TData>(attrName: TAttr): AccessStep<TData[TAttr]>;
    at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]>;
}
//# sourceMappingURL=__value.d.ts.map