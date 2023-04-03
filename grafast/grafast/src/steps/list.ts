import type { ExecutionExtra, UnwrapPlanTuple } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import { UnbatchedExecutableStep } from "../step.js";

export class ListStep<
  const TPlanTuple extends readonly ExecutableStep[],
> extends UnbatchedExecutableStep<UnwrapPlanTuple<TPlanTuple>> {
  static $$export = {
    moduleName: "grafast",
    exportName: "ListStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(list: TPlanTuple) {
    super();
    for (let i = 0, l = list.length; i < l; i++) {
      this.addDependency(list[i]);
    }
  }

  toStringMeta() {
    return this.dependencies.map(($dep) => $dep.id).join(",");
  }

  // Could be used to reduce the number of unique values returned
  tupleToTuple(
    results: Array<UnwrapPlanTuple<TPlanTuple>>,
    tuple: UnwrapPlanTuple<TPlanTuple>,
  ): UnwrapPlanTuple<TPlanTuple> {
    const tupleLength = tuple.length;
    // Note: `outerloop` is a JavaScript "label". They are not very common.
    // First look for an existing match:
    outerloop: for (let i = 0, l = results.length; i < l; i++) {
      const existingTuple = results[i];
      // Shortcut for identical tuples (unlikely).
      if (existingTuple === tuple) {
        return existingTuple;
      }
      // Slow loop over each value in the tuples; this is not expected to be a
      // particularly big loop, typically only 2-5 keys.
      for (let j = 0; j < tupleLength; j++) {
        if (existingTuple[j] !== tuple[j]) {
          // This isn't a match; try the next record in the outer loop
          continue outerloop;
        }
      }
      return existingTuple;
    }

    // That failed; store this tuple so the same tuple values result in the exact same array.
    results.push(tuple);
    return tuple;
  }

  execute(
    values: any[][], //Array<UnwrapPlanTuple<TPlanTuple>>,
  ): Array<UnwrapPlanTuple<TPlanTuple>> {
    const count = values[0].length;
    const result: any[] = [];
    for (let i = 0; i < count; i++) {
      result[i] = values.map((list) => list[i]);
    }
    return result;
  }

  unbatchedExecute(
    extra: ExecutionExtra,
    ...values: any[] //UnwrapPlanTuple<TPlanTuple>,
  ): UnwrapPlanTuple<TPlanTuple> {
    return values as any;
  }

  deduplicate(peers: ListStep<TPlanTuple>[]): ListStep<TPlanTuple>[] {
    return peers;
  }

  /**
   * Get the original plan at the given index back again.
   */
  public at<TIndex extends keyof TPlanTuple>(
    index: TIndex,
  ): TPlanTuple[TIndex] {
    return this.getDep(index as number) as TPlanTuple[TIndex];
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
