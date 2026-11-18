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

/** The location of a keyset's result in an in-flight batch. */
export interface PendingItem<TKeyset, TResult> {
  batch: PendingBatch<TKeyset, TResult>;
  index: number;
}

/** The canonical keyset and its pending or cached result for a tuple or object. */
export interface CompositeEntry<TKeyset, TResult> {
  keyset: TKeyset;
  /** Undefined before queuing or after failure, null once the result is cached. */
  batch: PendingBatch<TKeyset, TResult> | null | undefined;
  /** Position in `batch.keysets`. A value of `-1` means no batch is pending. */
  index: number;
  result: TResult | undefined;
}

export type BatchFamily<TOptions extends BatchOptions, TKeyset, TResult> = {
  executor: BatchExecutor<TOptions, TKeyset, TResult>;
  options: TOptions;
  /** The batch currently collecting keys, scheduled to start in a microtask. */
  queued: PendingBatch<TKeyset, TResult> | null;

  /** In `strict` mode, cached results by keyset. */
  cache: Map<TKeyset, TResult>;
  /** In `strict` mode, the pending batch and position for each in-flight keyset. */
  pending: Map<TKeyset, PendingItem<TKeyset, TResult>>;
  /**
   * In `tuple` mode, a trie keyed by tuple elements. Each entry holds the
   * canonical keyset and its pending batch or cached result.
   */
  tupleKeyIndex: BatchTupleIndex<CompositeEntry<TKeyset, TResult>> | null;
  /**
   * In `object` mode, one trie per set of property names, keyed by property
   * values. Each entry holds the canonical keyset and its pending batch or
   * cached result.
   */
  objectKeyIndexes: Map<string, KeysetTrieNode<TKeyset, TResult>> | null;
};

export type KeysetTrieNode<TKeyset, TResult> = {
  children: Map<unknown, KeysetTrieNode<TKeyset, TResult>> | null;
  /** First keyset at this terminal node; subsequent lookups reuse its identity. */
  entry: CompositeEntry<TKeyset, TResult> | null;
};
