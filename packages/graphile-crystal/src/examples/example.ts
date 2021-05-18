/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
/*
 * Regular forum. Except, some forums are private.
 *
 * Forums are owned by an organization.
 *
 * Users can only see posts in a private forum if:
 * 1. they are a member of the parent organization, and
 * 2. the organization's subscription is active.
 *
 * To assert the parent organization is up to date with their subscription, we
 * check with Stripe. (Poor example, we'd normally do this with database
 * column, but shows integration of external data into query planning.)
 */

import * as assert from "assert";
import chalk from "chalk";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  graphql,
  GraphQLString,
  GraphQLObjectTypeConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  ExecutionResult,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLInputObjectType,
  Thunk,
} from "graphql";
import sql, { SQL, SQLRawValue } from "pg-sql2";
import { crystalEnforce } from "..";
import {
  Plan,
  __TrackedObjectPlan,
  __ValuePlan,
  __ListItemPlan,
} from "../plan";
import prettier from "prettier";

import { Pool } from "pg";
import { resolve } from "path";
import { inspect } from "util";
import debugFactory from "debug";
import { map, object, aether, first } from "../plans";
import LRU from "@graphile/lru";
import { Deferred, defer } from "../deferred";
import { Aether } from "../aether";
import { CrystalValuesList, CrystalResultsList } from "../interfaces";

//const EMPTY_OBJECT = Object.freeze(Object.create(null));
const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);
const debug = debugFactory("crystal:example");

const testPool = new Pool({ connectionString: "graphile_crystal" });

const $$CURSOR = Symbol("connection-cursor");

// These are what the generics extend from
export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {}
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: any;
}

// This is the actual runtime context; we should not use a global for this.
export interface GraphileResolverContext extends BaseGraphQLContext {}

/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/

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
class PgDataSource<TRow extends { [key: string]: any }> extends DataSource<
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
    public readonly pool: Pool = testPool,
  ) {
    super();
  }

  toString() {
    return chalk.bold.blue(`PgDataSource(${this.name})`);
  }

  context() {
    const a: Aether = aether();
    return object({ pgSettings: a.contextPlan.get("pgSettings") });
  }

  applyAuthorizationChecksToPlan($plan: PgClassSelectPlan<this>) {
    // e.g. $plan.where(sql`user_id = ${me}`);
    $plan.where(sql`true /* authorization checks */`);
    return;
  }

  async execute(
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
              debug(
                "%s served %s from cache: %o",
                this,
                identifiersJSON,
                existingResult,
              );
              results[resultIndex] = existingResult;
            } else {
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
${inspect(queryResult.rows, { colors: true })}`
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

    await Promise.all(promises);

    const finalResults = await Promise.all(results);
    return { values: finalResults };
  }
}

const messageSource = new PgDataSource<{
  id: string;
  body: string;
  author_id: string;
  forum_id: string;
  created_at: Date;
}>(sql`app_public.messages`, "messages");

const userSource = new PgDataSource<{
  id: string;
  username: string;
  gravatar_url?: string;
  created_at: Date;
}>(sql`app_public.users`, "users");

const forumSource = new PgDataSource<{
  id: string;
  name: string;
}>(sql`app_public.forums`, "forums");

/** TODO: permissions
 *
 * Permissions are probably part of the datasource; but how we apply them is
 * not clear. Perhaps via executeQueryWithDataSource? May need to add
 * additional where clauses/joins/etc? What does this mean for cacheability?
 * Can we do this earlier? If the data is requested through a route where
 * security is already enforced (e.g. `currentUser{postsByAuthorId{ ... }}`)
 * can we bypass adding the checks? Can the checks get merged via plan
 * optimisation? Are the security checks part of the plan itself?
 */

// Convenience so we don't have to type these out each time. These used to be
// separate plans, but required too much maintenance.
type MessagesPlan = PgClassSelectPlan<typeof messageSource>;
type MessageConnectionPlan = PgConnectionPlan<typeof messageSource>;
type MessagePlan = PgClassSelectSinglePlan<typeof messageSource>;
type UsersPlan = PgClassSelectPlan<typeof userSource>;
type UserPlan = PgClassSelectSinglePlan<typeof userSource>;
type ForumsPlan = PgClassSelectPlan<typeof forumSource>;
type ForumPlan = PgClassSelectSinglePlan<typeof forumSource>;

/*+--------------------------------------------------------------------------+
  |                            PLANS SPECS                                   |
  +--------------------------------------------------------------------------+*/

/*+--------------------------------------------------------------------------+
  |                          GRAPHQL HELPERS                                 |
  +--------------------------------------------------------------------------+*/
/**
 * Plan resolvers are like regular resolvers except they're called beforehand,
 * they return plans rather than values, and they only run once for lists
 * rather than for each item in the list.
 *
 * The idea is that the plan resolver returns a plan object which later will
 * process the data and feed that into the actual resolver functions
 * (preferably using the default resolver function?).
 *
 * They are stored onto `<field>.extensions.graphile.plan`
 *
 * @returns a plan for this field.
 *
 * @remarks
 * We're using `TrackedObject<...>` so we can later consider caching these
 * executions.
 */
export type PlanResolver<
  TContext extends BaseGraphQLContext,
  TArgs extends BaseGraphQLArguments,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>
> = (
  $parentPlan: TParentPlan,
  args: __TrackedObjectPlan<TArgs>,
  context: __TrackedObjectPlan<TContext>,
) => TResultPlan;

/**
 * Basically GraphQLFieldConfig but with an easy to access `plan` method.
 */
type GraphileCrystalFieldConfig<
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>,
  TArgs extends BaseGraphQLArguments
> = GraphQLFieldConfig<any, any> & {
  plan?: PlanResolver<TContext, TArgs, TParentPlan, TResultPlan>;
};

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
function objectFieldSpec<
  TContext extends BaseGraphQLContext,
  TSource extends Plan<any>,
  TResult extends Plan<any> = Plan<any>,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments
>(
  graphileSpec: GraphileCrystalFieldConfig<TContext, TSource, TResult, TArgs>,
): GraphQLFieldConfig<any, TContext, TArgs> {
  const { plan, ...spec } = graphileSpec;
  return {
    ...spec,
    extensions: {
      graphile: {
        plan,
      },
    },
  };
}

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
function objectSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any>
>(
  spec: Omit<GraphQLObjectTypeConfig<any, TContext>, "fields"> & {
    fields: Thunk<{
      [key: string]: GraphileCrystalFieldConfig<
        TContext,
        TParentPlan,
        any,
        any
      >;
    }>;
  },
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = objectFieldSpec<TContext, TParentPlan>(fields[key]);
        return o;
      }, {} as GraphQLFieldConfigMap<any, TContext>);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

/**
 * A plan for selecting a column. Keep in mind that a column might not be a
 * scalar (could be a list, compound type, JSON, geometry, etc), so this might
 * not be a "leaf"; it might be used as the input of another layer of plan.
 */
class PgColumnSelectPlan<
  TDataSource extends PgDataSource<any>,
  TColumn extends keyof TDataSource["TRow"]
> extends Plan<TDataSource["TRow"][TColumn]> {
  private tableId: number;
  constructor(
    public table: PgClassSelectSinglePlan<TDataSource>,
    // This is the numeric index the parent PgClassSelectPlan gave us to represent this value
    private attrIndex: number,
    private attr: TColumn,
    private expression: SQL,
  ) {
    super();
    this.tableId = this.addDependency(table);
    debug(`%s (%s = .%s) constructor`, this, attrIndex, this.attr);
  }

  execute(values: any[][]) {
    const result = values.map((v) => v[this.tableId][this.attrIndex]);
    debug("%s values: %c, result: %c", this, values, result);
    return result;
  }

  toSQL(): SQL {
    return this.expression;
  }
}

/**
 * A plan for selecting a column. Keep in mind that a column might not be a
 * scalar (could be a list, compound type, JSON, geometry, etc), so this might
 * not be a "leaf"; it might be used as the input of another layer of plan.
 */
class PgAttributeSelectPlan<TData = any> extends Plan<any> {
  private parentPlanIndex: number;
  constructor(
    parentPlan: PgClassSelectSinglePlan<any>,
    private attrIndex: number,
  ) {
    super();
    this.parentPlanIndex = this.addDependency(parentPlan);
    debug(`%s (%s) constructor`, this, attrIndex);
  }

  execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
  ): CrystalResultsList<TData> {
    return values.map((v) => v[this.parentPlanIndex][this.attrIndex]);
  }
}

/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <columns>, <cursor?> FROM <table>`.  It's not
 * currently clear if it also includes `WHERE <conditions>`,
 * `ORDER BY <order>`, `LEFT JOIN <join>`, etc within its scope. `GROUP BY` is
 * definitely not in scope, because that would invalidate the identifiers.
 *
 * I currently don't expect this to be used to select sets of scalars, but it
 * could be used for that purpose so long as we name the scalars (i.e. create
 * records from them `{a: 1},{a: 2},{a:3}`).
 */
class PgClassSelectPlan<TDataSource extends PgDataSource<any>> extends Plan<
  ReadonlyArray<TDataSource["TRow"]>
> {
  symbol: symbol;

  /** = sql.identifier(this.symbol) */
  alias: SQL;

  /**
   * The data source from which we are selecting: table, view, etc
   */
  dataSource: TDataSource;

  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to identify which records in the result set should be returned to which
   * GraphQL resolvers.
   */
  private identifiers: Array<{ plan: Plan<any>; type: SQL }>;

  /**
   * This is an array with the same length as identifiers that returns the
   * index in this.dependencies for the relevant plan.
   */
  private identifierIds: number[];

  /**
   * So we can clone.
   */
  private identifierMatchesThunk: (alias: SQL) => SQL[];

  /**
   * This is the list of SQL fragments in the result that are compared to the
   * above `identifiers` to determine if there's a match or not. Typically this
   * will be a list of columns (e.g. primary or foreign keys on the table).
   */
  private identifierMatches: SQL[];

  /**
   * If this plan has identifiers, what's the alias for the identifiers 'table'.
   */
  private identifiersAlias: SQL | null;

  /**
   * If this plan has identifiers, we must feed the identifiers into the values
   * to feed into the SQL statement after compiling the query; we'll use this
   * symbol as the placeholder to replace.
   */
  private identifierSymbol: symbol;

  /**
   * If true, we don't need to add any of the security checks from the data
   * source; otherwise we must do so. Default false.
   */
  private isTrusted: boolean;

  /**
   * If true, we know at most one result can be matched for each identifier, so
   * it's safe to do a `LEFT JOIN` without risk of returning duplicates. Default false.
   */
  private isUnique: boolean;

  /**
   * If true, we will not attempt to inline this into the parent query.
   * Default false.
   */
  private isInliningForbidden = false;

  /**
   * The list of things we're selecting
   */
  private selects: Array<SQL | symbol>;

  private contextId: number;

  private finalizeResults: {
    text: string;
    rawSqlValues: (SQLRawValue | symbol)[];
    identifierIndex: number | null;
  } | null = null;

  constructor(
    dataSource: TDataSource,
    identifiers: Array<{ plan: Plan<any>; type: SQL }>,
    identifierMatchesThunk: (alias: SQL) => SQL[],
    cloneFrom: PgClassSelectPlan<TDataSource> | null = null,
  ) {
    super();
    this.dataSource = dataSource;
    this.contextId = this.addDependency(this.dataSource.context());
    this.identifiers = identifiers;
    this.identifierIds = identifiers.map(({ plan }) =>
      this.addDependency(plan),
    );
    this.identifierMatchesThunk = identifierMatchesThunk;

    this.identifierSymbol = cloneFrom
      ? cloneFrom.identifierSymbol
      : Symbol(dataSource.name + "_identifier_values");
    this.symbol = cloneFrom ? cloneFrom.symbol : Symbol(dataSource.name);
    this.alias = cloneFrom ? cloneFrom.alias : sql.identifier(this.symbol);
    this.identifierMatches = cloneFrom
      ? cloneFrom.identifierMatches
      : identifierMatchesThunk(this.alias);
    this.joins = cloneFrom ? [...cloneFrom.joins] : [];
    this.selects = cloneFrom ? [...cloneFrom.selects] : [];
    // this.cursorPlan = cloneFrom ? cloneFrom.cursorPlan : null;
    this.identifiersAlias = cloneFrom
      ? cloneFrom.identifiersAlias
      : this.identifiers.length
      ? sql.identifier(Symbol(this.dataSource.name + "_identifiers"))
      : null;
    this.isTrusted = cloneFrom ? cloneFrom.isTrusted : false;
    this.isUnique = cloneFrom ? cloneFrom.isUnique : false;
    this.isInliningForbidden = cloneFrom
      ? cloneFrom.isInliningForbidden
      : false;

    if (!cloneFrom) {
      if (this.identifiers.length !== this.identifierMatches.length) {
        throw new Error(
          `'identifiers' and 'identifierMatches' lengths must match (${this.identifiers.length} != ${this.identifierMatches.length})`,
        );
      }
    }
    debug(
      `%s (%s) constructor (%s)`,
      this,
      this.dataSource.name,
      cloneFrom ? "clone" : "original",
    );
    return this;
  }

  public setInliningForbidden(newInliningForbidden = true) {
    this.isInliningForbidden = newInliningForbidden;
    return this;
  }

  public inliningForbidden() {
    return this.isInliningForbidden;
  }

  public setTrusted(newIsTrusted = true) {
    this.isTrusted = newIsTrusted;
    return this;
  }

  public trusted() {
    return this.isTrusted;
  }

  /**
   * Set this true ONLY if there can be at most one match for each of the
   * identifiers. If you set this true when this is not the case then you may
   * get unexpected results during inlining; if in doubt leave it at the
   * default.
   */
  public setUnique(newUnique = true) {
    this.isUnique = newUnique;
    return this;
  }

  public unique() {
    return this.isUnique;
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   */
  public select(fragment: SQL | symbol): number {
    return this.selects.push(fragment) - 1;
  }

  /*
   * Select an SQL fragment, returning a plan.
   * /
  public select<TData = any>(
    fragment: SQL | symbol,
  ): PgAttributeSelectPlan<TData> {
    const attrIndex = this._select(fragment);
    return new PgAttributeSelectPlan(this, attrIndex);
  }
  */

  /*
  // TODO: rename this item from `.get` to something more subtle (`._itemGet`
  // or similar) since you wouldn't normally call `.get` on a list - only on an
  // item of that list via PgClassSelectSinglePlan.
  /**
   * Returns a plan representing a named attribute (e.g. column) from the class
   * (e.g. table).
   * /
  get<TAttr extends keyof TDataSource["TRow"]>(
    attr: TAttr,
  ): PgColumnSelectPlan<TDataSource, TAttr> {
    // Only one plan per column
    if (!this.colPlans[attr]) {
      // TODO: where do we do the SQL conversion, e.g. to_json for dates to
      // enforce ISO8601? Perhaps this should be the datasource itself, and
      // `attr` should be an SQL expression? This would allow for computed
      // fields/etc too (admittedly those without arguments).
      const expression = sql.identifier(this.symbol, String(attr));
      const index = this._select(expression);
      this.colPlans[attr] = new PgColumnSelectPlan(
        this,
        index,
        attr,
        expression,
      );
    }
    return this.colPlans[attr]!;
  }
  */

  joins: Array<
    | {
        type: "cross";
        source: SQL;
        alias: SQL;
      }
    | {
        type: "inner" | "left" | "right" | "full";
        source: SQL;
        alias: SQL;
        conditions: SQL[];
      }
  >;

  /**
   * Finalizes this instance and returns a mutable clone; useful for
   * connections/etc (e.g. copying `where` conditions but adding more, or
   * pagination, or grouping, aggregates, etc
   */
  clone(): PgClassSelectPlan<TDataSource> {
    this.finalize();
    const clone = new PgClassSelectPlan(
      this.dataSource,
      this.identifiers,
      this.identifierMatchesThunk,
      this,
    );
    return clone;
  }

  where(condition: SQL) {
    // e.g. this.conditions.push(condition);
    // TODO
  }

  /**
   * `execute` will always run as a root-level query. In future we'll implement a
   * `toSQL` method that allows embedding this plan within another SQL plan...
   * But that's a problem for later.
   *
   * This runs the query for every entry in the values, and then returns an
   * array of results where each entry in the results relates to the entry in
   * the incoming values.
   *
   * NOTE: we don't know what the values being fed in are, we must feed them to
   * the plans stored in this.identifiers to get actual values we can use.
   */
  async execute(
    values: CrystalValuesList<any[]>,
  ): Promise<CrystalResultsList<ReadonlyArray<TDataSource["TRow"]>>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot execute PgClassSelectPlan before finalizing it.");
    }
    const { text, rawSqlValues, identifierIndex } = this.finalizeResults;

    const executionResult = await this.dataSource.execute(
      values.map((value) => {
        return {
          // The context is how we'd handle different connections with different claims
          context: value[this.contextId],
          identifiers: identifierIndex
            ? this.identifierIds.map((id) => value[id])
            : EMPTY_ARRAY,
        };
      }),
      {
        text,
        rawSqlValues,
        identifierIndex,
        identifierSymbol: this.identifierSymbol,
      },
    );
    debug("%s; result: %c", this, executionResult);

    return executionResult.values;
  }

  /**
   * This'll turn this plan into SQL that can be embedded into a different SQL
   * plan as an optimisation. IMPORTANT: we must ensure that the datasources
   * are compatible (e.g. represent the same database) before inlining a plan.
   */
  toSQL() {}

  finalize() {
    if (!this.isTrusted) {
      this.dataSource.applyAuthorizationChecksToPlan(this);
    }

    const conditions: SQL[] = [];
    const orders: SQL[] = [];
    let identifierIndex: number | null = null;

    if (this.identifiers.length && this.identifiersAlias) {
      const alias = this.identifiersAlias;
      this.joins.push({
        type: "inner",
        source: sql`(select ids.ordinality - 1 as idx, ${sql.join(
          this.identifiers.map(({ type }, idx) => {
            return sql`(ids.value->>${sql.literal(
              idx,
            )})::${type} as ${sql.identifier(`id${idx}`)}`;
          }),
          ", ",
        )} from json_array_elements(${sql.value(
          // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
          // a value before executing the query.
          this.identifierSymbol as any,
        )}) with ordinality as ids)`,
        alias,
        conditions: this.identifierMatches.map(
          (frag, idx) => sql`${frag} = ${alias}.${sql.identifier(`id${idx}`)}`,
        ),
      });
      identifierIndex = this.select(sql`${alias}.idx`);
    }

    const joins: SQL[] = this.joins.map((j) => {
      const conditions =
        j.type === "cross"
          ? []
          : j.conditions.length
          ? sql`(${sql.join(j.conditions, ") AND (")})`
          : sql.true;
      const joinCondition =
        j.type !== "cross" ? sql`\non (${conditions})` : sql.blank;
      const join: SQL =
        j.type === "inner"
          ? sql`inner join`
          : j.type === "left"
          ? sql`left outer join`
          : j.type === "right"
          ? sql`right outer join`
          : j.type === "full"
          ? sql`full outer join`
          : j.type === "cross"
          ? sql`cross join`
          : (sql.blank as never);

      return sql`${join} ${j.source} as ${j.alias}${joinCondition}`;
    });

    const resolveSymbol = (symbol: symbol): SQL => {
      switch (symbol) {
        case $$CURSOR:
          // TODO: figure out what the cursor should be
          return sql`424242 /* TODO: CURSOR */`;
        default: {
          throw new Error(
            `Unrecognised special select symbol: ${inspect(symbol)}`,
          );
        }
      }
    };

    const fragmentsWithAliases = this.selects.map((fragOrSymbol, idx) => {
      const frag =
        typeof fragOrSymbol === "symbol"
          ? resolveSymbol(fragOrSymbol)
          : fragOrSymbol;
      return sql`${frag} as ${sql.identifier(String(idx))}`;
    });
    const selection = fragmentsWithAliases.length
      ? sql`\n  ${sql.join(fragmentsWithAliases, ",\n  ")}`
      : sql` /* NOTHING?! */`;
    const select = sql`select${selection}`;
    const from = sql`\nfrom ${this.dataSource.tableIdentifier} as ${this.alias}`;
    const join = joins.length ? sql`\n${sql.join(joins, "\n")}` : sql.blank;
    const where = conditions.length
      ? sql`\nwhere (\n  ${sql.join(conditions, "\n) and (\n  ")}\n)`
      : sql.blank;
    const orderBy = orders.length
      ? sql`\norder by ${sql.join(orders, ", ")}`
      : sql.blank;
    const query = sql`${select}${from}${join}${where}${orderBy}`;

    const { text, values: rawSqlValues } = sql.compile(query);

    this.finalizeResults = { text, rawSqlValues, identifierIndex };

    super.finalize();
  }

  optimize(_plans: PgClassSelectPlan<any>[]): Plan {
    // TODO: if FROM, JOIN, WHERE, ORDER, GROUP BY, HAVING, LIMIT, OFFSET all
    // match with one of our peers then we can replace ourself with one of our
    // peers, merging the relevant SELECTs. We should return a transform that
    // maps the expected attribute ids.

    // TODO: we should serialize our `SELECT` clauses and then if any are
    // identical we should omit the later copies and have them link back to the
    // earliest version (resolve this in `execute` via mapping).

    // Inline ourself into our parent if we can.
    if (
      this.isUnique &&
      !this
        .isInliningForbidden /* TODO: && !this.groupBy && !this.having && !this.limit && !this.order && !this.offset && ... */
    ) {
      let t: PgClassSelectPlan<any> | null = null;
      for (let i = 0, l = this.dependencies.length; i < l; i++) {
        const depId = this.dependencies[i];
        const dep = this.aether.plans[depId];
        if (!(dep instanceof PgColumnSelectPlan)) {
          t = null;
          break;
        }
        if (i === 0) {
          t = dep.table.classPlan;
        } else if (dep.table.classPlan !== t) {
          t = null;
          break;
        }
      }
      if (t != null) {
        // Looks feasible.
        t.joins.push(
          {
            type: "left",
            source: this.dataSource.tableIdentifier,
            alias: this.alias,
            conditions: [
              ...this.identifiers.map((id, i) => {
                const plan = id.plan as PgColumnSelectPlan<any, any>;
                return sql`${plan.toSQL()}::${id.type} = ${
                  this.identifierMatches[i]
                }`;
              }),
              // TODO: ...this.conditions - these are part of the JOIN
              // condition (since it's a LEFT JOIN) - not part of the WHERE!
            ],
          },
          ...this.joins,
        );
        const actualIndexByDesiredIndex = {};
        this.selects.forEach((fragOrSymbol, idx) => {
          if (typeof fragOrSymbol === "symbol") {
            throw new Error(
              "Cannot inline query that uses a symbol like this.",
            );
          }
          actualIndexByDesiredIndex[idx] = t?.select(fragOrSymbol);
        });
        //t.select();
        return map(t, actualIndexByDesiredIndex);
      }
    }

    return this;
  }

  /**
   * If this plan may only return one record, you can use `.single()` to return
   * a plan that resolves to that record (rather than a list of records as it
   * does currently). Beware: if you call this and the database might actually
   * return more than one record then you're potentially in for a Bad Time.
   */
  single(): PgClassSelectSinglePlan<TDataSource> {
    this.setUnique(true);
    // TODO: should this be on a clone plan? I don't currently think so since
    // PgClassSelectSinglePlan does not allow for `.where` divergence (since it
    // does not support `.where`).
    return new PgClassSelectSinglePlan(this, first(this));
  }

  /**
   * When you return a plan in a situation where GraphQL is expecting a
   * GraphQLList, it must implement the `.listItem()` method to return a plan
   * for an individual item within this list. Graphile Crystal will
   * automatically call this (possibly recursively) to pass to the plan
   * resolvers on the children of this field.
   *
   * NOTE: Graphile Crystal handles the list indexes for you, so your list item
   * plan should process just the single input list item.
   *
   * IMPORTANT: do not call `.listItem` from user code; it's only intended to
   * be called by Graphile Crystal.
   */
  listItem(
    itemPlan: __ListItemPlan<PgClassSelectPlan<TDataSource>>,
  ): PgClassSelectSinglePlan<TDataSource> {
    return new PgClassSelectSinglePlan(this, itemPlan);
  }
}

/**
 * Represents the single result of a unique PgClassSelectPlan. This might be
 * retrieved explicitly by PgClassSelectPlan.single(), or implicitly (via
 * Graphile Crystal) by PgClassSelectPlan.item(). Since this is the result of a
 * fetch it does not make sense to support changing `.where` or similar;
 * however we now add methods such as `.get` and `.cursor` which can receive
 * specific properties by telling the PgClassSelectPlan to select the relevant
 * expressions.
 */
class PgClassSelectSinglePlan<
  TDataSource extends PgDataSource<any>
> extends Plan<TDataSource["TRow"]> {
  private itemPlanId: number;

  // TODO: should we move this back to PgClassSelectPlan to help avoid
  // duplicate plans?
  /**
   * We only want to fetch each column once (since columns don't accept any
   * parameters), so this memo keeps track of which columns we've selected so
   * their plans can be easily reused.
   */
  private colPlans: {
    [key in keyof TDataSource["TRow"]]?: PgColumnSelectPlan<TDataSource, key>;
  };

  /**
   * If a cursor was requested, what plan returns it?
   */
  private cursorPlan: Plan<any> | null;

  constructor(
    public readonly classPlan: PgClassSelectPlan<TDataSource>,
    itemPlan: Plan<TDataSource["TRow"]>,
  ) {
    super();
    this.itemPlanId = this.addDependency(itemPlan);
    this.colPlans = {}; // TODO: think about cloning
    this.cursorPlan = null;
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the class
   * (e.g. table).
   */
  get<TAttr extends keyof TDataSource["TRow"]>(
    attr: TAttr,
  ): PgColumnSelectPlan<TDataSource, TAttr> {
    // Only one plan per column
    if (!this.colPlans[attr]) {
      // TODO: where do we do the SQL conversion, e.g. to_json for dates to
      // enforce ISO8601? Perhaps this should be the datasource itself, and
      // `attr` should be an SQL expression? This would allow for computed
      // fields/etc too (admittedly those without arguments).
      const expression = sql.identifier(this.classPlan.symbol, String(attr));
      const index = this.classPlan.select(expression);
      this.colPlans[attr] = new PgColumnSelectPlan(
        this,
        index,
        attr,
        expression,
      );
    }
    return this.colPlans[attr]!;
  }

  /**
   * Not sure about this at all. When selecting a connection we need to be able
   * to get the cursor. The cursor is built from the values of the `ORDER BY`
   * clause so that we can find nodes before/after it. This may or may not be
   * the right place for this.
   */
  cursor() {
    if (this.cursorPlan == null) {
      this.cursorPlan = new PgAttributeSelectPlan(
        this,
        this.classPlan.select($$CURSOR),
      );
    }
    return this.cursorPlan;
  }

  execute(
    values: CrystalValuesList<[TDataSource["TRow"]]>,
  ): CrystalResultsList<TDataSource["TRow"]> {
    return values.map((value) => value[this.itemPlanId]);
  }
}

/*
class ConnectionPlan<TSubplan extends Plan<any>> extends Plan<Opaque<any>> {
  constructor(public readonly subplan: TSubplan) {
    super();
  }

  /*
  executeWith(deps: any) {
    /*
     * Connection doesn't do anything itself; so `connection { __typename }` is
     * basically a no-op. However subfields will need access to the deps so
     * that they may determine which fetched rows relate to them.
     * /
    return { ...deps };
  }
  * /
}
*/

class PgConnectionPlan<TDataSource extends PgDataSource<any>> extends Plan<
  unknown
> {
  constructor(public readonly subplan: PgClassSelectPlan<TDataSource>) {
    super();
    debug(`%s (around %s) constructor`, this, subplan);
  }

  nodes(): PgClassSelectPlan<TDataSource> {
    return this.subplan.clone();
  }

  execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<Record<string, never>> {
    debug(`%s: execute; values: %o`, this.id, values);
    // TODO
    return values.map(() => ({}));
  }
}

/*+--------------------------------------------------------------------------+
  |                             THE EXAMPLE                                  |
  +--------------------------------------------------------------------------+*/

const User = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, UserPlan>({
    name: "User",
    fields: {
      username: {
        type: GraphQLString,
        plan($user) {
          return $user.get("username");
        },
      },
      gravatarUrl: {
        type: GraphQLString,
        plan($user) {
          return $user.get("gravatar_url");
        },
        /*
        resolve(parent) {
          return parent.gravatar_url;
        },
        extensions: {
          graphile: {
            dependencies: ["gravatar_url"],
          },
        },
        */
      },
    },
  }),
);

const Message = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, MessagePlan>({
    name: "Message",
    fields: {
      body: {
        type: GraphQLString,
        plan($message) {
          return $message.get("body");
        },
      },
      author: {
        type: User,
        plan($message) {
          const $user = new PgClassSelectPlan(
            userSource,
            [{ plan: $message.get("author_id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.id`],
          ).single();
          return $user;
        },
      },
    },
  }),
);

const MessageEdge = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, MessagePlan>({
    name: "MessageEdge",
    fields: {
      cursor: {
        type: GraphQLString,
        plan($node) {
          return $node.cursor();
        },
      },
      node: {
        type: Message,
        plan($node) {
          return $node;
        },
      },
    },
  }),
);

const MessagesConnection = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, MessageConnectionPlan>({
    name: "MessagesConnection",
    fields: {
      edges: {
        type: new GraphQLList(MessageEdge),
        plan($connection) {
          return $connection.nodes();
        },
      },
      nodes: {
        type: new GraphQLList(Message),
        plan($connection) {
          return $connection.nodes();
        },
        /*
      extensions: {
        graphile: {
          plan($deps) {
            // This already contains identity information
            const plan = $deps.collection({ pagination: true, cursors: false });
            return plan;
          },
        },
      },
      */
      },
    },
  }),
);

const IncludeArchived = new GraphQLEnumType({
  name: "IncludeArchived",
  values: {
    INHERIT: {
      value: "INHERIT",
    },
    YES: {
      value: "YES",
    },
    NO: {
      value: "NO",
    },
  },
});

const MessageCondition = new GraphQLInputObjectType({
  name: "MessageCondition",
  fields: {
    active: {
      type: GraphQLBoolean,
    },
  },
});

const Forum: GraphQLObjectType<
  any,
  GraphileResolverContext
> = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, ForumPlan>({
    name: "Forum",
    fields: () => ({
      id: {
        type: GraphQLString,
        plan($forum) {
          return $forum.get("id");
        },
      },
      name: {
        type: GraphQLString,
        plan($forum) {
          return $forum.get("name");
        },
      },
      self: {
        type: Forum,
        plan($forum) {
          return $forum;
        },
      },
      messagesList: {
        type: new GraphQLList(Message),
        args: {
          limit: {
            type: GraphQLInt,
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan($forum) {
          const $messages = new PgClassSelectPlan(
            messageSource,
            [{ plan: $forum.get("id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.forum_id`],
          );
          $messages.setTrusted();
          // $messages.leftJoin(...);
          // $messages.innerJoin(...);
          // $messages.relation('fk_messages_author_id')
          // $messages.where(...);
          // $messages.orderBy(...);
          return $messages;
        },
      },
      messagesConnection: {
        type: MessagesConnection,
        args: {
          limit: {
            type: GraphQLInt,
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan($forum) {
          const $messages = new PgClassSelectPlan(
            messageSource,
            [{ plan: $forum.get("id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.forum_id`],
          );
          $messages.setTrusted();
          // $messages.leftJoin(...);
          // $messages.innerJoin(...);
          // $messages.relation('fk_messages_author_id')
          // $messages.where(...);
          const $connectionPlan = new PgConnectionPlan($messages);
          // $connectionPlan.orderBy... ?
          // DEFINITELY NOT $messages.orderBy BECAUSE we don't want that applied to aggregates.
          // DEFINITELY NOT $messages.limit BECAUSE we don't want those limits applied to aggregates or page info.
          return $connectionPlan;
        },
      },
    }),
  }),
);

const Query = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, __ValuePlan>({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        plan(_$root) {
          const $forums = new PgClassSelectPlan(forumSource, [], () => []);
          return $forums;
        },
      },
      allMessagesConnection: {
        type: MessagesConnection,
        args: {
          limit: {
            type: GraphQLInt,
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan() {
          const $messages = new PgClassSelectPlan(
            messageSource,
            [],
            (_alias) => [],
          );
          // $messages.leftJoin(...);
          // $messages.innerJoin(...);
          // $messages.relation('fk_messages_author_id')
          // $messages.where(...);
          const $connectionPlan = new PgConnectionPlan($messages);
          // $connectionPlan.orderBy... ?
          // DEFINITELY NOT $messages.orderBy BECAUSE we don't want that applied to aggregates.
          // DEFINITELY NOT $messages.limit BECAUSE we don't want those limits applied to aggregates or page info.
          return $connectionPlan;
        },
      },
    },
  }),
);

const schema = crystalEnforce(
  new GraphQLSchema({
    query: Query,
  }),
);

// Polyfill replaceAll
function regexpEscape(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
declare global {
  interface String {
    replaceAll: (matcher: string | RegExp, replacement: string) => string;
  }
}
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (
    matcher: string | RegExp,
    replacement: string,
  ) {
    if (typeof matcher === "object" && matcher) {
      // TODO: need to ensure matcher is `/g`
      return this.replace(matcher, replacement);
    }
    return this.replace(new RegExp(regexpEscape(matcher), "g"), replacement);
  };
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

async function main() {
  //console.log(printSchema(schema));
  function logGraphQLResult(result: ExecutionResult<any>): void {
    const { data, errors } = result;
    const nicerErrors = errors?.map((e, idx) => {
      return idx > 0
        ? e.message // Flatten all but first error
        : {
            message: e.message,
            path: e.path?.join("."),
            locs: e.locations?.map((l) => `${l.line}:${l.column}`).join(", "),
            stack: e.stack
              ?.replaceAll(resolve(process.cwd()), ".")
              .replaceAll(/(?:\/[^\s\/]+)*\/node_modules\//g, "~/")
              .split("\n"),
          };
    });
    const formattedResult = {
      ...(data !== undefined ? { data } : null),
      ...(nicerErrors !== undefined ? { errors: nicerErrors } : null),
    };
    console.log(
      prettier.format(JSON.stringify(formattedResult), {
        parser: "json5",
        printWidth: 200,
      }),
    );
  }

  async function test(source: string, variableValues = {}) {
    console.log();
    console.log();
    console.log();
    console.log("=".repeat(80));
    console.log();
    console.log();
    console.log();
    console.log(prettier.format(source, { parser: "graphql" }));
    console.log();
    console.log();
    console.log();
    const result = await graphql({
      schema,
      source,
      variableValues,
      contextValue: {},
      rootValue: null,
    });

    console.log("GraphQL result:");
    logGraphQLResult(result);
    if (result.errors) {
      throw new Error("Aborting due to errors");
    }
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          self {
            id
            name
          }
        }
      }
    `);
  }

  if (Math.random() < 2) {
    return;
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          messagesList(
            limit: 5
            condition: { active: true }
            includeArchived: INHERIT
          ) {
            body
            author {
              username
              gravatarUrl
            }
          }
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        allMessagesConnection {
          edges {
            cursor
            node {
              body
              author {
                username
                gravatarUrl
              }
            }
          }
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          messagesConnection(
            limit: 5
            condition: { active: true }
            includeArchived: INHERIT
          ) {
            nodes {
              body
              author {
                username
                gravatarUrl
              }
            }
            edges {
              cursor
              node {
                body
                author {
                  username
                  gravatarUrl
                }
              }
            }
          }
        }
      }
    `);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => testPool.end());
