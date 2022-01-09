import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export class LastPlan<TData> extends ExecutablePlan<TData> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "LastPlan",
  };

  constructor(parentPlan: ExecutablePlan<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: CrystalValuesList<[ReadonlyArray<TData>]>,
  ): CrystalResultsList<TData> {
    return values.map(([list]) => {
      return list?.[list?.length - 1];
    });
  }

  deduplicate(peers: LastPlan<TData>[]): LastPlan<TData> {
    return peers.length > 0 ? peers[0] : this;
  }
}

/**
 * A plan that resolves to the last entry in the list returned by the given
 * plan.
 */
export function last<TData>(
  plan: ExecutablePlan<ReadonlyArray<TData>>,
): LastPlan<TData> {
  return new LastPlan(plan);
}
