import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { constant, ExecutableStep } from "grafast";

import type { PgClient, PgExecutor, WithPgClient } from "../executor";

export type WithPgClientStepCallback<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
> = (client: TPgClient, data: TData) => Promise<TResult>;

/**
 * Runs the given `callback` against the given `executor` using any plan data
 * from `$data` (which can be `constant(null)` if you don't need it). Typically
 * useful for running custom transactions.
 */
export class WithPgClientStep<
  TData = any,
  TResult = any,
  TPgClient extends PgClient = PgClient,
> extends ExecutableStep<TResult> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "WithPgClientStep",
  };

  isSyncAndSafe = false;
  hasSideEffects = true;

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
    $data: ExecutableStep<TData>,
    private callback: WithPgClientStepCallback<TData, TResult, TPgClient>,
  ) {
    super();
    this.executor = executor;
    this.contextId = this.addDependency(this.executor.context());
    this.dataId = this.addDependency($data);
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

export function withPgClient<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  $data:
    | ExecutableStep<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: WithPgClientStepCallback<TData, TResult, TPgClient>,
) {
  return new WithPgClientStep(
    executor,
    $data ?? constant($data as TData),
    callback,
  );
}

export function withPgClientTransaction<
  TData,
  TResult,
  TPgClient extends PgClient = PgClient,
>(
  executor: PgExecutor,
  $data:
    | ExecutableStep<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: WithPgClientStepCallback<TData, TResult, TPgClient>,
) {
  return withPgClient<TData, TResult, TPgClient>(
    executor,
    $data ?? constant($data as TData),
    (client, data) =>
      client.withTransaction((txClient) => callback(txClient, data)),
  );
}
