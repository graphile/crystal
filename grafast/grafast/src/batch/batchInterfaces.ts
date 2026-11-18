import type { BatchExecutor } from "../interfaces.ts";
import type { BatchTupleIndex } from "./batchTupleIndex.ts";

export type BatchOptions = Record<string, unknown> | undefined;

export interface PendingBatch<TKeyset, TResult> {
  deferred: PromiseWithResolvers<ReadonlyArray<TResult>>;
  /**
   * Populated only for tuple and object batches. When present, this has the
   * same length as `keysets`, with one entry per keyset at the same index.
   */
  entries: CompositeEntry<TKeyset, TResult>[] | null;
  /** Deduplicated keys passed to the callback in result order. */
  keysets: TKeyset[];
}

/** The canonical keyset and its pending or cached result for a tuple or object. */
export interface CompositeEntry<K, R> {
  keyset: K;
  /** Undefined before queuing or after failure, null once the result is cached. */
  batch: PendingBatch<K, R> | null | undefined;
  index: number;
  result: R | undefined;
}

export type BatchFamily<TOptions extends BatchOptions, TKeyset, TResult> = {
  executor: BatchExecutor<TOptions, TKeyset, TResult>;
  options: TOptions;
  cache: Map<TKeyset, TResult>;
  pending: Map<
    TKeyset,
    {
      batch: PendingBatch<TKeyset, TResult>;
      index: number;
    }
  >;
  /** The batch currently collecting keys, scheduled to start in a microtask. */
  queued: PendingBatch<TKeyset, TResult> | null;
  /** Trie that deduplicates tuple keys by their elements. */
  tupleKeyIndex: BatchTupleIndex<CompositeEntry<TKeyset, TResult>> | null;
  /** Tries that deduplicate object keys by property names and values. */
  objectKeyIndexes: Map<string, KeysetTrieNode<TKeyset, TResult>> | null;
};

export type KeysetTrieNode<TKeyset, TResult> = {
  children: Map<unknown, KeysetTrieNode<TKeyset, TResult>> | null;
  /** First keyset at this terminal node; subsequent lookups reuse its identity. */
  entry: CompositeEntry<TKeyset, TResult> | null;
};
