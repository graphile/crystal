import { isPojo } from "../utils.ts";
import type { CompositeEntry, KeysetTrieNode } from "./batchInterfaces.ts";
import type { BatchTupleIndex } from "./batchTupleIndex.ts";
import { internBatchTupleEntry } from "./batchTupleIndex.ts";

function createEntry<TKeyset, TResult>(
  keyset: TKeyset,
): CompositeEntry<TKeyset, TResult> {
  return { keyset, batch: undefined, index: -1, result: undefined };
}

function getTupleKeyset<TKeyset, TResult>(
  entry: CompositeEntry<TKeyset, TResult>,
) {
  return entry.keyset as TKeyset & readonly unknown[];
}

export function canonicalizeTuple<TKeyset, TResult>(
  index: BatchTupleIndex<CompositeEntry<TKeyset, TResult>>,
  keyset: TKeyset,
): CompositeEntry<TKeyset, TResult> {
  if (!Array.isArray(keyset)) {
    throw new Error("batch(..., 'tuple') requires array keysets");
  }
  return internBatchTupleEntry(
    index,
    keyset,
    getTupleKeyset<TKeyset, TResult>,
    createEntry<TKeyset, TResult>,
  );
}

export function canonicalizeObject<TKeyset, TResult>(
  indexes: Map<string, KeysetTrieNode<TKeyset, TResult>>,
  keyset: TKeyset,
): CompositeEntry<TKeyset, TResult> {
  if (!isPojo(keyset)) {
    throw new Error("batch(..., 'object') requires object keysets");
  }
  const record = keyset as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const shape = JSON.stringify(keys);
  let node = indexes.get(shape);
  if (node === undefined) {
    node = { children: null, entry: null };
    indexes.set(shape, node);
  }
  for (const key of keys) {
    const value = record[key];
    const children: Map<
      unknown,
      KeysetTrieNode<TKeyset, TResult>
    > = (node.children ??= new Map());
    let child: KeysetTrieNode<TKeyset, TResult> | undefined =
      children.get(value);
    if (child === undefined) {
      child = { children: null, entry: null };
      children.set(value, child);
    }
    node = child;
  }
  return (node.entry ??= createEntry(keyset));
}
