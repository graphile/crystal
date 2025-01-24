import type { UnbatchedExecutionExtra } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import type { ConnectionCapableStep } from "./connection.js";
import { itemsOrStep } from "./connection.js";
import { ListStep } from "./list.js";

export class LastStep<TData> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LastStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(
    parentPlan:
      | ExecutableStep<ReadonlyArray<TData>>
      | ConnectionCapableStep<ExecutableStep<TData>, any>,
  ) {
    super();
    this.addDependency(itemsOrStep(parentPlan));
  }

  unbatchedExecute = (
    _extra: UnbatchedExecutionExtra,
    list: ReadonlyArray<TData>,
  ): TData => {
    return list?.[list?.length - 1];
  };

  deduplicate(peers: LastStep<TData>[]): LastStep<TData>[] {
    return peers;
  }

  optimize() {
    const parent = this.getDep(0);
    // The last of a list plan is just the last dependency of the list plan.
    if (parent instanceof ListStep) {
      return parent.last();
    }
    return this;
  }
}

/**
 * A plan that resolves to the last entry in the list returned by the given
 * plan.
 */
export function last<TData>(
  plan:
    | ExecutableStep<ReadonlyArray<TData>>
    | ConnectionCapableStep<ExecutableStep<TData>, any>,
): LastStep<TData> {
  return plan.operationPlan.cacheStep(
    plan,
    "GrafastInternal:last()",
    "",
    () => new LastStep(plan),
  );
}
