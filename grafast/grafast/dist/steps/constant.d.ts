import type { ExecutionDetails, GrafastResultsList, JSONValue } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
/**
 * Converts a constant value (e.g. a string/number/etc) into a plan
 */
export declare class ConstantStep<TData> extends UnbatchedStep<TData> {
    readonly data: TData;
    readonly isSensitive: boolean;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    constructor(data: TData, isSensitive?: boolean);
    toStringMeta(): string;
    planJSONExtra(): undefined | Record<string, JSONValue>;
    deduplicate(peers: readonly ConstantStep<any>[]): ConstantStep<any>[];
    execute({ count }: ExecutionDetails): GrafastResultsList<TData>;
    unbatchedExecute(): TData;
    isNull(): boolean;
    isUndefined(): boolean;
    get(key: string): ConstantStep<any>;
    at(index: number): ConstantStep<any>;
}
/**
 * Call this as a template string or as a function. Only intended for handling
 * scalar values, not arrays/objects/etc.
 */
export declare function constant<const TString extends string>(strings: TemplateStringsArray & [TString]): ConstantStep<TString>;
export declare function constant<TData>(data: TData, isSecret?: boolean): ConstantStep<TData>;
//# sourceMappingURL=constant.d.ts.map