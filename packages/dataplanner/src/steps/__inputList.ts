import assert from "assert";
import type { GraphQLInputType, ValueNode } from "graphql";
import { GraphQLList, Kind } from "graphql";

import type { InputStep } from "../input.js";
import { assertInputStep, inputPlan } from "../input.js";
import { ExecutableStep } from "../step.js";
import { constant } from "./constant.js";

/**
 * Implements `__InputListStep`.
 */
export class __InputListStep extends ExecutableStep {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "__InputListStep",
  };
  isSyncAndSafe = true;

  private itemPlanIds: string[] = [];
  private outOfBoundsStepId: string;

  constructor(
    inputType: GraphQLList<GraphQLInputType>,
    private readonly inputValues: ValueNode | undefined,
  ) {
    super();
    assert.ok(
      inputType instanceof GraphQLList,
      "Expected inputType to be a List",
    );
    const innerType = inputType.ofType;
    const values =
      inputValues?.kind === Kind.LIST
        ? inputValues.values
        : inputValues?.kind === Kind.NULL
        ? null
        : inputValues
        ? [inputValues]
        : inputValues;
    if (values) {
      for (
        let inputValueIndex = 0, inputValuesLength = values.length;
        inputValueIndex < inputValuesLength;
        inputValueIndex++
      ) {
        const inputValue = values[inputValueIndex];
        const innerPlan = inputPlan(this.opPlan, innerType, inputValue);
        this.itemPlanIds.push(innerPlan.id);
        this.addDependency(innerPlan);
      }
    }
    // TODO: is `outOfBoundsPlan` safe? Maybe it was before we simplified
    // `InputNonNullStep`, but maybe it's not safe any more?
    this.outOfBoundsStepId = inputPlan(this.opPlan, innerType, undefined).id;
  }

  optimize() {
    const { inputValues } = this;
    if (inputValues?.kind === "NullValue") {
      return constant(null);
    } else {
      const itemPlansLength = this.itemPlanIds.length;
      const list: any[] = [];
      for (
        let itemPlanIndex = 0;
        itemPlanIndex < itemPlansLength;
        itemPlanIndex++
      ) {
        const itemStepId = this.itemPlanIds[itemPlanIndex];
        const itemPlan = this.opPlan.dangerouslyGetStep(itemStepId);
        assertInputStep(itemPlan);
        const value = itemPlan.eval();
        list[itemPlanIndex] = value;
      }
      return constant(list);
    }
  }

  execute(): any[] {
    throw new Error(
      "__InputListStep should never execute; it should have been optimized away.",
    );
  }

  at(index: number): InputStep {
    const itemStepId = this.itemPlanIds[index];
    const outOfBoundsPlan = this.getStep(this.outOfBoundsStepId);
    const itemPlan = itemStepId ? this.getStep(itemStepId) : outOfBoundsPlan;
    assertInputStep(itemPlan);
    return itemPlan;
  }

  eval(): any[] | null {
    if (this.inputValues?.kind === "NullValue") {
      return null;
    }
    const itemPlansLength = this.itemPlanIds.length;
    const list: any[] = [];
    for (
      let itemPlanIndex = 0;
      itemPlanIndex < itemPlansLength;
      itemPlanIndex++
    ) {
      const itemStepId = this.itemPlanIds[itemPlanIndex];
      const itemPlan = this.getStep(itemStepId);
      assertInputStep(itemPlan);
      const value = itemPlan.eval();
      list[itemPlanIndex] = value;
    }
    return list;
  }

  evalIs(value: null | undefined | 0): boolean {
    if (value === undefined) {
      return this.inputValues === value;
    } else if (value === null) {
      return this.inputValues?.kind === "NullValue";
    } else {
      throw new Error(
        "__InputListStep cannot evalIs values other than null and undefined currently",
      );
    }
  }

  evalLength(): number | null {
    if (this.inputValues === undefined) {
      return null;
    } else if (this.inputValues.kind === Kind.NULL) {
      return null;
    } else if (this.inputValues.kind === Kind.LIST) {
      return this.inputValues.values.length;
    } else {
      // Coercion to list
      return 1;
    }
  }
}
