import type {
  ExecutionExtra,
  StepOptimizeOptions,
  UnwrapPlanTuple,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { constant, ConstantStep } from "./constant.js";

export class ListStep<
  const TPlanTuple extends readonly ExecutableStep[],
> extends UnbatchedExecutableStep<UnwrapPlanTuple<TPlanTuple>> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ListStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;
  optimizeMetaKey = "ListStep";

  constructor(list: TPlanTuple) {
    super();
    for (let i = 0, l = list.length; i < l; i++) {
      this.addDependency(list[i], true);
    }
  }

  toStringMeta() {
    return this.dependencies.map(($dep) => $dep.id).join(",");
  }

  execute(
    count: number,
    values: any[][], //Array<UnwrapPlanTuple<TPlanTuple>>,
  ): Array<UnwrapPlanTuple<TPlanTuple>> {
    const result: any[] = [];
    for (let i = 0; i < count; i++) {
      result[i] = values.map((list) => list[i]);
    }
    return result;
  }

  unbatchedExecute(
    _extra: ExecutionExtra,
    ...values: any[] //UnwrapPlanTuple<TPlanTuple>,
  ): UnwrapPlanTuple<TPlanTuple> {
    return values as any;
  }

  deduplicate(peers: ListStep<TPlanTuple>[]): ListStep<TPlanTuple>[] {
    return peers;
  }

  optimize(opts: StepOptimizeOptions) {
    if (this.dependencies.every((dep) => dep instanceof ConstantStep)) {
      const meta = opts.meta as Record<number, any[][]>;
      // Used to validate the lists have the same length
      const cardinality = this.dependencies.length;
      if (!meta[cardinality]) {
        meta[cardinality] = [];
      }
      const existing = meta[cardinality].find((l) =>
        l.every(
          (v, i) => v === (this.dependencies[i] as ConstantStep<any>).data,
        ),
      );
      const isSensitive = this.dependencies.some(
        (d) => (d as ConstantStep<any>).isSensitive,
      );
      if (existing !== undefined) {
        return constant(existing, isSensitive);
      } else {
        // Replace self with constant
        const arr = this.dependencies.map(
          (dep) => (dep as ConstantStep<any>).data,
        );
        meta[cardinality].push(arr);
        return constant(arr, isSensitive);
      }
    }
    return this;
  }

  /**
   * Get the original plan at the given index back again.
   */
  public at<TIndex extends keyof TPlanTuple>(
    index: TIndex,
  ): TPlanTuple[TIndex] {
    return this.getDep(index as number) as TPlanTuple[TIndex];
  }

  public first() {
    return this.getDep(0) as TPlanTuple[0];
  }

  public last() {
    return this.getDep(this.dependencies.length - 1) as TPlanTuple[number];
  }
}

/**
 * Takes a list of plans and turns it into a single plan that represents the
 * list of their values.
 */
export function list<const TPlanTuple extends readonly ExecutableStep[]>(
  list: TPlanTuple,
): ListStep<TPlanTuple> {
  return new ListStep<TPlanTuple>(list);
}
