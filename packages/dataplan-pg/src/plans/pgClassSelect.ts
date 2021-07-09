import { createHash } from "crypto";
import debugFactory from "debug";
import type {
  __ListItemPlan,
  CrystalResultsList,
  CrystalValuesList,
} from "graphile-crystal";
import {
  __TrackedObjectPlan,
  access,
  ExecutablePlan,
  first,
  InputListPlan,
  InputObjectPlan,
  InputStaticLeafPlan,
  list,
  map,
} from "graphile-crystal";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql, { arraysMatch } from "pg-sql2";

import type { PgDataSource } from "../datasource";
import type { PgOrderSpec, PgTypedExecutablePlan } from "../interfaces";
import { PgClassSelectSinglePlan } from "./pgClassSelectSingle";
import { PgConditionPlan } from "./pgCondition";
import { PgExpressionPlan } from "./pgExpression";

const isDev = process.env.NODE_ENV === "development";

type LockableParameter = "orderBy";
type BeforeLockCallback<
  TDataSource extends PgDataSource<any, any> = PgDataSource<any, any>,
> = (plan: PgClassSelectPlan<TDataSource>) => void;

const debugPlan = debugFactory("datasource:pg:PgClassSelectPlan:plan");
const debugExecute = debugFactory("datasource:pg:PgClassSelectPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);

type PgClassSelectPlanJoin =
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
    };

type PgClassSelectPlaceholder = {
  dependencyIndex: number;
  // This is a "ref" so that it can be merged into other objects whilst still
  // allowing `placeholder.sqlRef.sql = ...` to work.
  sqlRef: { sql: SQL };
  type: SQL;
};

interface PgClassSelectIdentifierSpec {
  plan: ExecutablePlan<any>;
  type: SQL;
}

/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <columns>, <cursor?> FROM <table>`. You can also add
 * `JOIN`, `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`. You cannot add `GROUP BY`
 * because that would invalidate the identifiers; and as such you can't use
 * `HAVING` or functions that implicitly turn the query into an aggregate. We
 * don't allow `UNION`/`INTERSECT`/`EXCEPT`/`FOR UPDATE`/etc at this time,
 * purely because it hasn't been sufficiently considered.
 *
 * I currently don't expect this to be used to select sets of scalars, but it
 * could be used for that purpose so long as we name the scalars (i.e. create
 * records from them `{a: 1},{a: 2},{a:3}`).
 */
export class PgClassSelectPlan<
  TDataSource extends PgDataSource<any, any>,
> extends ExecutablePlan<ReadonlyArray<TDataSource["TRow"]>> {
  // FROM

  public readonly symbol: symbol;

  /** = sql.identifier(this.symbol) */
  public readonly alias: SQL;

  /**
   * The data source from which we are selecting: table, view, etc
   */
  public readonly dataSource: TDataSource;

  // JOIN

  private joins: Array<PgClassSelectPlanJoin>;

  // WHERE

  private conditions: SQL[];

  // ORDER BY

  private orders: Array<PgOrderSpec>;
  private isOrderUnique: boolean;

  // LIMIT

  private limit: number | null;

  // OFFSET

  private offset: number | null;

  // --------------------

  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to represent queryValues the query will need such as identifiers for which
   * records in the result set should be returned to which GraphQL resolvers,
   * parameters for conditions or orders, etc.
   */
  private queryValues: Array<{ dependencyIndex: number; type: SQL }>;

  /**
   * So we can clone.
   */
  private identifierMatchesThunk: (alias: SQL) => SQL[];

  /**
   * This is the list of SQL fragments in the result that are compared to some
   * of the above `queryValues` to determine if there's a match or not. Typically
   * this will be a list of columns (e.g. primary or foreign keys on the
   * table).
   */
  private identifierMatches: readonly SQL[];

  /**
   * If this plan has queryValues, we must feed the queryValues into the placeholders to
   * feed into the SQL statement after compiling the query; we'll use this
   * symbol as the placeholder to replace.
   */
  private queryValuesSymbol: symbol;

  /**
   * Values used in this plan.
   */
  private placeholders: Array<PgClassSelectPlaceholder>;

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
   * The list of things we're selecting.
   */
  private selects: Array<SQL>;

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * When finalized, we build the SQL query, queryValues, and note where to feed in
   * the relevant queryValues. This saves repeating this work at execution time.
   */
  private finalizeResults: {
    // The SQL query text
    text: string;

    // The values to feed into the query
    rawSqlValues: SQLRawValue[];

    // The column on the result that indicates which group the result belongs to
    identifierIndex: number | null;

    // The dependency index (i.e. index in the `values` object we'll receive
    // during execution) in which each of the `queryValues` are identified.
    queryValuesDependencyIndexes: number[];
  } | null = null;

  /**
   * Determines if the PgClassSelectPlan is "locked" - i.e. its
   * FROM,JOINs,WHERE,ORDER BY,LIMIT,OFFSET cannot be changed. Note this does
   * not prevent adding more SELECTs
   */
  private locked = false;

  // --------------------

  private _beforeLock: {
    [a in LockableParameter]: Array<BeforeLockCallback>;
  } = {
    orderBy: [],
  };

  private _lockedParameter: {
    [a in LockableParameter]: false | true | string | undefined;
  } = {
    orderBy: false,
  };

  constructor(
    dataSource: TDataSource,
    identifiers: Array<PgClassSelectIdentifierSpec>,
    identifierMatchesThunk: (alias: SQL) => SQL[],
  );
  constructor(cloneFrom: PgClassSelectPlan<TDataSource>);
  constructor(
    dataSourceOrCloneFrom: TDataSource | PgClassSelectPlan<TDataSource>,
    identifiersOrNot?: Array<PgClassSelectIdentifierSpec>,
    identifierMatchesThunkOrNot?: (alias: SQL) => SQL[],
  ) {
    super();
    const cloneFrom =
      dataSourceOrCloneFrom instanceof PgClassSelectPlan
        ? dataSourceOrCloneFrom
        : null;
    const { dataSource, identifiers, identifierMatchesThunk } = cloneFrom
      ? {
          dataSource: cloneFrom.dataSource,
          identifiers: cloneFrom.hydrateIdentifiers(),
          identifierMatchesThunk: cloneFrom.identifierMatchesThunk,
        }
      : {
          dataSource: dataSourceOrCloneFrom as TDataSource,
          identifiers: identifiersOrNot,
          identifierMatchesThunk: identifierMatchesThunkOrNot,
        };

    if (!identifiers || !identifierMatchesThunk) {
      throw new Error("Invalid construction of PgClassSelectPlan");
    }

    this.dataSource = dataSource;
    if (cloneFrom) {
      // Prevent any changes to our original to help avoid programming
      // errors.
      cloneFrom.lock();

      if (this.dependencies.length !== 0) {
        throw new Error("Should not have any dependencies yet");
      }
      cloneFrom.dependencies.forEach((planId, idx) => {
        const myIdx = this.addDependency(this.aether.plans[planId]);
        if (myIdx !== idx) {
          throw new Error(
            `Failed to clone ${cloneFrom}; dependency indexes did not match: ${myIdx} !== ${idx}`,
          );
        }
      });
    } else {
      // Since we're applying this to the original it doesn't make sense to
      // also apply it to the clones.
      this.beforeLock("orderBy", ensureOrderIsUnique);
    }

    this.contextId = cloneFrom
      ? cloneFrom.contextId
      : this.addDependency(this.dataSource.context());
    this.queryValues = cloneFrom
      ? [...cloneFrom.queryValues] // References indexes cloned above
      : identifiers.map(({ plan, type }) => ({
          dependencyIndex: this.addDependency(plan),
          type,
        }));
    this.identifierMatchesThunk = identifierMatchesThunk;

    this.queryValuesSymbol = cloneFrom
      ? cloneFrom.queryValuesSymbol
      : Symbol(dataSource.name + "_identifier_values");
    this.symbol = cloneFrom ? cloneFrom.symbol : Symbol(dataSource.name);
    this.alias = cloneFrom ? cloneFrom.alias : sql.identifier(this.symbol);
    this.identifierMatches = cloneFrom
      ? Object.freeze(cloneFrom.identifierMatches)
      : identifierMatchesThunk(this.alias);
    this.placeholders = cloneFrom ? [...cloneFrom.placeholders] : [];
    this.joins = cloneFrom ? [...cloneFrom.joins] : [];
    this.selects = cloneFrom ? [...cloneFrom.selects] : [];
    this.isTrusted = cloneFrom ? cloneFrom.isTrusted : false;
    this.isUnique = cloneFrom ? cloneFrom.isUnique : false;
    this.isInliningForbidden = cloneFrom
      ? cloneFrom.isInliningForbidden
      : false;
    this.conditions = cloneFrom ? [...cloneFrom.conditions] : [];
    this.orders = cloneFrom ? [...cloneFrom.orders] : [];
    this.isOrderUnique = cloneFrom ? cloneFrom.isOrderUnique : false;
    this.limit = cloneFrom ? cloneFrom.limit : null;
    this.offset = cloneFrom ? cloneFrom.offset : null;

    if (!cloneFrom) {
      if (this.queryValues.length !== this.identifierMatches.length) {
        throw new Error(
          `'queryValues' and 'identifierMatches' lengths must match (${this.queryValues.length} != ${this.identifierMatches.length})`,
        );
      }
    }
    debugPlan(
      `%s (%s) constructor (%s)`,
      this,
      this.dataSource.name,
      cloneFrom ? "clone" : "original",
    );
    return this;
  }

  toStringMeta(): string {
    return this.dataSource.name;
  }

  public lock(): void {
    this._lockAllParameters();
    this.locked = true;
  }

  public setInliningForbidden(newInliningForbidden = true): this {
    this.isInliningForbidden = newInliningForbidden;
    return this;
  }

  public inliningForbidden(): boolean {
    return this.isInliningForbidden;
  }

  public setTrusted(newIsTrusted = true): this {
    if (this.locked) {
      throw new Error(`${this}: cannot toggle trusted once plan is locked`);
    }
    this.isTrusted = newIsTrusted;
    return this;
  }

  public trusted(): boolean {
    return this.isTrusted;
  }

  public setLimit(limit: number | null | undefined): this {
    if (this.locked) {
      throw new Error(`${this}: cannot change limit when locked`);
    }
    this.limit = limit ?? null;
    return this;
  }

  public setOffset(offset: number | null | undefined): this {
    if (this.locked) {
      throw new Error(`${this}: cannot change offset when locked`);
    }
    this.offset = offset ?? null;
    return this;
  }

  /**
   * Set this true ONLY if there can be at most one match for each of the
   * identifiers. If you set this true when this is not the case then you may
   * get unexpected results during inlining; if in doubt leave it at the
   * default.
   */
  public setUnique(newUnique = true): this {
    if (this.locked) {
      throw new Error(`${this}: cannot toggle unique once plan is locked`);
    }
    this.isUnique = newUnique;
    return this;
  }

  public unique(): boolean {
    return this.isUnique;
  }

  private hydrateIdentifiers(): Array<PgClassSelectIdentifierSpec> {
    return this.queryValues.map(({ dependencyIndex, type }) => ({
      plan: this.aether.plans[this.dependencies[dependencyIndex]],
      type,
    }));
  }

  public placeholder($plan: PgTypedExecutablePlan<any>): SQL;
  public placeholder($plan: ExecutablePlan<any>, type: SQL): SQL;
  public placeholder(
    $plan: ExecutablePlan<any> | PgTypedExecutablePlan<any>,
    overrideType?: SQL,
  ): SQL {
    if (this.locked) {
      throw new Error(`${this}: cannot add placeholders once plan is locked`);
    }
    const type =
      overrideType ??
      ("pgCodec" in $plan && $plan.pgCodec ? $plan.pgCodec.sqlType : null);

    if (type === null) {
      throw new Error(
        `Plan ${$plan} does not contain pgCodec information, please wrap ` +
          `it in \`pgCast\`. E.g. \`pgCast($plan, TYPES.boolean)\``,
      );
    }
    const dependencyIndex = this.addDependency($plan);
    const sqlRef = { sql: sql`(1/0) /* ERROR! Unhandled placeholder! */` };
    const p: PgClassSelectPlaceholder = {
      dependencyIndex,
      type,
      sqlRef,
    };
    this.placeholders.push(p);
    // This allows us to replace the SQL that will be compiled, for example
    // when we're inlining this into a parent query.
    return sql.callback(() => sqlRef.sql);
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   */
  public select(fragment: SQL): number {
    // NOTE: it's okay to add selections after the plan is "locked" - lock only
    // applies to which rows are being selected, not what is being queried
    // about the rows.

    // Optimisation: if we're already selecting this fragment, return the existing one.
    const index = this.selects.findIndex((frag) =>
      sql.isEquivalent(frag, fragment),
    );
    if (index >= 0) {
      return index;
    }

    return this.selects.push(fragment) - 1;
  }

  /**
   * Finalizes this instance and returns a mutable clone; useful for
   * connections/etc (e.g. copying `where` conditions but adding more, or
   * pagination, or grouping, aggregates, etc)
   */
  clone(): PgClassSelectPlan<TDataSource> {
    return new PgClassSelectPlan(this);
  }

  where(condition: SQL): void {
    if (this.locked) {
      throw new Error(`${this}: cannot add conditions once plan is locked`);
    }
    this.conditions.push(condition);
  }

  wherePlan(): PgConditionPlan<this> {
    return new PgConditionPlan(this);
  }

  orderBy(order: PgOrderSpec): void {
    this._assertParameterUnlocked("orderBy");
    this.orders.push(order);
  }

  orderIsUnique(): boolean {
    return this.isOrderUnique;
  }
  setOrderIsUnique(): void {
    this.isOrderUnique = true;
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
    const {
      text,
      rawSqlValues,
      identifierIndex,
      queryValuesDependencyIndexes,
    } = this.finalizeResults;

    const executionResult = await this.dataSource.execute(
      values.map((value) => {
        return {
          // The context is how we'd handle different connections with different claims
          context: value[this.contextId],
          queryValues:
            identifierIndex != null
              ? queryValuesDependencyIndexes.map(
                  (dependencyIndex) => value[dependencyIndex],
                )
              : EMPTY_ARRAY,
        };
      }),
      {
        text,
        rawSqlValues,
        identifierIndex,
        queryValuesSymbol: this.queryValuesSymbol,
      },
    );
    debugExecute("%s; result: %c", this, executionResult);

    return executionResult.values;
  }

  private buildSelect(
    options: { asArray?: boolean; extraSelects?: readonly SQL[] } = {},
  ) {
    const { asArray = false, extraSelects = EMPTY_ARRAY } = options;
    const selects = [...this.selects, ...extraSelects];
    const l = this.selects.length;
    const extraSelectIndexes = extraSelects.map((_, i) => i + l);

    const fragmentsWithAliases = asArray
      ? selects
      : selects.map(
          (frag, idx) => sql`${frag} as ${sql.identifier(String(idx))}`,
        );

    if (asArray) {
      const selection = fragmentsWithAliases.length
        ? sql` array[${sql.indent(
            sql.join(fragmentsWithAliases, ",\n"),
          )}]::text[]`
        : /*
           * In the case where our array is empty, we must add something or
           * PostgreSQL will fail with 'ERROR:  2202E: cannot accumulate empty
           * arrays'
           */
          sql` array['' /* NOTHING?! */]::text[]`;

      return { sql: sql`select${selection}`, extraSelectIndexes };
    } else {
      const selection =
        fragmentsWithAliases.length > 0
          ? sql`\n${sql.indent(sql.join(fragmentsWithAliases, ",\n"))}`
          : sql` /* NOTHING?! */`;

      return { sql: sql`select${selection}`, extraSelectIndexes };
    }
  }

  private buildFrom() {
    return { sql: sql`\nfrom ${this.dataSource.source} as ${this.alias}` };
  }

  private buildJoin() {
    const joins: SQL[] = this.joins.map((j) => {
      const conditions =
        j.type === "cross"
          ? []
          : j.conditions.length === 0
          ? sql.true
          : j.conditions.length === 1
          ? j.conditions[0]
          : sql.join(
              j.conditions.map((c) => sql.parens(sql.indent(c))),
              " and ",
            );
      const joinCondition =
        j.type !== "cross"
          ? sql`\non ${sql.parens(
              sql.indentIf(j.conditions.length > 1, conditions),
            )}`
          : sql.blank;
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

    return { sql: joins.length ? sql`\n${sql.join(joins, "\n")}` : sql.blank };
  }

  private buildWhere(options: { extraWheres?: SQL[] } = {}) {
    const conditions = options.extraWheres
      ? [...this.conditions, ...options.extraWheres]
      : this.conditions;
    const sqlConditions = sql.join(
      conditions.map((c) => sql.parens(sql.indent(c))),
      " and ",
    );
    return {
      sql:
        conditions.length === 0
          ? sql.blank
          : conditions.length === 1
          ? sql`\nwhere ${sqlConditions}`
          : sql`\nwhere\n${sql.indent(sqlConditions)}`,
    };
  }

  /**
   * So we can quickly detect if cursors are invalid we use this digest,
   * passing this check does not mean that the cursor is valid but it at least
   * catches common user errors.
   */
  public getOrderByDigest() {
    this._lockParameter("orderBy");
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = createHash("sha256");
    hash.update(
      JSON.stringify(
        this.orders.map((o) => [sql.compile(o.fragment).text, o.ascending]),
      ),
    );
    const digest = hash.digest("hex").substr(0, 10);
    return digest;
  }

  public getOrderBy(): ReadonlyArray<PgOrderSpec> {
    this._lockParameter("orderBy");
    return this.orders;
  }

  private buildOrderBy() {
    this._lockParameter("orderBy");
    const orders = this.orders;

    return {
      sql:
        orders.length > 0
          ? sql`\norder by ${sql.join(
              orders.map(
                (o) =>
                  sql`${o.fragment} ${o.ascending ? sql`asc` : sql`desc`}${
                    o.nulls === "last"
                      ? sql` nulls last`
                      : o.nulls === "first"
                      ? sql` nulls first`
                      : sql.blank
                  }`,
              ),
              ", ",
            )}`
          : sql.blank,
    };
  }

  private buildLimit() {
    return {
      sql:
        this.limit != null
          ? sql`\nlimit ${sql.literal(this.limit)}`
          : sql.blank,
    };
  }

  private buildOffset() {
    return {
      sql:
        this.offset != null
          ? sql`\noffset ${sql.literal(this.offset)}`
          : sql.blank,
    };
  }

  private buildQuery(
    options: {
      asArray?: boolean;
      withIdentifiers?: boolean;
      extraSelects?: SQL[];
      extraWheres?: SQL[];
    } = {},
  ): {
    sql: SQL;
    extraSelectIndexes: number[];
  } {
    if (!this.isTrusted) {
      this.dataSource.applyAuthorizationChecksToPlan(this);
    }

    const { sql: select, extraSelectIndexes } = this.buildSelect(options);
    const { sql: from } = this.buildFrom();
    const { sql: join } = this.buildJoin();
    const { sql: where } = this.buildWhere(options);
    const { sql: orderBy } = this.buildOrderBy();
    const { sql: limit } = this.buildLimit();
    const { sql: offset } = this.buildOffset();

    const query = sql`${select}${from}${join}${where}${orderBy}${limit}${offset}`;

    return { sql: query, extraSelectIndexes };
  }

  public finalizeArguments(): void {
    console.log("FINALIZE ARGUMENTS CALLED HERE");
    this._lockAllParameters();
    console.log("FINALIZE ARGUMENTS COMPLETE");
    return super.finalizeArguments();
  }

  public finalize(): void {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locked = false;

    if (!this.isFinalized) {
      let query: SQL;
      let identifierIndex: number | null = null;
      if (this.queryValues.length || this.placeholders.length) {
        const alias = sql.identifier(
          Symbol(this.dataSource.name + "_identifiers"),
        );

        this.placeholders.forEach((placeholder) => {
          // NOTE: we're adding to `this.identifiers` but NOT to
          // `this.identifierMatches`.
          const idx =
            this.queryValues.push({
              dependencyIndex: placeholder.dependencyIndex,
              type: placeholder.type,
            }) - 1;
          placeholder.sqlRef.sql = sql`${alias}.${sql.identifier(`id${idx}`)}`;
        });

        const wrapperAlias = sql.identifier(
          Symbol(this.dataSource.name + "_result"),
        );
        const extraSelects: SQL[] = [];
        const extraWheres: SQL[] = [];

        extraSelects.push(sql`${alias}.idx`);

        extraWheres.push(
          ...this.identifierMatches.map(
            (frag, idx) =>
              sql`${frag} = ${alias}.${sql.identifier(`id${idx}`)}`,
          ),
        );
        const { sql: baseQuery, extraSelectIndexes } = this.buildQuery({
          extraSelects,
          extraWheres,
        });
        identifierIndex = extraSelectIndexes[0];

        // TODO: if the query does not have a limit/offset; should we use an
        // `inner join` in a flattened query instead of a wrapped query with
        // `lateral`?

        /*
         * This wrapper query is necessary so that queries that have a
         * limit/offset get the limit/offset applied _per identifier group_.
         */
        query = sql`select ${wrapperAlias}.*
from (${sql.indent(sql`\
select\n${sql.indent(sql`\
ids.ordinality - 1 as idx,
${sql.join(
  this.queryValues.map(({ type }, idx) => {
    return sql`(ids.value->>${sql.literal(idx)})::${type} as ${sql.identifier(
      `id${idx}`,
    )}`;
  }),
  ",\n",
)}`)}
from json_array_elements(${sql.value(
          // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
          // a value before executing the query.
          this.queryValuesSymbol as any,
        )}::json) with ordinality as ids`)}) as ${alias},
lateral (${sql.indent(baseQuery)}) as ${wrapperAlias}`;
      } else {
        ({ sql: query } = this.buildQuery());
      }

      const { text, values: rawSqlValues } = sql.compile(query);

      // The most trivial of optimisations...
      const queryValuesDependencyIndexes = this.queryValues.map(
        ({ dependencyIndex }) => dependencyIndex,
      );

      this.finalizeResults = {
        text,
        rawSqlValues,
        identifierIndex,
        queryValuesDependencyIndexes,
      };
    }

    this.locked = true;

    super.finalize();
  }

  deduplicate(peers: PgClassSelectPlan<any>[]): ExecutablePlan {
    const identical = peers.find((p) => {
      // If SELECT, FROM, JOIN, WHERE, ORDER, GROUP BY, HAVING, LIMIT, OFFSET
      // all match with one of our peers then we can replace ourself with one
      // of our peers. NOTE: we do _not_ merge SELECTs at this stage because
      // that would require mapping, and mapping should not be done during
      // deduplicate because it would interfere with optimize. So, instead,
      // we try to ensure that as few selects as possible exist in the plan
      // at this stage.

      // Check FROM matches
      if (p.dataSource !== this.dataSource) {
        return false;
      }

      // Since deduplicate runs before we have children, we do not need to
      // check the symbol or alias matches. We do need to factor the different
      // symbols into SQL equivalency checks though.
      const symbolSubstitutes = new Map<symbol, symbol>();
      symbolSubstitutes.set(this.symbol, p.symbol);
      const sqlIsEquivalent = (a: SQL | symbol, b: SQL | symbol) =>
        sql.isEquivalent(a, b, symbolSubstitutes);

      // Check trusted matches
      if (p.trusted !== this.trusted) {
        return false;
      }

      // Check inliningForbidden matches
      if (p.inliningForbidden !== this.inliningForbidden) {
        return false;
      }

      // Check SELECT matches
      if (!arraysMatch(this.selects, p.selects, sqlIsEquivalent)) {
        return false;
      }

      // Check JOINs match
      if (
        !arraysMatch(this.joins, p.joins, (a, b) =>
          joinMatches(a, b, sqlIsEquivalent),
        )
      ) {
        return false;
      }

      // Check WHEREs match
      if (!arraysMatch(this.conditions, p.conditions, sqlIsEquivalent)) {
        return false;
      }

      // Check PLACEHOLDERS match
      if (
        !arraysMatch(this.placeholders, p.placeholders, (a, b) => {
          return a.type === b.type && a.dependencyIndex === b.dependencyIndex;
        })
      ) {
        return false;
      }

      // Check IDENTIFIERs match
      if (
        !arraysMatch(
          this.identifierMatches,
          p.identifierMatches,
          sqlIsEquivalent,
        )
      ) {
        return false;
      }

      // Check ORDERs match
      if (
        !arraysMatch(
          this.orders,
          p.orders,
          (a, b) =>
            a.ascending === b.ascending &&
            a.nulls === b.nulls &&
            sqlIsEquivalent(a.fragment, b.fragment),
        )
      ) {
        return false;
      }

      // GROUP BY is not supported
      // HAVING is not supported

      // Check LIMIT matches
      if (this.limit !== p.limit) {
        return false;
      }

      // Check OFFSET matches
      if (this.offset !== p.offset) {
        return false;
      }

      debugPlan("Found that %c and %c are equivalent!", this, p);

      return true;
    });
    if (identical) {
      return identical;
      /* The following is now forbidden.

        // Move the selects across and then replace ourself with a transform that
        // maps the expected attribute ids from the `identical` plan.
        const actualKeyByDesiredKey = this.mergeSelectsWith(identical);
        const mapper = makeMapper(actualKeyByDesiredKey);
        return each(identical, mapper);

      */
    }
    return this;
  }

  mergeSelectsWith(otherPlan: PgClassSelectPlan<TDataSource>): {
    [desiredIndex: string]: string;
  } {
    const actualKeyByDesiredKey = {};
    //console.log(`Other ${otherPlan} selects:`);
    //console.dir(otherPlan.selects, { depth: 8 });
    //console.log(`My ${this} selects:`);
    //console.dir(this.selects, { depth: 8 });
    this.selects.forEach((frag, idx) => {
      actualKeyByDesiredKey[idx] = otherPlan.select(frag);
    });
    //console.dir(actualKeyByDesiredKey);
    //console.log(`Other ${otherPlan} selects now:`);
    //console.dir(otherPlan.selects, { depth: 8 });
    return actualKeyByDesiredKey;
  }

  mergePlaceholdersInto(otherPlan: PgClassSelectPlan<TDataSource>): void {
    for (const placeholder of this.placeholders) {
      const { dependencyIndex, sqlRef, type } = placeholder;
      const dep = this.aether.plans[this.dependencies[dependencyIndex]];
      if (otherPlan.parentPathIdentity.startsWith(dep.parentPathIdentity)) {
        const newPlanIndex = otherPlan.addDependency(dep);
        otherPlan.placeholders.push({
          dependencyIndex: newPlanIndex,
          type,
          sqlRef,
        });
      } else {
        if (dep instanceof PgExpressionPlan) {
          // Replace with a reference
          placeholder.sqlRef.sql = dep.toSQL();
        } else {
          throw new Error(
            `Could not merge placeholder from unsupported plan type: ${dep}`,
          );
        }
      }
    }
  }

  optimize(): ExecutablePlan {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locked = false;

    // TODO: we should serialize our `SELECT` clauses and then if any are
    // identical we should omit the later copies and have them link back to the
    // earliest version (resolve this in `execute` via mapping).

    if (!this.isInliningForbidden) {
      // Inline ourself into our parent if we can.
      let t: PgClassSelectPlan<any> | null | undefined = undefined;
      let p: ExecutablePlan<any> | undefined = undefined;
      for (
        let dependencyIndex = 0, l = this.dependencies.length;
        dependencyIndex < l;
        dependencyIndex++
      ) {
        if (dependencyIndex === this.contextId) {
          // We check myContext vs tsContext below; so lets assume it's fine
          // for now.
          continue;
        }
        const planId = this.dependencies[dependencyIndex];
        const dep = this.aether.plans[planId];
        if (dep instanceof __TrackedObjectPlan) {
          // This has come from a variable, context or rootValue, therefore
          // it's shared and thus safe.
          continue;
        }
        if (
          dep instanceof InputListPlan ||
          dep instanceof InputStaticLeafPlan ||
          dep instanceof InputObjectPlan
        ) {
          // This has come from a hard-coded input in the document, therefore
          // it's shared and thus safe.
          continue;
        }
        if (!(dep instanceof PgExpressionPlan)) {
          debugPlanVerbose(
            "Refusing to optimise %c due to dependency %c",
            this,
            dep,
          );
          t = null;
          break;
        }
        const p2 = this.aether.plans[dep.dependencies[dep.tableId]];
        const t2 = dep.getClassSinglePlan().getClassPlan();
        if (t === undefined && p === undefined) {
          p = p2;
          t = t2;
        } else if (t2 !== t) {
          debugPlanVerbose(
            "Refusing to optimise %c due to dependency %c depending on different class (%c != %c)",
            this,
            dep,
            t2,
            t,
          );
          t = null;
          break;
        } else if (p2 !== p) {
          debugPlanVerbose(
            "Refusing to optimise %c due to parent dependency mismatch: %c != %c",
            this,
            p2,
            p,
          );
          t = null;
          break;
        }
      }
      if (t != null && p != null) {
        const myContext = this.aether.plans[this.dependencies[this.contextId]];
        const tsContext = this.aether.plans[t.dependencies[t.contextId]];
        if (myContext != tsContext) {
          debugPlanVerbose(
            "Refusing to optimise %c due to own context dependency %c differing from tables context dependency %c (%c, %c)",
            this,
            myContext,
            tsContext,
            t.dependencies[t.contextId],
            t,
          );
          t = null;
        }
      }
      if (t != null && p != null) {
        // Looks feasible.

        const table = t;
        const parent = p;

        const tableWasLocked = table.locked;
        table.locked = false;

        if (
          this.isUnique
          /* TODO: && !this.groupBy && !this.having && !this.limit && !this.order && !this.offset && ... */
        ) {
          const { sql: where } = this.buildWhere();
          const conditions = [
            ...this.queryValues.map(({ dependencyIndex, type }, i) => {
              const plan =
                this.aether.plans[this.dependencies[dependencyIndex]];
              if (!(plan instanceof PgExpressionPlan)) {
                throw new Error(
                  `Expected ${plan} (${i}th dependency of ${this}; plan with id ${dependencyIndex}) to be a PgExpressionPlan`,
                );
              }
              return sql`${plan.toSQL()}::${type} = ${
                this.identifierMatches[i]
              }`;
            }),
            // Note the WHERE is now part of the JOIN condition (since
            // it's a LEFT JOIN).
            ...(where !== sql.blank ? [where] : []),
          ];
          table.joins.push(
            {
              type: "left",
              source: this.dataSource.source,
              alias: this.alias,
              conditions,
            },
            ...this.joins,
          );
          this.mergePlaceholdersInto(table);
          debugPlanVerbose("Merging %c into %c (via %c)", this, table, parent);
          const actualKeyByDesiredKey = this.mergeSelectsWith(table);
          // We return a list here because our children are going to use a `first` plan on us
          return list([map(parent, actualKeyByDesiredKey)]);
        } else if (parent instanceof PgClassSelectSinglePlan) {
          const parent2 =
            this.aether.plans[parent.dependencies[parent.itemPlanId]];
          this.queryValues.forEach(({ dependencyIndex, type }, i) => {
            const plan = this.aether.plans[this.dependencies[dependencyIndex]];
            if (!(plan instanceof PgExpressionPlan)) {
              throw new Error(
                `Expected ${plan} (${i}th dependency of ${this}; plan with id ${dependencyIndex}) to be a PgExpressionPlan`,
              );
            }
            return this.where(
              sql`${plan.toSQL()}::${type} = ${this.identifierMatches[i]}`,
            );
          });
          this.mergePlaceholdersInto(table);
          const { sql: query } = this.buildQuery({ asArray: true });
          const selfIndex = table.select(sql`array(${sql.indent(query)})`);
          debugPlanVerbose(
            "Optimising %c (via %c and %c)",
            this,
            table,
            parent2,
          );
          //console.dir(this.dependencies.map((id) => this.aether.plans[id]));
          return access(parent2, [selfIndex]);
        }

        table.locked = tableWasLocked;
      }
    }

    this.locked = true;

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

  // --------------------

  /**
   * Performs the given call back just before the given LockableParameter is
   * locked.
   *
   * @remarks To make sure we do things in the right order (e.g. ensure all the
   * `order by` values are established before attempting to interpret a
   * `cursor` for `before`/`after`) we need a locking system. This locking
   * system allows for final actions to take place _just before_ the element is
   * locked, for example _just before_ the order is locked we might want to
   * check that the ordering is unique, and if it is not then we may want to
   * add the primary key to the ordering.
   */
  public beforeLock(
    type: LockableParameter,
    callback: BeforeLockCallback,
  ): void {
    this._assertParameterUnlocked(type);
    this._beforeLock[type].push(callback);
  }

  /**
   * Calls all the beforeLock actions for the given parameter and then locks
   * it.
   */
  private _lockParameter(type: LockableParameter): void {
    if (this._lockedParameter[type] !== false) {
      return;
    }
    const preLockCallbacks = this._beforeLock[type];
    const l = preLockCallbacks.length;
    if (l > 0) {
      const callbacks = preLockCallbacks.splice(0, l);
      for (let i = 0; i < l; i++) {
        callbacks[i](this);
      }
      if (preLockCallbacks.length > 0) {
        throw new Error(
          `beforeLock callback for '${type}' caused more beforeLock callbacks to be registered`,
        );
      }
    }
    this._lockedParameter[type] = isDev
      ? new Error("Initially locked here").stack
      : true;
  }

  /**
   * Throw a helpful error if you're trying to modify something that's already
   * locked.
   */
  private _assertParameterUnlocked(type: LockableParameter): void {
    const isLocked = this._lockedParameter[type];
    if (isLocked !== false) {
      if (typeof isLocked === "string") {
        throw new Error(
          `'${type}' has already been locked\n    ` +
            isLocked.replace(/\n/g, "\n    ") +
            "\n",
        );
      }
      throw new Error(`'${type}' has already been locked`);
    }
  }

  private _lockAllParameters() {
    // // We must execute everything after `from` so we have the alias to reference
    // this._lockParameter("from");
    // this._lockParameter("join");
    this._lockParameter("orderBy");
    // // We must execute where after orderBy because cursor queries require all orderBy columns
    // this._lockParameter("cursorComparator");
    // this._lockParameter("whereBound");
    // this._lockParameter("where");
    // // 'where' -> 'whereBound' can affect 'offset'/'limit'
    // this._lockParameter("offset");
    // this._lockParameter("limit");
    // this._lockParameter("first");
    // this._lockParameter("last");
    // // We must execute select after orderBy otherwise we cannot generate a cursor
    // this._lockParameter("fixedSelectExpression");
    // this._lockParameter("selectCursor");
    // this._lockParameter("select");
  }
}

function joinMatches(
  j1: PgClassSelectPlanJoin,
  j2: PgClassSelectPlanJoin,
  sqlIsEquivalent: (a: SQL, b: SQL) => boolean,
): boolean {
  if (j1.type === "cross") {
    if (j2.type !== j1.type) {
      return false;
    }
    if (!sqlIsEquivalent(j1.source, j2.source)) {
      return false;
    }
    if (!sqlIsEquivalent(j1.alias, j2.alias)) {
      return false;
    }
    return true;
  } else {
    if (j2.type !== j1.type) {
      return false;
    }
    if (!sqlIsEquivalent(j1.source, j2.source)) {
      return false;
    }
    if (!sqlIsEquivalent(j1.alias, j2.alias)) {
      return false;
    }
    if (!arraysMatch(j1.conditions, j2.conditions, sqlIsEquivalent)) {
      return false;
    }
    return true;
  }
}

/**
 * Apply a default order in case our default is not unique.
 */
function ensureOrderIsUnique(plan: PgClassSelectPlan<any>) {
  console.log("ensureOrderIsUnique CALLED HERE");
  const uniqueColumns: string[] = plan.dataSource.uniques[0];
  if (uniqueColumns) {
    const ordersIsUnique = plan.orderIsUnique();
    if (!ordersIsUnique) {
      uniqueColumns.forEach((c) => {
        plan.orderBy({
          fragment: sql`${plan.alias}.${sql.identifier(c)}`,
          codec: plan.dataSource.columns[c].codec,
          ascending: true,
        });
      });
      plan.setOrderIsUnique();
    }
  }
}
