import type { UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
/**
 * Accesses a (potentially nested) property from the result of a plan.
 *
 * NOTE: this could lead to unexpected results (which could introduce security
 * issues) if it is not used carefully; only use it on JSON-like data,
 * preferably where the objects have null prototypes, and be sure to adhere to
 * the naming conventions detailed in assertSafeToAccessViaBraces.
 */
export declare class AccessStep<TData> extends UnbatchedStep<TData> {
    readonly fallback?: any | undefined;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    readonly path: (string | number | symbol)[];
    private readonly hasSymbols;
    constructor(parentPlan: Step<unknown>, path: (string | number | symbol)[], fallback?: any | undefined);
    toStringMeta(): string;
    getParentStep(): Step<any> | import("./__flag.js").__FlagStep<Step<any>>;
    /**
     * Get the named property of an object.
     */
    get<TAttr extends keyof TData>(attrName: TAttr): AccessStep<TData[TAttr]>;
    /**
     * Get the entry at the given index in an array.
     */
    at<TIndex extends keyof TData>(index: TIndex): AccessStep<TData[TIndex]>;
    optimize(): AccessStep<TData>;
    finalize(): void;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, ..._values: any[]): any;
    deduplicate(peers: AccessStep<unknown>[]): AccessStep<TData>[];
}
/**
 * Access the property at path `path` in the value returned from `parentPlan`,
 * falling back to `fallback` if it were null-ish.
 */
export declare function access<TData>(parentPlan: Step<unknown>, rawPath?: (string | number | symbol)[] | string | number | symbol, fallback?: any): AccessStep<TData>;
//# sourceMappingURL=access.d.ts.map