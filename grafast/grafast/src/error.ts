import type { $$extensions } from "./interfaces.js";
import { $$safeError } from "./interfaces.js";

/**
 * Internally we wrap errors that occur in a GrafastError; this allows us to do
 * simple `instanceof` checks to see if a value is an actual value or an error.
 * Users should never use this class; it's for internal usage only.
 *
 * @internal
 */
export interface GrafastError extends Error {
  originalError: Error;
  [$$extensions]?: Record<string, any>;
}

export const $$error = Symbol("isGrafastError");

// IMPORTANT: this WILL NOT WORK when compiled down to ES5. It requires ES6+
// native class support.
/**
 * When an error occurs during plan execution we wrap it in a GrafastError so
 * that we can pass it around as a value.  It gets unwrapped and thrown in the
 * grafast resolver.
 *
 * @internal
 */
export const _GrafastError = class GrafastError
  extends Error
  implements GrafastError
{
  public readonly originalError: Error;
  extensions: Record<string, any>;
  [$$error] = true;
  constructor(originalError: Error, planId: number | null) {
    if (originalError instanceof _GrafastError) {
      throw new Error(
        "GrafastInternalError<62505509-8b21-4ef7-80f5-d0f99873174b>: attempted to wrap a GrafastError with a GrafastError.",
      );
    }
    const message = originalError?.message;
    super(message);
    Object.setPrototypeOf(this, GrafastError.prototype);
    this.originalError = originalError;
    this.extensions = { grafast: { planId } };
  }
};

/**
 * DO NOT ALLOW CONSTRUCTION OF ERRORS OUTSIDE OF THIS MODULE!
 *
 * @internal
 */
export function newGrafastError(error: Error, planId: number | null) {
  return new _GrafastError(error, planId);
}

/**
 * Is the given value a GrafastError? This is the only public API that people
 * should use for looking at GrafastErrors.
 */
export function isGrafastError(value: any): value is GrafastError {
  return typeof value === "object" && value !== null && $$error in value;
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
