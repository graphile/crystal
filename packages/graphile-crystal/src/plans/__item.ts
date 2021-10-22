import chalk from "chalk";

import { getCurrentParentPathIdentity } from "../global";
import type { ListCapablePlan, StreamablePlan } from "../plan";
import { ExecutablePlan } from "../plan";

/**
 * An __ItemPlan is an internal plan (users must never construct it
 * themselves!) that Crystal uses to refer to an individual item within a list
 * or stream.
 */
export class __ItemPlan<TData> extends ExecutablePlan<TData> {
  constructor(
    parentPlan: StreamablePlan<TData> | ListCapablePlan<TData>,
    public readonly depth = 0,
  ) {
    super();
    this.addDependency(parentPlan);
    this.parentPathIdentity = getCurrentParentPathIdentity();
  }

  toStringMeta(): string {
    return chalk.bold.yellow(String(this.dependencies[0]));
  }

  execute(): never {
    throw new Error("__ItemPlan must never execute");
  }
}
