import type { GraphQLInputType } from "graphql";
import * as graphql from "graphql";

import * as assert from "../assert.ts";
import { assertInputStep, inputStep } from "../input.ts";
import type { AnyInputStep, NotVariableValueNode } from "../interfaces.ts";
import { Step } from "../step.ts";
import { constant } from "./constant.ts";
import { list } from "./list.ts";

const { GraphQLList, Kind } = graphql;

/**
 * Implements `__InputListStep`.
 */
export class __InputListStep<
  TInputType extends
    graphql.GraphQLList<GraphQLInputType> = graphql.GraphQLList<GraphQLInputType>,
> extends Step {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputListStep",
  };
  isSyncAndSafe = true;

  private itemCount = 0;
  private readonly inputValues: NotVariableValueNode | undefined;

  constructor(
    inputType: TInputType,
    inputValues: NotVariableValueNode | undefined,
  ) {
    super();
    this.inputValues = inputValues;
    assert.ok(
      inputType instanceof GraphQLList,
      "Expected inputType to be a List",
    );
    const innerType = inputType.ofType;
    const values =
      inputValues === undefined
        ? undefined
        : inputValues.kind === Kind.LIST
          ? inputValues.values
          : inputValues.kind === Kind.NULL
            ? undefined // Really it's `null` but we don't care here
            : // Coerce to list
              [inputValues];
    if (values !== undefined) {
      for (
        let inputValueIndex = 0, inputValuesLength = values.length;
        inputValueIndex < inputValuesLength;
        inputValueIndex++
      ) {
        const inputValue = values[inputValueIndex];
        const innerPlan = inputStep(
          this.operationPlan,
          innerType,
          inputValue,
          undefined,
        );
        this.addDependency(innerPlan);
        this.itemCount++;
      }
    }
  }

  optimize(): Step {
    const { inputValues } = this;
    if (inputValues?.kind === "NullValue") {
      return constant(null);
    } else {
      const arr: Step[] = [];
      for (let idx = 0; idx < this.itemCount; idx++) {
        const itemPlan = this.getDep(idx);
        arr[idx] = itemPlan;
      }
      return list(arr);
    }
  }

  execute(): any[] {
    throw new Error(
      "__InputListStep should never execute; it should have been optimized away.",
    );
  }
  unbatchedExecute = (): any => {
    throw new Error(
      "__InputListStep should never execute; it should have been optimized away.",
    );
  };

  at(index: number): AnyInputStep {
    const itemPlan =
      index < this.itemCount ? this.getDep(index) : constant(undefined);
    assertInputStep(itemPlan);
    return itemPlan;
  }

  /** @internal */
  eval(): any[] | null {
    if (this.inputValues?.kind === "NullValue") {
      return null;
    }
    const list: any[] = [];
    for (
      let itemPlanIndex = 0;
      itemPlanIndex < this.itemCount;
      itemPlanIndex++
    ) {
      const itemPlan = this.getDep(itemPlanIndex);
      assertInputStep(itemPlan);
      const value = itemPlan.eval();
      list[itemPlanIndex] = value;
    }
    return list;
  }

  /** @internal */
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

  /** @internal */
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
