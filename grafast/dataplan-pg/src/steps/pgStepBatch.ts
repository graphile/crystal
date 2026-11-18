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
    ...options,
    executor,
    context,
    cacheToken: executor.getBatchCacheToken(context),
    identifierIndex: options.identifierIndex ?? null,
    useTransaction: options.useTransaction ?? false,
  };
}

export const pgStepBatchExecutor = defineBatchExecutor({
  name: "@dataplan/pg/step",
  keysetEquality: "tuple",
  optionsMatch: { text: "strict", rawSqlValues: "tuple" },
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
} satisfies BatchExecutor<
  PgStepBatchOptions,
  readonly unknown[],
  ReadonlyArray<any>
>);
