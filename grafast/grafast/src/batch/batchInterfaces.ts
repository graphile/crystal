import type { BatchExecutor } from "../interfaces.ts";
import type { BatchTupleIndex } from "./batchTupleIndex.ts";

export type BatchOptions = Record<string, unknown> | undefined;

export interface PendingBatch<TKeyset, TResult> {
  deferred: PromiseWithResolvers<ReadonlyArray<TResult>>;
  entries: CompositeEntry<TKeyset, TResult>[] | null;
  /** Deduplicated canonical specifiers, used by the callback and cache maps. */
  keysets: TKeyset[];
}

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
  queued: PendingBatch<TKeyset, TResult> | null;
  tupleKeyIndex: BatchTupleIndex<CompositeEntry<TKeyset, TResult>> | null;
  objectKeyIndexes: Map<string, KeysetTrieNode<TKeyset, TResult>> | null;
};

export type KeysetTrieNode<TKeyset, TResult> = {
  children: Map<unknown, KeysetTrieNode<TKeyset, TResult>> | null;
  /** First keyset at this terminal node; subsequent lookups reuse its identity. */
  entry: CompositeEntry<TKeyset, TResult> | null;
};
