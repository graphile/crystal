import chalk from "chalk";

import { getCurrentParentPathIdentity } from "../global.js";
import { ExecutableStep } from "../step.js";

/**
 * An __ItemStep is an internal plan (users must never construct it
 * themselves!) that Crystal uses to refer to an individual item within a list
 * or stream.
 */
export class __ItemStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "__ItemStep",
  };
  isSyncAndSafe = true;

  /**
   * @internal
   */
  public transformStepId?: string;

  constructor(
    parentPlan: ExecutableStep<TData> | ExecutableStep<TData[]>,
    public readonly depth = 0,
  ) {
    super();
    this.parentPathIdentity = getCurrentParentPathIdentity();
    this.addDependency(parentPlan);
  }

  toStringMeta(): string {
    return chalk.bold.yellow(
      String(this.aether.dangerouslyGetPlan(this.dependencies[0]).id),
    );
  }

  execute(): never {
    throw new Error("__ItemStep must never execute");
  }
}
