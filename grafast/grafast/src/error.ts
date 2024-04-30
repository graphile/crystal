import { inspect } from "./inspect.js";
import type { ExecutionEntryFlags } from "./interfaces.js";
import {
  $$safeError,
  FLAG_ERROR,
  FLAG_INHIBITED,
  FLAG_NULL,
} from "./interfaces.js";

const $$flagged = Symbol("grafastFlaggedValue");

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
  toString(): string;
}

function flaggedValueToString(this: FlaggedValue) {
  if (this.flags & FLAG_ERROR && this.value instanceof Error) {
    return String(this.value);
  } else if (this.flags & FLAG_INHIBITED && this.value === null) {
    return "INHIBIT";
  } else {
    return `${this.flags}/${inspect(this.value)}`;
  }
}

function flaggedValue<T>(
  flags: ExecutionEntryFlags,
  value: any,
  planId: null | number,
): FlaggedValue<T> {
  if (value === null && !(flags & FLAG_NULL)) {
    throw new Error(`flaggedValue called with null, but not flagged as null.`);
  }
  if (value === null && !(flags & FLAG_INHIBITED)) {
    throw new Error(
      `flaggedValue called with null, but not flagged as inhibited.`,
    );
  }
  return {
    [$$flagged]: true,
    flags,
    value,
    planId,
    toString: flaggedValueToString,
  };
}

export const $$inhibit = flaggedValue<null>(
  FLAG_NULL | FLAG_INHIBITED,
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
  return value !== null && Object.hasOwn(value, $$flagged);
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
