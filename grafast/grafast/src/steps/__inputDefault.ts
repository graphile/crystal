import type { UnbatchedExecutionExtra } from "../interfaces.ts";
import { UnbatchedStep } from "../step.ts";
import type { __TrackedValueStep } from "./__trackedValue.ts";

export class __InputDefaultStep extends UnbatchedStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputDefaultStep",
  };
  isSyncAndSafe = true;
  private defaultValue: unknown;

  constructor(
    $variableValue: __TrackedValueStep,
    defaultValue: unknown,
  ) {
    super();
    this.defaultValue = defaultValue;
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
