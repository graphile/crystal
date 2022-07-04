import type {
  GraphQLScalarType,
  ListValueNode,
  ObjectValueNode,
  ValueNode,
} from "graphql";
import { Kind } from "graphql";

import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import type { __TrackedObjectStep } from "./__trackedObject.js";

/**
 * Handles "leaves" (scalars)
 */
export class __InputDynamicScalarStep<
  TLeaf = any,
> extends ExecutableStep<TLeaf> {
  static $$export = {
    moduleName: "dataplanner",
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
            this.aether.trackedVariableValuesStep.get(variableName);
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
          throw new Error("Enum values cannot be included within scalars");
        }
        default: {
          const never: never = inputValue;
          throw new Error(`Unsupported kind '${(never as ValueNode).kind}'`);
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
          throw new Error("Enum values cannot be included within scalars");
        }
        default: {
          const never: never = inputValue;
          throw new Error(`Unsupported kind '${(never as ValueNode).kind}'`);
        }
      }
    };
    return convert(this.value);
  }

  execute(values: [CrystalValuesList<TLeaf>]): CrystalResultsList<TLeaf> {
    return values[0].map((_, i) => {
      const variableValues = this.variableNames.map((_, j) => values[i][j]);
      const converted = this.valueFromValues(variableValues);
      console.dir({
        variableNames: this.variableNames,
        variableValues,
        converted,
      });
      return converted;
    });
  }

  eval(): TLeaf {
    const variableValues = this.variableNames.map((variableName, i) =>
      (this.getDep(i) as __TrackedObjectStep).eval(),
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
