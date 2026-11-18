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
  const keys = Object.keys(keyset).sort();
  const shape = JSON.stringify(keys);
  let startNode = indexes.get(shape);
  if (startNode === undefined) {
    startNode = { children: null, entry: null };
    indexes.set(shape, startNode);
  }
  let node = startNode;
  for (const key of keys) {
    const value = keyset[key];
    node.children ??= new Map();
    const children = node.children;
    let child = children.get(value);
    if (child === undefined) {
      child = { children: null, entry: null };
      children.set(value, child);
    }
    node = child;
  }
  return (node.entry ??= createEntry(keyset));
}
