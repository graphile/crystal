import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutablePlan } from "../plan.js";
import { ListPlan } from "./list.js";

export class FirstPlan<TData> extends ExecutablePlan<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "FirstPlan",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(parentPlan: ExecutablePlan<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: CrystalValuesList<[ReadonlyArray<TData>]>,
  ): CrystalResultsList<TData> {
    return values[0].map((list) => list?.[0]);
  }

  deduplicate(peers: FirstPlan<TData>[]): FirstPlan<TData> {
    return peers.length > 0 ? peers[0] : this;
  }

  optimize() {
    const parent = this.getDep(0);
    // The first of a list plan is just the first dependency of the list plan.
    if (parent instanceof ListPlan) {
      return this.getPlan(parent.dependencies[0]);
    }
    return this;
  }
}

/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 */
export function first<TData>(
  plan: ExecutablePlan<ReadonlyArray<TData>>,
): FirstPlan<TData> {
  return new FirstPlan(plan);
}
