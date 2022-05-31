import assert from "assert";
import { createHash } from "crypto";
import type {
  ConnectionCapablePlan,
  ConnectionPlan,
  ConstantPlan,
  CrystalResultsList,
  CrystalResultStreamList,
  CrystalValuesList,
  ExecutionExtra,
  InputPlan,
  LambdaPlan,
  PlanOptimizeOptions,
  PlanStreamOptions,
  StreamablePlan,
} from "dataplanner";
import {
  __InputListPlan,
  __InputObjectPlan,
  __InputStaticLeafPlan,
  __ItemPlan,
  __TrackedObjectPlan,
  access,
  constant,
  ExecutablePlan,
  first,
  isAsyncIterable,
  isPromiseLike,
  lambda,
  list,
  map,
  planGroupsOverlap,
  reverse,
  reverseArray,
} from "dataplanner";
import debugFactory from "debug";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql, { arraysMatch } from "pg-sql2";

import type { PgTypeColumns } from "../codecs.js";
import { listOfType } from "../codecs.js";
import type {
  PgSource,
  PgSourceParameter,
  PgSourceRelation,
  PgSourceRow,
  PgSourceUnique,
} from "../datasource.js";
import { PgSourceBuilder } from "../datasource.js";
import type {
  PgGroupSpec,
  PgOrderSpec,
  PgTypeCodec,
  PgTypedExecutablePlan,
} from "../interfaces.js";
import { PgClassExpressionPlan } from "./pgClassExpression.js";
import { PgConditionPlan } from "./pgCondition.js";
import type { PgPageInfoPlan } from "./pgPageInfo.js";
import { pgPageInfo } from "./pgPageInfo.js";
import type { PgSelectSinglePlanOptions } from "./pgSelectSingle.js";
import { PgSelectSinglePlan } from "./pgSelectSingle.js";
import { pgValidateParsedCursor } from "./pgValidateParsedCursor.js";
import { toPg } from "./toPg.js";

export type PgSelectParsedCursorPlan = LambdaPlan<string, any[]>;

// Maximum identifier length in Postgres is 63 chars, so trim one off. (We
// could do base64... but meh.)
const hash = (text: string): string =>
  createHash("sha256").update(text).digest("hex").slice(0, 63);

const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

// Constant functions so lambdas can be optimized
const listHasMore = (list: any | null | undefined) => list?.hasMore || false;
const parseCursor = (cursor: string | null) => {
  if (cursor == null) {
    throw new Error(
      "GraphileInternalError<3b076b86-828b-46b3-885d-ed2577068b8d>: cursor is null, but we have a constraint preventing that...",
    );
  }
  if (typeof cursor !== "string") {
    throw new Error("Invalid cursor");
  }
  const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
  if (!Array.isArray(decoded)) {
    throw new Error("Expected array");
  }
  return decoded;
};

function isStaticInputPlan(
  dep: ExecutablePlan,
): dep is __InputListPlan | __InputStaticLeafPlan | __InputObjectPlan {
  return (
    dep instanceof __InputListPlan ||
    dep instanceof __InputStaticLeafPlan ||
    dep instanceof __InputObjectPlan
  );
}

export type PgSelectLockableParameter =
  | "orderBy"
  | "first"
  | "last"
  | "offset"
  | "groupBy";
export type PgSelectLockCallback<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
> = (plan: PgSelectPlan<TColumns, TUniques, TRelations, TParameters>) => void;

const debugPlan = debugFactory("datasource:pg:PgSelectPlan:plan");
// const debugExecute = debugFactory("datasource:pg:PgSelectPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);

type PgSelectPlanJoin =
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

/**
 * Sometimes we want to refer to something that might change later - e.g. we
 * might have SQL that specifies a list of explicit values, or it might later
 * want to be replaced with a reference to an existing table value (e.g. when a
 * query is being inlined). PgSelectPlaceholder allows for this kind of
 * flexibility. It's really important to keep in mind that the same placeholder
 * might be used in multiple different SQL queries, and in the different
 * queries it might end up with different values - this is particularly
 * relevant when using `@stream`/`@defer`, for example.
 */
type PgSelectPlaceholder = {
  dependencyIndex: number;
  codec: PgTypeCodec<any, any, any, any>;
  symbol: symbol;
};

export type PgSelectIdentifierSpec =
  | {
      plan: ExecutablePlan<any>;
      codec: PgTypeCodec<any, any, any>;
      matches: (alias: SQL) => SQL;
    }
  | {
      plan: PgTypedExecutablePlan<any>;
      codec?: PgTypeCodec<any, any, any>;
      matches: (alias: SQL) => SQL;
    };

export type PgSelectArgumentSpec =
  | {
      plan: ExecutablePlan<any>;
      pgCodec: PgTypeCodec<any, any, any, any>;
      name?: string;
    }
  | {
      plan: PgTypedExecutablePlan<any>;
      name?: string;
    };

interface PgSelectArgumentDigest {
  position?: number;
  name?: string;
  placeholder: SQL;
}

interface QueryValue {
  dependencyIndex: number;
  codec: PgTypeCodec<any, any, any>;
}

function assertSensible(plan: ExecutablePlan): void {
  if (plan instanceof PgSelectPlan) {
    throw new Error(
      "You passed a PgSelectPlan as an identifier, perhaps you forgot to add `.record()`?",
    );
  }
  if (plan instanceof PgSelectSinglePlan) {
    throw new Error(
      "You passed a PgSelectSinglePlan as an identifier, perhaps you forgot to add `.record()`?",
    );
  }
}

export type PgSelectMode = "normal" | "aggregate";

export interface PgSelectOptions<TColumns extends PgTypeColumns | undefined> {
  /**
   * Tells us what we're dealing with - data type, columns, where to get it
   * from, what it's called, etc. Many of these details can be overridden
   * below.
   */
  source: PgSource<TColumns, any, any, any>;

  /**
   * The identifiers to limit the results down to just the row(s) you care
   * about.
   *
   * NOTE: this is required because it's a big footgun to omit it by accident,
   * if you truly do not need it (e.g. if you're calling a function with
   * limited results or you really want everything) then you can specify it as
   * an empty array `[]`.
   */
  identifiers: Array<PgSelectIdentifierSpec>;

  /**
   * If your `from` (or source.source if omitted) is a function, the arguments
   * to pass to the function.
   */
  args?: Array<PgSelectArgumentSpec>;

  /**
   * If you want to build the data in a custom way (e.g. calling a function,
   * selecting from a view, building a complex query, etc) then you can
   * override the `source.source` here with your own from code. Defaults to
   * `source.source`.
   */
  from?: SQL | ((...args: SQL[]) => SQL);

  /**
   * If you pass a custom `from` (or otherwise want to aid in debugging),
   * passing a custom name can make it easier to follow the SQL/etc that is
   * generated.
   */
  name?: string;

  mode?: PgSelectMode;
}

/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <columns>, <cursor?> FROM <table>`. You can also add
 * `JOIN`, `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`. You cannot add `GROUP BY`
 * because that would invalidate the identifiers; and as such you can't use
 * `HAVING` or functions that implicitly turn the query into an aggregate. We
 * don't allow `UNION`/`INTERSECT`/`EXCEPT`/`FOR UPDATE`/etc at this time,
 * purely because it hasn't been sufficiently considered.
 */
export class PgSelectPlan<
    TColumns extends PgTypeColumns | undefined,
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TColumns, undefined>>
    >,
    TRelations extends {
      [identifier: string]: TColumns extends PgTypeColumns
        ? PgSourceRelation<TColumns, any>
        : never;
    },
    TParameters extends PgSourceParameter[] | undefined = undefined,
  >
  extends ExecutablePlan<ReadonlyArray<PgSourceRow<TColumns>>>
  implements
    StreamablePlan<PgSourceRow<TColumns>>,
    ConnectionCapablePlan<
      PgSelectSinglePlan<TColumns, any, any, any>,
      PgSelectParsedCursorPlan
    >
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectPlan",
  };

  isSyncAndSafe = false;

  // FROM
  private readonly from: SQL | ((...args: SQL[]) => SQL);

  /**
   * This defaults to the name of the source but you can override it. Aids
   * in debugging.
   */
  private readonly name: string;
  /**
   * To be used as the table alias, we always use a symbol unless the calling
   * code specifically indicates a string to use.
   */
  private readonly symbol: symbol | string;
  /**
   * When SELECTs get merged, symbols also need to be merged. The keys in this
   * map are the symbols of PgSelects that don't exist any more, the values are
   * symbols of the PgSelects that they were replaced with (which might also not
   * exist in future, but we follow the chain so it's fine).
   */
  private readonly _symbolSubstitutes: Map<symbol, symbol>;

  /** = sql.identifier(this.symbol) */
  public readonly alias: SQL;

  /**
   * The data source from which we are selecting: table, view, etc
   */
  public readonly source: PgSource<TColumns, TUniques, TRelations, TParameters>;

  // JOIN

  private relationJoins: Map<keyof TRelations, SQL>;
  private joins: Array<PgSelectPlanJoin>;

  // WHERE

  private conditions: SQL[];

  // GROUP BY

  private groups: Array<PgGroupSpec>;

  // HAVING

  private havingConditions: SQL[];

  // ORDER BY

  private orders: Array<PgOrderSpec>;
  private isOrderUnique: boolean;

  // LIMIT

  private first: number | null;
  private last: number | null;
  private fetchOneExtra: boolean;

  // OFFSET

  private offset: number | null;

  // CURSORS

  private beforePlanId: number | null;
  private afterPlanId: number | null;

  // --------------------

  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to represent queryValues the query will need such as identifiers for which
   * records in the result set should be returned to which GraphQL resolvers,
   * parameters for conditions or orders, etc.
   */
  private queryValues: Array<QueryValue>;

  /**
   * This is the list of SQL fragments in the result that are compared to some
   * of the above `queryValues` to determine if there's a match or not. Typically
   * this will be a list of columns (e.g. primary or foreign keys on the
   * table).
   */
  private identifierMatches: readonly SQL[];

  /**
   * If the source is a function, this is the names of the arguments to pass
   */
  private arguments: ReadonlyArray<PgSelectArgumentDigest>;

  /**
   * If this plan has queryValues, we must feed the queryValues into the placeholders to
   * feed into the SQL statement after compiling the query; we'll use this
   * symbol as the placeholder to replace.
   */
  private queryValuesSymbol: symbol;

  /**
   * Values used in this plan.
   */
  private placeholders: Array<PgSelectPlaceholder>;
  private placeholderValues: Map<symbol, SQL>;

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
  private isInliningForbidden: boolean;

  /**
   * The list of things we're selecting.
   */
  private selects: Array<SQL>;

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * If this plan going to stream, the options for the stream (e.g.
   * initialCount). Set during the `optimize` call - do not trust it before
   * then. If null then the plan is not expected to stream.
   */
  private streamOptions: PlanStreamOptions | null = null;

  /**
   * When finalized, we build the SQL query, queryValues, and note where to feed in
   * the relevant queryValues. This saves repeating this work at execution time.
   */
  private finalizeResults: {
    // The SQL query text
    text: string;

    // The values to feed into the query
    rawSqlValues: SQLRawValue[];

    // The `DECLARE ... CURSOR` query for @stream
    textForDeclare?: string;

    // The values to feed into the `DECLARE ... CURSOR` query
    rawSqlValuesForDeclare?: SQLRawValue[];

    // If streaming, what's the initialCount
    streamInitialCount?: number;

    // The column on the result that indicates which group the result belongs to
    identifierIndex: number | null;

    // If last but not first, reverse order.
    shouldReverseOrder: boolean;

    // For prepared queries
    name?: string;
  } | null = null;

  /**
   * Determines if the PgSelectPlan is "locked" - i.e. its
   * FROM,JOINs,WHERE,ORDER BY,LIMIT,OFFSET cannot be changed. Note this does
   * not prevent adding more SELECTs
   */
  private locked = false;

  // --------------------

  private _beforeLock: {
    [a in PgSelectLockableParameter]: Array<
      PgSelectLockCallback<TColumns, TUniques, TRelations, TParameters>
    >;
  } = {
    orderBy: [],
    groupBy: [],
    first: [],
    last: [],
    offset: [],
  };

  private _afterLock: {
    [a in PgSelectLockableParameter]: Array<
      PgSelectLockCallback<TColumns, TUniques, TRelations, TParameters>
    >;
  } = {
    orderBy: [],
    groupBy: [],
    first: [],
    last: [],
    offset: [],
  };

  private _lockedParameter: {
    [a in PgSelectLockableParameter]: false | true | string | undefined;
  } = {
    orderBy: false,
    groupBy: false,
    first: false,
    last: false,
    offset: false,
  };

  public readonly mode: PgSelectMode;

  constructor(options: PgSelectOptions<TColumns>);
  constructor(
    cloneFrom: PgSelectPlan<TColumns, TUniques, TRelations, TParameters>,
    mode?: PgSelectMode,
  );
  constructor(
    optionsOrCloneFrom:
      | PgSelectPlan<TColumns, TUniques, TRelations, TParameters>
      | PgSelectOptions<TColumns>,
    overrideMode?: PgSelectMode,
  ) {
    super();
    const [
      cloneFrom,
      {
        source,
        identifiers,
        args: inArgs,
        from: inFrom = null,
        name: customName,
        mode: inMode,
      },
    ] =
      optionsOrCloneFrom instanceof PgSelectPlan
        ? [
            optionsOrCloneFrom,
            {
              source: optionsOrCloneFrom.source,
              identifiers: null,
              from: optionsOrCloneFrom.from,
              args: null,
              name: optionsOrCloneFrom.name,
              mode: undefined,
            },
          ]
        : [null, optionsOrCloneFrom];

    this.mode = overrideMode ?? inMode ?? "normal";
    const cloneFromMatchingMode =
      cloneFrom?.mode === this.mode ? cloneFrom : null;

    this.source = source;
    if (cloneFrom) {
      // Prevent any changes to our original to help avoid programming
      // errors.
      cloneFrom.lock();

      if (this.dependencies.length !== 0) {
        throw new Error("Should not have any dependencies yet");
      }
      cloneFrom.dependencies.forEach((planId, idx) => {
        const myIdx = this.addDependency(this.getPlan(planId));
        if (myIdx !== idx) {
          throw new Error(
            `Failed to clone ${cloneFrom}; dependency indexes did not match: ${myIdx} !== ${idx}`,
          );
        }
      });
    } else {
      // Since we're applying this to the original it doesn't make sense to
      // also apply it to the clones.
      if (this.mode === "aggregate") {
        this.beforeLock("orderBy", () => this._lockParameter("groupBy"));
      } else {
        this.beforeLock("orderBy", ensureOrderIsUnique);
      }
    }

    this.contextId = cloneFrom
      ? cloneFrom.contextId
      : this.addDependency(this.source.context());

    this.name = customName ?? source.name;
    this.queryValuesSymbol = cloneFrom
      ? cloneFrom.queryValuesSymbol
      : Symbol(this.name + "_identifier_values");
    this.symbol = cloneFrom ? cloneFrom.symbol : Symbol(this.name);
    this._symbolSubstitutes = cloneFrom
      ? new Map(cloneFrom._symbolSubstitutes)
      : new Map();
    this.alias = cloneFrom ? cloneFrom.alias : sql.identifier(this.symbol);
    this.from = inFrom ?? source.source;
    this.placeholders = cloneFrom ? [...cloneFrom.placeholders] : [];
    this.placeholderValues = cloneFrom
      ? new Map(cloneFrom.placeholderValues)
      : new Map();
    if (cloneFrom) {
      this.queryValues = [...cloneFrom.queryValues]; // References indexes cloned above
      this.identifierMatches = Object.freeze(cloneFrom.identifierMatches);
      this.arguments = Object.freeze(cloneFrom.arguments);
    } else {
      if (!identifiers) {
        throw new Error("Invalid construction of PgSelectPlan");
      }
      const queryValues: QueryValue[] = [];
      const identifierMatches: SQL[] = [];
      const args: PgSelectArgumentDigest[] = [];
      let argIndex: null | number = 0;
      identifiers.forEach((identifier) => {
        if (isDev) {
          assertSensible(identifier.plan);
        }
        const { plan, matches } = identifier;
        const codec =
          identifier.codec ||
          (identifier.plan as PgTypedExecutablePlan<any>).pgCodec;
        queryValues.push({
          dependencyIndex: this.addDependency(plan),
          codec,
        });
        identifierMatches.push(matches(this.alias));
      });
      if (inArgs) {
        inArgs.forEach((identifier) => {
          if (isDev) {
            assertSensible(identifier.plan);
          }
          const { plan, name } = identifier;
          const codec =
            "pgCodec" in identifier
              ? identifier.pgCodec
              : identifier.plan.pgCodec;
          const placeholder = this.placeholder(plan, codec);
          if (name) {
            argIndex = null;
            args.push({
              name,
              placeholder,
            });
          } else {
            if (argIndex === null) {
              throw new Error(
                "Cannot have unnamed argument after named arguments",
              );
            }
            args.push({
              position: argIndex++,
              placeholder,
            });
          }
        });
      }
      this.queryValues = queryValues;
      this.identifierMatches = identifierMatches;
      this.arguments = args;
    }
    this.relationJoins = cloneFrom
      ? new Map(cloneFrom.relationJoins)
      : new Map();
    this.joins = cloneFrom ? [...cloneFrom.joins] : [];
    this.selects = cloneFromMatchingMode
      ? [...cloneFromMatchingMode.selects]
      : [];
    this.isTrusted = cloneFrom ? cloneFrom.isTrusted : false;
    this.isUnique = cloneFrom ? cloneFrom.isUnique : false;
    this.isInliningForbidden = cloneFrom
      ? cloneFrom.isInliningForbidden
      : false;
    this.conditions = cloneFrom ? [...cloneFrom.conditions] : [];
    this.groups = cloneFromMatchingMode
      ? [...cloneFromMatchingMode.groups]
      : [];
    this.havingConditions = cloneFromMatchingMode
      ? [...cloneFromMatchingMode.havingConditions]
      : [];
    this.orders = cloneFromMatchingMode
      ? [...cloneFromMatchingMode.orders]
      : [];
    this.isOrderUnique = cloneFromMatchingMode
      ? cloneFromMatchingMode.isOrderUnique
      : false;
    this.first = cloneFromMatchingMode ? cloneFromMatchingMode.first : null;
    this.last = cloneFromMatchingMode ? cloneFromMatchingMode.last : null;
    this.fetchOneExtra = cloneFromMatchingMode
      ? cloneFromMatchingMode.fetchOneExtra
      : false;
    this.offset = cloneFromMatchingMode ? cloneFromMatchingMode.offset : null;
    this.beforePlanId =
      cloneFromMatchingMode && cloneFromMatchingMode.beforePlanId != null
        ? this.addDependency(
            cloneFromMatchingMode.getDep(cloneFromMatchingMode.beforePlanId),
          )
        : null;
    this.afterPlanId =
      cloneFromMatchingMode && cloneFromMatchingMode.afterPlanId != null
        ? this.addDependency(
            cloneFromMatchingMode.getDep(cloneFromMatchingMode.afterPlanId),
          )
        : null;

    this.afterLock("orderBy", () => {
      if (this.beforePlanId != null) {
        this.where(
          this.conditionFromCursor(
            "before",
            this.getDep(this.beforePlanId) as any,
          ),
        );
      }
      if (this.afterPlanId != null) {
        this.where(
          this.conditionFromCursor(
            "after",
            this.getDep(this.afterPlanId) as any,
          ),
        );
      }
    });

    debugPlanVerbose(
      `%s (%s) constructor (%s; %s)`,
      this,
      this.name,
      cloneFrom ? "clone" : "original",
      this.mode,
    );
    return this;
  }

  public toStringMeta(): string {
    return this.name;
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

  public setFirst(first: InputPlan): this {
    this._assertParameterUnlocked("first");
    // TODO: don't eval
    this.first = first.eval() ?? null;
    this._lockParameter("first");
    return this;
  }

  public setLast(last: InputPlan): this {
    this.assertCursorPaginationAllowed();
    this._assertParameterUnlocked("orderBy");
    this._assertParameterUnlocked("last");
    this.last = last.eval() ?? null;
    this._lockParameter("last");
    return this;
  }

  public setOffset(offset: InputPlan): this {
    this._assertParameterUnlocked("offset");
    this.offset = offset.eval() ?? null;
    if (this.offset !== null) {
      this._lockParameter("last");
      if (this.last != null) {
        throw new Error("Cannot use 'offset' with 'last'");
      }
    }
    this._lockParameter("offset");
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

  /**
   * Someone (probably pageInfo) wants to know if there's more records. To
   * determine this we fetch one extra record and then throw it away.
   */
  public hasMore(): ExecutablePlan<boolean> {
    this.fetchOneExtra = true;
    // TODO: This is a truly hideous hack. We should solve this by having this
    // plan resolve to an object with rows and metadata.
    return lambda(this, listHasMore);
  }

  public unique(): boolean {
    return this.isUnique;
  }

  public placeholder($plan: PgTypedExecutablePlan<any>): SQL;
  public placeholder(
    $plan: ExecutablePlan<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL;
  public placeholder(
    $plan: ExecutablePlan<any> | PgTypedExecutablePlan<any>,
    overrideCodec?: PgTypeCodec<any, any, any>,
  ): SQL {
    if (this.locked) {
      throw new Error(`${this}: cannot add placeholders once plan is locked`);
    }
    if (this.placeholders.length >= 100000) {
      throw new Error(
        `There's already ${this.placeholders.length} placeholders; wanting more suggests there's a bug somewhere`,
      );
    }

    const codec = overrideCodec ?? ("pgCodec" in $plan ? $plan.pgCodec : null);
    if (!codec) {
      throw new Error(
        `Plan ${$plan} does not contain pgCodec information, please wrap ` +
          `it in \`pgCast\`. E.g. \`pgCast($plan, TYPES.boolean)\``,
      );
    }

    const dependencyIndex = this.addDependency($plan);
    const symbol = Symbol(`plan-${$plan.id}`);
    const sqlPlaceholder = sql.placeholder(
      symbol,
      sql`(1/0) /* ERROR! Unhandled placeholder! */`,
    );
    const p: PgSelectPlaceholder = {
      dependencyIndex,
      codec,
      symbol,
    };
    this.placeholders.push(p);
    // This allows us to replace the SQL that will be compiled, for example
    // when we're inlining this into a parent query.
    return sqlPlaceholder;
  }

  /**
   * Join to a named relationship and return the alias that can be used in
   * SELECT, WHERE and ORDER BY.
   */
  public singleRelation<TRelationName extends keyof TRelations>(
    relationIdentifier: TRelationName,
  ): SQL {
    const relation = this.source.getRelation(relationIdentifier);
    if (!relation) {
      throw new Error(
        `${this.source} does not have a relation named '${String(
          relationIdentifier,
        )}'`,
      );
    }
    if (!relation.isUnique) {
      throw new Error(
        `${this.source} relation '${String(
          relationIdentifier,
        )}' is not unique so cannot be used with singleRelation`,
      );
    }
    const { source: rawRelationSource, localColumns, remoteColumns } = relation;
    const relationSource =
      rawRelationSource instanceof PgSourceBuilder
        ? rawRelationSource.get()
        : rawRelationSource;

    // Join to this relation if we haven't already
    const cachedAlias = this.relationJoins.get(relationIdentifier);
    if (cachedAlias) {
      return cachedAlias;
    }
    const alias = sql.identifier(Symbol(relationIdentifier as string));
    if (typeof relationSource.source === "function") {
      throw new Error(
        "Callback sources not currently supported via singleRelation",
      );
    }
    this.joins.push({
      type: "left",
      // TODO: `source.source` is confusing, rename one of these!
      source: relationSource.source,
      alias,
      conditions: localColumns.map(
        (col, i) =>
          sql`${this.alias}.${sql.identifier(
            col as string,
          )} = ${alias}.${sql.identifier(remoteColumns[i] as string)}`,
      ),
    });
    this.relationJoins.set(relationIdentifier, alias);
    return alias;
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   */
  public selectAndReturnIndex(fragment: SQL): number {
    if (!this.isArgumentsFinalized) {
      throw new Error("Select added before arguments were finalized");
    }
    // NOTE: it's okay to add selections after the plan is "locked" - lock only
    // applies to which rows are being selected, not what is being queried
    // about the rows.

    // Optimisation: if we're already selecting this fragment, return the existing one.
    const index = this.selects.findIndex((frag) =>
      sql.isEquivalent(frag, fragment, {
        symbolSubstitutes: this._symbolSubstitutes,
      }),
    );
    if (index >= 0) {
      return index;
    }

    return this.selects.push(fragment) - 1;
  }

  private nullCheckIndex: number | null | undefined = undefined;
  public getNullCheckIndex(): number | null {
    // TODO: if this isn't coming from a function _and_ it's not being inlined
    // via a left-join or similar then we shouldn't need this and should be
    // able to drop it.
    if (this.nullCheckIndex !== undefined) {
      return this.nullCheckIndex;
    }
    const nullCheckExpression = this.source.getNullCheckExpression(this.alias);
    if (nullCheckExpression) {
      this.nullCheckIndex = this.selectAndReturnIndex(nullCheckExpression);
    } else {
      this.nullCheckIndex = null;
    }
    return this.nullCheckIndex;
  }

  /**
   * Finalizes this instance and returns a mutable clone; useful for
   * connections/etc (e.g. copying `where` conditions but adding more, or
   * pagination, or grouping, aggregates, etc)
   */
  clone(
    mode?: PgSelectMode,
  ): PgSelectPlan<TColumns, TUniques, TRelations, TParameters> {
    return new PgSelectPlan(this, mode);
  }

  where(condition: SQL): void {
    if (this.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('where')`,
      );
    }
    this.conditions.push(condition);
  }

  wherePlan(): PgConditionPlan<this> {
    if (this.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('wherePlan')`,
      );
    }
    return new PgConditionPlan(this);
  }

  groupBy(group: PgGroupSpec): void {
    this._assertParameterUnlocked("groupBy");
    if (this.mode !== "aggregate") {
      throw new Error(`Cannot add groupBy to a non-aggregate query`);
    }
    this.groups.push(group);
  }

  havingPlan(): PgConditionPlan<this> {
    if (this.locked) {
      throw new Error(
        `${this}: cannot add having conditions once plan is locked ('havingPlan')`,
      );
    }
    if (this.mode !== "aggregate") {
      throw new Error(`Cannot add having to a non-aggregate query`);
    }
    return new PgConditionPlan(this, true);
  }

  having(condition: SQL): void {
    if (this.locked) {
      throw new Error(
        `${this}: cannot add having conditions once plan is locked ('having')`,
      );
    }
    if (this.mode !== "aggregate") {
      throw new Error(`Cannot add having to a non-aggregate query`);
    }
    this.havingConditions.push(condition);
  }

  orderBy(order: PgOrderSpec): void {
    this._assertParameterUnlocked("orderBy");
    this.orders.push(order);
  }

  orderIsUnique(): boolean {
    return this.isOrderUnique;
  }

  setOrderIsUnique(): void {
    if (this.locked) {
      throw new Error(`${this}: cannot set order unique once plan is locked`);
    }
    this.isOrderUnique = true;
  }

  private assertCursorPaginationAllowed(): void {
    if (this.mode === "aggregate") {
      throw new Error(
        "Cannot use cursor pagination on an aggregate PgSelectPlan",
      );
    }
  }

  private conditionFromCursor(
    beforeOrAfter: "before" | "after",
    $parsedCursorPlan: LambdaPlan<any, any[] | null>,
  ) {
    const digest = this.getOrderByDigest();
    const orders = this.getOrderBy();
    const orderCount = orders.length;
    if (orderCount === 0 || !this.isOrderUnique) {
      throw new Error(
        `Can only use '${beforeOrAfter}' cursor when there is a unique defined order.`,
      );
    }

    // Cursor validity check; if we get inlined then this will be passed up
    // to the parent so we can trust it.
    this.addDependency(
      pgValidateParsedCursor(
        $parsedCursorPlan,
        digest,
        orderCount,
        beforeOrAfter,
      ),
    );

    const condition = (i = 0): SQL => {
      const order = orders[i];
      // Codec is responsible for performing validation/coercion and throwing
      // error if value is invalid.
      // TODO: make sure this ^ is clear in the relevant places.
      /*
          const sqlValue = sql`${sql.value(
            (void 0 /* forbid relying on `this` * /, order.codec.toPg)(
              this.placeholder(access($parsedCursorPlan, [i + 1]), sql`text`),
            ),
          )}::${order.codec.sqlType}`;
          */
      const sqlValue = this.placeholder(
        toPg(access($parsedCursorPlan, [i + 1]), order.codec),
        order.codec,
      );
      const gt =
        (order.direction === "ASC" && beforeOrAfter === "after") ||
        (order.direction === "DESC" && beforeOrAfter === "before");

      let fragment = sql`${order.fragment} ${gt ? sql`>` : sql`<`} ${sqlValue}`;

      if (i < orderCount - 1) {
        fragment = sql`(${fragment}) or (${
          order.fragment
        } = ${sqlValue} and ${condition(i + 1)})`;
      }

      return sql.parens(fragment);
    };

    /*
     * We used to allow the cursor to be null or string; but we now _only_ run
     * this code when the `evalIs(null) || evalIs(undefined)` returns false. So
     * we know that the cursor must exist, so therefore we don't need to add
     * this extra condition.
    // If the cursor is null then no condition is needed
    const cursorIsNullPlaceholder = this.placeholder(
      lambda($parsedCursorPlan, (cursor) => cursor == null),
      TYPES.boolean
    );
    const finalCondition = sql`(${condition()}) or (${cursorIsNullPlaceholder} is true)`;
    */
    const finalCondition = condition();

    return finalCondition;
  }

  // TODO: rename?
  // TODO: should this be a static method?
  parseCursor(
    $cursorPlan: __InputStaticLeafPlan<string>,
  ): PgSelectParsedCursorPlan | null {
    this.assertCursorPaginationAllowed();
    if ($cursorPlan.evalIs(null)) {
      return null;
    } else if ($cursorPlan.evalIs(undefined)) {
      return null;
    }

    const $parsedCursorPlan = lambda($cursorPlan, parseCursor);
    return $parsedCursorPlan;
  }

  setAfter($parsedCursorPlan: PgSelectParsedCursorPlan): void {
    this.afterPlanId = this.addDependency($parsedCursorPlan);
  }

  setBefore($parsedCursorPlan: PgSelectParsedCursorPlan): void {
    this.beforePlanId = this.addDependency($parsedCursorPlan);
  }

  public pageInfo(
    $connectionPlan: ConnectionPlan<any, PgSelectParsedCursorPlan, this, any>,
  ): PgPageInfoPlan<this> {
    this.assertCursorPaginationAllowed();
    this.lock();
    return pgPageInfo($connectionPlan);
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
    values: Array<CrystalValuesList<any>>,
    { eventEmitter }: ExecutionExtra,
  ): Promise<CrystalResultsList<ReadonlyArray<PgSourceRow<TColumns>>>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot execute PgSelectPlan before finalizing it.");
    }
    const { text, rawSqlValues, identifierIndex, shouldReverseOrder, name } =
      this.finalizeResults;

    const executionResult = await this.source.executeWithCache(
      values[this.contextId].map((context, i) => {
        return {
          // The context is how we'd handle different connections with different claims
          context,
          queryValues:
            identifierIndex != null
              ? this.queryValues.map(({ dependencyIndex, codec }) =>
                  codec.toPg(values[dependencyIndex][i]),
                )
              : EMPTY_ARRAY,
        };
      }),
      {
        text,
        rawSqlValues,
        identifierIndex,
        queryValuesSymbol: this.queryValuesSymbol,
        name,
        eventEmitter,
      },
    );
    // debugExecute("%s; result: %c", this, executionResult);

    return executionResult.values.map((allVals) => {
      if (allVals == null || isPromiseLike(allVals)) {
        return allVals;
      }
      const limit = this.first ?? this.last;
      const firstAndLast =
        this.first != null && this.last != null && this.last < this.first;
      const hasMore =
        this.fetchOneExtra && limit != null && allVals.length > limit;
      const limitedRows = hasMore ? allVals.slice(0, limit) : allVals;
      const slicedRows =
        firstAndLast && this.last != null
          ? limitedRows.slice(-this.last)
          : limitedRows;
      const orderedRows = shouldReverseOrder
        ? reverseArray(slicedRows)
        : slicedRows;
      if (this.fetchOneExtra) {
        // TODO: this is an ugly hack; really we should consider resolving to an
        // object that can contain metadata as well as the rows.
        Object.defineProperty(orderedRows, "hasMore", { value: hasMore });
      }
      return orderedRows;
    });
  }

  /**
   * Like `execute`, but stream the results via async iterables.
   */
  async stream(
    values: Array<CrystalValuesList<any>>,
    { eventEmitter }: ExecutionExtra,
  ): Promise<CrystalResultStreamList<PgSourceRow<TColumns>>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot stream PgSelectPlan before finalizing it.");
    }
    const {
      text,
      rawSqlValues,
      textForDeclare,
      rawSqlValuesForDeclare,
      identifierIndex,
      shouldReverseOrder,
      streamInitialCount,
    } = this.finalizeResults;

    if (shouldReverseOrder !== false) {
      throw new Error("shouldReverseOrder must be false for stream");
    }
    if (!rawSqlValuesForDeclare || !textForDeclare) {
      throw new Error("declare query must exist for stream");
    }

    const initialFetchResult = text
      ? (
          await this.source.executeWithoutCache(
            values[this.contextId].map((context, i) => {
              return {
                // The context is how we'd handle different connections with different claims
                context,
                queryValues:
                  identifierIndex != null
                    ? this.queryValues.map(({ dependencyIndex, codec }) =>
                        codec.toPg(values[dependencyIndex][i]),
                      )
                    : EMPTY_ARRAY,
              };
            }),
            {
              text,
              rawSqlValues,
              identifierIndex,
              queryValuesSymbol: this.queryValuesSymbol,
              eventEmitter,
            },
          )
        ).values
      : null;

    const streams = (
      await this.source.executeStream(
        values[this.contextId].map((context, i) => {
          return {
            // The context is how we'd handle different connections with different claims
            context,
            queryValues:
              identifierIndex != null
                ? this.queryValues.map(({ dependencyIndex, codec }) =>
                    codec.toPg(values[dependencyIndex][i]),
                  )
                : EMPTY_ARRAY,
          };
        }),
        {
          text: textForDeclare,
          rawSqlValues: rawSqlValuesForDeclare,
          identifierIndex,
          queryValuesSymbol: this.queryValuesSymbol,
          eventEmitter,
        },
      )
    ).streams;

    if (initialFetchResult) {
      // Munge the initialCount records into the streams

      return streams.map((stream, idx) => {
        if (!isAsyncIterable(stream)) {
          return stream;
        }
        // TODO: Merge the initial results and the stream together manually to
        // avoid unstoppable async generator problem.
        return (async function* () {
          const l = initialFetchResult[idx].length;
          try {
            for (let i = 0; i < l; i++) {
              yield initialFetchResult[idx][i];
            }
          } finally {
            // This finally block because we want to release the underlying
            // stream even if error was thrown during above `yield`s.
            if (
              streamInitialCount != null &&
              streamInitialCount > 0 &&
              l < streamInitialCount
            ) {
              // End the stream here, otherwise GraphQL won't know to stop
              // waiting for the `initialCount` records.

              // Since we never `for await (...of...)` we must manually release
              // the stream:
              const iterator = stream[Symbol.asyncIterator]();
              iterator.return?.();

              // Now we exit this generator, ending the iterable.
              // eslint-disable-next-line no-unsafe-finally
              return;
            }
          }
          for await (const result of stream) {
            yield result;
          }
        })();
      });
    } else {
      return streams;
    }
  }

  private buildSelect(
    options: {
      asArray?: boolean;
      extraSelects?: readonly SQL[];
    } = Object.create(null),
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

    const sqlAliases: SQL[] = [];
    for (const [a, b] of this._symbolSubstitutes.entries()) {
      sqlAliases.push(sql.symbolAlias(a, b));
    }
    const aliases = sql.join(sqlAliases, "");

    if (asArray) {
      if (fragmentsWithAliases.length > 100) {
        // The maximum number of arguments you can pass to a PostgreSQL
        // function is 100, so we need to concatenate multiple arrays
        // TODO: jsonb_build_array || jsonb_build_array
        throw new Error(
          "Please select fewer fields, support for this many fields has not yet been added.",
        );
      }
      const selection = fragmentsWithAliases.length
        ? sql` json_build_array(\n${sql.indent(
            sql.join(fragmentsWithAliases, ",\n"),
          )}) as _`
        : /*
           * In the case where our array is empty, we must add something or
           * PostgreSQL will fail with 'ERROR:  2202E: cannot accumulate empty
           * arrays'
           */
          sql` '[]'::json as _ /* NOTHING?! */`;

      return { sql: sql`${aliases}select${selection}`, extraSelectIndexes };
    } else {
      const selection =
        fragmentsWithAliases.length > 0
          ? sql`\n${sql.indent(sql.join(fragmentsWithAliases, ",\n"))}`
          : sql` /* NOTHING?! */`;

      return { sql: sql`${aliases}select${selection}`, extraSelectIndexes };
    }
  }

  private fromExpression(): SQL {
    const source =
      typeof this.from === "function"
        ? this.from(...this.arguments.map((arg) => arg.placeholder))
        : this.from;
    return source;
  }

  private buildFrom() {
    return { sql: sql`\nfrom ${this.fromExpression()} as ${this.alias}` };
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

  private buildWhereOrHaving(
    whereOrHaving: SQL,
    baseConditions: SQL[],
    options: { extraWheres?: SQL[] } = Object.create(null),
  ) {
    const allConditions = options.extraWheres
      ? [...baseConditions, ...options.extraWheres]
      : baseConditions;
    const sqlConditions = sql.join(
      allConditions.map((c) => sql.parens(sql.indent(c))),
      " and ",
    );
    return {
      sql:
        allConditions.length === 0
          ? sql.blank
          : allConditions.length === 1
          ? sql`\n${whereOrHaving} ${sqlConditions}`
          : sql`\n${whereOrHaving}\n${sql.indent(sqlConditions)}`,
    };
  }

  /**
   * So we can quickly detect if cursors are invalid we use this digest,
   * passing this check does not mean that the cursor is valid but it at least
   * catches common user errors.
   */
  public getOrderByDigest() {
    this._lockParameter("orderBy");
    if (this.orders.length === 0) {
      return "natural";
    }
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = createHash("sha256");
    hash.update(
      JSON.stringify(
        this.orders.map(
          (o) =>
            sql.compile(o.fragment, {
              placeholderValues: this.placeholderValues,
            }).text,
        ),
      ),
    );
    const digest = hash.digest("hex").slice(0, 10);
    return digest;
  }

  public getOrderBy(): ReadonlyArray<PgOrderSpec> {
    this._lockParameter("orderBy");
    return this.orders;
  }

  /**
   * If `last` is in use then we reverse the order from the database and then
   * re-reverse it in JS-land.
   */
  private shouldReverseOrder() {
    return this.first == null && this.last != null;
  }

  private buildGroupBy() {
    this._lockParameter("groupBy");
    const groups = this.groups;
    return {
      sql:
        groups.length > 0
          ? sql`\ngroup by ${sql.join(
              groups.map((o) => o.fragment),
              ", ",
            )}`
          : sql.blank,
    };
  }

  private buildOrderBy({ reverse }: { reverse: boolean }) {
    this._lockParameter("orderBy");
    const orders = reverse
      ? this.orders.map((o) => ({
          ...o,
          direction: o.direction === "ASC" ? "DESC" : "ASC",
        }))
      : this.orders;
    return {
      sql:
        orders.length > 0
          ? sql`\norder by ${sql.join(
              orders.map(
                (o) =>
                  sql`${o.fragment} ${
                    o.direction === "ASC" ? sql`asc` : sql`desc`
                  }${
                    o.nulls === "LAST"
                      ? sql` nulls last`
                      : o.nulls === "FIRST"
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
    // NOTE: according to the EdgesToReturn algorithm in the GraphQL Cursor
    // Connections Specification first is applied first, then last is applied.
    // For us this means that if first is present we set the limit to this and
    // then we do the last artificially later.
    // https://relay.dev/graphql/connections.htm#EdgesToReturn()
    return {
      sql:
        this.first != null
          ? sql`\nlimit ${sql.literal(
              this.first + (this.fetchOneExtra ? 1 : 0),
            )}`
          : this.last != null
          ? sql`\nlimit ${sql.literal(
              this.last + (this.fetchOneExtra ? 1 : 0),
            )}`
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
      asJsonAgg?: boolean;
      withIdentifiers?: boolean;
      extraSelects?: SQL[];
      extraWheres?: SQL[];
    } = Object.create(null),
  ): {
    sql: SQL;
    extraSelectIndexes: number[];
  } {
    if (!this.isTrusted) {
      this.source.applyAuthorizationChecksToPlan(this);
    }

    const reverse = this.shouldReverseOrder();

    const { sql: select, extraSelectIndexes } = this.buildSelect(options);
    const { sql: from } = this.buildFrom();
    const { sql: join } = this.buildJoin();
    const { sql: where } = this.buildWhereOrHaving(
      sql`where`,
      this.conditions,
      options,
    );
    const { sql: groupBy } = this.buildGroupBy();
    const { sql: having } = this.buildWhereOrHaving(
      sql`having`,
      this.havingConditions,
    );
    const { sql: orderBy } = this.buildOrderBy({ reverse });
    const { sql: limit } = this.buildLimit();
    const { sql: offset } = this.buildOffset();

    const baseQuery = sql`${select}${from}${join}${where}${groupBy}${having}${orderBy}${limit}${offset}`;
    const query = options.asJsonAgg
      ? sql`select json_agg(_) from (${sql.indent(baseQuery)}) _`
      : baseQuery;

    return { sql: query, extraSelectIndexes };
  }

  public finalizeArguments(): void {
    this._lockAllParameters();
    return super.finalizeArguments();
  }

  public finalize(): void {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locked = false;

    if (!this.isFinalized) {
      const alias = sql.identifier(Symbol(this.name + "_identifiers"));

      this.placeholders.forEach((placeholder) => {
        // NOTE: we're NOT adding to `this.identifierMatches`.

        // Fine a existing match for this dependency of this type
        const existingIndex = this.queryValues.findIndex((v) => {
          return (
            v.dependencyIndex === placeholder.dependencyIndex &&
            v.codec === placeholder.codec
          );
        });

        // If none exists, add one to our query values
        const idx =
          existingIndex >= 0
            ? existingIndex
            : this.queryValues.push({
                dependencyIndex: placeholder.dependencyIndex,
                codec: placeholder.codec,
              }) - 1;

        // Finally alias this symbol to a reference to this placeholder
        this.placeholderValues.set(
          placeholder.symbol,
          sql`${alias}.${sql.identifier(`id${idx}`)}`,
        );
      });

      const makeQuery = ({
        limit,
        offset,
      }: { limit?: number; offset?: number } = {}): {
        query: SQL;
        identifierIndex: number | null;
      } => {
        const forceOrder = this.streamOptions && this.shouldReverseOrder();
        if (this.queryValues.length || this.placeholders.length) {
          const extraSelects: SQL[] = [];
          const extraWheres: SQL[] = [];

          const identifierIndexOffset =
            extraSelects.push(sql`${alias}.idx`) - 1;
          const rowNumberIndexOffset =
            forceOrder || limit != null || offset != null
              ? extraSelects.push(
                  sql`row_number() over (${sql.indent(
                    this.buildOrderBy({ reverse: false }).sql,
                  )})`,
                ) - 1
              : -1;

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
          const identifierIndex = extraSelectIndexes[identifierIndexOffset];

          const rowNumberIndex =
            rowNumberIndexOffset >= 0
              ? extraSelectIndexes[rowNumberIndexOffset]
              : null;
          const innerWrapper = sql.identifier(Symbol("stream_wrapped"));

          /*
           * This wrapper around the inner query is for @stream:
           *
           * - stream must be in the correct order, so if we have
           *   `this.shouldReverseOrder()` then we must reverse the order
           *   ourselves here;
           * - stream can have an `initialCount` - we want to satisfy all
           *   `initialCount` records from _each identifier group_ before we then
           *   resolve the remaining records.
           *
           * NOTE: if neither of the above cases apply then we can skip this,
           * even for @stream.
           */
          const wrappedInnerQuery =
            rowNumberIndex != null ||
            limit != null ||
            (offset != null && offset > 0)
              ? sql`select *\nfrom (${sql.indent(
                  baseQuery,
                )}) ${innerWrapper}\norder by ${innerWrapper}.${sql.identifier(
                  String(rowNumberIndex),
                )}${
                  limit != null ? sql`\nlimit ${sql.literal(limit)}` : sql.blank
                }${
                  offset != null && offset > 0
                    ? sql`\noffset ${sql.literal(offset)}`
                    : sql.blank
                }`
              : baseQuery;

          // TODO: if the query does not have a limit/offset; should we use an
          // `inner join` in a flattened query instead of a wrapped query with
          // `lateral`?

          const wrapperAlias = sql.identifier(Symbol(this.name + "_result"));
          /*
           * IMPORTANT: this wrapper query is necessary so that queries that
           * have a limit/offset get the limit/offset applied _per identifier
           * group_; that's why this cannot just be another "from" clause.
           */
          const query = sql`select ${wrapperAlias}.*
from (${sql.indent(sql`\
select\n${sql.indent(sql`\
ids.ordinality - 1 as idx,
${sql.join(
  this.queryValues.map(({ codec }, idx) => {
    return sql`(ids.value->>${sql.literal(idx)})::${
      codec.sqlType
    } as ${sql.identifier(`id${idx}`)}`;
  }),
  ",\n",
)}`)}
from json_array_elements(${sql.value(
            // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
            // a value before executing the query.
            this.queryValuesSymbol as any,
          )}::json) with ordinality as ids`)}) as ${alias},
lateral (${sql.indent(wrappedInnerQuery)}) as ${wrapperAlias}`;
          return { query, identifierIndex };
        } else {
          const { sql: query } = this.buildQuery();
          return { query, identifierIndex: null };
        }
      };

      if (this.streamOptions) {
        // When streaming we can't reverse order in JS - we must do it in the DB.
        if (this.streamOptions.initialCount > 0) {
          /*
           * Here our stream is constructed of two parts - an
           * `initialFetchQuery` to satisfy the `initialCount` and then a
           * `streamQuery` to build the PostgreSQL cursor for fetching the
           * remaining results across all groups.
           */
          const {
            query: initialFetchQuery,
            identifierIndex: initialFetchIdentifierIndex,
          } = makeQuery({
            limit: this.streamOptions.initialCount,
          });
          const { query: streamQuery, identifierIndex: streamIdentifierIndex } =
            makeQuery({
              offset: this.streamOptions.initialCount,
            });
          if (initialFetchIdentifierIndex !== streamIdentifierIndex) {
            throw new Error(
              `GraphileInternalError<3760b02e-dfd0-4924-bf62-2e0ef9399605>: expected identifier indexes to match`,
            );
          }
          const identifierIndex = initialFetchIdentifierIndex;
          const { text, values: rawSqlValues } = sql.compile(
            initialFetchQuery,
            { placeholderValues: this.placeholderValues },
          );
          const { text: textForDeclare, values: rawSqlValuesForDeclare } =
            sql.compile(streamQuery, {
              placeholderValues: this.placeholderValues,
            });
          this.finalizeResults = {
            text,
            rawSqlValues,
            textForDeclare,
            rawSqlValuesForDeclare,
            identifierIndex,
            shouldReverseOrder: false,
            streamInitialCount: this.streamOptions.initialCount,
          };
        } else {
          /*
           * Unlike the above case, here we have an `initialCount` of zero so
           * we can skip the `initialFetchQuery` and jump straight to the
           * `streamQuery`.
           */
          const { query: streamQuery, identifierIndex: streamIdentifierIndex } =
            makeQuery({
              offset: 0,
            });
          const { text: textForDeclare, values: rawSqlValuesForDeclare } =
            sql.compile(streamQuery, {
              placeholderValues: this.placeholderValues,
            });
          this.finalizeResults = {
            // This is a hack since this is the _only_ place we don't want
            // `text`; loosening the types would risk us forgetting in more
            // places (and cause us to do excessive type safety checks) so we
            // use an explicit empty string to mark this.
            text: "",
            rawSqlValues: [],
            textForDeclare,
            rawSqlValuesForDeclare,
            identifierIndex: streamIdentifierIndex,
            shouldReverseOrder: false,
            streamInitialCount: 0,
          };
        }
      } else {
        const { query, identifierIndex } = makeQuery();
        const { text, values: rawSqlValues } = sql.compile(query, {
          placeholderValues: this.placeholderValues,
        });
        this.finalizeResults = {
          text,
          rawSqlValues,
          identifierIndex,
          // TODO: when streaming we must not set this to true
          shouldReverseOrder: this.shouldReverseOrder(),
          name: hash(text),
        };
      }
    }

    this.locked = true;

    super.finalize();
  }

  deduplicate(
    peers: PgSelectPlan<any, any, any, any>[],
  ): PgSelectPlan<TColumns, TUniques, TRelations, TParameters> {
    const identical = peers.find((p) => {
      // If SELECT, FROM, JOIN, WHERE, ORDER, GROUP BY, HAVING, LIMIT, OFFSET
      // all match with one of our peers then we can replace ourself with one
      // of our peers. NOTE: we do _not_ merge SELECTs at this stage because
      // that would require mapping, and mapping should not be done during
      // deduplicate because it would interfere with optimize. So, instead,
      // we try to ensure that as few selects as possible exist in the plan
      // at this stage.

      // Check FROM matches
      if (p.source !== this.source) {
        return false;
      }

      // Check mode matches
      if (p.mode !== this.mode) {
        return false;
      }

      // Since deduplicate runs before we have children, we do not need to
      // check the symbol or alias matches. We do need to factor the different
      // symbols into SQL equivalency checks though.
      const symbolSubstitutes = new Map<symbol, symbol>();
      if (typeof this.symbol === "symbol" && typeof p.symbol === "symbol") {
        if (this.symbol !== p.symbol) {
          symbolSubstitutes.set(this.symbol, p.symbol);
        } else {
          // Fine :)
        }
      } else if (this.symbol !== p.symbol) {
        return false;
      }

      // Check PLACEHOLDERS match
      if (
        !arraysMatch(this.placeholders, p.placeholders, (a, b) => {
          const equivalent =
            a.codec === b.codec && a.dependencyIndex === b.dependencyIndex;
          if (equivalent) {
            if (a.symbol !== b.symbol) {
              // Make symbols appear equivalent
              symbolSubstitutes.set(a.symbol, b.symbol);
            }
          }
          return equivalent;
        })
      ) {
        debugPlanVerbose(
          "Refusing to deduplicate %c with %c because the placeholders don't match",
          this,
          p,
        );
        return false;
      }

      const sqlIsEquivalent = (a: SQL | symbol, b: SQL | symbol) =>
        sql.isEquivalent(a, b, { symbolSubstitutes });

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

      // Check GROUPs match
      if (
        !arraysMatch(this.groups, p.groups, (a, b) =>
          sqlIsEquivalent(a.fragment, b.fragment),
        )
      ) {
        return false;
      }

      // Check HAVINGs match
      if (
        !arraysMatch(this.havingConditions, p.havingConditions, sqlIsEquivalent)
      ) {
        return false;
      }

      // Check ORDERs match
      if (
        !arraysMatch(
          this.orders,
          p.orders,
          (a, b) =>
            a.direction === b.direction &&
            a.nulls === b.nulls &&
            sqlIsEquivalent(a.fragment, b.fragment),
        )
      ) {
        return false;
      }

      // Check LIMIT matches
      if (this.first !== p.first) {
        return false;
      }
      if (this.last !== p.last) {
        return false;
      }

      // Check OFFSET matches
      if (this.offset !== p.offset) {
        return false;
      }

      // Check JOINs match
      if (
        !arraysMatch(this.joins, p.joins, (a, b) =>
          joinMatches(a, b, sqlIsEquivalent),
        )
      ) {
        debugPlanVerbose(
          "Refusing to deduplicate %c with %c because the joins don't match",
          this,
          p,
        );
        return false;
      }

      // Check WHEREs match
      if (!arraysMatch(this.conditions, p.conditions, sqlIsEquivalent)) {
        debugPlanVerbose(
          "Refusing to deduplicate %c with %c because the conditions don't match",
          this,
          p,
        );
        return false;
      }

      debugPlanVerbose("Found that %c and %c are equivalent!", this, p);

      return true;
    });
    if (identical) {
      if (
        typeof this.symbol === "symbol" &&
        typeof identical.symbol === "symbol"
      ) {
        if (this.symbol !== identical.symbol) {
          identical._symbolSubstitutes.set(this.symbol, identical.symbol);
        } else {
          // Fine :)
        }
      }

      if (this.fetchOneExtra) {
        identical.fetchOneExtra = true;
      }

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

  private mergeSelectsWith<TOtherPlan extends PgSelectPlan<any, any, any, any>>(
    otherPlan: TOtherPlan,
  ): {
    [desiredIndex: string]: string;
  } {
    assert.equal(
      otherPlan.mode,
      this.mode,
      "GraphileInternalError<d12a3d95-4f7b-41d9-8cb4-a97bd169d128>: attempted to merge selects with a PgSelectPlan in a different mode",
    );
    const actualKeyByDesiredKey = Object.create(null);
    //console.log(`Other ${otherPlan} selects:`);
    //console.dir(otherPlan.selects, { depth: 8 });
    //console.log(`My ${this} selects:`);
    //console.dir(this.selects, { depth: 8 });
    this.selects.forEach((frag, idx) => {
      actualKeyByDesiredKey[idx] = otherPlan.selectAndReturnIndex(frag);
    });
    //console.dir(actualKeyByDesiredKey);
    //console.log(`Other ${otherPlan} selects now:`);
    //console.dir(otherPlan.selects, { depth: 8 });
    return actualKeyByDesiredKey;
  }

  private mergePlaceholdersInto<
    TOtherPlan extends PgSelectPlan<any, any, any, any>,
  >(otherPlan: TOtherPlan): void {
    for (const placeholder of this.placeholders) {
      const { dependencyIndex, symbol, codec } = placeholder;
      const dep = this.getPlan(this.dependencies[dependencyIndex]);
      if (
        // I am uncertain on this code.
        isStaticInputPlan(dep) ||
        (otherPlan.parentPathIdentity.length > dep.parentPathIdentity.length &&
          otherPlan.parentPathIdentity.startsWith(dep.parentPathIdentity))
      ) {
        // Either dep is a static input plan (which isn't dependent on anything
        // else) or otherPlan is deeper than dep; either way we can use the dep
        // directly within otherPlan.
        const newPlanIndex = otherPlan.addDependency(dep);
        otherPlan.placeholders.push({
          dependencyIndex: newPlanIndex,
          codec,
          symbol,
        });
      } else if (dep instanceof PgClassExpressionPlan) {
        // Replace with a reference.
        otherPlan.placeholderValues.set(placeholder.symbol, dep.toSQL());
      } else {
        throw new Error(
          `Could not merge placeholder from unsupported plan type: ${dep}`,
        );
      }
    }
    for (const [
      sqlPlaceholder,
      placeholderValue,
    ] of this.placeholderValues.entries()) {
      if (
        otherPlan.placeholderValues.has(sqlPlaceholder) &&
        otherPlan.placeholderValues.get(sqlPlaceholder) !== placeholderValue
      ) {
        throw new Error(
          `${otherPlan} already has an identical placeholder with a different value when trying to mergePlaceholdersInto it from ${this}`,
        );
      }
      otherPlan.placeholderValues.set(sqlPlaceholder, placeholderValue);
    }
  }

  optimize({ stream }: PlanOptimizeOptions): ExecutablePlan {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locked = false;
    this.streamOptions = stream;

    // TODO: we should serialize our `SELECT` clauses and then if any are
    // identical we should omit the later copies and have them link back to the
    // earliest version (resolve this in `execute` via mapping).

    if (!this.isInliningForbidden && !this.hasSideEffects && !stream) {
      // Inline ourself into our parent if we can.
      let t: PgSelectPlan<any, any, any, any> | null | undefined = undefined;
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
        const dep = this.getPlan(planId);
        if (dep instanceof __TrackedObjectPlan) {
          // This has come from a variable, context or rootValue, therefore
          // it's shared and thus safe.
        } else if (isStaticInputPlan(dep)) {
          // This has come from a hard-coded input in the document, therefore
          // it's shared and thus safe.
        } else if (dep instanceof PgClassExpressionPlan) {
          const p2 = this.getPlan(dep.dependencies[dep.tableId]);
          const t2Parent = dep.getParentPlan();
          if (!(t2Parent instanceof PgSelectSinglePlan)) {
            continue;
          }
          const t2 = t2Parent.getClassPlan();
          if (t2 === this) {
            throw new Error(
              `Recursion error - record plan ${dep} is dependent on ${t2}, and ${this} is dependent on ${dep}`,
            );
          }

          if (t2.hasSideEffects) {
            // It's a mutation; don't merge
            continue;
          }

          if (!planGroupsOverlap(this, t2)) {
            // We're not in the same group (i.e. there's probably a @defer or
            // @stream between us) - do not merge.
            continue;
          }

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
        } else {
          debugPlanVerbose(
            "Refusing to optimise %c due to dependency %c",
            this,
            dep,
          );
          t = null;
          break;
        }
      }
      if (t != null && p != null) {
        const myContext = this.getPlan(this.dependencies[this.contextId]);
        const tsContext = this.getPlan(t.dependencies[t.contextId]);
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

        if (table === this) {
          throw new Error(
            `Something's gone catastrophically wrong - ${this} is trying to merge with itself!`,
          );
        }

        const tableWasLocked = table.locked;
        table.locked = false;

        if (
          this.isUnique &&
          this.first == null &&
          this.last == null &&
          this.offset == null &&
          this.mode !== "aggregate" &&
          table.mode !== "aggregate"
          // TODO: && !this.order && ... */
        ) {
          if (this.selects.length > 0) {
            debugPlanVerbose(
              "Merging %c into %c (via %c)",
              this,
              table,
              parent,
            );
            const { sql: where } = this.buildWhereOrHaving(
              sql`where`,
              this.conditions,
            );
            const conditions = [
              ...this.identifierMatches.map((identifierMatch, i) => {
                const { dependencyIndex, codec } = this.queryValues[i];
                const plan = this.getPlan(this.dependencies[dependencyIndex]);
                if (plan instanceof PgClassExpressionPlan) {
                  return sql`${plan.toSQL()}::${
                    codec.sqlType
                  } = ${identifierMatch}`;
                } else if (isStaticInputPlan(plan)) {
                  return sql`${this.placeholder(
                    plan,
                    codec,
                  )} = ${identifierMatch}`;
                } else {
                  throw new Error(
                    `Expected ${plan} (${i}th dependency of ${this}; plan with id ${dependencyIndex}) to be a PgClassExpressionPlan`,
                  );
                }
              }),
              // Note the WHERE is now part of the JOIN condition (since
              // it's a LEFT JOIN).
              ...(where !== sql.blank ? [where] : []),
            ];
            this.mergePlaceholdersInto(table);
            for (const [a, b] of this._symbolSubstitutes.entries()) {
              if (isDev) {
                if (
                  table._symbolSubstitutes.has(a) &&
                  table._symbolSubstitutes.get(a) !== b
                ) {
                  throw new Error(
                    `Conflict when setting a substitute whilst merging ${this} into ${table}; symbol already has a substitute, and it's different.`,
                  );
                }
              }
              table._symbolSubstitutes.set(a, b);
            }
            table.joins.push(
              {
                type: "left",
                source: this.fromExpression(),
                alias: this.alias,
                conditions,
              },
              ...this.joins,
            );
            const actualKeyByDesiredKey = this.mergeSelectsWith(table);
            // We return a list here because our children are going to use a
            // `first` plan on us.
            // NOTE: we don't need to reverse the list for relay pagination
            // because it only contains one entry.
            return list([map(parent, actualKeyByDesiredKey)]);
          } else {
            debugPlanVerbose(
              "Skipping merging %c into %c (via %c) due to no columns being selected",
              this,
              table,
              parent,
            );
            // We return a list here because our children are going to use a
            // `first` plan on us.
            return list([parent]);
          }
        } else if (
          parent instanceof PgSelectSinglePlan &&
          parent.getClassPlan().mode !== "aggregate"
        ) {
          const parent2 = this.getPlan(parent.dependencies[parent.itemPlanId]);
          this.identifierMatches.forEach((identifierMatch, i) => {
            const { dependencyIndex, codec } = this.queryValues[i];
            const plan = this.getPlan(this.dependencies[dependencyIndex]);
            if (plan instanceof PgClassExpressionPlan) {
              return this.where(
                sql`${plan.toSQL()}::${codec.sqlType} = ${identifierMatch}`,
              );
            } else if (isStaticInputPlan(plan)) {
              return this.where(
                sql`${this.placeholder(plan, codec)} = ${identifierMatch}`,
              );
            } else {
              throw new Error(
                `Expected ${plan} (${i}th dependency of ${this}; plan with id ${dependencyIndex}) to be a PgClassExpressionPlan`,
              );
            }
          });
          this.mergePlaceholdersInto(table);
          const { sql: query } = this.buildQuery({
            // No need to do arrays; the json_agg handles this for us - we can
            // return objects with numeric keys just fine and JS will be fine
            // with it.
            asArray: false,
            asJsonAgg: true,
          });
          const selfIndex = table.selectAndReturnIndex(sql`(${query})`);
          debugPlanVerbose(
            "Optimising %c (via %c and %c)",
            this,
            table,
            parent2,
          );
          const limit = this.first ?? this.last;
          const firstAndLast =
            this.first != null && this.last != null && this.last < this.first;
          const rowsPlan = access<any[]>(parent2, [selfIndex], []);
          const shouldReverse = this.shouldReverseOrder();
          if ((this.fetchOneExtra || firstAndLast) && limit != null) {
            return lambda(rowsPlan, (rows) => {
              if (!rows) {
                return rows;
              }
              const hasMore = rows.length > limit;
              const limitedRows = hasMore ? rows.slice(0, limit) : rows;
              const slicedRows =
                firstAndLast && this.last != null
                  ? limitedRows.slice(-this.last)
                  : limitedRows;
              const orderedRows = shouldReverse
                ? reverseArray(slicedRows)
                : slicedRows;
              if (this.fetchOneExtra) {
                // TODO: this is an ugly hack; really we should consider resolving to an
                // object that can contain metadata as well as the rows.
                Object.defineProperty(orderedRows, "hasMore", {
                  value: hasMore,
                });
              }
              return orderedRows;
            });
          } else {
            const orderedPlan = shouldReverse ? reverse(rowsPlan) : rowsPlan;
            return orderedPlan;
          }
        }

        table.locked = tableWasLocked;
      }
    }

    this.locked = true;

    return this;
  }

  /**
   * Most likely you want `.single()` instead of this method.
   *
   * If this plan may only return one record, you can use `.singleAsRecord()`
   * to return a plan that resolves to that record (rather than a list of
   * records as it does currently).
   *
   * The main reason to use this instead of `.single()` is if you are
   * paginating over a scalar and you truly need a PgSelectSinglePlan interface
   * e.g. so you can get the `count(*)` aggregate.
   *
   * Beware: if you call this and the database might actually return more than
   * one record then you're potentially in for a Bad Time.
   */
  singleAsRecord(
    options?: PgSelectSinglePlanOptions,
  ): PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters> {
    this.setUnique(true);
    // TODO: should this be on a clone plan? I don't currently think so since
    // PgSelectSinglePlan does not allow for `.where` divergence (since it
    // does not support `.where`).
    return new PgSelectSinglePlan(this, first(this), options);
  }

  /**
   * If this plan may only return one record, you can use `.single()` to return
   * a plan that resolves to either that record (in the case of composite
   * types) or the underlying scalar (in the case of a source whose codec has
   * no columns).
   *
   * Beware: if you call this and the database might actually return more than
   * one record then you're potentially in for a Bad Time.
   */
  single(
    options?: PgSelectSinglePlanOptions,
  ): TColumns extends PgTypeColumns
    ? PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters>
    : PgClassExpressionPlan<
        undefined,
        PgTypeCodec<undefined, any, any>,
        TColumns,
        TUniques,
        TRelations,
        TParameters
      > {
    const $single = this.singleAsRecord(options);
    const isScalar = !this.source.codec.columns;
    return (isScalar ? $single.getSelfNamed() : $single) as any;
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
    itemPlan: ExecutablePlan,
  ): TColumns extends PgTypeColumns
    ? PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters>
    : PgClassExpressionPlan<
        undefined,
        PgTypeCodec<undefined, any, any>,
        TColumns,
        TUniques,
        TRelations,
        TParameters
      > {
    const $single = new PgSelectSinglePlan(this, itemPlan);
    const isScalar = !this.source.codec.columns;
    return (isScalar ? $single.getSelfNamed() : $single) as any;
  }

  // --------------------

  /**
   * Performs the given call back just before the given PgSelectLockableParameter is
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
    type: PgSelectLockableParameter,
    callback: PgSelectLockCallback<TColumns, TUniques, TRelations, TParameters>,
  ): void {
    this._assertParameterUnlocked(type);
    this._beforeLock[type].push(callback);
  }

  /**
   * Performs the given call back just after the given PgSelectLockableParameter is
   * locked.
   */
  public afterLock(
    type: PgSelectLockableParameter,
    callback: PgSelectLockCallback<TColumns, TUniques, TRelations, TParameters>,
  ): void {
    this._assertParameterUnlocked(type);
    this._afterLock[type].push(callback);
  }

  private lockCallbacks(
    phase: "beforeLock" | "afterLock",
    type: PgSelectLockableParameter,
  ) {
    const list = phase === "beforeLock" ? this._beforeLock : this._afterLock;
    const callbacks = list[type];
    const l = callbacks.length;
    if (l > 0) {
      const toCall = callbacks.splice(0, l);
      for (let i = 0; i < l; i++) {
        toCall[i](this);
      }
      if (callbacks.length > 0) {
        throw new Error(
          `beforeLock callback for '${type}' caused more beforeLock callbacks to be registered`,
        );
      }
    }
  }

  /**
   * Calls all the beforeLock actions for the given parameter and then locks
   * it.
   */
  private _lockParameter(type: PgSelectLockableParameter): void {
    if (this._lockedParameter[type] !== false) {
      return;
    }
    this.lockCallbacks("beforeLock", type);
    this._lockedParameter[type] = isDev
      ? new Error("Initially locked here").stack
      : true;
    this.lockCallbacks("afterLock", type);
  }

  /**
   * Throw a helpful error if you're trying to modify something that's already
   * locked.
   */
  private _assertParameterUnlocked(type: PgSelectLockableParameter): void {
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
    this._lockParameter("groupBy");
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
  j1: PgSelectPlanJoin,
  j2: PgSelectPlanJoin,
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
function ensureOrderIsUnique(plan: PgSelectPlan<any, any, any, any>) {
  const unique = (plan.source.uniques as PgSourceUnique[])[0];
  if (unique) {
    const ordersIsUnique = plan.orderIsUnique();
    if (!ordersIsUnique) {
      unique.columns.forEach((c) => {
        plan.orderBy({
          fragment: sql`${plan.alias}.${sql.identifier(c as string)}`,
          codec: plan.source.codec.columns[c].codec,
          direction: "ASC",
        });
      });
      plan.setOrderIsUnique();
    }
  }
}

export function pgSelect<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  options: PgSelectOptions<TColumns>,
): PgSelectPlan<TColumns, TUniques, TRelations, TParameters> {
  return new PgSelectPlan(options);
}

Object.defineProperty(pgSelect, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgSelect",
  },
});

/**
 * Turns a list of records (e.g. from PgSelectSinglePlan.record()) back into a PgSelect.
 */
export function pgSelectFromRecords<
  TColumns extends PgTypeColumns,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  source: PgSource<TColumns, TUniques, TRelations, TParameters>,
  records: PgClassExpressionPlan<
    undefined,
    PgTypeCodec<undefined, any, any, PgTypeCodec<TColumns, any, any>>,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >,
): PgSelectPlan<TColumns, TUniques, TRelations, TParameters> {
  return new PgSelectPlan<TColumns, TUniques, TRelations, TParameters>({
    source,
    identifiers: [],
    from: (records) => sql`unnest(${records})`,
    args: [{ plan: records, pgCodec: listOfType(source.codec) }],
  }) as PgSelectPlan<TColumns, TUniques, TRelations, TParameters>;
}

Object.defineProperty(pgSelectFromRecords, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgSelectFromRecords",
  },
});
