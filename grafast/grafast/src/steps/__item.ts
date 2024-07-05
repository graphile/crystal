import chalk from "chalk";

import type { GrafastResultsList, JSONValue } from "../index.js";
import { $$deepDepSkip } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { $$noExec, UnbatchedExecutableStep } from "../step.js";

/**
 * An __ItemStep is an internal plan (users must never construct it
 * themselves!) that Grafast uses to refer to an individual item within a list
 * or stream.
 */
export class __ItemStep<TData> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__ItemStep",
  };
  isSyncAndSafe = true;
  [$$noExec] = true;

  /**
   * @internal
   */
  public transformStepId?: number;

  constructor(
    parentPlan: ExecutableStep<TData> | ExecutableStep<TData[]>,
    public readonly depth = 0,
  ) {
    super();
    this.addDependency(parentPlan);
    this._isUnary = false;
    this._isUnaryLocked = true;
  }

  toStringMeta(): string {
    return chalk.bold.yellow(String(this.dependencies[0].id));
  }

  public planJSONExtra(): Record<string, JSONValue | undefined> | undefined {
    return {
      transformStepId: this.transformStepId,
    };
  }

  getParentStep(): ExecutableStep {
    return this.getDep(0);
  }
  [$$deepDepSkip](): ExecutableStep {
    return this.getDep(0);
  }

  execute(): GrafastResultsList<TData> {
    throw new Error("__ItemStep must never execute");
  }
  unbatchedExecute(): TData {
    throw new Error("__ItemStep must never execute");
  }

  public finalize(): void {
    super.finalize();
    if (this.transformStepId != null) {
      this.transformStepId = this.operationPlan.dangerouslyGetStep(
        this.transformStepId,
      ).id;
    }
  }
}
