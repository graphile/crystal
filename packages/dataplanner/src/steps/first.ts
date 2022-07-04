import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { ListStep } from "./list.js";

export class FirstStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "FirstStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(parentPlan: ExecutableStep<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: CrystalValuesList<[ReadonlyArray<TData>]>,
  ): CrystalResultsList<TData> {
    return values[0].map((list) => list?.[0]);
  }

  deduplicate(peers: FirstStep<TData>[]): FirstStep<TData> {
    return peers.length > 0 ? peers[0] : this;
  }

  optimize() {
    const parent = this.getDep(0);
    // The first of a list plan is just the first dependency of the list plan.
    if (parent instanceof ListStep) {
      return this.getStep(parent.dependencies[0]);
    }
    return this;
  }
}

/**
 * A plan that resolves to the first entry in the list returned by the given
 * plan.
 */
export function first<TData>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
): FirstStep<TData> {
  return new FirstStep(plan);
}
