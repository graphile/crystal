import { $$deepDepSkip } from "../constants.js";
import type { ExecutionDetails } from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { Step } from "../step.js";
import type { __ItemStep } from "./__item.js";

export class __CloneStreamStep extends Step {
  static $$export = {
    moduleName: "grafast",
    exportName: "__CloneStreamStep",
  };
  public isSyncAndSafe = false;
  constructor($dep: Step) {
    super();
    this.addDependency($dep);
  }
  [$$deepDepSkip](): Step {
    return this.getDepOptions(0).step;
  }
  listItem($item: __ItemStep<any>): Step {
    const $dep = this.getDepOptions(0).step as Step &
      Partial<ListCapableStep<any, any, any>>;
    return $dep.listItem?.($item) ?? $item;
  }
  optimize() {
    // IMPORTANT: optimization is handled in OperationPlan's inlineSteps()
    return this;
  }
  execute({ values: [val], indexMap }: ExecutionDetails) {
    // The stream has already been cloned, we're just a placeholder really
    if (val.isBatch) {
      return val.entries;
    } else {
      const v = val.value;
      return indexMap(() => v);
    }
  }
}

export function __cloneStream($dep: Step) {
  return new __CloneStreamStep($dep);
}
