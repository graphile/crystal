import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../plan.js";
import { ListStep } from "./list.js";

export class LastStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "LastStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(parentPlan: ExecutableStep<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: [CrystalValuesList<ReadonlyArray<TData>>],
  ): CrystalResultsList<TData> {
    return values[0].map((list) => list?.[list?.length - 1]);
  }

  executeSingle = ([list]: [ReadonlyArray<TData>]): TData => {
    return list?.[list?.length - 1];
  };

  deduplicate(peers: LastStep<TData>[]): LastStep<TData> {
    return peers.length > 0 ? peers[0] : this;
  }

  optimize() {
    const parent = this.getDep(0);
    // The last of a list plan is just the last dependency of the list plan.
    if (parent instanceof ListStep) {
      return this.getPlan(parent.dependencies[parent.dependencies.length - 1]);
    }
    return this;
  }
}

/**
 * A plan that resolves to the last entry in the list returned by the given
 * plan.
 */
export function last<TData>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
): LastStep<TData> {
  return new LastStep(plan);
}
