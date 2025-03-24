import type { UnbatchedExecutionExtra } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
import type { __TrackedValueStep } from "./__trackedValue.js";

export class __InputDefaultStep extends UnbatchedStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputDefaultStep",
  };
  isSyncAndSafe = true;

  constructor(
    $variableValue: __TrackedValueStep,
    private defaultValue: unknown,
  ) {
    super();
    this.addUnaryDependency($variableValue);
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, variableValue: unknown) {
    return variableValue === undefined ? this.defaultValue : variableValue;
  }

  /** @internal */
  eval(): any {
    const $variable = this.getDep(0) as __TrackedValueStep;
    const variableValue = $variable.eval();
    return variableValue === undefined ? this.defaultValue : variableValue;
  }

  /** @internal */
  evalIs(value: null | undefined | 0): boolean {
    if (value === undefined) {
      return false;
    } else {
      const $variable = this.getDep(0) as __TrackedValueStep;
      return $variable.evalIs(undefined)
        ? this.defaultValue === value
        : $variable.evalIs(value);
    }
  }

  /** @internal */
  evalLength(): number | null {
    const $variable = this.getDep(0) as __TrackedValueStep;
    return $variable.evalIs(undefined)
      ? Array.isArray(this.defaultValue)
        ? this.defaultValue.length
        : null
      : $variable.evalLength();
  }
}
