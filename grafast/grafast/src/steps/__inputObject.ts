import type { GraphQLInputObjectType } from "graphql";
import * as graphql from "graphql";
import te from "tamedevil";

import { inputStep } from "../input.js";
import type {
  AnyInputStep,
  NotVariableValueNode,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { UnbatchedExecutableStep } from "../step.js";
import { defaultValueToValueNode } from "../utils.js";
import { constant } from "./constant.js";

const { Kind } = graphql;

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
    [fieldName: string]: { dependencyIndex: number; step: AnyInputStep };
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

  get(attrName: string): AnyInputStep {
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

  evalKeys(): ReadonlyArray<keyof TInputType & string> | null {
    if (this.inputValues === undefined) {
      return null;
    } else if (this.inputValues.kind === Kind.NULL) {
      return null;
    } else if (this.inputValues.kind !== Kind.OBJECT) {
      throw new Error("evalKeys must only be called for object types");
    }

    const keys: string[] = [];
    const inputFieldKeys = Object.keys(this.inputFields);
    for (let i = 0; i < inputFieldKeys.length; i++) {
      const key = inputFieldKeys[i];
      const inputFieldPlan = this.inputFields[key].step;

      // This evalIs() is required. With __inputObject we know that it's an
      // explicit input object (not variable) in the GraphQL document, but the
      // values of each key may still be undefined if they're a variable that
      // isn't supplied and has no default. In these cases we do not wish to
      // return these keys (since the input object is not seen as having those
      // keys set), but that will differ on an operation-to-operation basis,
      // and thus we must evaluate whether or not they are undefined. Note that
      // this implicitly adds constraints for these values; we do not need to
      // explicitly add any constraint for the object itself because the
      // document itself guarantees it will always be present.
      //
      // PERF: We should not need to .evalIs(undefined) for any input field
      // that is declared as non-nullable, I think?
      if (!inputFieldPlan.evalIs(undefined)) {
        keys.push(key);
      }
    }

    return keys as ReadonlyArray<keyof TInputType & string>;
  }
}

export type __InputObjectStepWithDollars<
  TInputType extends GraphQLInputObjectType = GraphQLInputObjectType,
> = __InputObjectStep<TInputType> & {
  [key in keyof ReturnType<TInputType["getFields"]> &
    string as `$${key}`]: AnyInputStep;
};
