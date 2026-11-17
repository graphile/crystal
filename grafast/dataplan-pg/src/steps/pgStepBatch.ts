import type { BatchExecutor } from "grafast";

import type {
  PgExecutor,
  PgExecutorContext,
  PgExecutorInput,
  PgExecutorOptions,
} from "../executor.ts";

type PgStepBatchDependencies = readonly [
  executor: PgExecutor,
  context: PgExecutorContext,
  store: PgExecutorOptions["store"],
  text: PgExecutorOptions["text"],
  identifierIndex: PgExecutorOptions["identifierIndex"],
  name: PgExecutorOptions["name"],
  affinity: PgExecutorOptions["affinity"],
  eventEmitter: PgExecutorOptions["eventEmitter"],
  useTransaction: boolean,
  ...rawSqlValues: PgExecutorOptions["rawSqlValues"],
];

function getUnaryDependencies(
  executor: PgExecutor,
  context: PgExecutorContext,
  options: PgExecutorOptions,
): PgStepBatchDependencies {
  return [
    executor,
    context,
    options.store,
    options.text,
    options.identifierIndex ?? null,
    options.name,
    options.affinity,
    options.eventEmitter,
    options.useTransaction ?? false,
    ...options.rawSqlValues,
  ];
}

export const pgStepBatchExecutor = Object.freeze({
  getUnaryDependencies,
  name: "@dataplan/pg/step",
  keysetEquality: "tuple",
  callback: async (
    [
      executor,
      context,
      store,
      text,
      identifierIndex,
      name,
      affinity,
      eventEmitter,
      useTransaction,
      ...rawSqlValues
    ],
    keysets,
  ) => {
    const inputs: PgExecutorInput<any>[] = keysets.map((queryValues) => ({
      context,
      queryValues,
    }));
    return (
      await executor.executeWithCache(inputs, {
        store,
        text,
        identifierIndex,
        name,
        affinity,
        eventEmitter,
        useTransaction,
        rawSqlValues,
      })
    ).values;
  },
} satisfies BatchExecutor<
  PgStepBatchDependencies,
  readonly unknown[],
  ReadonlyArray<any>
> & { getUnaryDependencies: typeof getUnaryDependencies });
