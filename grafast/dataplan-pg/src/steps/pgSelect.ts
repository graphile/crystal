import { createHash } from "crypto";
import debugFactory from "debug";
import type {
  ConnectionCapableStep,
  ExecutionExtra,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastValuesList,
  InputStep,
  LambdaStep,
  PromiseOrDirect,
  StepOptimizeOptions,
  StepStreamOptions,
  StreamableStep,
} from "grafast";
import {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __ItemStep,
  __TrackedValueStep,
  access,
  arrayOfLength,
  ConnectionStep,
  constant,
  ConstantStep,
  deepEval,
  ExecutableStep,
  exportAs,
  first,
  isAsyncIterable,
  isPromiseLike,
  lambda,
  list,
  remapKeys,
  reverse,
  reverseArray,
  SafeError,
  stepAMayDependOnStepB,
  stepsAreInSamePhase,
} from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql, { $$symbolToIdentifier, arraysMatch } from "pg-sql2";

import type { PgCodecAttributes } from "../codecs.js";
import { listOfCodec, TYPES } from "../codecs.js";
import type { PgResource, PgResourceUnique } from "../datasource.js";
import type {
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRelations,
  PgCodec,
  PgCodecRelation,
  PgGroupSpec,
  PgOrderSpec,
  PgTypedExecutableStep,
} from "../interfaces.js";
import { PgLocker } from "../pgLocker.js";
import { PgClassExpressionStep } from "./pgClassExpression.js";
import type {
  PgHavingConditionSpec,
  PgWhereConditionSpec,
} from "./pgCondition.js";
import { PgConditionStep } from "./pgCondition.js";
import type { PgPageInfoStep } from "./pgPageInfo.js";
import { pgPageInfo } from "./pgPageInfo.js";
import type { PgSelectSinglePlanOptions } from "./pgSelectSingle.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";
import { pgValidateParsedCursor } from "./pgValidateParsedCursor.js";
import { toPg } from "./toPg.js";

export type PgSelectParsedCursorStep = LambdaStep<string, any[]>;

const UNHANDLED_PLACEHOLDER = sql`(1/0) /* ERROR! Unhandled pgSelect placeholder! */`;

// Maximum identifier length in Postgres is 63 chars, so trim one off. (We
// could do base64... but meh.)
const hash = (text: string): string =>
  createHash("sha256").update(text).digest("hex").slice(0, 63);

const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

function parseCursor(cursor: string | null) {
  if (cursor == null) {
    // This throw should never happen, so we can still be isSyncAndSafe.
    // If it does throw, the entire lambda will throw, which is allowed.
    throw new Error(
      "GrafastInternalError<3b076b86-828b-46b3-885d-ed2577068b8d>: cursor is null, but we have a constraint preventing that...",
    );
  }
  try {
    if (typeof cursor !== "string") {
      throw new Error("Invalid cursor");
    }
    const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    if (!Array.isArray(decoded)) {
      throw new Error("Expected array");
    }
    return decoded;
  } catch (e) {
    throw new SafeError(
      "Invalid cursor, please enter a cursor from a previous request, or null.",
    );
  }
}
parseCursor.isSyncAndSafe = true; // Optimization

function isStaticInputStep(
  dep: ExecutableStep,
): dep is
  | __InputListStep
  | __InputStaticLeafStep
  | __InputObjectStep
  | ConstantStep<any> {
  return (
    dep instanceof __InputListStep ||
    dep instanceof __InputStaticLeafStep ||
    dep instanceof __InputObjectStep ||
    dep instanceof ConstantStep
  );
}

const debugPlan = debugFactory("@dataplan/pg:PgSelectStep:plan");
// const debugExecute = debugFactory("@dataplan/pg:PgSelectStep:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);

type PgSelectPlanJoin =
  | {
      type: "cross";
      from: SQL;
      alias: SQL;
      attributeNames?: SQL;
      lateral?: boolean;
    }
  | {
      type: "inner" | "left" | "right" | "full";
      from: SQL;
      alias: SQL;
      attributeNames?: SQL;
      conditions: SQL[];
      lateral?: boolean;
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
  codec: PgCodec;
  symbol: symbol;
};

export type PgSelectIdentifierSpec =
  | {
      step: ExecutableStep;
      codec: PgCodec;
      matches: (alias: SQL) => SQL;
    }
  | {
      step: PgTypedExecutableStep<any>;
      codec?: PgCodec;
      matches: (alias: SQL) => SQL;
    };

export type PgSelectArgumentSpec =
  | {
      step: ExecutableStep;
      pgCodec: PgCodec<any, any, any, any>;
      name?: string;
    }
  | {
      step: PgTypedExecutableStep<any>;
      name?: string;
    };

export interface PgSelectArgumentDigest {
  position?: number;
  name?: string;
  placeholder: SQL;
}

interface QueryValue {
  dependencyIndex: number;
  codec: PgCodec;
}

function assertSensible(step: ExecutableStep): void {
  if (step instanceof PgSelectStep) {
    throw new Error(
      "You passed a PgSelectStep as an identifier, perhaps you forgot to add `.record()`?",
    );
  }
  if (step instanceof PgSelectSingleStep) {
    throw new Error(
      "You passed a PgSelectSingleStep as an identifier, perhaps you forgot to add `.record()`?",
    );
  }
}

export type PgSelectMode = "normal" | "aggregate" | "mutation";

export interface PgSelectOptions<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> {
  /**
   * Tells us what we're dealing with - data type, columns, where to get it
   * from, what it's called, etc. Many of these details can be overridden
   * below.
   */
  resource: TResource;

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
   * If your `from` (or resource.from if omitted) is a function, the arguments
   * to pass to the function.
   */
  args?: Array<PgSelectArgumentSpec>;

  /**
   * If you want to build the data in a custom way (e.g. calling a function,
   * selecting from a view, building a complex query, etc) then you can
   * override the `resource.from` here with your own from code. Defaults to
   * `resource.from`.
   */
  from?: SQL | ((...args: PgSelectArgumentDigest[]) => SQL);

  /**
   * If you pass a custom `from` (or otherwise want to aid in debugging),
   * passing a custom name can make it easier to follow the SQL/etc that is
   * generated.
   */
  name?: string;

  mode?: PgSelectMode;

  /**
   * If true and this turns into a join it should be a lateral join.
   */
  joinAsLateral?: boolean;
}

/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <attributes>, <cursor?> FROM <table>`. You can also add
 * `JOIN`, `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`. You cannot add `GROUP BY`
 * because that would invalidate the identifiers; and as such you can't use
 * `HAVING` or functions that implicitly turn the query into an aggregate. We
 * don't allow `UNION`/`INTERSECT`/`EXCEPT`/`FOR UPDATE`/etc at this time,
 * purely because it hasn't been sufficiently considered.
 */
export class PgSelectStep<
    TResource extends PgResource<any, any, any, any, any> = PgResource,
  >
  extends ExecutableStep<
    ReadonlyArray<unknown[] /* a tuple based on what is selected at runtime */>
  >
  implements
    StreamableStep<unknown[]>,
    ConnectionCapableStep<
      PgSelectSingleStep<TResource>,
      PgSelectParsedCursorStep
    >
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectStep",
  };

  isSyncAndSafe = false;

  // FROM
  private readonly from:
    | SQL
    | ((...args: Array<PgSelectArgumentDigest>) => SQL);

  /**
   * This defaults to the name of the resource but you can override it. Aids
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
   * The resource from which we are selecting: table, view, etc
   */
  public readonly resource: TResource;

  // JOIN

  private relationJoins: Map<keyof GetPgResourceRelations<TResource>, SQL>;
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
  /** When using natural pagination, this index is the lower bound (and should be excluded) */
  private lowerIndexStepId: number | null;
  /** When using natural pagination, this index is the upper bound (and should be excluded) */
  private upperIndexStepId: number | null;
  /** When we calculate the limit/offset, we may be able to determine there cannot be a next page */
  private limitAndOffsetId: number | null;

  // OFFSET

  private offset: number | null;

  // CURSORS

  private beforeStepId: number | null;
  private afterStepId: number | null;

  // Connection
  private connectionDepId: number | null = null;

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
   * If the resource is a function, this is the names of the arguments to pass
   */
  private arguments: ReadonlyArray<PgSelectArgumentDigest>;

  /**
   * Values used in this plan.
   */
  private placeholders: Array<PgSelectPlaceholder>;
  private placeholderValues: Map<symbol, SQL>;

  /**
   * If true, we don't need to add any of the security checks from the
   * resource; otherwise we must do so. Default false.
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
   * If true and this becomes a join during optimisation then it should become
   * a lateral join; e.g. in the following query, the left join must be
   * lateral.
   *
   * ```sql
   * select *
   * from foo
   * left join lateral (
   *   select (foo.col).*
   * ) t
   * on true
   * ```
   */
  private joinAsLateral: boolean;

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
  private streamOptions: StepStreamOptions | null = null;

  /**
   * When finalized, we build the SQL query, queryValues, and note where to feed in
   * the relevant queryValues. This saves repeating this work at execution time.
   */
  private finalizeResults: {
    // The SQL query text
    text: string;
    // An optimized SQL query to use when there's only one input
    textForSingle?: string;

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
    nameForSingle?: string;
  } | null = null;

  // --------------------

  public readonly mode: PgSelectMode;

  private locker: PgLocker<this> = new PgLocker(this);

  constructor(options: PgSelectOptions<TResource>);
  constructor(cloneFrom: PgSelectStep<TResource>, mode?: PgSelectMode);
  constructor(
    optionsOrCloneFrom: PgSelectStep<TResource> | PgSelectOptions<TResource>,
    overrideMode?: PgSelectMode,
  ) {
    super();
    const [
      cloneFrom,
      {
        resource,
        identifiers,
        args: inArgs,
        from: inFrom = null,
        name: customName,
        mode: inMode,
        joinAsLateral: inJoinAsLateral = false,
      },
    ] =
      optionsOrCloneFrom instanceof PgSelectStep
        ? [
            optionsOrCloneFrom,
            {
              resource: optionsOrCloneFrom.resource,
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

    this.resource = resource;
    if (cloneFrom !== null) {
      // Prevent any changes to our original to help avoid programming
      // errors.
      cloneFrom.lock();

      if (this.dependencies.length !== 0) {
        throw new Error("Should not have any dependencies yet");
      }
      cloneFrom.dependencies.forEach((planId, idx) => {
        const myIdx = this.addDependency(cloneFrom.getDep(idx), true);
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
        this.locker.beforeLock("orderBy", () =>
          this.locker.lockParameter("groupBy"),
        );
      } else {
        this.locker.beforeLock("orderBy", ensureOrderIsUnique);
      }
    }

    this.contextId = cloneFrom
      ? cloneFrom.contextId
      : this.addDependency(this.resource.executor.context());

    this.name = customName ?? resource.name;
    this.symbol = cloneFrom ? cloneFrom.symbol : Symbol(this.name);
    this._symbolSubstitutes = cloneFrom
      ? new Map(cloneFrom._symbolSubstitutes)
      : new Map();
    this.alias = cloneFrom ? cloneFrom.alias : sql.identifier(this.symbol);
    this.from = inFrom ?? resource.from;
    this.placeholders = cloneFrom ? [...cloneFrom.placeholders] : [];
    this.placeholderValues = cloneFrom
      ? new Map(cloneFrom.placeholderValues)
      : new Map();
    this.joinAsLateral =
      (cloneFrom ? cloneFrom.joinAsLateral : inJoinAsLateral) ??
      !!this.resource.parameters;
    if (cloneFrom !== null) {
      this.queryValues = [...cloneFrom.queryValues]; // References indexes cloned above
      this.identifierMatches = Object.freeze(cloneFrom.identifierMatches);
      this.arguments = Object.freeze(cloneFrom.arguments);
    } else {
      if (!identifiers) {
        throw new Error("Invalid construction of PgSelectStep");
      }
      const queryValues: QueryValue[] = [];
      const identifierMatches: SQL[] = [];
      let args: PgSelectArgumentDigest[] = [];
      let argIndex: null | number = 0;
      identifiers.forEach((identifier) => {
        if (isDev) {
          assertSensible(identifier.step);
        }
        const { step, matches } = identifier;
        const codec =
          identifier.codec ||
          (identifier.step as PgTypedExecutableStep<any>).pgCodec;
        queryValues.push({
          dependencyIndex: this.addDependency(step),
          codec,
        });
        identifierMatches.push(matches(this.alias));
      });
      if (inArgs != null) {
        const { digests: newArgs, argIndex: newArgIndex } =
          digestsFromArgumentSpecs(this, inArgs, args, argIndex);
        args = newArgs;
        argIndex = newArgIndex;
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

    // dependencies were already added, so we can just copy the dependency references
    this.beforeStepId = cloneFromMatchingMode?.beforeStepId ?? null;
    this.afterStepId = cloneFromMatchingMode?.afterStepId ?? null;
    this.lowerIndexStepId = cloneFromMatchingMode?.lowerIndexStepId ?? null;
    this.upperIndexStepId = cloneFromMatchingMode?.upperIndexStepId ?? null;
    this.limitAndOffsetId = cloneFromMatchingMode?.limitAndOffsetId ?? null;

    this.locker.afterLock("orderBy", () => {
      if (this.beforeStepId != null) {
        this.applyConditionFromCursor(
          "before",
          this.getDep(this.beforeStepId) as any,
        );
      }
      if (this.afterStepId != null) {
        this.applyConditionFromCursor(
          "after",
          this.getDep(this.afterStepId) as any,
        );
      }
    });

    this.hasSideEffects = this.mode === "mutation";

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
    return (
      this.name +
      (this.fetchOneExtra ? "+1" : "") +
      (this.mode === "normal" ? "" : `(${this.mode})`)
    );
  }

  public lock(): void {
    this.locker.lock();
  }

  public setInliningForbidden(newInliningForbidden = true): this {
    this.isInliningForbidden = newInliningForbidden;
    return this;
  }

  public inliningForbidden(): boolean {
    return this.isInliningForbidden;
  }

  public setTrusted(newIsTrusted = true): this {
    if (this.locker.locked) {
      throw new Error(`${this}: cannot toggle trusted once plan is locked`);
    }
    this.isTrusted = newIsTrusted;
    return this;
  }

  public trusted(): boolean {
    return this.isTrusted;
  }

  public setFirst(first: InputStep): this {
    this.locker.assertParameterUnlocked("first");
    // PERF: don't eval
    this.first = first.eval() ?? null;
    this.locker.lockParameter("first");
    return this;
  }

  public setLast(last: InputStep): this {
    this.assertCursorPaginationAllowed();
    this.locker.assertParameterUnlocked("orderBy");
    this.locker.assertParameterUnlocked("last");
    this.last = last.eval() ?? null;
    this.locker.lockParameter("last");
    return this;
  }

  public setOffset(offset: InputStep): this {
    this.locker.assertParameterUnlocked("offset");
    this.offset = offset.eval() ?? null;
    if (this.offset !== null) {
      this.locker.lockParameter("last");
      if (this.last != null) {
        throw new SafeError("Cannot use 'offset' with 'last'");
      }
    }
    this.locker.lockParameter("offset");
    return this;
  }

  /**
   * Set this true ONLY if there can be at most one match for each of the
   * identifiers. If you set this true when this is not the case then you may
   * get unexpected results during inlining; if in doubt leave it at the
   * default.
   */
  public setUnique(newUnique = true): this {
    if (this.locker.locked) {
      throw new Error(`${this}: cannot toggle unique once plan is locked`);
    }
    this.isUnique = newUnique;
    return this;
  }

  /**
   * Someone (probably pageInfo) wants to know if there's more records. To
   * determine this we fetch one extra record and then throw it away.
   */
  public hasMore(): ExecutableStep<boolean> {
    this.fetchOneExtra = true;
    return access(this, "hasMore", false);
  }

  public unique(): boolean {
    return this.isUnique;
  }

  public placeholder($step: PgTypedExecutableStep<PgCodec>): SQL;
  public placeholder($step: ExecutableStep, codec: PgCodec): SQL;
  public placeholder(
    $step: ExecutableStep | PgTypedExecutableStep<PgCodec>,
    overrideCodec?: PgCodec,
  ): SQL {
    if (this.locker.locked) {
      throw new Error(`${this}: cannot add placeholders once plan is locked`);
    }
    if (this.placeholders.length >= 100000) {
      throw new Error(
        `There's already ${this.placeholders.length} placeholders; wanting more suggests there's a bug somewhere`,
      );
    }

    const codec = overrideCodec ?? ("pgCodec" in $step ? $step.pgCodec : null);
    if (!codec) {
      console.trace(`${this}.placeholder(${$step}) call, no codec`);
      throw new Error(
        `Step ${$step} does not contain pgCodec information, please pass the codec explicitly to the 'placeholder' method.`,
      );
    }

    const $evalledStep = deepEval($step);

    const dependencyIndex = this.addDependency($evalledStep);
    const symbol = Symbol(`step-${$step.id}`);
    const sqlPlaceholder = sql.placeholder(symbol, UNHANDLED_PLACEHOLDER);
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
  public singleRelation<
    TRelationName extends keyof GetPgResourceRelations<TResource> & string,
  >(relationIdentifier: TRelationName): SQL {
    const relation = this.resource.getRelation(
      relationIdentifier,
    ) as PgCodecRelation;
    if (!relation) {
      throw new Error(
        `${this.resource} does not have a relation named '${String(
          relationIdentifier,
        )}'`,
      );
    }
    if (!relation.isUnique) {
      throw new Error(
        `${this.resource} relation '${String(
          relationIdentifier,
        )}' is not unique so cannot be used with singleRelation`,
      );
    }
    const { remoteResource, localAttributes, remoteAttributes } = relation;

    // Join to this relation if we haven't already
    const cachedAlias = this.relationJoins.get(relationIdentifier);
    if (cachedAlias) {
      return cachedAlias;
    }
    const alias = sql.identifier(Symbol(relationIdentifier as string));
    if (typeof remoteResource.from === "function") {
      throw new Error(
        "Callback sources not currently supported via singleRelation",
      );
    }
    this.joins.push({
      type: "left",
      from: remoteResource.from,
      alias,
      conditions: localAttributes.map(
        (col, i) =>
          sql`${this.alias}.${sql.identifier(
            col as string,
          )} = ${alias}.${sql.identifier(remoteAttributes[i] as string)}`,
      ),
    });
    this.relationJoins.set(relationIdentifier, alias);
    return alias;
  }

  /**
   * @experimental Please use `singleRelation` or `manyRelation` instead.
   *
   * @internal
   */
  public join(spec: PgSelectPlanJoin) {
    this.joins.push(spec);
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   *
   * @internal
   */
  public selectAndReturnIndex(fragment: SQL): number {
    if (!this.isArgumentsFinalized) {
      throw new Error("Select added before arguments were finalized");
    }
    // NOTE: it's okay to add selections after the plan is "locked" - lock only
    // applies to which rows are being selected, not what is being queried
    // about the rows.

    // Optimisation: if we're already selecting this fragment, return the existing one.
    const options = {
      symbolSubstitutes: this._symbolSubstitutes,
    };
    // PERF: performance of this sucks at planning time
    const index = this.selects.findIndex((frag) =>
      sql.isEquivalent(frag, fragment, options),
    );
    if (index >= 0) {
      return index;
    }

    return this.selects.push(fragment) - 1;
  }

  private nullCheckIndex: number | null | undefined = undefined;
  /** @internal */
  public getNullCheckIndex(): number | null {
    // PERF: if this isn't coming from a function _and_ it's not being inlined
    // via a left-join or similar then we shouldn't need this and should be
    // able to drop it.
    if (this.nullCheckIndex !== undefined) {
      return this.nullCheckIndex;
    }
    const nullCheckExpression = this.resource.getNullCheckExpression(
      this.alias,
    );
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
   *
   * @internal
   */
  clone(mode?: PgSelectMode): PgSelectStep<TResource> {
    return new PgSelectStep(this, mode);
  }

  /** @internal */
  connectionClone(
    $connection: ConnectionStep<any, any, any, any>,
    mode?: PgSelectMode,
  ): PgSelectStep<TResource> {
    const $plan = this.clone(mode);
    // In case any errors are raised
    $plan.connectionDepId = $plan.addDependency($connection);
    return $plan;
  }

  where(
    condition: PgWhereConditionSpec<
      keyof GetPgResourceAttributes<TResource> & string
    >,
  ): void {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('where')`,
      );
    }
    if (sql.isSQL(condition)) {
      this.conditions.push(condition);
    } else {
      switch (condition.type) {
        case "attribute": {
          this.conditions.push(
            condition.callback(
              sql`${this.alias}.${sql.identifier(condition.attribute)}`,
            ),
          );
          break;
        }
        default: {
          const never: never = condition.type;
          console.error("Unsupported condition: ", never);
          throw new Error(`Unsupported condition`);
        }
      }
    }
  }

  wherePlan(): PgConditionStep<this> {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('wherePlan')`,
      );
    }
    return new PgConditionStep(this);
  }

  groupBy(group: PgGroupSpec): void {
    this.locker.assertParameterUnlocked("groupBy");
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add groupBy to a non-aggregate query`);
    }
    this.groups.push(group);
  }

  getGroups(): readonly PgGroupSpec[] {
    this.locker.lockParameter("groupBy");
    return this.groups;
  }

  havingPlan(): PgConditionStep<this> {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add having conditions once plan is locked ('havingPlan')`,
      );
    }
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add having to a non-aggregate query`);
    }
    return new PgConditionStep(this, true);
  }

  having(
    condition: PgHavingConditionSpec<
      keyof GetPgResourceAttributes<TResource> & string
    >,
  ): void {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add having conditions once plan is locked ('having')`,
      );
    }
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add having to a non-aggregate query`);
    }
    if (sql.isSQL(condition)) {
      this.havingConditions.push(condition);
    } else {
      const never: never = condition;
      console.error("Unsupported condition: ", never);
      throw new Error(`Unsupported condition`);
    }
  }

  orderBy(order: PgOrderSpec): void {
    this.locker.assertParameterUnlocked("orderBy");
    this.orders.push(order);
  }

  orderIsUnique(): boolean {
    return this.isOrderUnique;
  }

  setOrderIsUnique(): void {
    if (this.locker.locked) {
      throw new Error(`${this}: cannot set order unique once plan is locked`);
    }
    this.isOrderUnique = true;
  }

  private assertCursorPaginationAllowed(): void {
    if (this.mode === "aggregate") {
      throw new SafeError(
        "Cannot use cursor pagination on an aggregate PgSelectStep",
      );
    }
  }

  private applyConditionFromCursor(
    beforeOrAfter: "before" | "after",
    $parsedCursorPlan: LambdaStep<any, any[] | null>,
  ): void {
    const digest = this.getOrderByDigest();
    const orders = this.getOrderBy();
    const orderCount = orders.length;

    // Cursor validity check; if we get inlined then this will be passed up
    // to the parent so we can trust it.
    if (this.connectionDepId === null) {
      const $validate = pgValidateParsedCursor(
        $parsedCursorPlan,
        digest,
        orderCount,
        beforeOrAfter,
      );
      this.addDependency($validate);
    } else {
      // To make the error be thrown in the right place, we should also add this error to our parent connection
      const $connection = this.getDep(this.connectionDepId) as ConnectionStep<
        any,
        any,
        any
      >;
      $connection.addValidation(() => {
        return pgValidateParsedCursor(
          $parsedCursorPlan,
          digest,
          orderCount,
          beforeOrAfter,
        );
      });
    }

    if (orderCount === 0) {
      // Natural pagination `['natural', N]`
      const $n = access($parsedCursorPlan, [1]);
      if (beforeOrAfter === "before") {
        this.upperIndexStepId = this.addDependency($n);
      } else {
        this.lowerIndexStepId = this.addDependency($n);
      }
      return;
    }
    if (!this.isOrderUnique) {
      // ENHANCEMENT: make this smarter
      throw new SafeError(
        `Can only use '${beforeOrAfter}' cursor when there is a unique defined order.`,
      );
    }

    const condition = (i = 0): SQL => {
      const order = orders[i];
      const [orderFragment, orderCodec, nullable] =
        getFragmentAndCodecFromOrder(this.alias, order, this.resource.codec);
      const { nulls, direction } = order;
      const sqlValue = this.placeholder(
        toPg(access($parsedCursorPlan, [i + 1]), orderCodec),
        orderCodec,
      );

      // For the truth-table of this code, have a look at this spreadsheet:
      // https://docs.google.com/spreadsheets/d/1m5H-4IRAjhx_Z8v7nd2wMTbmx1dOBof9IroW3WUYE7s/edit?usp=sharing

      const gt =
        (direction === "ASC" && beforeOrAfter === "after") ||
        (direction === "DESC" && beforeOrAfter === "before");

      const nullsFirst =
        nulls === "FIRST"
          ? true
          : nulls === "LAST"
          ? false
          : // NOTE: PostgreSQL states that by default DESC = NULLS FIRST,
            // ASC = NULLS LAST
            direction === "DESC";

      // Simple less than or greater than
      let fragment = sql`${orderFragment} ${gt ? sql`>` : sql`<`} ${sqlValue}`;

      // Nullable, so now handle if one is null but the other isn't
      if (nullable) {
        const useAIsNullAndBIsNotNull =
          (nullsFirst && beforeOrAfter === "after") ||
          (!nullsFirst && beforeOrAfter === "before");
        const oneIsNull = useAIsNullAndBIsNotNull
          ? sql`${orderFragment} is null and ${sqlValue} is not null`
          : sql`${orderFragment} is not null and ${sqlValue} is null`;
        fragment = sql`((${fragment}) or (${oneIsNull}))`;
      }

      // Finally handle if they're equal - recurse
      if (i < orderCount - 1) {
        const equals = nullable ? sql`is not distinct from` : sql`=`;
        const aEqualsB = sql`${orderFragment} ${equals} ${sqlValue}`;
        fragment = sql`(${fragment})
or (
${sql.indent`${aEqualsB}
and ${sql.indent(sql.parens(condition(i + 1)))}`}
)`;
      }

      return fragment;
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

    this.where(finalCondition);
  }

  /** @internal */
  parseCursor(
    $cursorPlan: __InputStaticLeafStep<string>,
  ): PgSelectParsedCursorStep | null {
    this.assertCursorPaginationAllowed();
    if ($cursorPlan.evalIs(null)) {
      return null;
    } else if ($cursorPlan.evalIs(undefined)) {
      return null;
    }

    const $parsedCursorPlan = lambda($cursorPlan, parseCursor);
    return $parsedCursorPlan;
  }

  setAfter($parsedCursorPlan: PgSelectParsedCursorStep): void {
    this.afterStepId = this.addDependency($parsedCursorPlan);
  }

  setBefore($parsedCursorPlan: PgSelectParsedCursorStep): void {
    this.beforeStepId = this.addDependency($parsedCursorPlan);
  }

  /** @internal */
  public pageInfo(
    $connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, this, any>,
  ): PgPageInfoStep<this> {
    this.assertCursorPaginationAllowed();
    this.lock();
    return pgPageInfo($connectionPlan);
  }

  isNullFetch() {
    return (
      (this.first === 0 || this.last === 0) && this.fetchOneExtra === false
    );
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
    count: number,
    values: Array<GrafastValuesList<any>>,
    { eventEmitter }: ExecutionExtra,
  ): Promise<GrafastResultsList<ReadonlyArray<unknown[]>>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot execute PgSelectStep before finalizing it.");
    }
    if (this.isNullFetch()) {
      return arrayOfLength(count, Object.freeze([]));
    }
    const {
      text,
      textForSingle,
      rawSqlValues,
      identifierIndex,
      shouldReverseOrder,
      name,
      nameForSingle,
    } = this.finalizeResults;

    const executionResult = await this.resource.executeWithCache(
      values[this.contextId].map((context, i) => {
        return {
          // The context is how we'd handle different connections with different claims
          context,
          queryValues:
            identifierIndex != null
              ? this.queryValues.map(({ dependencyIndex, codec }) => {
                  const val = values[dependencyIndex][i];
                  return val == null ? null : codec.toPg(val);
                })
              : EMPTY_ARRAY,
        };
      }),
      {
        text,
        textForSingle,
        rawSqlValues,
        identifierIndex,
        name,
        nameForSingle,
        eventEmitter,
        useTransaction: this.mode === "mutation",
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
      const trimFromStart =
        !shouldReverseOrder && this.last != null && this.first == null;
      const limitedRows = hasMore
        ? trimFromStart
          ? allVals.slice(Math.max(0, allVals.length - limit!))
          : allVals.slice(0, limit!)
        : allVals;
      const slicedRows =
        firstAndLast && this.last != null
          ? limitedRows.slice(-this.last)
          : limitedRows;
      const orderedRows = shouldReverseOrder
        ? reverseArray(slicedRows)
        : slicedRows;
      if (hasMore) {
        (orderedRows as any).hasMore = true;
      }
      return orderedRows;
    });
  }

  /**
   * Like `execute`, but stream the results via async iterables.
   */
  async stream(
    _count: number,
    values: ReadonlyArray<GrafastValuesList<any>>,
    { eventEmitter }: ExecutionExtra,
  ): Promise<GrafastResultStreamList<unknown[]>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot stream PgSelectStep before finalizing it.");
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
          await this.resource.executeWithoutCache(
            values[this.contextId].map((context, i) => {
              return {
                // The context is how we'd handle different connections with different claims
                context,
                queryValues:
                  identifierIndex != null
                    ? this.queryValues.map(({ dependencyIndex, codec }) => {
                        const val = values[dependencyIndex][i];
                        return val == null ? null : codec.toPg(val);
                      })
                    : EMPTY_ARRAY,
              };
            }),
            {
              text,
              rawSqlValues,
              identifierIndex,
              eventEmitter,
            },
          )
        ).values
      : null;

    const streams = (
      await this.resource.executeStream(
        values[this.contextId].map((context, i) => {
          return {
            // The context is how we'd handle different connections with different claims
            context,
            queryValues:
              identifierIndex != null
                ? this.queryValues.map(({ dependencyIndex, codec }) => {
                    const val = values[dependencyIndex][i];
                    return val == null ? val : codec.toPg(val);
                  })
                : EMPTY_ARRAY,
          };
        }),
        {
          text: textForDeclare,
          rawSqlValues: rawSqlValuesForDeclare,
          identifierIndex,
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

        const innerIterator = stream[Symbol.asyncIterator]();

        let i = 0;
        let done = false;
        const l = initialFetchResult[idx].length;
        const mergedGenerator: AsyncGenerator<PromiseOrDirect<unknown[]>> = {
          next() {
            if (done) {
              return Promise.resolve({ value: undefined, done });
            } else if (i < l) {
              return Promise.resolve({
                value: initialFetchResult[idx][i++],
                done,
              });
            } else if (streamInitialCount != null && l < streamInitialCount) {
              done = true;
              innerIterator.return?.();
              return Promise.resolve({ value: undefined, done });
            } else {
              return innerIterator.next();
            }
          },
          return(value) {
            done = true;
            return (
              innerIterator.return?.(value) ??
              Promise.resolve({ value: undefined, done })
            );
          },
          throw(e) {
            done = true;
            return (
              innerIterator.throw?.(e) ??
              Promise.resolve({ value: undefined, done })
            );
          },
          [Symbol.asyncIterator]() {
            return this;
          },
        };
        return mergedGenerator;
      });
    } else {
      return streams;
    }
  }

  private buildSelect(
    options: {
      extraSelects?: readonly SQL[];
    } = Object.create(null),
  ) {
    const { extraSelects = EMPTY_ARRAY } = options;
    const selects = [...this.selects, ...extraSelects];
    const l = this.selects.length;
    const extraSelectIndexes = extraSelects.map((_, i) => i + l);

    const fragmentsWithAliases = selects.map(
      (frag, idx) => sql`${frag} as ${sql.identifier(String(idx))}`,
    );

    const sqlAliases: SQL[] = [];
    for (const [a, b] of this._symbolSubstitutes.entries()) {
      sqlAliases.push(sql.symbolAlias(a, b));
    }
    const aliases = sql.join(sqlAliases, "");

    const selection =
      fragmentsWithAliases.length > 0
        ? sql`\n${sql.indent(sql.join(fragmentsWithAliases, ",\n"))}`
        : sql` /* NOTHING?! */`;

    return { sql: sql`${aliases}select${selection}`, extraSelectIndexes };
  }

  private fromExpression(): SQL {
    const from =
      typeof this.from === "function"
        ? this.from(...this.arguments)
        : this.from;
    return from;
  }

  private buildFrom() {
    return {
      sql: sql`\nfrom ${this.fromExpression()} as ${this.alias}${
        this.resource.codec.attributes ? sql.blank : sql`(v)`
      }`,
    };
  }

  private buildJoin() {
    const joins: SQL[] = this.joins.map((j) => {
      const conditions: SQL =
        j.type === "cross"
          ? sql.blank
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

      return sql`${join}${j.lateral ? sql` lateral` : sql.blank} ${j.from} as ${
        j.alias
      }${j.attributeNames ?? sql.blank}${joinCondition}`;
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
    this.locker.lockParameter("orderBy");
    if (this.orders.length === 0) {
      return "natural";
    }
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = createHash("sha256");
    hash.update(
      JSON.stringify(
        this.orders.map((o) => {
          const [frag] = getFragmentAndCodecFromOrder(
            this.alias,
            o,
            this.resource.codec,
          );
          return sql.compile(frag, {
            placeholderValues: this.placeholderValues,
          }).text;
        }),
      ),
    );
    const digest = hash.digest("hex").slice(0, 10);
    return digest;
  }

  public getOrderBy(): ReadonlyArray<PgOrderSpec> {
    this.locker.lockParameter("orderBy");
    return this.orders;
  }

  /**
   * If `last` is in use then we reverse the order from the database and then
   * re-reverse it in JS-land.
   */
  private shouldReverseOrder() {
    return (
      this.first == null &&
      this.last != null &&
      this.lowerIndexStepId == null &&
      this.upperIndexStepId == null
    );
  }

  private buildGroupBy() {
    this.locker.lockParameter("groupBy");
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
    this.locker.lockParameter("orderBy");
    const orders = reverse
      ? this.orders.map(
          (o) =>
            ({
              ...o,
              direction: o.direction === "ASC" ? "DESC" : "ASC",
            } as PgOrderSpec),
        )
      : this.orders;
    return {
      sql:
        orders.length > 0
          ? sql`\norder by ${sql.join(
              orders.map((o) => {
                const [frag] = getFragmentAndCodecFromOrder(
                  this.alias,
                  o,
                  this.resource.codec,
                );
                return sql`${frag} ${
                  o.direction === "ASC" ? sql`asc` : sql`desc`
                }${
                  o.nulls === "LAST"
                    ? sql` nulls last`
                    : o.nulls === "FIRST"
                    ? sql` nulls first`
                    : sql.blank
                }`;
              }),
              ", ",
            )}`
          : sql.blank,
    };
  }

  private limitAndOffsetSQL: SQL | null = null;
  private planLimitAndOffset() {
    if (this.lowerIndexStepId != null || this.upperIndexStepId != null) {
      /*
       * When using cursor-base pagination with 'natural' cursors, we are actually
       * applying limit/offset under the hood (presumably because we're paginating
       * something that has no explicit order, like a function).
       *
       * If you have:
       * - first: 3
       * - after: ['natural', 4]
       *
       * Then we want `limit 3 offset 4`.
       * With `fetchOneExtra` it'd be `limit 4 offset 4`.
       *
       * For:
       * - last: 2
       * - before: ['natural', 6]
       *
       * We want `limit 2 offset 4`
       * With `fetchOneExtra` it'd be `limit 3 offset 3`.
       *
       * For:
       * - last: 2
       * - before: ['natural', 3]
       *
       * We want `limit 2`
       * With `fetchOneExtra` it'd still be `limit 2`.
       *
       * For:
       * - last: 2
       * - before: ['natural', 4]
       *
       * We want `limit 2 offset 1`
       * With `fetchOneExtra` it'd be `limit 3`.
       *
       * Using `offset` with `after`/`before` is forbidden, so we do not need to consider that.
       *
       * For:
       * - after: ['natural', 2]
       * - before: ['natural', 6]
       *
       * We want `limit 4 offset 2`
       * With `fetchOneExtra` it'd be `limit 4 offset 2` still.
       *
       * For:
       * - first: 2
       * - after: ['natural', 2]
       * - before: ['natural', 6]
       *
       * We want `limit 2 offset 2`
       * With `fetchOneExtra` it'd be `limit 3 offset 2` still.
       */

      const $lower =
        this.lowerIndexStepId != null
          ? (this.getDep(this.lowerIndexStepId) as ExecutableStep<
              number | null | undefined
            >)
          : constant(null);
      const $upper =
        this.upperIndexStepId != null
          ? (this.getDep(this.upperIndexStepId) as ExecutableStep<
              number | null | undefined
            >)
          : constant(null);

      const limitAndOffsetLambda = lambda(
        list([$lower, $upper]),
        ([cursorLower, cursorUpper]) => {
          /** lower bound - exclusive (1-indexed) */
          let lower = 0;
          /** upper bound - exclusive (1-indexed) */
          let upper = Infinity;

          // Apply 'after', if present
          if (cursorLower != null) {
            lower = Math.max(0, cursorLower);
          }

          // Apply 'before', if present
          if (cursorUpper != null) {
            upper = cursorUpper;
          }

          // Cannot go beyond these bounds
          const maxUpper = upper;

          // Apply 'first', if present
          if (this.first != null) {
            upper = Math.min(upper, lower + this.first + 1);
          }

          // Apply 'last', if present
          if (this.last != null) {
            lower = Math.max(0, lower, upper - this.last - 1);
          }

          // Apply 'offset', if present
          if (this.offset != null && this.offset > 0) {
            lower = Math.min(lower + this.offset, maxUpper);
            upper = Math.min(upper + this.offset, maxUpper);
          }

          // If 'fetch one extra', adjust:
          if (this.fetchOneExtra) {
            if (this.first != null) {
              upper = upper + 1;
            } else if (this.last != null) {
              lower = Math.max(0, lower - 1);
            }
          }

          /** lower, but 0-indexed and inclusive */
          const lower0 = lower - 1 + 1;
          /** upper, but 0-indexed and inclusive */
          const upper0 = upper - 1 - 1;

          // Calculate the final limit/offset
          const limit = isFinite(upper0)
            ? Math.max(0, upper0 - lower0 + 1)
            : null;
          const offset = lower0;

          return [limit, offset];
        },
        true,
      );
      this.limitAndOffsetId = this.addDependency(limitAndOffsetLambda);
      const limitLambda = access(limitAndOffsetLambda, [0]);
      const offsetLambda = access(limitAndOffsetLambda, [1]);
      return sql`\nlimit ${this.placeholder(
        limitLambda,
        TYPES.int,
      )}\noffset ${this.placeholder(offsetLambda, TYPES.int)}`;
    } else {
      const limit =
        this.first != null
          ? sql`\nlimit ${sql.literal(
              this.first + (this.fetchOneExtra ? 1 : 0),
            )}`
          : this.last != null
          ? sql`\nlimit ${sql.literal(
              this.last + (this.fetchOneExtra ? 1 : 0),
            )}`
          : sql.blank;
      const offset =
        this.offset != null
          ? sql`\noffset ${sql.literal(this.offset)}`
          : sql.blank;
      return sql`${limit}${offset}`;
    }
  }

  private buildLimitAndOffset() {
    // NOTE: according to the EdgesToReturn algorithm in the GraphQL Cursor
    // Connections Specification first is applied first, then last is applied.
    // For us this means that if first is present we set the limit to this and
    // then we do the last artificially later.
    // https://relay.dev/graphql/connections.htm#EdgesToReturn()

    if (!this.limitAndOffsetSQL) {
      throw new Error(
        "limitAndOffsetSQL was not built - did we not get optimized?",
      );
    }
    return {
      sql: this.limitAndOffsetSQL,
    };
  }

  private buildQuery(
    options: {
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
      this.resource.applyAuthorizationChecksToPlan(this);
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
    const { sql: limitAndOffset } = this.buildLimitAndOffset();

    const baseQuery = sql`${select}${from}${join}${where}${groupBy}${having}${orderBy}${limitAndOffset}`;
    const query = options.asJsonAgg
      ? // 's' for 'subquery'
        sql`select json_agg(s) from (${sql.indent(baseQuery)}) s`
      : baseQuery;

    return { sql: query, extraSelectIndexes };
  }

  public finalize(): void {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locker.locked = false;

    if (!this.isFinalized) {
      const identifiersSymbol = Symbol(this.name + "_identifiers");
      const identifiersAlias = sql.identifier(identifiersSymbol);

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
          sql`${identifiersAlias}.${sql.identifier(`id${idx}`)}`,
        );
      });

      const makeQuery = ({
        limit,
        offset,
        options,
      }: {
        limit?: number;
        offset?: number;
        options?: Parameters<typeof sql.compile>[1];
      } = {}): {
        text: string;
        rawSqlValues: SQLRawValue[];
        textForSingle?: string;
        identifierIndex: number | null;
      } => {
        const forceOrder = this.streamOptions && this.shouldReverseOrder();
        if (this.queryValues.length || this.placeholders.length) {
          const extraSelects: SQL[] = [];
          const extraWheres: SQL[] = [];

          const identifierIndexOffset =
            extraSelects.push(sql`${identifiersAlias}.idx`) - 1;
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
                sql`${frag} = ${identifiersAlias}.${sql.identifier(
                  `id${idx}`,
                )}`,
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

          // PERF: if the query does not have a limit/offset; should we use an
          // `inner join` in a flattened query instead of a wrapped query with
          // `lateral`?

          const wrapperSymbol = Symbol(this.name + "_result");
          const wrapperAlias = sql.identifier(wrapperSymbol);

          const {
            text: lateralText,
            values: rawSqlValues,
            [$$symbolToIdentifier]: symbolToIdentifier,
          } = sql.compile(
            sql`lateral (${sql.indent(wrappedInnerQuery)}) as ${wrapperAlias}`,
            options,
          );

          const identifiersAliasText =
            symbolToIdentifier.get(identifiersSymbol);
          const wrapperAliasText = symbolToIdentifier.get(wrapperSymbol);

          let lastPlaceholder = rawSqlValues.length;

          /*
           * IMPORTANT: these wrapper queries are necessary so that queries
           * that have a limit/offset get the limit/offset applied _per
           * identifier group_; that's why this cannot just be another "from"
           * clause.
           */
          const text = `\
select ${wrapperAliasText}.*
from (select ids.ordinality - 1 as idx, ${this.queryValues
            .map(({ codec }, idx) => {
              return `(ids.value->>${idx})::${
                sql.compile(codec.sqlType).text
              } as "id${idx}"`;
            })
            .join(
              ", ",
            )} from json_array_elements($${++lastPlaceholder}::json) with ordinality as ids) as ${identifiersAliasText},
${lateralText};`;

          lastPlaceholder = rawSqlValues.length;
          /**
           * This is an optimized query to use when there's only one value to
           * feed in, PostgreSQL seems to be able to execute queries using this
           * _significantly_ faster (up to 3x or 200ms faster).
           */
          const textForSingle = `\
select ${wrapperAliasText}.*
from (select 0 as idx, ${this.queryValues
            .map(({ codec }, idx) => {
              return `$${++lastPlaceholder}::${
                sql.compile(codec.sqlType).text
              } as "id${idx}"`;
            })
            .join(", ")}) as ${identifiersAliasText},
${lateralText};`;

          return { text, textForSingle, rawSqlValues, identifierIndex };
        } else if (
          (limit != null && limit >= 0) ||
          (offset != null && offset > 0)
        ) {
          // ENHANCEMENT: make this nicer; combine with the `if` branch above?

          const extraSelects: SQL[] = [];
          const rowNumberIndexOffset =
            forceOrder || limit != null || offset != null
              ? extraSelects.push(
                  sql`row_number() over (${sql.indent(
                    this.buildOrderBy({ reverse: false }).sql,
                  )})`,
                ) - 1
              : -1;

          const { sql: baseQuery, extraSelectIndexes } = this.buildQuery({
            extraSelects,
          });
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
                };`
              : sql`${baseQuery};`;
          const { text, values: rawSqlValues } = sql.compile(
            wrappedInnerQuery,
            options,
          );
          return { text, rawSqlValues, identifierIndex: null };
        } else {
          const { sql: query } = this.buildQuery();
          const { text, values: rawSqlValues } = sql.compile(
            sql`${query};`,
            options,
          );
          return { text, rawSqlValues, identifierIndex: null };
        }
      };

      if (this.streamOptions) {
        // PERF: should use the queryForSingle optimization in here too

        // When streaming we can't reverse order in JS - we must do it in the DB.
        if (this.streamOptions.initialCount > 0) {
          /*
           * Here our stream is constructed of two parts - an
           * `initialFetchQuery` to satisfy the `initialCount` and then a
           * `streamQuery` to build the PostgreSQL cursor for fetching the
           * remaining results across all groups.
           */
          const {
            text,
            rawSqlValues,
            identifierIndex: initialFetchIdentifierIndex,
          } = makeQuery({
            limit: this.streamOptions.initialCount,
            options: { placeholderValues: this.placeholderValues },
          });
          const {
            text: textForDeclare,
            rawSqlValues: rawSqlValuesForDeclare,
            identifierIndex: streamIdentifierIndex,
          } = makeQuery({
            offset: this.streamOptions.initialCount,
            options: { placeholderValues: this.placeholderValues },
          });
          if (initialFetchIdentifierIndex !== streamIdentifierIndex) {
            throw new Error(
              `GrafastInternalError<3760b02e-dfd0-4924-bf62-2e0ef9399605>: expected identifier indexes to match`,
            );
          }
          const identifierIndex = initialFetchIdentifierIndex;
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
          const {
            text: textForDeclare,
            rawSqlValues: rawSqlValuesForDeclare,
            identifierIndex: streamIdentifierIndex,
          } = makeQuery({
            offset: 0,
            options: {
              placeholderValues: this.placeholderValues,
            },
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
        const { text, rawSqlValues, textForSingle, identifierIndex } =
          makeQuery({
            options: {
              placeholderValues: this.placeholderValues,
            },
          });
        this.finalizeResults = {
          text,
          textForSingle,
          rawSqlValues,
          identifierIndex,
          shouldReverseOrder: this.shouldReverseOrder(),
          name: hash(text),
          nameForSingle: textForSingle ? hash(textForSingle) : undefined,
        };
      }
    }

    this.locker.locked = true;

    super.finalize();
  }

  deduplicate(peers: PgSelectStep<any>[]): PgSelectStep<TResource>[] {
    this.locker.lockAllParameters();
    return peers.filter(($p): $p is PgSelectStep<TResource> => {
      if ($p === this) {
        return true;
      }
      const p = $p as PgSelectStep<PgResource>;
      // If SELECT, FROM, JOIN, WHERE, ORDER, GROUP BY, HAVING, LIMIT, OFFSET
      // all match with one of our peers then we can replace ourself with one
      // of our peers. NOTE: we do _not_ merge SELECTs at this stage because
      // that would require mapping, and mapping should not be done during
      // deduplicate because it would interfere with optimize. So, instead,
      // we try to ensure that as few selects as possible exist in the plan
      // at this stage.

      // Check FROM matches
      if (p.resource !== this.resource) {
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
      const options = { symbolSubstitutes };
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

      const sqlIsEquivalent = (a: SQL, b: SQL) =>
        sql.isEquivalent(a, b, options);

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
        !arraysMatch(this.orders, p.orders, (a, b) => {
          if (a.direction !== b.direction) return false;
          if (a.nulls !== b.nulls) return false;
          if (a.attribute != null) {
            if (b.attribute !== a.attribute) return false;
            // ENHANCEMENT: really should compare if the result is equivalent?
            return a.callback === b.callback;
          } else {
            if (b.attribute != null) return false;
            return sqlIsEquivalent(a.fragment, b.fragment);
          }
        })
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
  }

  /** @internal */
  public deduplicatedWith(replacement: PgSelectStep<TResource>): void {
    if (
      typeof this.symbol === "symbol" &&
      typeof replacement.symbol === "symbol"
    ) {
      if (this.symbol !== replacement.symbol) {
        replacement._symbolSubstitutes.set(this.symbol, replacement.symbol);
      } else {
        // Fine :)
      }
    }

    if (this.fetchOneExtra) {
      replacement.fetchOneExtra = true;
    }
  }

  private mergeSelectsWith<TOtherStep extends PgSelectStep<PgResource>>(
    otherPlan: TOtherStep,
  ): {
    [desiredIndex: string]: string;
  } {
    if (otherPlan.mode !== this.mode) {
      throw new Error(
        "GrafastInternalError<d12a3d95-4f7b-41d9-8cb4-a97bd169d128>: attempted to merge selects with a PgSelectStep in a different mode",
      );
    }
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

  private mergePlaceholdersInto<TOtherStep extends PgSelectStep<PgResource>>(
    otherPlan: TOtherStep,
  ): void {
    for (const placeholder of this.placeholders) {
      const { dependencyIndex, symbol, codec } = placeholder;
      const dep = this.getDep(dependencyIndex);
      /*
       * We have dependency `dep`. We're attempting to merge ourself into
       * `otherPlan`. We have two situations we need to handle:
       *
       * 1. `dep` is not dependent on `otherPlan`, in which case we can add
       *    `dep` as a dependency to `otherPlan` without creating a cycle, or
       * 2. `dep` is dependent on `otherPlan` (for example, it might be the
       *    result of selecting an expression in the `otherPlan`), in which
       *    case we should turn it into an SQL expression and inline that.
       */

      // PERF: we know dep can't depend on otherPlan if
      // `isStaticInputStep(dep)` or `dep`'s layerPlan is an ancestor of
      // `otherPlan`'s layerPlan.
      if (stepAMayDependOnStepB(otherPlan, dep)) {
        // Either dep is a static input plan (which isn't dependent on anything
        // else) or otherPlan is deeper than dep; either way we can use the dep
        // directly within otherPlan.
        const newPlanIndex = otherPlan.addDependency(dep);
        otherPlan.placeholders.push({
          dependencyIndex: newPlanIndex,
          codec,
          symbol,
        });
      } else if (dep instanceof PgClassExpressionStep) {
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

  optimize({ stream }: StepOptimizeOptions): ExecutableStep {
    // TODO: should this be in 'beforeLock'?
    this.limitAndOffsetSQL = this.planLimitAndOffset();

    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locker.locked = false;
    this.streamOptions = stream;

    // PERF: we should serialize our `SELECT` clauses and then if any are
    // identical we should omit the later copies and have them link back to the
    // earliest version (resolve this in `execute` via mapping).

    if (
      !this.isInliningForbidden &&
      !this.hasSideEffects &&
      !stream &&
      !this.isNullFetch()
    ) {
      // Inline ourself into our parent if we can.
      let t: PgSelectStep<PgResource> | null | undefined = undefined;
      let p: ExecutableStep | undefined = undefined;
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
        const dep = this.getDep(dependencyIndex);
        if (dep instanceof __TrackedValueStep) {
          // This has come from a variable, context or rootValue, therefore
          // it's shared and thus safe.
        } else if (isStaticInputStep(dep)) {
          // This has come from a hard-coded input in the document, therefore
          // it's shared and thus safe.
        } else if (dep instanceof ConnectionStep) {
          // We only have this to detect errors, it's an empty object. Safe.
        } else if (dep instanceof PgClassExpressionStep) {
          const p2 = dep.getDep(dep.rowDependencyId);
          const t2Parent = dep.getParentStep();
          if (!(t2Parent instanceof PgSelectSingleStep)) {
            continue;
          }
          const t2 = t2Parent.getClassStep();
          if (t2 === this) {
            throw new Error(
              `Recursion error - record plan ${dep} is dependent on ${t2}, and ${this} is dependent on ${dep}`,
            );
          }

          if (t2.hasSideEffects) {
            // It's a mutation; don't merge
            continue;
          }

          // Don't allow merging across a stream/defer/subscription boundary
          if (!stepsAreInSamePhase(t2, this)) {
            continue;
          }

          /*
          if (!planGroupsOverlap(this, t2)) {
            // We're not in the same group (i.e. there's probably a @defer or
            // @stream between us) - do not merge.
            continue;
          }
          */

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
        const myContext = this.getDep(this.contextId);
        const tsContext = t.getDep(t.contextId);
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

        if ((table as PgSelectStep<any>) === this) {
          throw new Error(
            `Something's gone catastrophically wrong - ${this} is trying to merge with itself!`,
          );
        }

        const tableWasLocked = table.locker.locked;
        table.locker.locked = false;

        if (
          this.isUnique &&
          this.first == null &&
          this.last == null &&
          this.offset == null &&
          this.mode !== "aggregate" &&
          table.mode !== "aggregate" &&
          // For uniques these should all pass anyway, but pays to be cautious..
          this.groups.length === 0 &&
          this.havingConditions.length === 0 &&
          this.orders.length === 0 &&
          !this.fetchOneExtra
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
                const step = this.getDep(dependencyIndex);
                if (step instanceof PgClassExpressionStep) {
                  return sql`${step.toSQL()}::${
                    codec.sqlType
                  } = ${identifierMatch}`;
                } else if (isStaticInputStep(step)) {
                  return sql`${this.placeholder(
                    step,
                    codec,
                  )} = ${identifierMatch}`;
                } else {
                  throw new Error(
                    `Expected ${step} (${i}th dependency of ${this}; step with id ${dependencyIndex}) to be a PgClassExpressionStep`,
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
                from: this.fromExpression(),
                alias: this.alias,
                attributeNames: this.resource.codec.attributes
                  ? sql.blank
                  : sql`(v)`,
                conditions,
                lateral: this.joinAsLateral,
              },
              ...this.joins,
            );
            const actualKeyByDesiredKey = this.mergeSelectsWith(table);
            // We return a list here because our children are going to use a
            // `first` plan on us.
            // NOTE: we don't need to reverse the list for relay pagination
            // because it only contains one entry.
            return list([remapKeys(parent, actualKeyByDesiredKey)]);
          } else {
            debugPlanVerbose(
              "Skipping merging %c into %c (via %c) due to no attributes being selected",
              this,
              table,
              parent,
            );
            // We return a list here because our children are going to use a
            // `first` plan on us.
            return list([parent]);
          }
        } else if (
          parent instanceof PgSelectSingleStep &&
          parent.getClassStep().mode !== "aggregate"
        ) {
          const parent2 = parent.getDep(parent.itemStepId);
          this.identifierMatches.forEach((identifierMatch, i) => {
            const { dependencyIndex, codec } = this.queryValues[i];
            const step = this.getDep(dependencyIndex);
            if (step instanceof PgClassExpressionStep) {
              return this.where(
                sql`${step.toSQL()}::${codec.sqlType} = ${identifierMatch}`,
              );
            } else if (isStaticInputStep(step)) {
              return this.where(
                sql`${this.placeholder(step, codec)} = ${identifierMatch}`,
              );
            } else {
              throw new Error(
                `Expected ${step} (${i}th dependency of ${this}; step with id ${dependencyIndex}) to be a PgClassExpressionStep`,
              );
            }
          });
          this.mergePlaceholdersInto(table);
          const { sql: query } = this.buildQuery({
            // No need to do arrays; the json_agg handles this for us - we can
            // return objects with numeric keys just fine and JS will be fine
            // with it.
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
            return lambda(
              rowsPlan,
              (rows) => {
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
                if (hasMore) {
                  (orderedRows as any).hasMore = true;
                }
                return orderedRows;
              },
              true,
            );
          } else {
            const orderedPlan = shouldReverse ? reverse(rowsPlan) : rowsPlan;
            return orderedPlan;
          }
        }

        table.locker.locked = tableWasLocked;
      }
    }

    this.locker.locked = true;

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
   * paginating over a scalar and you truly need a PgSelectSingleStep interface
   * e.g. so you can get the `count(*)` aggregate.
   *
   * Beware: if you call this and the database might actually return more than
   * one record then you're potentially in for a Bad Time.
   */
  singleAsRecord(
    options?: PgSelectSinglePlanOptions,
  ): PgSelectSingleStep<TResource> {
    this.setUnique(true);
    return new PgSelectSingleStep(this, first(this), options);
  }

  /**
   * If this plan may only return one record, you can use `.single()` to return
   * a plan that resolves to either that record (in the case of composite
   * types) or the underlying scalar (in the case of a resource whose codec has
   * no attributes).
   *
   * Beware: if you call this and the database might actually return more than
   * one record then you're potentially in for a Bad Time.
   */
  single(
    options?: PgSelectSinglePlanOptions,
  ): TResource extends PgResource<
    any,
    PgCodec<any, infer UAttributes, any, any, any, any, any>,
    any,
    any,
    any
  >
    ? UAttributes extends PgCodecAttributes
      ? PgSelectSingleStep<TResource>
      : PgClassExpressionStep<
          PgCodec<string, undefined, any, any, any, any, any>,
          TResource
        >
    : never {
    const $single = this.singleAsRecord(options);
    const isScalar = !this.resource.codec.attributes;
    return (isScalar ? $single.getSelfNamed() : $single) as any;
  }

  row($row: ExecutableStep, options?: PgSelectSinglePlanOptions) {
    return new PgSelectSingleStep(this, $row, options);
  }

  /**
   * When you return a plan in a situation where GraphQL is expecting a
   * GraphQLList, it must implement the `.listItem()` method to return a plan
   * for an individual item within this list. Grafast will automatically call
   * this (possibly recursively) to pass to the plan resolvers on the children
   * of this field.
   *
   * NOTE: Grafast handles the list indexes for you, so your list item plan
   * should process just the single input list item.
   *
   * IMPORTANT: do not call `.listItem` from user code; it's only intended to
   * be called by Grafast.
   */
  listItem(
    itemPlan: ExecutableStep,
  ): TResource extends PgResource<
    any,
    PgCodec<any, infer UAttributes, any, any, any, any, any>,
    any,
    any,
    any
  >
    ? UAttributes extends PgCodecAttributes
      ? PgSelectSingleStep<TResource>
      : PgClassExpressionStep<
          PgCodec<string, undefined, any, any, any, any, any>,
          TResource
        >
    : never {
    const $single = new PgSelectSingleStep(this, itemPlan);
    const isScalar = !this.resource.codec.attributes;
    return (isScalar ? $single.getSelfNamed() : $single) as any;
  }

  // --------------------
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
    if (!sqlIsEquivalent(j1.from, j2.from)) {
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
    if (!sqlIsEquivalent(j1.from, j2.from)) {
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
function ensureOrderIsUnique(step: PgSelectStep<any>) {
  // No need to order a unique record
  if (step.unique()) return;
  const unique = (step.resource.uniques as PgResourceUnique[])[0];
  if (unique !== undefined) {
    const ordersIsUnique = step.orderIsUnique();
    if (!ordersIsUnique) {
      unique.attributes.forEach((c) => {
        step.orderBy({
          fragment: sql`${step.alias}.${sql.identifier(c as string)}`,
          codec: step.resource.codec.attributes![c].codec,
          direction: "ASC",
        });
      });
      step.setOrderIsUnique();
    }
  }
}

export function pgSelect<TResource extends PgResource<any, any, any, any, any>>(
  options: PgSelectOptions<TResource>,
): PgSelectStep<TResource> {
  return new PgSelectStep(options);
}
exportAs("@dataplan/pg", pgSelect, "pgSelect");

/**
 * Turns a list of records (e.g. from PgSelectSingleStep.record()) back into a PgSelect.
 */
export function pgSelectFromRecords<
  TResource extends PgResource<any, any, any, any, any>,
>(
  resource: TResource,
  records:
    | PgClassExpressionStep<
        PgCodec<
          any,
          undefined,
          any,
          any,
          GetPgResourceCodec<TResource>,
          any,
          any
        >,
        TResource
      >
    | ExecutableStep<any[]>,
): PgSelectStep<TResource> {
  return new PgSelectStep<TResource>({
    resource,
    identifiers: [],
    from: (records) => sql`unnest(${records.placeholder})`,
    args: [{ step: records, pgCodec: listOfCodec(resource.codec) }],
  }) as PgSelectStep<TResource>;
}

exportAs("@dataplan/pg", pgSelectFromRecords, "pgSelectFromRecords");

export function sqlFromArgDigests(
  digests: readonly PgSelectArgumentDigest[],
): SQL {
  const args = digests.map((digest) => {
    if (digest.name) {
      return sql`${sql.identifier(digest.name)} := ${digest.placeholder}`;
    } else {
      return digest.placeholder;
    }
  });
  return digests.length > 1
    ? sql.indent(sql.join(args, ",\n"))
    : sql.join(args, ", ");
}
exportAs("@dataplan/pg", sqlFromArgDigests, "sqlFromArgDigests");

export function digestsFromArgumentSpecs(
  $placeholderable: {
    placeholder(step: ExecutableStep, codec: PgCodec): SQL;
  },
  specs: PgSelectArgumentSpec[],
  digests: PgSelectArgumentDigest[] = [],
  initialArgIndex: number | null = 0,
): { digests: PgSelectArgumentDigest[]; argIndex: number | null } {
  let argIndex: null | number = initialArgIndex;
  for (const identifier of specs) {
    if (isDev) {
      assertSensible(identifier.step);
    }
    const { step, name } = identifier;
    const codec =
      "pgCodec" in identifier ? identifier.pgCodec : identifier.step.pgCodec;
    const placeholder = $placeholderable.placeholder(step, codec);
    if (name !== undefined) {
      argIndex = null;
      digests.push({
        name,
        placeholder,
      });
    } else {
      if (argIndex === null) {
        throw new Error("Cannot have unnamed argument after named arguments");
      }
      digests.push({
        position: argIndex++,
        placeholder,
      });
    }
  }
  return { digests, argIndex };
}
exportAs("@dataplan/pg", digestsFromArgumentSpecs, "digestsFromArgumentSpecs");

export function getFragmentAndCodecFromOrder(
  alias: SQL,
  order: PgOrderSpec,
  codecOrCodecs: PgCodec | PgCodec[],
): [fragment: SQL, codec: PgCodec, isNullable?: boolean] {
  if (order.attribute != null) {
    const colFrag = sql`${alias}.${sql.identifier(order.attribute)}`;
    const isArray = Array.isArray(codecOrCodecs);
    const col = (isArray ? codecOrCodecs[0] : codecOrCodecs).attributes![
      order.attribute
    ];
    const colCodec = col.codec;
    if (isArray) {
      for (const codec of codecOrCodecs) {
        if (codec.attributes![order.attribute].codec !== colCodec) {
          throw new Error(
            `Order by attribute '${
              order.attribute
            }' not allowed - this attribute has different codecs (${
              codec.attributes![order.attribute].codec.name
            } != ${colCodec.name}) in different parents (${
              codecOrCodecs[0].name
            } vs ${codec.name})`,
          );
        }
      }
    }
    const isNullable = !col.notNull && !colCodec.notNull;
    return order.callback
      ? order.callback(colFrag, colCodec, isNullable)
      : [colFrag, colCodec, isNullable];
  } else {
    return [order.fragment, order.codec, order.nullable];
  }
}
