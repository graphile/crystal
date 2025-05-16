import { FLAG_INHIBITED, FLAG_NULL } from "../constants.js";
import type { Maybe, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

export class CoalesceStep<T> extends UnbatchedExecutableStep<Maybe<T>> {
  static $$export = {
    moduleName: "grafast",
    exportName: "CoalesceStep",
  };
  isSyncAndSafe = true;

  constructor(steps: ReadonlyArray<Step<Maybe<T>>>) {
    super();
    this.allowMultipleOptimizations = true;
    for (const step of steps) {
      this.addDataDependency({
        step,
        acceptFlags: FLAG_INHIBITED | FLAG_NULL,
      });
    }
  }

  unbatchedExecute(
    _info: UnbatchedExecutionExtra,
    ...values: ReadonlyArray<T | null>
  ) {
    return values.find((v) => v != null);
  }
}

export function coalesce<T>(
  steps: ReadonlyArray<Step<Maybe<T>>>,
): CoalesceStep<T> {
  return new CoalesceStep(steps);
}
