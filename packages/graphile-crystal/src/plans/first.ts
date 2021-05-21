import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { Plan } from "../plan";

export class FirstPlan<TData> extends Plan<TData> {
  constructor(parentPlan: Plan<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: CrystalValuesList<[ReadonlyArray<TData>]>,
  ): CrystalResultsList<TData> {
    return values.map((tuple) => tuple[0]?.[0]);
  }

  deduplicate(peers: FirstPlan<TData>[]): FirstPlan<TData> {
    return peers.length > 0 ? peers[0] : this;
  }
}

/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 */
export function first<TPlan extends Plan<ReadonlyArray<any>>>(
  plan: TPlan,
): FirstPlan<TPlan extends Plan<ReadonlyArray<infer U>> ? U : never> {
  return new FirstPlan(plan);
}
