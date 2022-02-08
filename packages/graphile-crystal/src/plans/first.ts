import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export class FirstPlan<TData> extends ExecutablePlan<TData> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "FirstPlan",
  };
  sync = true;

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
