import type {
  GraphQLScalarType,
  ListValueNode,
  ObjectValueNode,
  ValueNode,
} from "graphql";
import * as graphql from "graphql";

import { SafeError } from "../error.js";
import type { ExecutionExtra } from "../interfaces.js";
import { UnbatchedExecutableStep } from "../step.js";
import type { __TrackedValueStep } from "./__trackedValue.js";

const { Kind } = graphql;

/**
 * Handles "leaves" (scalars)
 */
export class __InputDynamicScalarStep<
  TLeaf = any,
> extends UnbatchedExecutableStep<TLeaf> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputDynamicScalarStep",
  };
  isSyncAndSafe = true;
  private variableNames: string[] = [];

  constructor(
    inputType: GraphQLScalarType,
    private value: ListValueNode | ObjectValueNode,
  ) {
    super();
    // Walk value and add any variable references as dependencies
    const walk = (inputValue: ValueNode): void => {
      switch (inputValue.kind) {
        case Kind.VARIABLE: {
          const variableName = inputValue.name.value;
          this.variableNames.push(variableName);
          const variableValuePlan =
            this.operationPlan.trackedVariableValuesStep.get(variableName);
          this.addDependency(variableValuePlan);
          return;
        }
        case Kind.INT:
        case Kind.FLOAT:
        case Kind.STRING:
        case Kind.BOOLEAN:
        case Kind.NULL: {
          // No need to take action
          return;
        }
        case Kind.LIST: {
          inputValue.values.map(walk);
          return;
        }
        case Kind.OBJECT: {
          for (const field of inputValue.fields) {
            walk(field.value);
          }
          return;
        }
        case Kind.ENUM: {
          throw new SafeError("Enum values cannot be included within scalars");
        }
        default: {
          const never: never = inputValue;
          throw new SafeError(
            `Unsupported kind '${(never as ValueNode).kind}'`,
          );
        }
      }
    };
    walk(value);
  }

  valueFromValues(variableValues: any[]): any {
    const convert = (inputValue: ValueNode): any => {
      switch (inputValue.kind) {
        case Kind.VARIABLE: {
          const variableName = inputValue.name.value;
          const variableIndex = this.variableNames.indexOf(variableName);
          return variableValues[variableIndex];
        }
        case Kind.INT: {
          return parseInt(inputValue.value, 10);
        }
        case Kind.FLOAT: {
          return parseFloat(inputValue.value);
        }
        case Kind.STRING: {
          return inputValue.value;
        }
        case Kind.BOOLEAN: {
          return inputValue.value;
        }
        case Kind.NULL: {
          return null;
        }
        case Kind.LIST: {
          return inputValue.values.map(convert);
        }
        case Kind.OBJECT: {
          const obj = Object.create(null);
          for (const field of inputValue.fields) {
            obj[field.name.value] = convert(field.value);
          }
          return obj;
        }
        case Kind.ENUM: {
          throw new SafeError("Enum values cannot be included within scalars");
        }
        default: {
          const never: never = inputValue;
          throw new SafeError(
            `Unsupported kind '${(never as ValueNode).kind}'`,
          );
        }
      }
    };
    return convert(this.value);
  }

  unbatchedExecute = (
    extra: ExecutionExtra,
    ...variableValues: any[]
  ): TLeaf => {
    const converted = this.valueFromValues(variableValues);
    return converted;
  };

  eval(): TLeaf {
    const variableValues = this.variableNames.map((variableName, i) =>
      (this.getDep(i) as __TrackedValueStep).eval(),
    );
    return this.valueFromValues(variableValues);
  }

  evalIs(expectedValue: undefined | null | 0): boolean {
    if (
      expectedValue === undefined ||
      expectedValue === null ||
      expectedValue === 0
    ) {
      return false;
    } else {
      throw new Error(
        "__InputDynamicScalarStep doesn't support evalIs on non-null, non-undefined, non-0 values",
      );
    }
  }
}
