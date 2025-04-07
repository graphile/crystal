import { flagError } from "../error.js";
import { inspect } from "../inspect.js";
import type { ExecutionDetails, GrafastResultsList } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
import { arrayOfLength } from "../utils.js";

export class ErrorStep<TError extends Error> extends UnbatchedStep<never> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ErrorStep",
  };
  isSyncAndSafe = false;
  error: TError;
  constructor(error: TError) {
    super();
    if (!(error instanceof Error)) {
      throw new Error(`${this} called with non-Error ${inspect(error)}`);
    }
    this.error = error;
  }

  execute({ count }: ExecutionDetails): GrafastResultsList<any> {
    return arrayOfLength(count, flagError(this.error));
  }
  unbatchedExecute(): any {
    return flagError(this.error);
  }
}

export function error<TError extends Error>(error: TError): ErrorStep<TError> {
  return new ErrorStep(error);
}
