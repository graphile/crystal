import { flagError } from "../error.ts";
import { inspect } from "../inspect.ts";
import type { ExecutionDetails, GrafastResultsList } from "../interfaces.ts";
import { UnbatchedStep } from "../step.ts";
import { arrayOfLength } from "../utils.ts";

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
