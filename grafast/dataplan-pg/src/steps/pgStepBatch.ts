import type { BatchExecutor } from "grafast";
import { defineBatchExecutor } from "grafast";

import type {
  PgExecutor,
  PgExecutorContext,
  PgExecutorInput,
  PgExecutorOptions,
} from "../executor.ts";

type PgStepBatchOptions = PgExecutorOptions & {
  executor: PgExecutor;
  context: PgExecutorContext;
  cacheToken: object;
};

export function pgStepBatchOptions(
  executor: PgExecutor,
  context: PgExecutorContext,
  options: PgExecutorOptions,
): PgStepBatchOptions {
  return {
    store: options.store,
    cursorScope: options.cursorScope,
    text: options.text,
    rawSqlValues: options.rawSqlValues,
    identifierIndex: options.identifierIndex ?? null,
    name: options.name,
    affinity: options.affinity,
    eventEmitter: options.eventEmitter,
    useTransaction: options.useTransaction ?? false,
    executor,
    context,
    cacheToken: executor.getBatchCacheToken(context),
  };
}

export const pgStepBatchExecutor = defineBatchExecutor({
  name: "@dataplan/pg/step",
  keysetEquality: "tuple",
  callback: async (
    { executor, context, cacheToken: _cacheToken, ...options },
    keysets,
  ) => {
    const inputs: PgExecutorInput<any>[] = keysets.map((queryValues) => ({
      context,
      queryValues,
    }));
    return (await executor.executeWithCache(inputs, options)).values;
  },
  optionsMatch: { text: "strict", rawSqlValues: "tuple" },
} satisfies BatchExecutor<
  PgStepBatchOptions,
  readonly unknown[],
  ReadonlyArray<any>
>);
