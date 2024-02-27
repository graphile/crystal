import type {
  ExecutionDetails,
  GrafastResultsList,
  GrafastValuesList,
} from "grafast";
import { constant, ExecutableStep } from "grafast";

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
    private callback: WithPgClientStepCallback<TData, TResult>,
  ) {
    super();
    this.executor = executor;
    this.contextId = this.addDependency(this.executor.context());
    this.dataId = this.addDependency($data);
  }

  executeV2({
    count,
    values,
    unaries,
  }: ExecutionDetails<
    [{ pgSettings: any; withPgClient: WithPgClient }, TData]
  >): GrafastResultsList<TResult> {
    const contextValues = values[this.contextId as 0];
    const unaryContext = unaries[this.contextId as 0];
    const dataValues = values[this.dataId as 1];
    const dataUnary = unaries[this.dataId as 1];
    const promises: Promise<any>[] = [];
    for (let i = 0; i < count; i++) {
      const context = contextValues === null ? unaryContext! : contextValues[i];
      const data = dataValues === null ? dataUnary! : dataValues[i];
      const { withPgClient, pgSettings } = context;
      promises.push(
        withPgClient(pgSettings, (client) => this.callback(client, data)),
      );
    }
    return promises;
  }
}

export function withPgClient<TData, TResult>(
  executor: PgExecutor,
  $data:
    | ExecutableStep<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: WithPgClientStepCallback<TData, TResult>,
) {
  return new WithPgClientStep(
    executor,
    $data ?? constant($data as TData),
    callback,
  );
}

export function withPgClientTransaction<TData, TResult>(
  executor: PgExecutor,
  $data:
    | ExecutableStep<TData>
    | (TData extends null | undefined ? null | undefined : never),
  callback: WithPgClientStepCallback<TData, TResult>,
) {
  return withPgClient(
    executor,
    $data ?? constant($data as TData),
    (client, data) =>
      client.withTransaction((txClient) => callback(txClient, data)),
  );
}
