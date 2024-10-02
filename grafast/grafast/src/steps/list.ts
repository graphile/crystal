import type {
  ExecutionDetails,
  StepOptimizeOptions,
  UnbatchedExecutionExtra,
  UnwrapPlanTuple,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { constant, ConstantStep } from "./constant.js";

interface ListStepCacheConfig {
  identifier?: string;
  cacheSize?: number;
}

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
  private cacheSize: number;

  constructor(list: TPlanTuple, cacheConfig?: ListStepCacheConfig) {
    super();
    this.metaKey = cacheConfig?.identifier
      ? `list|${list.length}|${cacheConfig.identifier}`
      : this.id;
    this.cacheSize = cacheConfig?.cacheSize ?? 10;
    for (let i = 0, l = list.length; i < l; i++) {
      this.addDependency({ step: list[i], skipDeduplication: true });
    }
  }

  toStringMeta() {
    return this.dependencies.map(($dep) => $dep.id).join(",");
  }

  execute(
    { indexMap, values }: ExecutionDetails, //UnwrapPlanTuple<TPlanTuple>,
  ) {
    return indexMap(
      (i) => values.map((value) => value.at(i)) as UnwrapPlanTuple<TPlanTuple>,
    );
  }

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
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
  cacheConfig?: ListStepCacheConfig,
): ListStep<TPlanTuple> {
  return new ListStep<TPlanTuple>(list, cacheConfig);
}
