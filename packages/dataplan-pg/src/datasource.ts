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
import { __ValuePlan, arraysMatch, defer } from "graphile-crystal";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql from "pg-sql2";
import { inspect } from "util";

import { PgClassSelectPlan } from "./plans/pgClassSelect";
import type { PgClassSelectSinglePlan } from "./plans/pgClassSelectSingle";

const debug = debugFactory("datasource:pg:PgDataSource");
const debugVerbose = debug.extend("verbose");

abstract class DataSource<
  TData extends any,
  TInput extends any,
  TOptions extends { [key: string]: any },
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

export type PgDataSourceInput = {
  context: PgDataSourceContext;
  identifiers: ReadonlyArray<any>;
  placeholders: ReadonlyArray<any>;
};
export type PgDataSourceExecuteOptions = {
  text: string;
  rawSqlValues: Array<SQLRawValue | symbol>;
  identifierIndex?: number | null;
  identifierSymbol?: symbol | null;
  placeholderSymbols: symbol[];
};

export type WithPgClient = <T>(
  pgSettings: { [key: string]: string },
  callback: (client: PgClient) => T | Promise<T>,
) => Promise<T>;

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

export interface PgClient {
  query<TData>(opts: PgClientQuery): Promise<{ rows: readonly TData[] }>;

  // TODO: add transaction support
}

export type PgDataSourceContext<TSettings = any> = {
  pgSettings: TSettings;
  withPgClient: WithPgClient;
};

type PgDataSourceColumns = {
  [columnName: string]: PgDataSourceColumn<any>;
};

export interface PgDataSourceColumn<TData extends any> {
  gql2pg: (graphqlValue: TData) => SQL;
  pg2gql: (postgresValue: unknown) => TData;
  notNull: boolean;
  type: SQL;
}

type PgDataSourceRow<TColumns extends PgDataSourceColumns> = {
  [key in keyof TColumns]: ReturnType<TColumns[key]["pg2gql"]>;
};

type TuplePlanMap<
  TColumns extends { [column: string]: any },
  TTuple extends ReadonlyArray<keyof TColumns>,
> = {
  [Index in keyof TTuple]: {
    [key in TTuple[number]]: ExecutablePlan<
      ReturnType<TColumns[key]["pg2gql"]>
    >;
  };
};

type PlanByUniques<
  TColumns extends { [column: string]: any },
  TCols extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
> = TuplePlanMap<TColumns, TCols[number]>[number];

/**
 * PG data source represents a PostgreSQL data source. This could be a table,
 * view, materialized view, function call, join, etc. Anything table-like.
 */
export class PgDataSource<
  TColumns extends PgDataSourceColumns,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
> extends DataSource<
  ReadonlyArray<PgDataSourceRow<TColumns>>,
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
  TRow!: PgDataSourceRow<TColumns>;

  private cache: WeakMap<
    Record<string, unknown> /* context */,
    LRU<
      string /* query and variables */,
      Map<string /* identifiers (JSON) */, Deferred<any[]>>
    >
  > = new WeakMap();

  public source: SQL;
  public name: string;
  private contextCallback: () => ObjectPlan<PgDataSourceContext>;
  public columns: TColumns;
  public uniques: TUniques;

  /**
   * @param source - the SQL for the `FROM` clause (without any
   * aliasing). If this is a subquery don't forget to wrap it in parens.
   * @param name - a nickname for this data source. Doesn't need to be unique
   * (but should be). Used for making the SQL query and debug messages easier
   * to understand.
   */
  constructor(options: {
    name: string;
    source: SQL;
    context: () => ObjectPlan<PgDataSourceContext>;
    columns: TColumns;
    uniques: TUniques;
  }) {
    super();
    const { context, source, name, columns, uniques } = options;
    this.source = source;
    this.name = name;
    this.contextCallback = context;
    this.columns = columns;
    this.uniques = uniques;
  }

  public toString(): string {
    return chalk.bold.blue(`PgDataSource(${this.name})`);
  }

  public context(): ExecutablePlan<any> {
    return this.contextCallback();
  }

  public get(
    spec: PlanByUniques<TColumns, TUniques>,
  ): PgClassSelectSinglePlan<this> {
    const keys: ReadonlyArray<keyof TColumns> = Object.keys(spec);
    if (!this.uniques.some((uniq) => uniq.every((key) => keys.includes(key)))) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) but that combination of columns is not unique. Did you mean to call .find() instead?`,
      );
    }
    return this.find(spec).single();
  }

  public find(
    spec: { [key in keyof TColumns]?: ExecutablePlan } = {},
  ): PgClassSelectPlan<this> {
    const keys: ReadonlyArray<keyof TColumns> = Object.keys(spec);
    const invalidKeys = keys.filter((key) => this.columns[key] == null);
    if (invalidKeys.length > 0) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) but that request included columns that we don't know about: '${invalidKeys.join(
          "', '",
        )}'`,
      );
    }

    const identifiers = keys.map((key) => {
      const column = this.columns[key];
      const { type } = column;
      const plan: ExecutablePlan | undefined = spec[key];
      if (plan == undefined) {
        throw new Error(
          `Attempted to call ${this}.get({${keys.join(
            ", ",
          )}}) but failed to provide a plan for '${key}'`,
        );
      }
      return {
        plan,
        type,
      };
    });
    const identifiersMatchesThunk = (alias: SQL) =>
      keys.map((key) => sql`${alias}.${sql.identifier(key as string)}`);
    return new PgClassSelectPlan(this, identifiers, identifiersMatchesThunk);
  }

  public applyAuthorizationChecksToPlan($plan: PgClassSelectPlan<this>): void {
    // e.g. $plan.where(sql`user_id = ${me}`);
    $plan.where(sql`true /* authorization checks */`);
    return;
  }

  public async execute(
    values: CrystalValuesList<PgDataSourceInput>,
    common: PgDataSourceExecuteOptions,
  ): Promise<{
    values: CrystalValuesList<ReadonlyArray<PgDataSourceRow<TColumns>>>;
  }> {
    const {
      text,
      rawSqlValues,
      identifierIndex,
      identifierSymbol,
      placeholderSymbols,
    } = common;
    let sqlValues = rawSqlValues;

    const valuesCount = values.length;
    const results: Deferred<Array<PgDataSourceRow<TColumns>>>[] = new Array(
      valuesCount,
    );

    type Placeholders = readonly any[];

    const cache: Array<readonly any[]> = [];
    // Dedupes the placeholders
    const findMatchingOrAdd = (
      placeholders: readonly any[],
    ): readonly any[] => {
      for (let i = 0, l = cache.length; i < l; i++) {
        if (arraysMatch(placeholders, cache[i])) {
          return cache[i];
        }
      }
      cache.push(placeholders);
      return placeholders;
    };

    // Group by context
    const groupMap = new Map<
      PgDataSourceContext,
      Map<
        Placeholders,
        Array<{
          identifiers: readonly any[];
          resultIndex: number;
        }>
      >
    >();
    for (
      let resultIndex = 0, l = values.length;
      resultIndex < l;
      resultIndex++
    ) {
      const {
        context,
        identifiers,
        placeholders: rawPlaceholders,
      } = values[resultIndex];
      const placeholders = findMatchingOrAdd(rawPlaceholders);

      let contextMap = groupMap.get(context);
      if (!contextMap) {
        contextMap = new Map();
        groupMap.set(context, contextMap);
      }
      let entry = contextMap.get(placeholders);
      if (!entry) {
        entry = [];
        contextMap.set(placeholders, entry);
      }
      entry.push({ identifiers, resultIndex });
    }

    // For each context, run the relevant fetches
    const promises: Promise<void>[] = [];
    for (const [context, placeholderMap] of groupMap.entries()) {
      for (const [placeholders, batch] of placeholderMap.entries()) {
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
                let found = false;
                sqlValues = sqlValues.map((v) => {
                  // THIS IS A DELIBERATE HACK - we are replacing this symbol with a value
                  // before executing the query.
                  if (
                    identifierIndex != null &&
                    identifierSymbol != null &&
                    (v as any) === identifierSymbol
                  ) {
                    found = true;
                    // Manual JSON-ing
                    return "[" + remaining.join(",") + "]";
                  } else if (typeof v === "symbol") {
                    const index = placeholderSymbols.indexOf(v);
                    if (index >= 0) {
                      return placeholders[index];
                    } else {
                      console.error(formatSQLForDebugging(text));
                      console.error(placeholderSymbols);
                      throw new Error(
                        `Unhandled symbol when executing query: '${String(v)}'`,
                      );
                    }
                  } else {
                    return v;
                  }
                });
                if (identifierIndex != null && !found) {
                  throw new Error(
                    "Query with identifiers was executed, but no identifier reference was found in the values passed",
                  );
                }
                let queryResult: any, error: any;
                try {
                  // TODO: we could probably make this more efficient by grouping the
                  // deferreds further, DataLoader-style, and running one SQL query for
                  // everything.
                  queryResult = await context.withPgClient(
                    context.pgSettings,
                    (client) =>
                      client.query({
                        text,
                        values: sqlValues,
                        arrayMode: true,
                      }),
                  );
                } catch (e) {
                  error = e;
                }
                debugVerbose(`\


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
                if (error) {
                  throw error;
                }
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

  const colouredSql = sql.replace(/__[a-z0-9_]+(?:_[0-9]+|__)/g, colourize);
  return colouredSql;
}
