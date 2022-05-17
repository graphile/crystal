import LRU from "@graphile/lru";
import * as assert from "assert";
import chalk from "chalk";
import type {
  CrystalError,
  CrystalResultStreamList,
  CrystalValuesList,
  Deferred,
  ExecutablePlan,
  ExecutionEventEmitter,
  ObjectPlan,
  PromiseOrDirect,
} from "dataplanner";
import { defer, isAsyncIterable, isDev } from "dataplanner";
import debugFactory from "debug";
import type { SQLRawValue } from "pg-sql2";
import { inspect } from "util";

import { formatSQLForDebugging } from "./formatSQLForDebugging.js";

const LOOK_DOWN = "👇".repeat(30);
const LOOK_UP = "👆".repeat(30);

const $$FINISHED: unique symbol = Symbol("finished");

class Wrapped<T extends Error | typeof $$FINISHED = Error | typeof $$FINISHED> {
  constructor(public originalValue: T) {}
}

let cursorCount = 0;

const debug = debugFactory("datasource:pg:PgExecutor");
const debugVerbose = debug.extend("verbose");

type ExecuteFunction = <TData>(
  text: string,
  values: ReadonlyArray<SQLRawValue>,
) => Promise<PgClientResult<TData>>;

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
  /**
   * For `SELECT` or `INSERT/UPDATE/DELETE ... RETURNING` this will be the list
   * of rows returned.
   */
  rows: readonly TData[];
  /**
   * For `INSERT/UPDATE/DELETE` without `RETURNING`, this will be the number of
   * rows created/updated/deleted.
   */
  rowCount: number;
}

/**
 * This is a generic interface that your Postgres client must honor; have a
 * look at adaptors/node-postgres.ts for an example of a compliant
 * implementation that uses the `pg` module, but you should be able to write
 * an adaptor for many different Postgres drivers.
 */
export interface PgClient {
  query<TData>(opts: PgClientQuery): Promise<PgClientResult<TData>>;
  /**
   * Listens to the given topic and calls the callback on matching events.
   * Returns a function to call to stop listening.
   */
  listen?<TEvent>(
    topic: string,
    callback: (event: TEvent) => void,
  ): Promise<() => void>;

  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}

export interface WithPgClient {
  <T>(
    pgSettings: { [key: string]: string } | null,
    callback: (client: PgClient) => T | Promise<T>,
  ): Promise<T>;

  release?(): PromiseOrDirect<void>;
}

export type PgExecutorContext<TSettings = any> = {
  pgSettings: TSettings;
  withPgClient: WithPgClient;
};

export type PgExecutorContextPlans<TSettings = any> = {
  pgSettings: ExecutablePlan<TSettings>;
  withPgClient: ExecutablePlan<WithPgClient>;
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
  name?: string;
  eventEmitter: ExecutionEventEmitter | undefined;
};

export type PgExecutorMutationOptions = {
  context: PgExecutorContext;
  text: string;
  values: ReadonlyArray<SQLRawValue>;
};

export type PgExecutorSubscribeOptions = {
  context: PgExecutorContext;
  topic: string;
};

/**
 * Represents a PostgreSQL database connection, can be used for issuing queries
 * to the database. Used by PgSource but also directly by things like
 * PgSimpleFunctionCallPlan. Was once PgDataSource itself. Multiple PgExecutors
 * can exist in the same schema. PgExecutor is also responsible for things like
 * caching.
 */
export class PgExecutor<TSettings = any> {
  public name: string;
  private contextCallback: () => ObjectPlan<PgExecutorContextPlans<TSettings>>;
  private $$cache: symbol;

  constructor(options: {
    name: string;
    context: () => ObjectPlan<PgExecutorContextPlans<TSettings>>;
  }) {
    const { name, context } = options;
    this.name = name;
    this.$$cache = Symbol(this.name + "_cache");
    this.contextCallback = context;
  }

  public toString(): string {
    return chalk.bold.blue(`PgExecutor(${this.name})`);
  }

  // public context(): ExecutablePlan<any>
  public context(): ObjectPlan<PgExecutorContextPlans<TSettings>> {
    return this.contextCallback();
  }

  private async _executeWithClient<TData>(
    client: PgClient,
    text: string,
    values: ReadonlyArray<SQLRawValue>,
    name?: string,
  ): Promise<PgClientResult<TData>> {
    let queryResult: PgClientResult<TData> | null = null,
      error: any = null;
    const start = process.hrtime.bigint();
    try {
      queryResult = await client.query({
        text,
        values: values as SQLRawValue[],
        arrayMode: true,
        name,
      });
    } catch (e) {
      error = e;
    }
    if (debugVerbose.enabled) {
      const end = process.hrtime.bigint();
      // TODO: why use bigint if you're just going to round it? :D
      const duration = (Number((end - start) / 10000n) / 100).toFixed(2) + "ms";
      const rows = queryResult?.rows;
      const rowResults =
        rows && rows.length > 10
          ? "[\n  " +
            rows
              .slice(0, 3)
              .map((row) =>
                inspect(row, { colors: true, depth: 5 }).replace(/\n/g, "\n  "),
              )
              .join(",\n  ") +
            ",\n\n  ...\n\n  " +
            rows
              .slice(rows.length - 3)
              .map((row) =>
                inspect(row, { colors: true, depth: 5 }).replace(/\n/g, "\n  "),
              )
              .join("\n  ") +
            "\n]"
          : inspect(queryResult?.rows, { colors: true, depth: 6 });
      debugVerbose(
        `\


%s
# SQL QUERY:
%s

# PLACEHOLDERS:
%o

${
  error
    ? `\
# ERROR:
%o`
    : `\
# RESULT:
%s`
}

# DURATION
${duration}
%s


`,
        LOOK_DOWN,
        formatSQLForDebugging(text, error),
        values,
        error ? error : rowResults,
        LOOK_UP,
      );
    }
    if (error) {
      throw error;
    }
    if (!queryResult) {
      // Appease TypeScript
      throw new Error("No query result and no error? Impossible.");
    }
    return queryResult;
  }

  private async _execute<TData>(
    context: PgExecutorContext,
    text: string,
    values: ReadonlyArray<SQLRawValue>,
    name?: string,
  ) {
    // TODO: we could probably make this more efficient by grouping the
    // deferreds further, DataLoader-style, and running one SQL query for
    // everything.
    return await context.withPgClient(context.pgSettings, (client) =>
      this._executeWithClient<TData>(client, text, values, name),
    );
  }

  private async withTransaction<T>(
    context: PgExecutorContext,
    callback: (execute: ExecuteFunction) => PromiseLike<T>,
  ): Promise<T> {
    return await context.withPgClient<T>(
      context.pgSettings,
      async (client): Promise<T> => {
        await client.startTransaction();
        try {
          const execute: ExecuteFunction = (text, values) =>
            this._executeWithClient(client, text, values);
          const result = await callback(execute);

          await client.commitTransaction();
          return result;
        } catch (e) {
          await client.rollbackTransaction();
          throw e;
        }
      },
    );
  }

  public async executeWithCache<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    common: PgExecutorOptions,
  ): Promise<{
    values: CrystalValuesList<ReadonlyArray<TOutput>>;
  }> {
    return this._executeWithOrWithoutCache<TInput, TOutput>(
      values,
      common,
      true,
    );
  }

  public async executeWithoutCache<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    common: PgExecutorOptions,
  ): Promise<{
    values: CrystalValuesList<ReadonlyArray<TOutput>>;
  }> {
    return this._executeWithOrWithoutCache<TInput, TOutput>(
      values,
      common,
      false,
    );
  }

  private async _executeWithOrWithoutCache<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    common: PgExecutorOptions,
    useCache: boolean,
  ): Promise<{
    values: CrystalValuesList<ReadonlyArray<TOutput>>;
  }> {
    const {
      text,
      rawSqlValues,
      identifierIndex,
      queryValuesSymbol,
      name,
      eventEmitter,
    } = common;

    eventEmitter?.emit("explainOperation", {
      operation: {
        type: "sql",
        title: `SQL query${name ? ` '${name.slice(0, 7)}...'` : ""}`,
        query: text,
        explain: undefined, // TODO: add explain output
      },
    });

    const valuesCount = values.length;
    const results: Array<Deferred<Array<TOutput>> | undefined> = [];

    // Group by context
    const groupMap = new Map<
      PgExecutorContext,
      Array<{
        queryValues: readonly any[];
        resultIndex: number;
      }>
    >();
    for (let resultIndex = 0, l = valuesCount; resultIndex < l; resultIndex++) {
      results[resultIndex] = undefined;
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
          let cacheForContext = useCache ? context[this.$$cache] : null;
          if (!cacheForContext) {
            cacheForContext = new LRU({ maxLength: 500 /* SQL queries */ });
            if (useCache) {
              context[this.$$cache] = cacheForContext;
            }
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
                if (debugVerbose.enabled) {
                  debugVerbose(
                    "%s served %o from cache: %c",
                    this,
                    identifiersJSON,
                    existingResult,
                  );
                }
                results[resultIndex] = existingResult;
              } else {
                if (debugVerbose.enabled) {
                  debugVerbose(
                    "%s no entry for %o in cache %c",
                    this,
                    identifiersJSON,
                    scopedCache,
                  );
                }
                if (isDev) {
                  assert.ok(
                    remaining.includes(identifiersJSON) === false,
                    "Should only fetch each identifiersJSON once, future entries in the loop should receive previous deferred",
                  );
                }
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
                name,
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

    const finalResults = await Promise.all(
      results as typeof results extends ReadonlyArray<infer U>
        ? ReadonlyArray<Exclude<U, undefined>>
        : never,
    );
    return { values: finalResults };
  }

  /**
   * Returns a list of streams (async iterables), one for each entry in
   * `values`, for the results from the cursor defined by running the query
   * `common.text` with the given variables.
   */
  public async executeStream<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    common: PgExecutorOptions,
  ): Promise<{
    streams: CrystalResultStreamList<TOutput>;
  }> {
    const { text, rawSqlValues, identifierIndex, queryValuesSymbol } = common;

    const valuesCount = values.length;
    const streams: Array<AsyncIterable<TOutput> | Promise<never> | null> = [];

    // Group by context
    const groupMap = new Map<
      PgExecutorContext,
      Array<{
        queryValues: readonly any[];
        resultIndex: number;
      }>
    >();
    for (let resultIndex = 0, l = valuesCount; resultIndex < l; resultIndex++) {
      streams[resultIndex] = null;
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
      const tx = defer();
      const promise = (async () => {
        const batchIndexesByIdentifiersJSON = new Map<string, number[]>();

        // Concurrent requests to the same queryValues should result in the same value/execution.
        const batchSize = batch.length;
        for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
          const { queryValues } = batch[batchIndex];
          const identifiersJSON = JSON.stringify(queryValues); // TODO: Canonical? Manual for perf?
          const existing = batchIndexesByIdentifiersJSON.get(identifiersJSON);
          if (existing) {
            existing.push(batchIndex);
            if (debugVerbose.enabled) {
              debugVerbose(
                "%s served %o again (%o)",
                this,
                identifiersJSON,
                existing,
              );
            }
            //results[resultIndex] = existingResult;
          } else {
            if (debugVerbose.enabled) {
              debugVerbose(
                "%s no entry for %o, allocating",
                this,
                identifiersJSON,
              );
            }
            batchIndexesByIdentifiersJSON.set(identifiersJSON, [batchIndex]);
          }
        }

        if (batchIndexesByIdentifiersJSON.size <= 0) {
          throw new Error(
            "GraphileInternalError<98699a62-cd44-4372-8e92-d730b116a51d>: empty batch doesn't make sense in this context.",
          );
        }

        let found = false;
        const remaining = [...batchIndexesByIdentifiersJSON.keys()];
        const batchIndexesByValueIndex = [
          ...batchIndexesByIdentifiersJSON.values(),
        ];

        // TODO: batchIndexesByIdentifiersJSON = null;

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

        // Maximum PostgreSQL identifier length is typically 63 bytes.
        // Minus the `__cursor___` text, this leaves 52 characters for this
        // counter. JS's largest safe integer is 2^53-1 which is 16 digits
        // long - well under the 52 character limit. Assuming we used 1000
        // cursors per second every second, it would take us 285k years to
        // exhaust this. Because this is a cursor we control and know is
        // PostgreSQL safe we don't need to escape it.
        const cursorIdentifier = `__cursor_${cursorCount++}__`;

        const batchFetchSize = 100;

        const declareCursorSQL = `declare ${cursorIdentifier} insensitive no scroll cursor without hold for\n${text}`;
        const pullViaCursorSQL = `fetch forward ${batchFetchSize} from ${cursorIdentifier}`;
        const releaseCursorSQL = `close ${cursorIdentifier}`;

        let _deferredStreams = 0;
        let valuesPending = 0;

        const pending: Array<any[]> = batch.map(() => []);
        const waiting: Array<Deferred<any> | null> = batch.map(() => null);
        let finished = false;

        // eslint-disable-next-line no-inner-declarations
        function getNext(batchIndex: number): Promise<any> | any {
          if (pending[batchIndex].length > 0) {
            valuesPending--;
            if (valuesPending < batchFetchSize && !fetching) {
              fetchNextBatch().then(null, handleFetchError);
            }
            const value = pending[batchIndex].shift();
            if (value instanceof Wrapped) {
              return Promise.reject(value.originalValue);
            } else {
              return value;
            }
          } else {
            _deferredStreams++;
            waiting[batchIndex] = defer<any>();
          }
        }

        // eslint-disable-next-line no-inner-declarations
        function supplyValue(batchIndex: number, value: any | Wrapped): void {
          const deferred = waiting[batchIndex];
          if (deferred) {
            _deferredStreams--;
            if (value instanceof Wrapped) {
              deferred.reject(value.originalValue);
            } else {
              deferred.resolve(value);
            }
          } else {
            valuesPending++;
            pending[batchIndex].push(value);
          }
        }

        const executePromise = defer<ExecuteFunction>();
        const handleFetchError = (error: Error) => {
          finished = true;
          tx.resolve();
          executePromise.reject(error);
          console.error("Error occurred:");
          console.error(error);
          for (let i = 0, l = batch.length; i < l; i++) {
            supplyValue(i, new Wrapped(error));
          }
        };

        this.withTransaction(context, (_execute) => {
          executePromise.resolve(_execute);
          return tx;
        }).then(null, handleFetchError);
        const execute = await executePromise;

        // eslint-disable-next-line no-inner-declarations
        let fetching = false;
        const fetchNextBatch = async (): Promise<void> => {
          if (fetching) {
            return;
          }
          if (finished) {
            return;
          }
          fetching = true;
          const queryResult = await execute<TOutput>(pullViaCursorSQL, []);
          const { rows } = queryResult;
          if (rows.length < batchFetchSize) {
            finished = true;
            tx.resolve();
          }
          for (let i = 0, l = rows.length; i < l; i++) {
            const result = rows[i];
            const valueIndex =
              identifierIndex != null ? result[identifierIndex] : 0;
            const batchIndexes = batchIndexesByValueIndex[valueIndex];
            if (!batchIndexes) {
              throw new Error(
                `GraphileInternalError<8f513ceb-a3dc-4ec7-9ca1-0f0d4576a22d>: could not determine the identifier JSON for value index '${valueIndex}'`,
              );
            }
            for (let i = 0, l = batchIndexes.length; i < l; i++) {
              supplyValue(batchIndexes[i], result);
            }
          }
          fetching = false;
          if (finished) {
            // We've hit the end of the road
            for (let i = 0, l = batch.length; i < l; i++) {
              supplyValue(i, new Wrapped($$FINISHED));
            }
          } else {
            if (valuesPending < batchFetchSize) {
              fetchNextBatch().then(null, handleFetchError);
            }
          }
        };

        // Registers the cursor
        await execute<TOutput>(declareCursorSQL, sqlValues);
        // TODO: if the above statement(s) throw an error, is the resulting stream being null okay?

        // Ensure we release the cursor now we've registered it.
        try {
          fetchNextBatch().then(null, handleFetchError);
          batch.forEach(({ resultIndex }, batchIndex) => {
            streams[resultIndex] = (async function* () {
              try {
                for (;;) {
                  yield await getNext(batchIndex);
                }
              } catch (e) {
                if (e === $$FINISHED) {
                  return;
                } else {
                  throw e;
                }
              }
            })();
          });
        } finally {
          // Release the cursor
          await execute(releaseCursorSQL, []);
        }
      })();
      promise.then(null, (e) => {
        console.error("UNEXPECTED ERROR!");
        console.error(e);
        tx.resolve();
        batch.forEach(({ resultIndex }) => {
          if (isAsyncIterable(streams[resultIndex])) {
            streams[resultIndex]![Symbol.asyncIterator].throw?.(e);
          }
          streams[resultIndex] = Promise.reject(e);
        });
      });
      promises.push(promise);
    }

    // Avoids UnhandledPromiseRejection error.
    await Promise.allSettled(promises);

    return { streams: streams as Array<AsyncIterable<TOutput> | CrystalError> };
  }

  public async executeMutation<TData>(
    options: PgExecutorMutationOptions,
  ): Promise<PgClientResult<TData>> {
    const { context, text, values } = options;

    const queryResult = await this._execute<TData>(context, text, values);

    // TODO: we could probably make this more efficient rather than blowing away the entire cache!
    // Wipe the cache since a mutation succeeded.
    context[this.$$cache]?.reset();

    return queryResult;
  }
}

Object.defineProperty(PgExecutor, "$$export", {
  value: { moduleName: "@dataplan/pg", exportName: "PgExecutor" },
});
