import chalk from "chalk";

import { getCurrentParentPathIdentity } from "../global";
import { Plan } from "../plan";

export class __ListItemPlan<
  TParentPlan extends Plan<ReadonlyArray<any>>,
> extends Plan<TParentPlan extends Plan<ReadonlyArray<infer U>> ? U : never> {
  constructor(parentPlan: TParentPlan) {
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

export interface ListCapablePlan<TData> extends Plan<ReadonlyArray<TData>> {
  listItem(itemPlan: __ListItemPlan<Plan<ReadonlyArray<TData>>>): Plan<TData>;
}

export function isListCapablePlan<TData>(
  plan: Plan<ReadonlyArray<TData>>,
): plan is ListCapablePlan<TData> {
  return "listItem" in plan && typeof (plan as any).listItem === "function";
}

export function assertListCapablePlan<TData>(
  plan: Plan<ReadonlyArray<TData>>,
  pathIdentity: string,
): asserts plan is ListCapablePlan<TData> {
  if (!isListCapablePlan(plan)) {
    throw new Error(
      `The plan returned from '${pathIdentity}' should be a list capable plan, but it does not implement the 'listItem' method.`,
    );
  }
}
