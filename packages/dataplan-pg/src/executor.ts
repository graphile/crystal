import LRU from "@graphile/lru";
import * as assert from "assert";
import chalk from "chalk";
import debugFactory from "debug";
import type {
  CrystalValuesList,
  Deferred,
  ExecutablePlan,
  ObjectPlan,
} from "graphile-crystal";
import { defer } from "graphile-crystal";
import type { SQLRawValue } from "pg-sql2";
import { inspect } from "util";

import { formatSQLForDebugging } from "./formatSQLForDebugging";

const debug = debugFactory("datasource:pg:PgExecutor");
const debugVerbose = debug.extend("verbose");

export interface PgClientQuery {
  /** The query string */
  text: string;
  /** The values to put in the placeholders */
  values?: Array<any>;
  /** An optimisation, to avoid you having to decode column names */
  arrayMode?: boolean;
  /** For prepared statements */
  name?: string;
}

export interface PgClientResult<TData> {
  rows: readonly TData[];
}

export interface PgClient {
  query<TData>(opts: PgClientQuery): Promise<PgClientResult<TData>>;

  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}

export type WithPgClient = <T>(
  pgSettings: { [key: string]: string },
  callback: (client: PgClient) => T | Promise<T>,
) => Promise<T>;

export type PgExecutorContext<TSettings = any> = {
  pgSettings: TSettings;
  withPgClient: WithPgClient;
};

export type PgExecutorContextPlans<TSettings = any> = {
  [key in keyof PgExecutorContext<TSettings>]: ExecutablePlan<
    PgExecutorContext<TSettings>[key]
  >;
};

export type PgExecutorInput<TInput> = {
  context: PgExecutorContext;
  queryValues: ReadonlyArray<TInput>;
};

export type PgExecutorOptions = {
  text: string;
  rawSqlValues: Array<SQLRawValue | symbol>;
  identifierIndex?: number | null;
  queryValuesSymbol?: symbol | null;
};

export type PgExecutorMutationOptions = {
  context: PgExecutorContext;
  text: string;
  values: ReadonlyArray<SQLRawValue>;
};

/**
 * Represents a PostgreSQL database connection, can be used for issuing queries
 * to the database. Used by PgSource but also directly by things like
 * PgSimpleFunctionCallPlan. Was once PgDataSource itself.
 */
export class PgExecutor {
  public name: string;
  private contextCallback: () => ObjectPlan<PgExecutorContextPlans>;
  private cache: WeakMap<
    Record<string, unknown> /* context */,
    LRU<
      string /* query and variables */,
      Map<string /* queryValues (JSON) */, Deferred<any[]>>
    >
  > = new WeakMap();

  constructor(options: {
    name: string;
    context: () => ObjectPlan<PgExecutorContextPlans>;
  }) {
    const { name, context } = options;
    this.name = name;
    this.contextCallback = context;
  }

  public toString(): string {
    return chalk.bold.blue(`PgExecutor(${this.name})`);
  }

  // public context(): ExecutablePlan<any>
  public context(): ObjectPlan<PgExecutorContextPlans> {
    return this.contextCallback();
  }

  private async _execute<TData>(
    context: PgExecutorContext,
    text: string,
    values: ReadonlyArray<SQLRawValue>,
  ) {
    let queryResult: PgClientResult<TData> | null = null,
      error: any = null;
    try {
      // TODO: we could probably make this more efficient by grouping the
      // deferreds further, DataLoader-style, and running one SQL query for
      // everything.
      queryResult = await context.withPgClient(context.pgSettings, (client) =>
        client.query({
          text,
          values: values as SQLRawValue[],
          arrayMode: true,
        }),
      );
    } catch (e) {
      error = e;
    }
    debugVerbose(`\


${"👇".repeat(30)}
# SQL QUERY:
${formatSQLForDebugging(text, error)}

# PLACEHOLDERS:
${inspect(values, { colors: true })}

${
  error
    ? `\
# ERROR:
${inspect(error, { colors: true })}`
    : `\
# RESULT:
${inspect(queryResult?.rows, { colors: true, depth: 6 })}`
}
${"👆".repeat(30)}


`);
    if (error) {
      throw error;
    }
    if (!queryResult) {
      // Appease TypeScript
      throw new Error("No query result and no error? Impossible.");
    }
    return queryResult;
  }

  public async executeWithCache<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    common: PgExecutorOptions,
  ): Promise<{
    values: CrystalValuesList<ReadonlyArray<TOutput>>;
  }> {
    const { text, rawSqlValues, identifierIndex, queryValuesSymbol } = common;

    const valuesCount = values.length;
    const results: Deferred<Array<TOutput>>[] = new Array(valuesCount);

    // Group by context
    const groupMap = new Map<
      PgExecutorContext,
      Array<{
        queryValues: readonly any[];
        resultIndex: number;
      }>
    >();
    for (
      let resultIndex = 0, l = values.length;
      resultIndex < l;
      resultIndex++
    ) {
      const { context, queryValues } = values[resultIndex];

      let entry = groupMap.get(context);
      if (!entry) {
        entry = [];
        groupMap.set(context, entry);
      }
      entry.push({ queryValues, resultIndex });
    }

    // For each context, run the relevant fetches
    const promises: Promise<void>[] = [];
    for (const [context, batch] of groupMap.entries()) {
      promises.push(
        (async () => {
          // TODO: cache must factor in placeholders.
          let cacheForContext = this.cache.get(context);
          if (!cacheForContext) {
            cacheForContext = new LRU({ maxLength: 500 /* SQL queries */ });
            this.cache.set(context, cacheForContext);
          }

          const textAndValues = `${text}\n${JSON.stringify(rawSqlValues)}`;
          let cacheForQuery = cacheForContext.get(textAndValues);
          if (!cacheForQuery) {
            cacheForQuery = new Map();
            cacheForContext.set(textAndValues, cacheForQuery);
          }

          const scopedCache = cacheForQuery;

          const remaining: string[] = [];
          const remainingDeferreds: Array<Deferred<any[]>> = [];

          try {
            // Concurrent requests to the same queryValues should result in the same value/execution.
            const batchSize = batch.length;
            for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
              const { queryValues, resultIndex } = batch[batchIndex];
              const identifiersJSON = JSON.stringify(queryValues); // TODO: Canonical? Manual for perf?
              const existingResult = scopedCache.get(identifiersJSON);
              if (existingResult) {
                debugVerbose(
                  "%s served %o from cache: %c",
                  this,
                  identifiersJSON,
                  existingResult,
                );
                results[resultIndex] = existingResult;
              } else {
                debugVerbose(
                  "%s no entry for %o in cache %c",
                  this,
                  identifiersJSON,
                  scopedCache,
                );
                assert.ok(
                  remaining.includes(identifiersJSON) === false,
                  "Should only fetch each identifiersJSON once, future entries in the loop should receive previous deferred",
                );
                const pendingResult = defer<any[]>(); // CRITICAL: this MUST resolve later
                results[resultIndex] = pendingResult;
                scopedCache.set(identifiersJSON, pendingResult);
                remaining.push(identifiersJSON) - 1;
                remainingDeferreds.push(pendingResult);
              }
            }

            if (remaining.length) {
              let found = false;
              const sqlValues = rawSqlValues.map((v) => {
                // THIS IS A DELIBERATE HACK - we are replacing this symbol with a value
                // before executing the query.
                if (
                  identifierIndex != null &&
                  queryValuesSymbol != null &&
                  (v as any) === queryValuesSymbol
                ) {
                  found = true;
                  // Manual JSON-ing
                  return "[" + remaining.join(",") + "]";
                } else if (typeof v === "symbol") {
                  console.error(formatSQLForDebugging(text));
                  throw new Error(
                    `Unhandled symbol when executing query: '${String(v)}'`,
                  );
                } else {
                  return v;
                }
              });
              if (identifierIndex != null && !found) {
                throw new Error(
                  "Query with identifiers was executed, but no identifier reference was found in the values passed",
                );
              }
              // TODO: we could probably make this more efficient by grouping the
              // deferreds further, DataLoader-style, and running one SQL query for
              // everything.
              const queryResult = await this._execute<TOutput>(
                context,
                text,
                sqlValues,
              );
              const { rows } = queryResult;
              const groups: { [valueIndex: number]: any[] } =
                Object.create(null);
              for (let i = 0, l = rows.length; i < l; i++) {
                const result = rows[i];
                const valueIndex =
                  identifierIndex != null ? result[identifierIndex] : 0;
                if (!groups[valueIndex]) {
                  groups[valueIndex] = [result];
                } else {
                  groups[valueIndex].push(result);
                }
              }
              for (let i = 0, l = remainingDeferreds.length; i < l; i++) {
                const remainingDeferred = remainingDeferreds[i];
                const value = groups[i] ?? [];
                remainingDeferred.resolve(value);
              }
            }
          } catch (e) {
            // This block guarantees that all remainingDeferreds will be
            // rejected - we don't want defers hanging around!
            remainingDeferreds.forEach((d) => {
              try {
                if (d) {
                  d.reject(e);
                }
              } catch (e2) {
                // Ignore error when rejecting
                console.error(
                  `Encountered second error when rejecting deferred due to a different error; ignoring error: ${e2}`,
                );
              }
            });
            return Promise.reject(e);
          }
        })(),
      );
    }

    // Avoids UnhandledPromiseRejection error.
    await Promise.allSettled(promises);

    const finalResults = await Promise.all(results);
    return { values: finalResults };
  }

  public async executeMutation<TData>(
    options: PgExecutorMutationOptions,
  ): Promise<PgClientResult<TData>> {
    const { context, text, values } = options;

    const queryResult = await this._execute<TData>(context, text, values);

    // TODO: we could probably make this more efficient rather than blowing away the entire cache!
    // Wipe the cache since a mutation succeeded.
    this.cache.get(context)?.reset();

    return queryResult;
  }
}
