import type {
  ExecutionDetails,
  GrafastResultsList,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { ListStep } from "./list.js";

export class FirstStep<TData> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "FirstStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(parentPlan: ExecutableStep<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  executeV2({
    count,
    values: [values0],
    unaries: [unaries0],
  }: ExecutionDetails<[TData[]]>): GrafastResultsList<TData> {
    const result: Array<TData> = [];
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      result[i] = values0 === null ? unaries0?.[0]! : values0[i]?.[0];
    }
    return result;
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, list: any[]) {
    return list?.[0];
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
 */
export function first<TData>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
): FirstStep<TData> {
  return new FirstStep(plan);
}
