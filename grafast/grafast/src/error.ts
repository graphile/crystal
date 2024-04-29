import type { ExecutionEntryFlags } from "./interfaces.js";
import {
  $$safeError,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
} from "./interfaces.js";

export const $$flagged = Symbol("grafastFlaggedValue");

/**
 * Wrapper for errors to return (rather than throw or reject) from user code.
 *
 * @internal
 */
export interface FlaggedValue<TValue = any> {
  [$$flagged]: true;
  flags: ExecutionEntryFlags;
  value: TValue;
  planId: number | null;
}

function flaggedValue<T>(
  flags: ExecutionEntryFlags,
  value: any,
  planId: null | number,
): FlaggedValue<T> {
  return {
    [$$flagged]: true,
    flags,
    value,
    planId,
  };
}

export const $$inhibit = flaggedValue<null>(
  FLAG_NULL & FLAG_INHIBITED,
  null,
  null,
);

/**
 * Used to wrap error values to have Grafast treat them as if they were
 * thrown/rejected (rather than just regular values).
 */
export function flagError<TError extends Error = Error>(
  value: TError,
  planId: number | null = null,
): FlaggedValue<TError> {
  return flaggedValue(FLAG_ERROR, value, planId);
}

/**
 * Is this a flagged value?
 *
 * @internal
 */
export function isFlaggedValue(value: object): value is FlaggedValue {
  return typeof value !== null && Object.hasOwn(value, $$flagged);
}

export class SafeError<
  TExtensions extends Record<string, any> | undefined =
    | Record<string, any>
    | undefined,
> extends Error {
  static $$export = {
    moduleName: "grafast",
    exportName: "SafeError",
  };
  [$$safeError] = true;
  constructor(
    message: string,
    public extensions: TExtensions = undefined as TExtensions,
    errorOptions?: ErrorOptions,
  ) {
    super(message, errorOptions);
    Object.setPrototypeOf(this, SafeError.prototype);
  }
}

export function isSafeError(error: Error): error is SafeError {
  return (error as any)[$$safeError];
}
