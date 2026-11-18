import type { BatchExecutor } from "../interfaces.ts";

/** Define once at module scope, or during schema construction. */
export function defineBatchExecutor<
  TOptions extends Record<string, unknown> | undefined,
  TKeyset,
  TResult,
>(
  executor: BatchExecutor<TOptions, TKeyset, TResult>,
): BatchExecutor<TOptions, TKeyset, TResult> {
  return executor;
}
