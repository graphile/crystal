import type { GraphQLLeafType, ValueNode } from "graphql";
import { valueFromAST } from "graphql";

import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutablePlan } from "../plan.js";
import { arrayOfLength } from "../utils.js";

/**
 * Implements `InputStaticLeafPlan`
 */
export class __InputStaticLeafPlan<TLeaf = any> extends ExecutablePlan<TLeaf> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "__InputStaticLeafPlan",
  };
  isSyncAndSafe = true;

  private readonly coercedValue: any;
  constructor(inputType: GraphQLLeafType, value: ValueNode | undefined) {
    super();
    // `coerceInputValue` throws on coercion failure. NOTE: it's only safe for
    // us to call coerceInputValue because we already know this is a scalar and
    // *not* a variable. Otherwise we'd need to process it via
    // aether.trackedVariableValuesPlan.
    // TODO: validate this is safe.
    this.coercedValue = value != null ? valueFromAST(value, inputType) : value;
  }

  execute(values: [CrystalValuesList<TLeaf>]): CrystalResultsList<TLeaf> {
    return arrayOfLength(values[0].length, this.coercedValue);
  }

  eval(): TLeaf {
    return this.coercedValue;
  }

  evalIs(expectedValue: unknown): boolean {
    return this.coercedValue === expectedValue;
  }
}
