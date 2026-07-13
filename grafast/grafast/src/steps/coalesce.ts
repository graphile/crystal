import { FLAG_INHIBITED, FLAG_NULL } from "../constants.ts";
import type { Maybe, UnbatchedExecutionExtra } from "../interfaces.ts";
import type { Step } from "../step.ts";
import { UnbatchedStep } from "../step.ts";
import { constant } from "./constant.ts";

type UBE = (
  _info: UnbatchedExecutionExtra,
  ...values: ReadonlyArray<any>
) => any;

const ube0: UBE = () => null;
const ube1: UBE = (_info, a) => a ?? null;
const ube2: UBE = (_info, a, b) => a ?? b ?? null;
const ube3: UBE = (_info, a, b, c) => a ?? b ?? c ?? null;
const ube4: UBE = (_info, a, b, c, d) => a ?? b ?? c ?? d ?? null;

export class CoalesceStep<T> extends UnbatchedStep<T | null> {
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

  finalize() {
    // Use optimal callback functions rather than looping
    const l = this.dependencies.length;
    if (l === 0) this.unbatchedExecute = ube0;
    else if (l === 1) this.unbatchedExecute = ube1;
    else if (l === 2) this.unbatchedExecute = ube2;
    else if (l === 3) this.unbatchedExecute = ube3;
    else if (l === 4) this.unbatchedExecute = ube4;
    else {
      // Keep default
    }
  }

  unbatchedExecute(
    _info: UnbatchedExecutionExtra,
    ...values: ReadonlyArray<T | null>
  ) {
    return values.find((v) => v != null) ?? null;
  }
}

export function coalesce<T>(
  steps: ReadonlyArray<Step<Maybe<T>>>,
): CoalesceStep<T>;
export function coalesce<T>(
  ...steps: ReadonlyArray<Step<Maybe<T>>>
): CoalesceStep<T>;
export function coalesce<T>(
  ...input: ReadonlyArray<Step<Maybe<T>>> | [ReadonlyArray<Step<Maybe<T>>>]
): Step<T | null> {
  const list = Array.isArray(input[0])
    ? input[0]
    : (input as ReadonlyArray<Step<Maybe<T>>>);

  if (list.length === 0) {
    return constant(null);
  }

  return new CoalesceStep(list);
}
