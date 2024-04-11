import type { ExecutableStep, UnbatchedExecutionExtra } from "..";
import { UnbatchedExecutableStep } from "../step.js";

const unaryOperators = ["null", "not null", "nullish", "not nullish"] as const;
type UnaryOperator = (typeof unaryOperators)[number];
const binaryOperators = ["equal", "not equal"] as const;
type BinaryOperator = (typeof binaryOperators)[number];
type Operator = UnaryOperator | BinaryOperator;

export class CompareStep extends UnbatchedExecutableStep<boolean> {
  static $$export = {
    moduleName: "grafast",
    exportName: "CompareStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;
  constructor(
    private op: Operator,
    step1: Step,
    step2?: Step,
  ) {
    super();
    if (!step2) {
      // unary
      if (!unaryOperators.includes(op as UnaryOperator)) {
        throw new Error(
          `Unary operator '${op}' is not known; supported operators: ${unaryOperators.join(
            ", ",
          )}`,
        );
      }
      this.addDependency(step1);
    } else {
      // binary
      if (!binaryOperators.includes(op as BinaryOperator)) {
        throw new Error(
          `Unary operator '${op}' is not known; supported operators: ${binaryOperators.join(
            ", ",
          )}`,
        );
      }
      this.addDependency(step1);
      this.addDependency(step2);
    }
  }
  public toStringMeta(): string | null {
    if (unaryOperators.includes(this.op as UnaryOperator)) {
      return `${this.op}`;
    } else {
      const $dep1 = this.getDepOptions(0).step;
      const $dep2 = this.getDepOptions(1).step;
      return `${$dep1.id} ${this.op} ${$dep2.id}`;
    }
  }

  finalize() {
    this.unbatchedExecute = this.makeUnbatchedExecute();
    super.finalize();
  }
  private makeUnbatchedExecute() {
    switch (this.op) {
      case "null":
        return isNull;
      case "not null":
        return isNotNull;
      case "nullish":
        return isNullish;
      case "not nullish":
        return isNotNullish;
      case "equal":
        return isEqual;
      case "not equal":
        return isNotEqual;
      default: {
        const never: never = this.op;
        throw new Error(`Operator ${never} is not supported`);
      }
    }
  }

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    _value1: any,
    _value2: any,
  ): boolean {
    throw new Error(`${this} was not finalized?`);
  }
}
function isNull(_extra: UnbatchedExecutionExtra, value1: any): boolean {
  return value1 === null;
}
function isNotNull(_extra: UnbatchedExecutionExtra, value1: any): boolean {
  return value1 !== null;
}
function isNullish(_extra: UnbatchedExecutionExtra, value1: any): boolean {
  return value1 == null;
}
function isNotNullish(_extra: UnbatchedExecutionExtra, value1: any): boolean {
  return value1 != null;
}
function isEqual(
  _extra: UnbatchedExecutionExtra,
  value1: any,
  value2: any,
): boolean {
  return value1 === value2;
}
function isNotEqual(
  _extra: UnbatchedExecutionExtra,
  value1: any,
  value2: any,
): boolean {
  return value1 !== value2;
}

type Step<T = any> = ExecutableStep<T>;
type $Boolean = ExecutableStep<boolean>;
function compare(op: "null", step: Step): $Boolean;
function compare(op: "not null", step: Step): $Boolean;
function compare(op: "nullish", step: Step): $Boolean;
function compare(op: "not nullish", step: Step): $Boolean;
function compare(op: "equal", step1: Step, step2: Step): $Boolean;
function compare(op: "not equal", step1: Step, step2: Step): $Boolean;
function compare(op: Operator, step1: Step, step2?: Step): $Boolean {
  return new CompareStep(op, step1, step2);
}

export { compare };
