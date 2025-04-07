import type {
  BooleanValueNode,
  EnumValueNode,
  FloatValueNode,
  GraphQLLeafType,
  IntValueNode,
  NullValueNode,
  StringValueNode,
} from "graphql";
import * as graphql from "graphql";

import { UnbatchedStep } from "../step.js";
import { constant } from "./constant.js";

const { valueFromAST } = graphql;

/**
 * Implements `InputStaticLeafStep`
 *
 * @see __InputDynamicScalarStep
 */
export class __InputStaticLeafStep<TLeaf = any> extends UnbatchedStep<TLeaf> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputStaticLeafStep",
  };
  isSyncAndSafe = true;

  private readonly coercedValue: any;
  constructor(
    inputType: GraphQLLeafType,
    value:
      | IntValueNode
      | FloatValueNode
      | StringValueNode
      | BooleanValueNode
      | NullValueNode
      | EnumValueNode
      | undefined,
  ) {
    super();
    // `coerceInputValue` throws on coercion failure. NOTE: it's only safe for
    // us to call coerceInputValue because we already know this is a scalar,
    // *not* a variable, and not an object/list therefore cannot _contain_ a
    // variable. Otherwise we'd need to process it via
    // operationPlan.trackedVariableValuesStep.
    this.coercedValue = value != null ? valueFromAST(value, inputType) : value;
  }

  unbatchedExecute(): TLeaf {
    return this.coercedValue;
  }

  optimize() {
    return constant(this.coercedValue, false);
  }

  /** @internal */
  eval(): TLeaf {
    return this.coercedValue;
  }

  /** @internal */
  evalIs(expectedValue: unknown): boolean {
    return this.coercedValue === expectedValue;
  }
}
