import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { constant, Step } from "grafast";

import type { PgClient, PgExecutor, WithPgClient } from "../executor";

export type SideEffectWithPgClientStepCallback<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
> = (client: TPgClient, data: TData) => Promise<TResult>;

/**
 * Runs the given `callback` against the given `executor` using any plan data
 * from `$data` (which can be `constant(null)` if you don't need it). Typically
 * useful for running custom transactions.
 */
export class SideEffectWithPgClientStep<
  TData = any,
  TResult = any,
  TPgClient extends PgClient = PgClient,
> extends Step<TResult> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "SideEffectWithPgClientStep",
  };

  isSyncAndSafe = false;

  /**
   * Tells us what we're dealing with - data type, columns, where to insert it,
   * what it's called, etc.
   */
  public readonly executor: PgExecutor;

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * The id for the data plan.
   */
  private dataId: number;

  constructor(
    executor: PgExecutor,
    $data: Step<TData>,
    private callback: SideEffectWithPgClientStepCallback<
      TData,
      TResult,
      TPgClient
    >,
  ) {
    super();
    this.executor = executor;
    this.contextId = this.addDependency(this.executor.context());
    this.dataId = this.addDependency($data);

    // Be sure to set this _after_ we've added the dependencies - we don't want them to be dependent on us!
    this.hasSideEffects = true;
  }

  execute({
    indexMap,
    values,
  }: ExecutionDetails<
    [{ pgSettings: any; withPgClient: WithPgClient<TPgClient> }, TData]
  >): GrafastResultsList<TResult> {
    const contextDep = values[this.contextId as 0];
    const dataDep = values[this.dataId as 1];
    return indexMap((i) => {
      const context = contextDep.at(i);
      const data = dataDep.at(i);
      const { withPgClient, pgSettings } = context;
      return withPgClient(pgSettings, (client) => this.callback(client, data));
    });
  }
}

export function sideEffectWithPgClient<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  $data:
    | Step<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: SideEffectWithPgClientStepCallback<TData, TResult, TPgClient>,
) {
  return new SideEffectWithPgClientStep(
    executor,
    $data ?? constant($data as TData),
    callback,
  );
}

export function sideEffectWithPgClientTransaction<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  $data:
    | Step<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: SideEffectWithPgClientStepCallback<TData, TResult, TPgClient>,
) {
  return sideEffectWithPgClient<TData, TResult, TPgClient>(
    executor,
    $data ?? constant($data as TData),
    (client, data) =>
      client.withTransaction((txClient) => callback(txClient, data)),
  );
}
/** @deprecated Use `sideEffectWithPgClient` or `loadOneWithPgClient` or `loadManyWithPgClient` instead */
export const withPgClient = sideEffectWithPgClient;
/** @deprecated Use `sideEffectWithPgClientTransaction` instead (or `loadOneWithPgClient`/`loadManyWithPgClient` if you're not doing a mutation) */
export const withPgClientTransaction = sideEffectWithPgClientTransaction;
