import type { ExecutionDetails } from "../interfaces.js";
import type { ListCapableStep} from "../step.js";
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
  listItem($item: __ItemStep<any>): Step {
    const $dep = this.getDepOptions(0).step as Step &
      Partial<ListCapableStep<any, any, any>>;
    return $dep.listItem?.($item) ?? $item;
  }
  optimize(): Step {
    const $dep = this.getDepOptions(0).step;
    if (!$dep.cloneStreams) {
      return $dep;
    }
    // TODO: if $dep.dependents.length === 1, replace with $dep?
    return this;
  }
  execute({ values: [val], indexMap }: ExecutionDetails) {
    // The stream has already been cloned, we're just a placeholder really
    return indexMap((i) => val.at(i));
  }
}

export function __cloneStream($dep: Step) {
  return new __CloneStreamStep($dep);
}
