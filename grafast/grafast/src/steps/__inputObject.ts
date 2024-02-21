import type { GraphQLInputObjectType } from "graphql";
import te from "tamedevil";

import { inputStep } from "../input.js";
import type {
  InputStep,
  NotVariableValueNode,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { UnbatchedExecutableStep } from "../step.js";
import { defaultValueToValueNode } from "../utils.js";
import { constant } from "./constant.js";

/**
 * Implements `InputObjectStep`
 */
export class __InputObjectStep<
  TInputType extends GraphQLInputObjectType = GraphQLInputObjectType,
> extends UnbatchedExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputObjectStep",
  };
  isSyncAndSafe = true;

  private inputFields: {
    [fieldName: string]: { dependencyIndex: number; step: InputStep };
  } = Object.create(null);
  constructor(
    private inputObjectType: TInputType,
    private inputValues: NotVariableValueNode | undefined,
  ) {
    super();
    const inputFieldDefinitions = inputObjectType.getFields();
    const inputFields =
      inputValues?.kind === "ObjectValue" ? inputValues.fields : undefined;
    for (const inputFieldName in inputFieldDefinitions) {
      const inputFieldDefinition = inputFieldDefinitions[inputFieldName];
      const inputFieldType = inputFieldDefinition.type;
      const defaultValue =
        inputFieldDefinition.defaultValue !== undefined
          ? defaultValueToValueNode(
              inputFieldType,
              inputFieldDefinition.defaultValue,
            )
          : undefined;
      const inputFieldValue = inputFields?.find(
        (val) => val.name.value === inputFieldName,
      );
      const step = inputStep(
        this.operationPlan,
        inputFieldType,
        inputFieldValue?.value,
        defaultValue,
      );
      this.inputFields[inputFieldName] = {
        step,
        dependencyIndex: this.addDependency(step),
      };
      Object.defineProperty(this, `$${inputFieldName}`, {
        value: step,
      });
    }
  }

  optimize() {
    if (this.inputValues?.kind === "NullValue") {
      return constant(null);
    }
    return this;
  }

  finalize() {
    te.runInBatch<typeof this.unbatchedExecute>(
      te`(function (extra, ${te.join(
        this.dependencies.map((_, dependencyIndex) =>
          te.identifier(`val${dependencyIndex}`),
        ),
        ", ",
      )}) {
  const resultValues = Object.create(null);
  ${te.join(
    Object.entries(this.inputFields).map(
      ([inputFieldName, { dependencyIndex }]) => {
        if (dependencyIndex == null) {
          throw new Error("inputFieldPlan has gone missing.");
        }
        return te`\
  resultValues${te.set(inputFieldName, true)} = ${te.identifier(
    `val${dependencyIndex}`,
  )};`;
      },
    ),
    "\n",
  )}
  return resultValues;
})`,
      (fn) => {
        this.unbatchedExecute = fn;
      },
    );
    super.finalize();
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, ...values: any[]) {
    const resultValues = Object.create(null);
    for (const inputFieldName in this.inputFields) {
      const dependencyIndex = this.inputFields[inputFieldName].dependencyIndex;
      if (dependencyIndex == null) {
        throw new Error("inputFieldPlan has gone missing.");
      }
      const value = values[dependencyIndex];
      resultValues[inputFieldName] = value;
    }
    return resultValues;
  }

  get(attrName: string): InputStep {
    const step = this.inputFields[attrName]?.step;
    if (step === undefined) {
      throw new Error(
        `Tried to '.get("${attrName}")', but no such attribute exists on ${this.inputObjectType.name}`,
      );
    }
    return step;
  }

  eval(): any {
    if (this.inputValues?.kind === "NullValue") {
      return null;
    }
    const resultValues = Object.create(null);
    for (const inputFieldName in this.inputFields) {
      const inputFieldPlan = this.inputFields[inputFieldName].step;
      resultValues[inputFieldName] = inputFieldPlan.eval();
    }
    return resultValues;
  }

  evalIs(value: null | undefined | 0): boolean {
    if (value === undefined) {
      return this.inputValues === value;
    } else if (value === null) {
      return this.inputValues?.kind === "NullValue";
    } else if (value === 0) {
      return (
        this.inputValues?.kind === "IntValue" && this.inputValues.value === "0"
      );
    } else {
      throw new Error(
        "__InputObjectStep cannot evalIs values other than null and undefined currently",
      );
    }
  }

  evalIsEmpty(): boolean {
    return (
      this.inputValues?.kind === "ObjectValue" &&
      this.inputValues.fields.length === 0
    );
  }

  // Written without consulting spec.
  evalHas(attrName: string): boolean {
    if (!this.inputValues) {
      return false;
    }
    if (this.inputValues.kind === "NullValue") {
      return false;
    }
    if (!(attrName in this.inputFields)) {
      return false;
    }
    return !this.inputFields[attrName].step.evalIs(undefined);
  }
}

export type __InputObjectStepWithDollars<
  TInputType extends GraphQLInputObjectType = GraphQLInputObjectType,
> = __InputObjectStep<TInputType> & {
  [key in keyof ReturnType<TInputType["getFields"]> &
    string as `$${key}`]: InputStep<
    ReturnType<TInputType["getFields"]>[key]["type"]
  >;
};
