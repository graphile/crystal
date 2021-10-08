import chalk from "chalk";

import { getCurrentParentPathIdentity } from "../global";
import { ExecutablePlan } from "../plan";

export class __ListItemPlan<
  TParentPlan extends ExecutablePlan<ReadonlyArray<any>>,
> extends ExecutablePlan<
  TParentPlan extends ExecutablePlan<ReadonlyArray<infer U>> ? U : never
> {
  constructor(parentPlan: TParentPlan, public readonly depth: number) {
    super();
    this.addDependency(parentPlan);
    this.parentPathIdentity = getCurrentParentPathIdentity();
  }

  toStringMeta(): string {
    return chalk.bold.yellow(String(this.dependencies[0]));
  }

  execute(): never {
    throw new Error("__ListItemPlan must never execute");
  }
}

export interface ListCapablePlan<
  TOutputData extends any,
  TItemPlan extends ExecutablePlan<TOutputData> = ExecutablePlan<TOutputData>,
> extends ExecutablePlan<ReadonlyArray<any>> {
  listItem(itemPlan: __ListItemPlan<this>): TItemPlan;
}

export function isListCapablePlan<
  TData,
  TItemPlan extends ExecutablePlan<TData>,
>(
  plan: ExecutablePlan<ReadonlyArray<TData>>,
): plan is ListCapablePlan<TData, TItemPlan> {
  return "listItem" in plan && typeof (plan as any).listItem === "function";
}

export function assertListCapablePlan<
  TData,
  TItemPlan extends ExecutablePlan<TData>,
>(
  plan: ExecutablePlan<ReadonlyArray<TData>>,
  pathIdentity: string,
): asserts plan is ListCapablePlan<TData, TItemPlan> {
  if (!isListCapablePlan(plan)) {
    throw new Error(
      `The plan returned from '${pathIdentity}' should be a list capable plan, but it does not implement the 'listItem' method.`,
    );
  }
}
