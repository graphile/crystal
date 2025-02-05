import type {
  ExecutionDetails,
  StepOptimizeOptions,
  UnbatchedExecutionExtra,
  UnwrapPlanTuple,
} from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";
import { constant, ConstantStep } from "./constant.js";

const DEFAULT_CACHE_SIZE = 100;

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
  private valueCount: number;

  constructor(list: TPlanTuple, cacheConfig?: ListStepCacheConfig) {
    super();
    this.valueCount = list.length;
    this.cacheSize =
      cacheConfig?.cacheSize ??
      (cacheConfig?.identifier ? DEFAULT_CACHE_SIZE : 0);
    this.metaKey =
      this.cacheSize <= 0
        ? undefined
        : cacheConfig?.identifier
        ? `list|${list.length}|${cacheConfig.identifier}`
        : this.id;
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

  deduplicatedUnbatchedExecute(
    { meta: inMeta }: UnbatchedExecutionExtra,
    ...values: any[] //UnwrapPlanTuple<TPlanTuple>,
  ): UnwrapPlanTuple<TPlanTuple> {
    const meta = inMeta as {
      nextIndex: number | undefined;
      results: Array<any[]>;
    };
    if (meta.nextIndex !== undefined) {
      outer: for (let i = 0, l = meta.results.length; i < l; i++) {
        const cachedValues = meta.results[i];
        for (let j = 0, c = this.valueCount; j < c; j++) {
          if (values[j] !== cachedValues[j]) {
            continue outer;
          }
        }
        return cachedValues as any;
      }
    } else {
      meta.nextIndex = 0;
      meta.results = [];
    }
    meta.results[meta.nextIndex] = values;
    // Only cache this.cacheSize results, use a round-robin
    const maxIndex = this.cacheSize - 1;
    meta.nextIndex = meta.nextIndex === maxIndex ? 0 : meta.nextIndex + 1;
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

  finalize() {
    if (this.cacheSize > 0) {
      this.unbatchedExecute = this.deduplicatedUnbatchedExecute;
    }
    super.finalize();
  }

  /**
   * Get the original plan at the given index back again.
   */
  public at<TIndex extends keyof TPlanTuple & number>(
    index: TIndex,
  ): TPlanTuple[TIndex] {
    return this.getDep<TPlanTuple[TIndex]>(index as number);
  }

  public first() {
    return this.getDep<TPlanTuple[0]>(0);
  }

  public last() {
    return this.getDep<TPlanTuple[number]>(this.dependencies.length - 1);
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
