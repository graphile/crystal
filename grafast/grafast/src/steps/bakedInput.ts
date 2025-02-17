import type {
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLNullableType,
  GraphQLSchema,
} from "graphql";
import { isInputObjectType } from "graphql";

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
  extra: { type: GraphQLInputObjectType; schema: GraphQLSchema };
  constructor(type: GraphQLInputObjectType, $value: AnyInputStep) {
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
    if (value == null) return value;
    const bakedObj = this.extra.type.extensions!.grafast!.baked!(
      value as Record<string, any>,
      this.extra,
    );
    inputArgsApply(this.extra.type, bakedObj, value, undefined);
    return bakedObj;
  }
}

/**
 * Takes a input type and matching value and performs runtime conversion of
 * that type to the internal representation (if any).
 */
export function bakedInput<TArg = any>(
  inputType: GraphQLInputType & GraphQLNullableType,
  $value: AnyInputStep,
) {
  // Could have done this in `optimize()` but faster to do it here.
  if (
    !isInputObjectType(inputType) ||
    typeof inputType.extensions?.grafast?.baked !== "function"
  ) {
    // Nothing special, we just return the input.
    return $value;
  } else {
    // Ooo, we're fancy! Do the thing!
    return new BakedInputStep<TArg>(inputType, $value);
  }
}
