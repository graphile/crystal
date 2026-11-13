import type { BatchCallback } from "grafast";

import type {
  PgExecutor,
  PgExecutorContext,
  PgExecutorInput,
  PgExecutorOptions,
} from "../executor.ts";

export const pgStepBatchMetaKey = Symbol.for("@dataplan/pg/step-batches");

export type PgStepBatchInfo = {
  executor: PgExecutor;
  context: PgExecutorContext;
  options: PgExecutorOptions;
};

const batchInfoSymbol = Symbol("PostgreSQL batch info");

type BatchInfoMeta = Record<PropertyKey, any>;

export function getPgStepBatchInfo(
  meta: BatchInfoMeta,
  executor: PgExecutor,
  context: PgExecutorContext,
  options: PgExecutorOptions,
): PgStepBatchInfo {
  const state = (meta[batchInfoSymbol] ??= {
    infoByExecutor: new WeakMap(),
    objectIds: new WeakMap(),
    symbolIds: new Map(),
    nextId: 0,
  });
  function identity(value: object | symbol | undefined): number {
    if (value === undefined) return 0;
    const ids = typeof value === "symbol" ? state.symbolIds : state.objectIds;
    let id = ids.get(value);
    if (id === undefined) {
      id = ++state.nextId;
      ids.set(value, id);
    }
    return id;
  }
  let byContext = state.infoByExecutor.get(executor);
  if (byContext == null) {
    state.infoByExecutor.set(executor, (byContext = new WeakMap()));
  }
  let bySignature = byContext.get(context);
  if (bySignature == null) {
    byContext.set(context, (bySignature = new Map()));
  }
  let scopedContext = state.contexts?.get(context);
  if (scopedContext == null) {
    const contexts = (state.contexts ??= new WeakMap());
    scopedContext = {
      pgSettings: context.pgSettings,
      withPgClient: context.withPgClient,
    };
    contexts.set(context, scopedContext);
  }

  const signature = JSON.stringify([
    options.text,
    options.rawSqlValues,
    options.identifierIndex ?? null,
    options.name ?? null,
    identity(options.affinity),
    identity(options.eventEmitter),
    options.useTransaction ?? false,
  ]);
  let info = bySignature.get(signature);
  if (info == null) {
    // Executor caches belong to this execution metadata lifetime. The input
    // context can survive subscription events and mutation fields, whereas
    // metadata is reset at each of those boundaries.
    info = {
      executor,
      context: scopedContext,
      options,
    };
    bySignature.set(signature, info);
  }
  return info;
}

export const executePgStepBatch: BatchCallback<
  readonly [PgStepBatchInfo],
  readonly unknown[],
  ReadonlyArray<any>
> = async ([{ executor, context, options }], keysets) => {
  const inputs: PgExecutorInput<any>[] = keysets.map((queryValues) => ({
    context,
    queryValues,
  }));
  return (await executor.executeWithCache(inputs, options)).values;
};
