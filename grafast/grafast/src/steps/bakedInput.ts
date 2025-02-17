import type {
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLList,
  GraphQLNullableType,
  GraphQLSchema,
} from "graphql";
import { getNullableType, isInputObjectType, isListType } from "graphql";

import type { AnyInputStep, UnbatchedExecutionExtra } from "../interfaces.js";
import { UnbatchedExecutableStep } from "../step.js";
import { inputArgsApply } from "./applyInput.js";

export class BakedInputStep<
  TData = any,
> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "BakedInputStep",
  };
  public isSyncAndSafe = true;

  valueDepId: 0;
  extra: {
    type: GraphQLInputObjectType | GraphQLList<any>;
    schema: GraphQLSchema;
  };
  constructor(
    type: GraphQLInputObjectType | GraphQLList<any>,
    $value: AnyInputStep,
  ) {
    super();
    this.valueDepId = this.addUnaryDependency($value) as 0;
    if (!this._isUnary) {
      throw new Error(`bakedInput() must be unary`);
    }
    this._isUnaryLocked = true;
    const { schema } = this.operationPlan;
    this.extra = { type, schema };
  }

  unbatchedExecute(extra: UnbatchedExecutionExtra, value: unknown) {
    if (value == null) return value as TData;
    return bakedInputRuntime(
      this.extra.schema,
      this.extra.type,
      value,
    ) as TData;
  }
}

/**
 * Takes a input type and matching value and performs runtime conversion of
 * that type to the internal representation (if any).
 */
export function bakedInput<TArg = any>(
  inputType: GraphQLInputType,
  $value: AnyInputStep,
) {
  const nullableInputType = getNullableType(inputType);
  // Could have done this in `optimize()` but faster to do it here.
  if (
    isListType(nullableInputType) ||
    (isInputObjectType(nullableInputType) &&
      typeof nullableInputType.extensions?.grafast?.baked === "function")
  ) {
    // Ooo, we're fancy! Do the thing!
    return new BakedInputStep<TArg>(nullableInputType, $value);
  } else {
    // Nothing special, we just return the input.
    return $value;
  }
}

export function bakedInputRuntime(
  schema: GraphQLSchema,
  inputType: GraphQLInputType,
  value: unknown,
): unknown {
  if (value == null) return value;
  const nullableInputType = getNullableType(inputType);
  if (isListType(nullableInputType)) {
    if (Array.isArray(value)) {
      return value.map((v) =>
        bakedInputRuntime(schema, nullableInputType.ofType, v),
      );
    } else {
      throw new Error(
        `Failed to process input for type ${inputType} - expected array`,
      );
    }
  }
  // Could have done this in `optimize()` but faster to do it here.
  const baked = isInputObjectType(nullableInputType)
    ? nullableInputType.extensions?.grafast?.baked
    : null;
  if (typeof baked !== "function") {
    // Nothing special, we just return the input.
    return value;
  } else {
    // Ooo, we're fancy! Do the thing!
    let applied = false;
    const bakedObj = baked!(value as Record<string, any>, {
      type: nullableInputType as GraphQLInputObjectType,
      schema,
      applyChildren(parent) {
        applied = true;
        inputArgsApply(schema, nullableInputType, parent, value, undefined);
      },
    });
    if (!applied) {
      inputArgsApply(schema, nullableInputType, bakedObj, value, undefined);
    }
    return bakedObj;
  }
}
