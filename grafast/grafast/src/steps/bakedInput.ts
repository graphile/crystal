import type {
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLList,
  GraphQLSchema,
} from "graphql";
import { getNullableType, isInputObjectType, isListType } from "graphql";

import { operationPlan } from "../global.ts";
import type { UnbatchedExecutionExtra } from "../interfaces.ts";
import type { Step } from "../step.ts";
import { UnbatchedStep } from "../step.ts";
import { inputArgsApply } from "./applyInput.ts";

export class BakedInputStep<TData = any> extends UnbatchedStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "BakedInputStep",
  };
  public isSyncAndSafe = true;

  valueDepId: 0;
  private inputType: GraphQLInputObjectType | GraphQLList<any>;
  constructor(
    inputType: GraphQLInputObjectType | GraphQLList<any>,
    $value: Step,
  ) {
    super();
    this.inputType = inputType;
    this.valueDepId = this.addUnaryDependency($value) as 0;
    if (!this._isUnary) {
      throw new Error(`bakedInput() must be unary`);
    }
    this._isUnaryLocked = true;
  }

  public deduplicate(peers: readonly BakedInputStep[]) {
    return peers.filter((p) => p.inputType === this.inputType);
  }

  unbatchedExecute(extra: UnbatchedExecutionExtra, value: unknown) {
    if (value == null) return value as TData;
    return bakedInputRuntime(
      this.operationPlan.schema,
      this.inputType,
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
  $value: Step,
) {
  const nullableInputType = getNullableType(inputType);
  // Could have done this in `optimize()` but faster to do it here.
  if (
    isListType(nullableInputType) ||
    (isInputObjectType(nullableInputType) &&
      typeof nullableInputType.extensions?.grafast?.baked === "function")
  ) {
    // Ooo, we're fancy! Do the thing!
    return operationPlan().withRootLayerPlan(
      () => new BakedInputStep<TArg>(nullableInputType, $value),
    );
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
        inputArgsApply(
          schema,
          nullableInputType,
          parent,
          value,
          undefined,
          undefined,
        );
      },
    });
    if (!applied) {
      inputArgsApply(
        schema,
        nullableInputType,
        bakedObj,
        value,
        undefined,
        undefined,
      );
    }
    return bakedObj;
  }
}
