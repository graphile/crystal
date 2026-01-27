import chalk from "chalk";

import { $$deepDepSkip } from "../constants.ts";
import type { GrafastResultsList, JSONValue } from "../index.ts";
import type { Step } from "../step.ts";
import { $$noExec, UnbatchedStep } from "../step.ts";

/**
 * An __ItemStep is an internal plan (users must never construct it
 * themselves!) that Grafast uses to refer to an individual item within a list
 * or stream.
 */
export class __ItemStep<TData> extends UnbatchedStep<TData> {
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
  public readonly depth: number;

  constructor(
    parentPlan: Step<TData> | Step<TData[]>,
    depth = 0,
  ) {
    super();
    this.depth = depth;
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

  getParentStep(): Step {
    return this.getDep(0);
  }
  [$$deepDepSkip](): Step {
    return this.getDepOptions(0).step;
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
