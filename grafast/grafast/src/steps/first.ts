import { $$deepDepSkip } from "../constants.ts";
import type {
  ExecutionDetails,
  GrafastResultsList,
  UnbatchedExecutionExtra,
} from "../interfaces.ts";
import { Step } from "../step.ts";
import type { StepRepresentingList } from "./connection.ts";
import { itemsOrStep } from "./connection.ts";
import { ListStep } from "./list.ts";

function unbatchedExecute(_extra: UnbatchedExecutionExtra, list: any[]) {
  return list?.[0];
}
function optimalExecute<TData>({
  indexMap,
  values: [values0],
}: ExecutionDetails<[ReadonlyArray<TData>]>): GrafastResultsList<TData> {
  return indexMap((i) => values0.at(i)?.[0]);
}

export class FirstStep<TData> extends Step<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "FirstStep",
  };
  allowMultipleOptimizations = true;
  unbatchedExecute?: typeof unbatchedExecute;

  constructor(parentPlan: StepRepresentingList<TData>, isArray = true) {
    super();
    this.addStrongDependency(itemsOrStep(parentPlan));
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
      if (Array.isArray(val)) return val[0];
      // Iterable? Return the first entry
      return (async () => {
        for await (const e of val) {
          return e;
        }
        return undefined;
      })();
    });
  }

  deduplicate(peers: FirstStep<TData>[]): FirstStep<TData>[] {
    return peers;
  }

  optimize() {
    const parent = this.getDep(0);
    // The first of a list plan is just the first dependency of the list plan.
    if (parent instanceof ListStep) {
      return parent.first();
    }
    return this;
  }
}

/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 *
 * @param plan - the list plan
 * @param array - set this true if the plan represents an array (or
 * null/undefined) - i.e. it' won't be an (async) iterable - to enable greater
 * optimization
 */
export function first<TData>(
  plan: StepRepresentingList<TData>,
  array = true,
): FirstStep<TData> {
  return plan.operationPlan.cacheStep(
    plan,
    "GrafastInternal:first()",
    array,
    () => new FirstStep(plan, array),
  );
}
