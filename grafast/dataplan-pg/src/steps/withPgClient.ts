import type {
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
} from "grafast";
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
export class WithPgClientStep<TData, TResult> extends ExecutableStep<TResult> {
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

  constructor(
    executor: PgExecutor,
    $data: ExecutableStep<TData>,
    private callback: WithPgClientStepCallback<TData, TResult>,
  ) {
    super();
    this.executor = executor;
    this.contextId = this.addDependency(this.executor.context());
    this.addDependency($data);
  }

  async execute(
    values: [
      GrafastValuesList<{ pgSettings: any; withPgClient: WithPgClient }>,
      GrafastValuesList<TData>,
    ],
  ): Promise<GrafastResultsList<TResult>> {
    const results: PromiseOrDirect<TResult>[] = [];
    for (let i = 0, l = values[0].length; i < l; i++) {
      const { pgSettings, withPgClient } = values[0][i];
      const data = values[1][i];
      try {
        const result = await withPgClient(pgSettings, (client) =>
          this.callback(client, data),
        );
        results.push(result);
      } catch (e) {
        results.push(Promise.reject(e));
      }
    }
    return results;
  }
}

export function withPgClient<TData, TResult>(
  executor: PgExecutor,
  $data: ExecutableStep<TData>,
  callback: WithPgClientStepCallback<TData, TResult>,
) {
  return new WithPgClientStep(executor, $data, callback);
}
