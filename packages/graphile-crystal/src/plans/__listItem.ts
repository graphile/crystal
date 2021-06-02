import chalk from "chalk";

import { getCurrentParentPathIdentity } from "../global";
import { ExecutablePlan } from "../plan";

export class __ListItemPlan<
  TParentPlan extends ExecutablePlan<ReadonlyArray<any>>,
> extends ExecutablePlan<
  TParentPlan extends ExecutablePlan<ReadonlyArray<infer U>> ? U : never
> {
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

export interface ListCapablePlan<TData>
  extends ExecutablePlan<ReadonlyArray<TData>> {
  listItem(
    itemPlan: __ListItemPlan<ExecutablePlan<ReadonlyArray<TData>>>,
  ): ExecutablePlan<TData>;
}

export function isListCapablePlan<TData>(
  plan: ExecutablePlan<ReadonlyArray<TData>>,
): plan is ListCapablePlan<TData> {
  return "listItem" in plan && typeof (plan as any).listItem === "function";
}

export function assertListCapablePlan<TData>(
  plan: ExecutablePlan<ReadonlyArray<TData>>,
  pathIdentity: string,
): asserts plan is ListCapablePlan<TData> {
  if (!isListCapablePlan(plan)) {
    throw new Error(
      `The plan returned from '${pathIdentity}' should be a list capable plan, but it does not implement the 'listItem' method.`,
    );
  }
}
