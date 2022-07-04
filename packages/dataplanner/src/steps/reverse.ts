import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../plan.js";

/**
 * Returns a reversed copy of the list.
 */
export function reverseArray<TData = any>(list: readonly TData[]): TData[] {
  if (!Array.isArray(list)) {
    throw new Error(
      `Attempted to reverse an array, but what was passed wasn't an array`,
    );
  }
  const l = list.length;
  const newList = [];
  for (let i = 0; i < l; i++) {
    newList[i] = list[l - i - 1];
  }
  return newList;
}

/**
 * Reverses a list.
 */
export class ReverseStep<TData> extends ExecutableStep<readonly TData[]> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "ReverseStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(plan: ExecutableStep<readonly TData[]>) {
    super();
    this.addDependency(plan);
  }

  execute(values: [CrystalValuesList<TData[]>]): CrystalResultsList<TData[]> {
    return values[0].map((arr) => (arr == null ? arr : reverseArray(arr)));
  }

  executeSingle = ([arr]: [TData[]]): TData[] =>
    arr == null ? arr : reverseArray(arr);

  deduplicate(peers: ReverseStep<TData>[]): ReverseStep<TData> {
    return peers.length > 0 ? peers[0] : this;
  }
}

/**
 * Reverses a list.
 */
export function reverse<TData>(
  plan: ExecutableStep<readonly TData[]>,
): ReverseStep<TData> {
  return new ReverseStep<TData>(plan);
}
