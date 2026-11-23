import type { BatchExecutor } from "grafast";
import { defineBatchExecutor } from "grafast";

import type {
  PgExecutor,
  PgExecutorContext,
  PgExecutorInput,
  PgExecutorOptions,
} from "../executor.ts";

type PgStepBatchOptions = Omit<PgExecutorOptions, "store"> & {
  executor: PgExecutor;
  context: PgExecutorContext;
};

export function pgStepBatchOptions(
  executor: PgExecutor,
  context: PgExecutorContext,
  options: PgExecutorOptions,
): PgStepBatchOptions {
  return {
    text: options.text,
    rawSqlValues: options.rawSqlValues,
    identifierIndex: options.identifierIndex ?? null,
    name: options.name,
    affinity: options.affinity,
    eventEmitter: options.eventEmitter,
    useTransaction: options.useTransaction ?? false,
    executor,
    context,
  };
}

export const pgStepBatchExecutor = defineBatchExecutor({
  name: "@dataplan/pg/step",
  keysetEquality: "tuple",
  callback: async ({ executor, context, ...options }, keysets) => {
    const inputs: PgExecutorInput<any>[] = keysets.map((queryValues) => ({
      context,
      queryValues,
    }));
    return (
      await executor.executeWithoutCache(inputs, { ...options, queue: true })
    ).values;
  },
  // Affinity routes the query to a connection queue without affecting its rows.
  optionsMatch: {
    text: "strict",
    rawSqlValues: "deepTuple",
    affinity: "ignore",
  },
  mergeOptions: (current, incoming) =>
    current.affinity != null ? current : incoming,
} satisfies BatchExecutor<
  PgStepBatchOptions,
  readonly unknown[],
  ReadonlyArray<any>
>);
