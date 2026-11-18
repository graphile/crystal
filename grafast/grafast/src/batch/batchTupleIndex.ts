import { arraysMatch } from "../utils.ts";

/** A branch stores the original tuple directly until it needs to split. */
export type BatchTupleIndex<T> = Map<unknown, T | BatchTupleIndex<T>>;

const $$terminal = Symbol("end of batch tuple");

export function internBatchTuple<TTuple extends readonly unknown[]>(
  index: BatchTupleIndex<TTuple>,
  tuple: TTuple,
): TTuple {
  return internBatchTupleEntry(index, tuple, identity, identity);
}

function identity<T>(value: T): T {
  return value;
}

export function internBatchTupleEntry<
  TTuple extends readonly unknown[],
  TEntry,
>(
  root: BatchTupleIndex<TEntry>,
  tuple: TTuple,
  getTuple: (entry: TEntry) => TTuple,
  create: (tuple: TTuple) => TEntry,
): TEntry {
  let index = root;
  let mismatching: TTuple | undefined;
  for (let depth = 0; ; depth++) {
    const key = depth === tuple.length ? $$terminal : tuple[depth];
    const existing = index.get(key);
    if (existing === undefined) {
      const entry = create(tuple);
      index.set(key, entry);
      return entry;
    } else if (existing instanceof Map) {
      index = existing;
    } else {
      const previous = getTuple(existing);
      if (
        // Every previous component has already matched under Map equality, so
        // even NaN needs no further check once both tuples end on this path.
        key === $$terminal ||
        (previous !== mismatching && arraysMatch(previous, tuple))
      ) {
        return existing;
      }
      const nextDepth = depth + 1;
      const previousKey =
        nextDepth === previous.length ? $$terminal : previous[nextDepth];
      const children: BatchTupleIndex<TEntry> = new Map();
      children.set(previousKey, existing);
      index.set(key, children);
      index = children;
      // A long shared prefix can require several splits with the same leaf.
      mismatching = previous;
    }
  }
}
