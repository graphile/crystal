import LRU from "@graphile/lru";
import * as assert from "assert";
import chalk from "chalk";
import debugFactory from "debug";
import {
Aether,  aether,
  CrystalValuesList,
  defer,
  Deferred,
  object,
 Plan  } from "graphile-crystal";
import { Pool } from "pg";
import sql, { SQL, SQLRawValue } from "pg-sql2";
import { inspect } from "util";

import { PgClassSelectPlan } from "./plans/pgClassSelect";

const debug = debugFactory("datasource:pg:PgDataSource");
const debugVerbose = debug.extend("verbose");

export abstract class DataSource<
  TData extends any,
  TInput extends any,
  TOptions extends { [key: string]: any }
> {
  /**
   * TypeScript hack so that we can retrieve the TData type from a data source
   * at a later time - needed so we can have strong typing on `.get()` and
   * similar methods.
   *
   * @internal
   */
  TData!: TData;

  constructor() {}

  abstract execute(
    values: ReadonlyArray<TInput>,
    options: TOptions,
  ): Promise<{ values: ReadonlyArray<TData> }>;
}

type PgDataSourceInput = { context: any; identifiers: ReadonlyArray<any> };
type PgDataSourceExecuteOptions = {
  text: string;
  rawSqlValues: Array<SQLRawValue | symbol>;
  identifierIndex?: number | null;
  identifierSymbol?: symbol | null;
};

/**
 * PG data source represents a PostgreSQL data source. This could be a table,
 * view, materialized view, function call, join, etc. Anything table-like.
 */
export class PgDataSource<
  TRow extends { [key: string]: any }
> extends DataSource<
  ReadonlyArray<TRow>,
  PgDataSourceInput,
  PgDataSourceExecuteOptions
> {
  /**
   * TypeScript hack so that we can retrieve the TRow type from a Postgres data
   * source at a later time - needed so we can have strong typing on `.get()`
   * and similar methods.
   *
   * @internal
   */
  TRow!: TRow;

  private cache: WeakMap<
    Record<string, unknown> /* context */,
    LRU<
      string /* query and variables */,
      Map<string /* identifiers (JSON) */, Deferred<any[]>>
    >
  > = new WeakMap();

  /**
   * @param tableIdentifier - the SQL for the `FROM` clause (without any
   * aliasing). If this is a subquery don't forget to wrap it in parens.
   * @param name - a nickname for this data source. Doesn't need to be unique
   * (but should be). Used for making the SQL query and debug messages easier
   * to understand.
   */
  constructor(
    public tableIdentifier: SQL,
    public name: string,
    public readonly pool: Pool,
  ) {
    super();
  }

  public toString(): string {
    return chalk.bold.blue(`PgDataSource(${this.name})`);
  }

  public context(): Plan<any> {
    const a: Aether = aether();
    return object({ pgSettings: a.contextPlan.get("pgSettings") });
  }

  public applyAuthorizationChecksToPlan($plan: PgClassSelectPlan<this>): void {
    // e.g. $plan.where(sql`user_id = ${me}`);
    $plan.where(sql`true /* authorization checks */`);
    return;
  }

  public async execute(
    values: CrystalValuesList<PgDataSourceInput>,
    common: PgDataSourceExecuteOptions,
  ): Promise<{ values: CrystalValuesList<ReadonlyArray<TRow>> }> {
    const { text, rawSqlValues, identifierIndex, identifierSymbol } = common;
    let sqlValues = rawSqlValues;

    const valuesCount = values.length;
    const results: Deferred<Array<TRow>>[] = new Array(valuesCount);

    // Group by context
    const groupMap = new Map();
    for (
      let resultIndex = 0, l = values.length;
      resultIndex < l;
      resultIndex++
    ) {
      const { context, identifiers } = values[resultIndex];
      if (!groupMap.get(context)) {
        groupMap.set(context, []);
      }
      groupMap.get(context).push({ identifiers, resultIndex });
    }

    // For each context, run the relevant fetches
    const promises: Promise<void>[] = [];
    for (const [context, batch] of groupMap.entries()) {
      promises.push(
        (async () => {
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

          // Concurrent requests to the same identifiers should result in the same value/execution.
          const batchSize = batch.length;
          for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
            const { identifiers, resultIndex } = batch[batchIndex];
            const identifiersJSON = JSON.stringify(identifiers); // TODO: Canonical? Manual for perf?
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
            if (identifierIndex != null) {
              assert.ok(identifierSymbol != null);
              let found = false;
              sqlValues = sqlValues.map((v) => {
                // THIS IS A DELIBERATE HACK - we are replacing this symbol with a value
                // before executing the query.
                if ((v as any) === identifierSymbol) {
                  found = true;
                  // Manual JSON-ing
                  return "[" + remaining.join(",") + "]";
                } else {
                  return v;
                }
              });
              if (!found) {
                throw new Error(
                  "Query with identifiers was executed, but no identifier reference was found in the values passed",
                );
              }
            }
            let queryResult: any, error: any;
            try {
              // TODO: we could probably make this more efficient by grouping the
              // deferreds further, DataLoader-style, and running one SQL query for
              // everything.
              queryResult = await this.pool.query({
                text,
                values: sqlValues,
                rowMode: "array",
              });
            } catch (e) {
              error = e;
            }
            console.log();
            console.log();
            console.log(`\
${"👇".repeat(30)}
# SQL QUERY:
${formatSQLForDebugging(text)}

# PLACEHOLDERS:
${inspect(sqlValues, { colors: true })}

${
  error
    ? `\
# ERROR:
${inspect(error, { colors: true })}`
    : `\
# RESULT:
${inspect(queryResult.rows, { colors: true, depth: 6 })}`
}
${"👆".repeat(30)}
`);
            console.log();
            console.log();
            if (error) {
              remainingDeferreds.forEach((d) => d.reject(error));
              return Promise.reject(error);
            }
            const { rows } = queryResult;
            const groups: { [valueIndex: number]: any[] } = Object.create(null);
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
        })(),
      );
    }

    // Avoids UnhandledPromiseRejection error.
    await Promise.allSettled(promises);

    const finalResults = await Promise.all(results);
    return { values: finalResults };
  }
}

// A simplified version of formatSQLForDebugging from graphile-build-pg
function formatSQLForDebugging(sql: string) {
  let colourIndex = 0;
  const allowedColours = [
    chalk.red,
    chalk.green,
    chalk.yellow,
    chalk.blue,
    chalk.magenta,
    chalk.cyan,
    chalk.white,
    chalk.black,
  ];

  function nextColor() {
    colourIndex = (colourIndex + 1) % allowedColours.length;
    return allowedColours[colourIndex];
  }
  const colours = {};

  /* Yep - that's `colour` from English and `ize` from American */
  function colourize(str: string) {
    if (!colours[str]) {
      colours[str] = nextColor();
    }
    return colours[str].bold.call(null, str);
  }

  const colouredSql = sql.replace(/__[a-z0-9_]+_[0-9]+(?:__)?/g, colourize);
  return colouredSql;
}
