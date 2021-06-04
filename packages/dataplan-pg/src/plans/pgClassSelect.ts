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
import { inspect } from "util";

import type { PgDataSource } from "../datasource";
import { $$CURSOR } from "../symbols";
import { PgClassSelectSinglePlan } from "./pgClassSelectSingle";
import { PgColumnSelectPlan } from "./pgColumnSelect";
import { PgConditionPlan } from "./pgCondition";

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

type PgClassSelectPlaceholder = { planIndex: number; symbol: symbol; sql: SQL };

interface PgClassSelectIdentifierSpec {
  plan: ExecutablePlan<any>;
  type: SQL;
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

  private orders: SQL[];

  // LIMIT

  private limit: number | null;

  // OFFSET

  private offset: number | null;

  // --------------------

  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to identify which records in the result set should be returned to which
   * GraphQL resolvers.
   */
  private identifiers: Array<{ depId: number; type: SQL }>;

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
   * The list of things we're selecting
   */
  private selects: Array<SQL | symbol>;

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * When finalized, we build the SQL query, values, and note where to feed in
   * the identifiers. This saves repeating this work at execution time.
   */
  private finalizeResults: {
    text: string;
    rawSqlValues: (SQLRawValue | symbol)[];
    identifierIndex: number | null;
    placeholderSymbols: symbol[];
    placeholderIndexes: number[];
    identifierIds: number[];
  } | null = null;

  /**
   * Determines if the PgClassSelectPlan is "locked" - i.e. its
   * FROM,JOINs,WHERE,ORDER BY,LIMIT,OFFSET cannot be changed. Note this does
   * not prevent adding more SELECTs
   */
  private locked = false;

  constructor(
    dataSource: TDataSource,
    identifiers: Array<PgClassSelectIdentifierSpec>,
    identifierMatchesThunk: (alias: SQL) => SQL[],
    cloneFrom: PgClassSelectPlan<TDataSource> | null = null,
  ) {
    super();
    this.dataSource = dataSource;
    if (cloneFrom) {
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
    }
    this.contextId = cloneFrom
      ? cloneFrom.contextId
      : this.addDependency(this.dataSource.context());
    this.identifiers = cloneFrom
      ? [...cloneFrom.identifiers] // References indexes cloned above
      : identifiers.map(({ plan, type }) => ({
          depId: this.addDependency(plan),
          type,
        }));
    this.identifierMatchesThunk = identifierMatchesThunk;

    this.identifierSymbol = cloneFrom
      ? cloneFrom.identifierSymbol
      : Symbol(dataSource.name + "_identifier_values");
    this.symbol = cloneFrom ? cloneFrom.symbol : Symbol(dataSource.name);
    this.alias = cloneFrom ? cloneFrom.alias : sql.identifier(this.symbol);
    this.identifierMatches = cloneFrom
      ? cloneFrom.identifierMatches
      : identifierMatchesThunk(this.alias);
    this.placeholders = cloneFrom ? [...cloneFrom.placeholders] : [];
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
    this.conditions = cloneFrom ? cloneFrom.conditions : [];
    this.orders = cloneFrom ? cloneFrom.orders : [];
    this.limit = cloneFrom ? cloneFrom.limit : null;
    this.offset = cloneFrom ? cloneFrom.offset : null;

    if (!cloneFrom) {
      if (this.identifiers.length !== this.identifierMatches.length) {
        throw new Error(
          `'identifiers' and 'identifierMatches' lengths must match (${this.identifiers.length} != ${this.identifierMatches.length})`,
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
    return this.identifiers.map(({ depId, type }) => ({
      plan: this.aether.plans[this.dependencies[depId]],
      type,
    }));
  }

  public placeholder($plan: ExecutablePlan<any>): SQL {
    if (this.locked) {
      throw new Error(`${this}: cannot add placeholders once plan is locked`);
    }
    const planIndex = this.addDependency($plan);
    const symbol = Symbol("value_" + planIndex);
    const p: PgClassSelectPlaceholder = {
      planIndex,
      symbol,
      sql: sql.value(
        // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
        // a value before executing the query.

        symbol as any,
      ),
    };
    this.placeholders.push(p);
    // This allows us to replace the SQL that will be compiled, for example
    // when we're inlining this into a parent query.
    return sql.callback(() => p.sql);
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   */
  public select(fragment: SQL | symbol): number {
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

  /**
   * Finalizes this instance and returns a mutable clone; useful for
   * connections/etc (e.g. copying `where` conditions but adding more, or
   * pagination, or grouping, aggregates, etc
   */
  clone(): PgClassSelectPlan<TDataSource> {
    this.lock();
    const clone = new PgClassSelectPlan(
      this.dataSource,
      this.hydrateIdentifiers(),
      this.identifierMatchesThunk,
      this,
    );
    return clone;
  }

  where(condition: SQL): void {
    if (this.locked) {
      throw new Error(`${this}: cannot add conditions once plan is locked`);
    }
    this.conditions.push(condition);
  }

  wherePlan(): PgConditionPlan<TDataSource> {
    return new PgConditionPlan(this);
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
      placeholderSymbols,
      placeholderIndexes,
      identifierIds,
    } = this.finalizeResults;

    const executionResult = await this.dataSource.execute(
      values.map((value) => {
        return {
          // The context is how we'd handle different connections with different claims
          context: value[this.contextId],
          identifiers:
            identifierIndex != null
              ? identifierIds.map((depId) => value[depId])
              : EMPTY_ARRAY,
          placeholders:
            placeholderIndexes.length > 0
              ? placeholderIndexes.map((planIndex) => value[planIndex])
              : EMPTY_ARRAY,
        };
      }),
      {
        text,
        rawSqlValues,
        identifierIndex,
        identifierSymbol: this.identifierSymbol,
        placeholderSymbols,
      },
    );
    debugExecute("%s; result: %c", this, executionResult);

    return executionResult.values;
  }

  private buildSelect(
    options: { asArray?: boolean; extraSelects?: readonly SQL[] } = {},
  ) {
    const { asArray = false, extraSelects = EMPTY_ARRAY } = options;
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

    const selects = [...this.selects, ...extraSelects];
    const l = this.selects.length;
    const extraSelectIndexes = extraSelects.map((_, i) => i + l);

    const fragmentsWithAliases = selects.map((fragOrSymbol, idx) => {
      const frag =
        typeof fragOrSymbol === "symbol"
          ? resolveSymbol(fragOrSymbol)
          : fragOrSymbol;
      return asArray ? frag : sql`${frag} as ${sql.identifier(String(idx))}`;
    });

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
      const selection = fragmentsWithAliases.length
        ? sql` ${sql.indent(sql.join(fragmentsWithAliases, ",\n"))}`
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

    return { sql: joins.length ? sql`\n${sql.join(joins, "\n")}` : sql.blank };
  }

  private buildWhere(options: { extraWheres?: SQL[] } = {}) {
    const conditions = options.extraWheres
      ? [...this.conditions, ...options.extraWheres]
      : this.conditions;
    return {
      sql: conditions.length
        ? sql`\nwhere (\n  ${sql.join(conditions, "\n) and (\n  ")}\n)`
        : sql.blank,
    };
  }

  private buildOrderBy() {
    const orders = [...this.orders];

    // TODO: should we really apply a default order _here_ rather than in the calling code?
    if (this.dataSource.uniques.length > 0) {
      const ordersIsUnique = false; /* TODO */
      if (!ordersIsUnique) {
        const uniqueColumns: string[] = this.dataSource.uniques[0];
        orders.push(
          ...uniqueColumns.map(
            (c) => sql`${this.alias}.${sql.identifier(c)} asc`,
          ),
        );
      }
    }
    return {
      sql: orders.length
        ? sql`\norder by ${sql.join(orders, ", ")}`
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

  public finalize(): void {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locked = false;

    if (!this.isFinalized) {
      let query: SQL;
      let identifierIndex: number | null = null;
      if (this.identifiers.length && this.identifiersAlias) {
        const alias = this.identifiersAlias;
        const wrapperAlias = sql.identifier(Symbol("identifier_wrapper"));
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
select ids.ordinality - 1 as idx, ${sql.join(
          this.identifiers.map(({ type }, idx) => {
            return sql`(ids.value->>${sql.literal(
              idx,
            )})::${type} as ${sql.identifier(`id${idx}`)}`;
          }),
          ", ",
        )}
from json_array_elements(${sql.value(
          // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
          // a value before executing the query.
          this.identifierSymbol as any,
        )}::json) with ordinality as ids`)}) as ${alias},
lateral (${sql.indent(baseQuery)}) as ${wrapperAlias}`;
      } else {
        ({ sql: query } = this.buildQuery());
      }

      const { text, values: rawSqlValues } = sql.compile(query);
      const placeholderSymbols = this.placeholders.map(({ symbol }) => symbol);
      const placeholderIndexes = this.placeholders.map(
        ({ planIndex }) => planIndex,
      );

      // The most trivial of optimisations...
      const identifierIds = this.identifiers.map(({ depId }) => depId);

      this.finalizeResults = {
        text,
        rawSqlValues,
        identifierIndex,
        placeholderSymbols,
        placeholderIndexes,
        identifierIds,
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
          return a.symbol === b.symbol && a.planIndex === b.planIndex;
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
      if (!arraysMatch(this.orders, p.orders, sqlIsEquivalent)) {
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
    this.selects.forEach((fragOrSymbol, idx) => {
      if (typeof fragOrSymbol === "symbol") {
        throw new Error("Cannot inline query that uses a symbol like this.");
      }
      actualKeyByDesiredKey[idx] = otherPlan.select(fragOrSymbol);
    });
    //console.dir(actualKeyByDesiredKey);
    //console.log(`Other ${otherPlan} selects now:`);
    //console.dir(otherPlan.selects, { depth: 8 });
    return actualKeyByDesiredKey;
  }

  mergePlaceholdersInto(otherPlan: PgClassSelectPlan<TDataSource>): void {
    for (const placeholder of this.placeholders) {
      const { symbol, planIndex, sql: sqlFrag } = placeholder;
      const dep = this.aether.plans[this.dependencies[planIndex]];
      if (otherPlan.parentPathIdentity.startsWith(dep.parentPathIdentity)) {
        const newPlanIndex = otherPlan.addDependency(dep);
        otherPlan.placeholders.push({
          planIndex: newPlanIndex,
          symbol,
          sql: sqlFrag,
        });
      } else {
        if (dep instanceof PgColumnSelectPlan) {
          // Replace with a reference
          placeholder.sql = dep.toSQL();
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
      for (let depId = 0, l = this.dependencies.length; depId < l; depId++) {
        if (depId === this.contextId) {
          // We check myContext vs tsContext below; so lets assume it's fine
          // for now.
          continue;
        }
        const planId = this.dependencies[depId];
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
        if (!(dep instanceof PgColumnSelectPlan)) {
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
            ...this.identifiers.map(({ depId, type }, i) => {
              const plan = this.aether.plans[this.dependencies[depId]];
              if (!(plan instanceof PgColumnSelectPlan)) {
                throw new Error(
                  `Expected ${plan} (${i}th dependency of ${this}; plan with id ${depId}) to be a PgColumnSelectPlan`,
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
          this.identifiers.forEach(({ depId, type }, i) => {
            const plan = this.aether.plans[this.dependencies[depId]];
            if (!(plan instanceof PgColumnSelectPlan)) {
              throw new Error(
                `Expected ${plan} (${i}th dependency of ${this}; plan with id ${depId}) to be a PgColumnSelectPlan`,
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
