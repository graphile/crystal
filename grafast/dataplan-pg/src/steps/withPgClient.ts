import type { GrafastResultsList, GrafastValuesList } from "grafast";
import { ExecutableStep } from "grafast";

import type { PgClient, PgExecutor, WithPgClient } from "../executor";

export type WithPgClientStepCallback<TData, TResult> = (
  client: PgClient,
  data: TData,
) => Promise<TResult>;

/**
 * Runs the given `callback` against the given `executor` using any plan data
 * from `$data` (which can be `constant(null)` if you don't need it). Typically
 * useful for running custom transactions.
 */
export class WithPgClientStep<
  TData = any,
  TResult = any,
> extends ExecutableStep<TResult> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "WithPgClientStep",
  };

  isSyncAndSafe = false;
  hasSideEffects = true;

  /**
   * Tells us what we're dealing with - data type, attributes, where to insert it,
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
    private callback: WithPgClientStepCallback<TData, TResult>,
  ) {
    super();
    this.executor = executor;
    this.contextId = this.addDependency(this.executor.context());
    this.dataId = this.addDependency($data);
  }

  execute(
    _count: number,
    values: [
      GrafastValuesList<{ pgSettings: any; withPgClient: WithPgClient }>,
      GrafastValuesList<TData>,
    ],
  ): GrafastResultsList<TResult> {
    const contexts = values[this.contextId as 0];
    const datas = values[this.dataId as 1];
    return contexts.map(async ({ pgSettings, withPgClient }, i) => {
      const data = datas[i];
      return withPgClient(pgSettings, (client) => this.callback(client, data));
    });
  }
}

export function withPgClient<TData, TResult>(
  executor: PgExecutor,
  $data: ExecutableStep<TData>,
  callback: WithPgClientStepCallback<TData, TResult>,
) {
  return new WithPgClientStep(executor, $data, callback);
}

export function withPgClientTransaction<TData, TResult>(
  executor: PgExecutor,
  $data: ExecutableStep<TData>,
  callback: WithPgClientStepCallback<TData, TResult>,
) {
  return withPgClient(executor, $data, (client, data) =>
    client.withTransaction((txClient) => callback(txClient, data)),
  );
}
