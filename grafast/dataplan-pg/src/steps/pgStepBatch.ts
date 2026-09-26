import type { BatchCallback, ExecutionEventEmitter } from "grafast";
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

const objectIds = new WeakMap<object, number>();
const symbolIds = new Map<symbol, number>();
let nextId = 0;

function identity(value: object | symbol | undefined): number {
  if (value === undefined) return 0;
  const ids = typeof value === "symbol" ? symbolIds : objectIds;
  let id = ids.get(value as never);
  if (id === undefined) {
    id = ++nextId;
    ids.set(value as never, id);
  }
  return id;
}

const infoByExecutor = new WeakMap<
  PgExecutor,
  WeakMap<PgExecutorContext, Map<string, PgStepBatchInfo>>
>();

export function getPgStepBatchInfo(
  executor: PgExecutor,
  context: PgExecutorContext,
  options: PgExecutorOptions,
): PgStepBatchInfo {
  let byContext = infoByExecutor.get(executor);
  if (!byContext) infoByExecutor.set(executor, (byContext = new WeakMap()));
  let bySignature = byContext.get(context);
  if (!bySignature) byContext.set(context, (bySignature = new Map()));

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
  if (!info) {
    info = { executor, context, options };
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
