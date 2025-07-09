import type { ExecutionEntryFlags } from "./interfaces.js";
import { $$safeError } from "./interfaces.js";
declare const $$flagged: unique symbol;
/**
 * Wrapper for errors to return (rather than throw or reject) from user code.
 */
export interface FlaggedValue<TValue = any> {
    [$$flagged]: true;
    flags: ExecutionEntryFlags;
    value: TValue;
    planId: number | null;
    toString(): string;
}
export declare const $$inhibit: FlaggedValue<null>;
/**
 * Used to wrap error values to have Grafast treat them as if they were
 * thrown/rejected (rather than just regular values).
 */
export declare function flagError<TError extends Error = Error>(value: TError, planId?: number | null): FlaggedValue<TError>;
export declare class SafeError<TExtensions extends Record<string, any> | undefined = Record<string, any> | undefined> extends Error {
    extensions: TExtensions;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    [$$safeError]: boolean;
    constructor(message: string, extensions?: TExtensions, errorOptions?: ErrorOptions);
}
export declare function isSafeError(error: Error): error is SafeError;
export {};
//# sourceMappingURL=error.d.ts.map