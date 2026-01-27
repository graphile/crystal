import { $$deepDepSkip } from "../constants.ts";
import type {
  ExecutionDetails,
  GrafastResultsList,
  Maybe,
  UnbatchedExecutionExtra,
} from "../interfaces.ts";
import { Step } from "../step.ts";
import type { StepRepresentingList } from "./connection.ts";
import { itemsOrStep } from "./connection.ts";
import { ListStep } from "./list.ts";

function unbatchedExecute(_extra: UnbatchedExecutionExtra, list: any[]) {
  return list?.[list.length - 1];
}
function optimalExecute<TData>({
  indexMap,
  values: [values0],
}: ExecutionDetails<[ReadonlyArray<TData>]>): GrafastResultsList<TData> {
  return indexMap((i) => {
    const list = values0.at(i);
    return list?.[list.length - 1];
  });
}

export class LastStep<TData> extends Step<Maybe<TData>> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LastStep",
  };
  allowMultipleOptimizations = true;
  unbatchedExecute?: typeof unbatchedExecute;

  constructor(parentPlan: StepRepresentingList<TData>, isArray = true) {
    super();
    this.addDependency(itemsOrStep(parentPlan));
    if (isArray) {
      this.unbatchedExecute = unbatchedExecute;
      this.execute = optimalExecute<TData>;
      this.isSyncAndSafe = true;
    } else {
      this.isSyncAndSafe = false;
    }
  }

  [$$deepDepSkip](): Step {
    return this.getDepOptions(0).step;
  }

  execute({
    indexMap,
    values: [values0],
  }: ExecutionDetails<[ReadonlyArray<TData>]>): GrafastResultsList<TData> {
    return indexMap((i) => {
      const val = values0.at(i);
      if (val == null) return val;
      if (Array.isArray(val)) return val[val.length - 1];
      // Iterable? Return the last entry
      return (async () => {
        let last: any = undefined;
        for await (const e of val) {
          last = e;
        }
        return last;
      })();
    });
  }

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
 *
 * @param plan - the list plan
 * @param array - set this true if the plan represents an array (or
 * null/undefined) - i.e. it' won't be an (async) iterable - to enable greater
 * optimization
 */
export function last<TData>(
  plan: StepRepresentingList<TData>,
  array = true,
): LastStep<TData> {
  return plan.operationPlan.cacheStep(
    plan,
    "GrafastInternal:last()",
    array,
    () => new LastStep(plan, array),
  );
}
