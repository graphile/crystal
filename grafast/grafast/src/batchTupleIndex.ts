import { arraysMatch } from "./utils.ts";

/** A branch stores the original tuple directly until it needs to split. */
export type BatchTupleIndex<T extends readonly unknown[]> = Map<
  unknown,
  T | BatchTupleIndex<T>
>;

const $$terminal = Symbol("end of batch tuple");

export function internBatchTuple<T extends readonly unknown[]>(
  index: BatchTupleIndex<T>,
  tuple: T,
): T {
  let mismatching: T | undefined;
  for (let depth = 0; ; depth++) {
    const key = depth === tuple.length ? $$terminal : tuple[depth];
    const existing = index.get(key);
    if (existing === undefined) {
      index.set(key, tuple);
      return tuple;
    } else if (existing instanceof Map) {
      index = existing;
    } else if (
      // Every previous component has already matched under Map equality, so
      // even NaN needs no further check once both tuples end on this path.
      key === $$terminal ||
      (existing !== mismatching && arraysMatch(existing, tuple))
    ) {
      return existing;
    } else {
      const nextDepth = depth + 1;
      const previousKey =
        nextDepth === existing.length ? $$terminal : existing[nextDepth];
      const children: BatchTupleIndex<T> = new Map();
      children.set(previousKey, existing);
      index.set(key, children);
      index = children;
      // A long shared prefix can require several splits with the same leaf.
      mismatching = existing;
    }
  }
}
