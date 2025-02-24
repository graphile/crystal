import { createHash } from "crypto";
import debugFactory from "debug";
import type {
  ConnectionCapableStep,
  ConnectionStep,
  ExecutionDetails,
  GrafastResultsList,
  LambdaStep,
  Maybe,
  PromiseOrDirect,
} from "grafast";
import {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __ItemStep,
  __TrackedValueStep,
  access,
  arrayOfLength,
  ExecutableStep,
  exportAs,
  first,
  isAsyncIterable,
  isDev,
  isPromiseLike,
  reverseArray,
  SafeError,
} from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql, { $$symbolToIdentifier, $$toSQL, arraysMatch } from "pg-sql2";

import type { PgCodecAttributes } from "../codecs.js";
import { listOfCodec, TYPES } from "../codecs.js";
import type { PgResource, PgResourceUnique } from "../datasource.js";
import type { PgExecutorContextPlans, PgExecutorInput } from "../executor.js";
import type {
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRelations,
  PgCodec,
  PgCodecRelation,
  PgConditionLike,
  PgGroupSpec,
  PgOrderSpec,
  PgQueryBuilder,
  PgSelectQueryBuilderCallback,
  PgSQLCallbackOrDirect,
  PgTypedExecutableStep,
  ReadonlyArrayOrDirect,
} from "../interfaces.js";
import { PgLocker } from "../pgLocker.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import type {
  PgHavingConditionSpec,
  PgWhereConditionSpec,
} from "./pgCondition.js";
import { PgCondition } from "./pgCondition.js";
import type { PgCursorDetails } from "./pgCursor.js";
import type { PgPageInfoStep } from "./pgPageInfo.js";
import { pgPageInfo } from "./pgPageInfo.js";
import type { PgSelectSinglePlanOptions } from "./pgSelectSingle.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";
import type {
  MutablePgStmtCommonQueryInfo,
  PgStmtCommonQueryInfo,
  PgStmtDeferredPlaceholder,
  PgStmtDeferredSQL,
} from "./pgStmt.js";
import {
  applyCommonPaginationStuff,
  calculateLimitAndOffsetSQLFromInfo,
  getUnary,
  makeValues,
  PgStmtBaseStep,
} from "./pgStmt.js";
import { validateParsedCursor } from "./pgValidateParsedCursor.js";

export type PgSelectParsedCursorStep = LambdaStep<string, any[]>;

// Maximum identifier length in Postgres is 63 chars, so trim one off. (We
// could do base64... but meh.)
const hash = (text: string): string =>
  createHash("sha256").update(text).digest("hex").slice(0, 63);

const debugPlan = debugFactory("@dataplan/pg:PgSelectStep:plan");
// const debugExecute = debugFactory("@dataplan/pg:PgSelectStep:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);
const NO_ROWS = Object.freeze({
  m: Object.create(null),
  hasMore: false,
  items: [],
} as PgSelectStepResult);

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

type PgSelectScopedPlanJoin = PgSQLCallbackOrDirect<PgSelectPlanJoin>;

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
  alreadyEncoded: boolean;
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
   * Set this true if your query includes any `VOLATILE` function (including
   * seemingly innocuous things such as `random()`) otherwise we might only
   * call the relevant function once and re-use the result.
   */
  forceIdentity?: boolean;

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
   * You should never rely on implicit order - use explicit `ORDER BY` (via
   * `$select.orderBy(...)`) instead. However, if you _are_ relying on implicit
   * order in your `from` result (e.g. a subquery or function call that has its
   * own internal ordering), setting this to `true` will prevent PgSelect from
   * inlining some queries (joins) that it thinks might impact the order of
   * results. Setting this to `true` does NOT guarantee that you can rely on
   * your order being maintained, but it does increase the chances.
   */
  hasImplicitOrder?: false;

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

  /** @internal @experimental */
  context?: ExecutableStep<PgExecutorContextPlans<any>>;
  /** @internal */
  _internalCloneSymbol?: symbol | string;
  /** @internal */
  _internalCloneAlias?: SQL;
}

/**
 * When finalized, we build the SQL query, queryValues, and note where to feed in
 * the relevant queryValues. This saves repeating this work at execution time.
 */
interface QueryBuildResult {
  meta: Record<string, unknown>;

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

  queryValues: Array<QueryValue>;

  first: Maybe<number>;
  last: Maybe<number>;
  cursorDetails: PgCursorDetails | undefined;
}

interface PgSelectStepResult {
  hasMore?: boolean;
  /** a tuple based on what is selected at runtime */
  items: ReadonlyArray<unknown[]> | AsyncIterable<unknown[]>;
  cursorDetails?: PgCursorDetails;
  m: Record<string, unknown>;
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
  extends PgStmtBaseStep<PgSelectStepResult>
  implements
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
  private readonly hasImplicitOrder: boolean;

  /**
   * This defaults to the name of the resource but you can override it. Aids
   * in debugging.
   */
  public readonly name: string;
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
  private readonly _symbolSubstitutes = new Map<symbol, symbol>();

  /** = sql.identifier(this.symbol) */
  public readonly alias: SQL;

  /**
   * The resource from which we are selecting: table, view, etc
   */
  public readonly resource: TResource;

  // JOIN

  private relationJoins = new Map<
    keyof GetPgResourceRelations<TResource>,
    SQL
  >();
  private joins: Array<PgSelectPlanJoin> = [];

  // WHERE

  private conditions: SQL[] = [];

  // GROUP BY

  private groups: Array<PgGroupSpec> = [];

  // HAVING

  private havingConditions: SQL[] = [];

  // ORDER BY

  private orders: Array<PgOrderSpec> = [];
  private isOrderUnique = false;

  // LIMIT

  protected firstStepId: number | null = null;
  protected lastStepId: number | null = null;
  protected fetchOneExtra = false;
  /** When using natural pagination, this index is the lower bound (and should be excluded) */
  protected lowerIndexStepId: number | null = null;
  /** When using natural pagination, this index is the upper bound (and should be excluded) */
  protected upperIndexStepId: number | null = null;

  // OFFSET

  protected offsetStepId: number | null = null;

  // CURSORS

  protected beforeStepId: number | null = null;
  protected afterStepId: number | null = null;

  // Connection
  private connectionDepId: number | null = null;

  private applyDepIds: number[] = [];

  // --------------------

  /**
   * This is the list of SQL fragments in the result that are compared to some
   * of the above `queryValues` to determine if there's a match or not. Typically
   * this will be a list of columns (e.g. primary or foreign keys on the
   * table).
   */
  private identifierMatches: readonly {
    dependencyIndex: number;
    expression: SQL;
    codec: PgCodec;
    _matches: PgSelectIdentifierSpec["matches"];
  }[];

  /**
   * Set this true if your query includes any `VOLATILE` function (including
   * seemingly innocuous things such as `random()`) otherwise we might only
   * call the relevant function once and re-use the result.
   */
  public forceIdentity: boolean;

  /**
   * If the resource is a function, this is the names of the arguments to pass
   */
  private arguments: ReadonlyArray<PgSelectArgumentDigest>;

  protected placeholders: Array<PgStmtDeferredPlaceholder> = [];
  protected deferreds: Array<PgStmtDeferredSQL> = [];
  private fixedPlaceholderValues = new Map<symbol, SQL>();

  /**
   * If true, we don't need to add any of the security checks from the
   * resource; otherwise we must do so. Default false.
   */
  private isTrusted = false;

  /**
   * If true, we know at most one result can be matched for each identifier, so
   * it's safe to do a `LEFT JOIN` without risk of returning duplicates. Default false.
   */
  private isUnique = false;

  /**
   * If true, we will not attempt to inline this into the parent query.
   * Default false.
   */
  private isInliningForbidden = false;

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
  private selects: Array<SQL> = [];

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  // --------------------

  public readonly mode: PgSelectMode;

  protected locker: PgLocker<this> = new PgLocker(this);

  static clone<TResource extends PgResource<any, any, any, any, any>>(
    cloneFrom: PgSelectStep<TResource>,
    mode: PgSelectMode = cloneFrom.mode,
  ): PgSelectStep<TResource> {
    const cloneFromMatchingMode = cloneFrom?.mode === mode ? cloneFrom : null;
    const $clone = new PgSelectStep({
      identifiers: [], //We'll overwrite teh result of this in a moment
      args: undefined, // We'll overwrite the result of this in a moment
      context: cloneFrom.getDep(cloneFrom.contextId),

      resource: cloneFrom.resource,
      from: cloneFrom.from,
      ...(cloneFrom.hasImplicitOrder === false
        ? { hasImplicitOrder: cloneFrom.hasImplicitOrder }
        : {}),
      name: cloneFrom.name,
      mode,
      joinAsLateral: cloneFrom.joinAsLateral,
      forceIdentity: cloneFrom.forceIdentity,

      _internalCloneSymbol: cloneFrom.symbol,
      _internalCloneAlias: cloneFrom.alias,
    });

    if ($clone.dependencies.length !== 1) {
      throw new Error(
        "Should not have any dependencies other than context yet",
      );
    }

    cloneFrom.dependencies.forEach((planId, idx) => {
      if (idx === 0) return;
      const myIdx = $clone.addDependency({
        ...cloneFrom.getDepOptions(idx),
        skipDeduplication: true,
      });
      if (myIdx !== idx) {
        throw new Error(
          `Failed to clone ${cloneFrom}; dependency indexes did not match: ${myIdx} !== ${idx}`,
        );
      }
    });

    $clone.applyDepIds = [...cloneFrom.applyDepIds];
    $clone.identifierMatches = [...cloneFrom.identifierMatches];
    $clone.arguments = [...cloneFrom.arguments];
    $clone.isTrusted = cloneFrom.isTrusted;
    // TODO: should `isUnique` only be set if mode matches?
    $clone.isUnique = cloneFrom.isUnique;
    $clone.isInliningForbidden = cloneFrom.isInliningForbidden;

    for (const [k, v] of cloneFrom._symbolSubstitutes) {
      $clone._symbolSubstitutes.set(k, v);
    }

    for (const v of cloneFrom.placeholders) {
      $clone.placeholders.push(v);
    }
    for (const v of cloneFrom.deferreds) {
      $clone.deferreds.push(v);
    }
    for (const [k, v] of cloneFrom.fixedPlaceholderValues) {
      $clone.fixedPlaceholderValues.set(k, v);
    }
    for (const [k, v] of cloneFrom.relationJoins) {
      $clone.relationJoins.set(k, v);
    }
    for (const v of cloneFrom.joins) {
      $clone.joins.push(v);
    }
    for (const v of cloneFrom.conditions) {
      $clone.conditions.push(v);
    }
    if (cloneFromMatchingMode) {
      for (const v of cloneFromMatchingMode.selects) {
        $clone.selects.push(v);
      }
      for (const v of cloneFromMatchingMode.groups) {
        $clone.groups.push(v);
      }
      for (const v of cloneFromMatchingMode.havingConditions) {
        $clone.havingConditions.push(v);
      }
      for (const v of cloneFromMatchingMode.orders) {
        $clone.orders.push(v);
      }

      $clone.isOrderUnique = cloneFromMatchingMode.isOrderUnique;
      $clone.firstStepId = cloneFromMatchingMode.firstStepId;
      $clone.lastStepId = cloneFromMatchingMode.lastStepId;
      $clone.fetchOneExtra = cloneFromMatchingMode.fetchOneExtra;
      $clone.offsetStepId = cloneFromMatchingMode.offsetStepId;

      // dependencies were already added, so we can just copy the dependency references
      $clone.beforeStepId = cloneFromMatchingMode.beforeStepId;
      $clone.afterStepId = cloneFromMatchingMode.afterStepId;
      $clone.lowerIndexStepId = cloneFromMatchingMode.lowerIndexStepId;
      $clone.upperIndexStepId = cloneFromMatchingMode.upperIndexStepId;
    }

    return $clone;
  }

  constructor(options: PgSelectOptions<TResource>) {
    super();
    const {
      resource,
      identifiers,
      args: inArgs,
      from: inFrom = null,
      hasImplicitOrder: inHasImplicitOrder,
      name,
      mode,
      joinAsLateral: inJoinAsLateral = false,
      forceIdentity: inForceIdentity = false,
      context: inContext,

      // Clone only details
      _internalCloneSymbol,
      _internalCloneAlias,
    } = options;

    this.mode = mode ?? "normal";

    this.hasSideEffects = this.mode === "mutation";

    this.resource = resource;

    // Since we're applying this to the original it doesn't make sense to
    // also apply it to the clones.
    if (_internalCloneSymbol === undefined) {
      if (this.mode === "aggregate") {
        this.locker.beforeLock("orderBy", () =>
          this.locker.lockParameter("groupBy"),
        );
      }
    }

    this.contextId = this.addDependency(
      inContext ?? resource.executor.context(),
    );

    this.name = name ?? resource.name;
    this.symbol = _internalCloneSymbol ?? Symbol(this.name);
    this.alias = _internalCloneAlias ?? sql.identifier(this.symbol);
    this.from = inFrom ?? resource.from;
    this.hasImplicitOrder = inHasImplicitOrder ?? resource.hasImplicitOrder;
    this.joinAsLateral = inJoinAsLateral ?? !!this.resource.parameters;
    this.forceIdentity = inForceIdentity;

    {
      if (!identifiers) {
        throw new Error("Invalid construction of PgSelectStep");
      }
      const identifierMatches: {
        dependencyIndex: number;
        expression: SQL;
        codec: PgCodec;
        _matches: PgSelectIdentifierSpec["matches"];
      }[] = [];
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
        identifierMatches.push({
          expression: matches(this.alias),
          dependencyIndex: this.addDependency(step),
          codec,
          _matches: matches,
        });
      });
      if (inArgs != null) {
        const { digests: newArgs, argIndex: newArgIndex } =
          digestsFromArgumentSpecs(this, inArgs, args, argIndex);
        args = newArgs;
        argIndex = newArgIndex;
      }
      this.identifierMatches = identifierMatches;
      this.arguments = args;
    }

    this.peerKey = this.resource.name;

    debugPlanVerbose(`%s (%s) constructor (%s)`, this, this.name, this.mode);

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

  public unique(): boolean {
    return this.isUnique;
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
   */
  public join(spec: PgSelectScopedPlanJoin) {
    this.joins.push(this.scopedSQL(spec));
  }

  public getMeta(key: string) {
    return access(this, ["m", key]);
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   *
   * @internal
   */
  public selectAndReturnIndex(
    fragmentOrCb: PgSQLCallbackOrDirect<SQL>,
  ): number {
    const fragment = this.scopedSQL(fragmentOrCb);
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

  private nullCheckIndex: Maybe<number> = undefined;
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
   */
  clone(mode?: PgSelectMode): PgSelectStep<TResource> {
    // Prevent any changes to our original to help avoid programming
    // errors.
    this.lock();

    return PgSelectStep.clone(this, mode);
  }

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
    rawCondition: PgSQLCallbackOrDirect<
      PgWhereConditionSpec<keyof GetPgResourceAttributes<TResource> & string>
    >,
  ): void {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('where')`,
      );
    }
    const condition = this.scopedSQL(rawCondition);
    if (sql.isSQL(condition)) {
      this.conditions.push(condition);
    } else {
      switch (condition.type) {
        case "attribute": {
          this.conditions.push(
            this.scopedSQL((sql) =>
              condition.callback(
                sql`${this.alias}.${sql.identifier(condition.attribute)}`,
              ),
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

  groupBy(group: PgSQLCallbackOrDirect<PgGroupSpec>): void {
    this.locker.assertParameterUnlocked("groupBy");
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add groupBy to a non-aggregate query`);
    }
    this.groups.push(this.scopedSQL(group));
  }

  having(
    rawCondition: PgSQLCallbackOrDirect<
      PgHavingConditionSpec<keyof GetPgResourceAttributes<TResource> & string>
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
    const condition = this.scopedSQL(rawCondition);
    if (sql.isSQL(condition)) {
      this.havingConditions.push(condition);
    } else {
      const never: never = condition;
      console.error("Unsupported condition: ", never);
      throw new Error(`Unsupported condition`);
    }
  }

  orderBy(order: PgSQLCallbackOrDirect<PgOrderSpec>): void {
    this.locker.assertParameterUnlocked("orderBy");
    this.orders.push(this.scopedSQL(order));
  }

  setOrderIsUnique(): void {
    if (this.locker.locked) {
      throw new Error(`${this}: cannot set order unique once plan is locked`);
    }
    this.isOrderUnique = true;
  }

  apply(
    $step: ExecutableStep<
      ReadonlyArrayOrDirect<Maybe<PgSelectQueryBuilderCallback>>
    >,
  ) {
    this.applyDepIds.push(this.addUnaryDependency($step));
  }

  protected assertCursorPaginationAllowed(): void {
    if (this.mode === "aggregate") {
      throw new SafeError(
        "Cannot use cursor pagination on an aggregate PgSelectStep",
      );
    }
  }

  public items() {
    return this.operationPlan.cacheStep(
      this,
      "items",
      "" /* Digest of our arguments */,
      () => new PgSelectRowsStep(this),
    );
  }

  public pageInfo(
    $connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, this, any>,
  ): PgPageInfoStep<this> {
    this.assertCursorPaginationAllowed();
    this.lock();
    return pgPageInfo($connectionPlan);
  }

  public getCursorDetails(): ExecutableStep<PgCursorDetails> {
    this.needsCursor = true;
    return access(this, "cursorDetails");
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
    executionDetails: ExecutionDetails,
  ): Promise<GrafastResultsList<PgSelectStepResult>> {
    const {
      indexMap,
      count,
      values,
      extra: { eventEmitter },
      stream,
    } = executionDetails;
    const {
      meta,
      text,
      rawSqlValues,
      textForDeclare,
      rawSqlValuesForDeclare,
      identifierIndex,
      name,
      streamInitialCount,
      queryValues,
      shouldReverseOrder,
      first,
      last,
      cursorDetails,
    } = buildTheQuery({
      executionDetails,
      placeholders: this.placeholders,
      fixedPlaceholderValues: this.fixedPlaceholderValues,
      deferreds: this.deferreds,
      firstStepId: this.firstStepId,
      lastStepId: this.lastStepId,
      offsetStepId: this.offsetStepId,
      afterStepId: this.afterStepId,
      beforeStepId: this.beforeStepId,
      forceIdentity: this.forceIdentity,
      havingConditions: this.havingConditions,
      mode: this.mode,
      hasSideEffects: this.hasSideEffects,
      name: this.name,
      alias: this.alias,
      symbol: this.symbol,
      resource: this.resource,
      groups: this.groups,
      orders: this.orders,
      selects: this.selects,
      fetchOneExtra: this.fetchOneExtra,
      isOrderUnique: this.isOrderUnique,
      isUnique: this.isUnique,
      conditions: this.conditions,
      identifierMatches: this.identifierMatches,
      _symbolSubstitutes: this._symbolSubstitutes,
      from: this.from,
      joins: this.joins,
      arguments: this.arguments,
      needsCursor: this.needsCursor,
      applyDepIds: this.applyDepIds,
      relationJoins: this.relationJoins,
    });
    if (first === 0 || last === 0) {
      return arrayOfLength(count, NO_ROWS);
    }
    const contextDep = values[this.contextId];

    if (stream == null) {
      const specs = indexMap<PgExecutorInput<any>>((i) => {
        const context = contextDep.at(i);
        return {
          // The context is how we'd handle different connections with different claims
          context,
          queryValues:
            identifierIndex != null
              ? queryValues.map(({ dependencyIndex, codec }) => {
                  const val = values[dependencyIndex].at(i);
                  return val == null ? null : codec.toPg(val);
                })
              : EMPTY_ARRAY,
        };
      });
      const executeMethod =
        this.operationPlan.operation.operation === "query"
          ? "executeWithCache"
          : "executeWithoutCache";
      const executionResult = await this.resource[executeMethod](specs, {
        text,
        rawSqlValues,
        identifierIndex,
        name,
        eventEmitter,
        useTransaction: this.mode === "mutation",
      });
      // debugExecute("%s; result: %c", this, executionResult);

      return executionResult.values.map((allVals) => {
        if (isPromiseLike(allVals)) {
          // Must be an error
          return allVals as never;
        }
        if (allVals == null) {
          return allVals;
        }
        const limit = first ?? last;
        const firstAndLast = first != null && last != null && last < first;
        const hasMore =
          this.fetchOneExtra && limit != null && allVals.length > limit;
        const trimFromStart =
          !shouldReverseOrder && last != null && first == null;
        const limitedRows = hasMore
          ? trimFromStart
            ? allVals.slice(Math.max(0, allVals.length - limit!))
            : allVals.slice(0, limit!)
          : allVals;
        const slicedRows =
          firstAndLast && last != null ? limitedRows.slice(-last) : limitedRows;
        const orderedRows = shouldReverseOrder
          ? reverseArray(slicedRows)
          : slicedRows;
        return {
          m: meta,
          items: orderedRows,
          hasMore,
          cursorDetails,
        };
      });
    } else {
      if (shouldReverseOrder !== false) {
        throw new Error("shouldReverseOrder must be false for stream");
      }
      if (!rawSqlValuesForDeclare || !textForDeclare) {
        throw new Error("declare query must exist for stream");
      }

      let specs: readonly PgExecutorInput<any>[] | null = null;
      if (text) {
        specs = indexMap((i) => {
          const context = contextDep.at(i);
          return {
            // The context is how we'd handle different connections with different claims
            context,
            queryValues:
              identifierIndex != null
                ? queryValues.map(({ dependencyIndex, codec }) => {
                    const val = values[dependencyIndex].at(i);
                    return val == null ? null : codec.toPg(val);
                  })
                : EMPTY_ARRAY,
          };
        });
      }
      const initialFetchResult = specs
        ? (
            await this.resource.executeWithoutCache(specs, {
              text,
              rawSqlValues,
              identifierIndex,
              eventEmitter,
            })
          ).values
        : null;

      const streamSpecs = indexMap<PgExecutorInput<any>>((i) => {
        const context = contextDep.at(i);

        return {
          // The context is how we'd handle different connections with different claims
          context,
          queryValues:
            identifierIndex != null
              ? queryValues.map(({ dependencyIndex, codec }) => {
                  const val = values[dependencyIndex].at(i);
                  return val == null ? val : codec.toPg(val);
                })
              : EMPTY_ARRAY,
        };
      });
      const streams = (
        await this.resource.executeStream(streamSpecs, {
          text: textForDeclare,
          rawSqlValues: rawSqlValuesForDeclare,
          identifierIndex,
          eventEmitter,
        })
      ).streams;

      return streams.map((iterable, idx) => {
        if (!isAsyncIterable(iterable)) {
          // Must be an error
          return iterable;
        }
        if (!initialFetchResult) {
          return {
            m: meta,
            items: iterable,
            hasMore: false,
            cursorDetails,
          };
        }

        // Munge the initialCount records into the streams
        const innerIterator = iterable[Symbol.asyncIterator]();

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
        return {
          m: meta,
          items: mergedGenerator,
          hasMore: false,
          cursorDetails,
        };
      });
    }
  }

  public finalize(): void {
    // In case we have any lock actions in future:
    this.lock();

    // Now we need to be able to mess with ourself, but be sure to lock again
    // at the end.
    this.locker.locked = false;

    this.locker.locked = true;

    super.finalize();
  }

  deduplicate(peers: PgSelectStep<any>[]): PgSelectStep<TResource>[] {
    if (!this.isTrusted) {
      this.resource.applyAuthorizationChecksToPlan(this);
      this.isTrusted = true;
    }

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
      if (p.from !== this.from) {
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
          (matchA, matchB) =>
            matchA.codec === matchB.codec &&
            matchA.dependencyIndex === matchB.dependencyIndex &&
            sqlIsEquivalent(matchA.expression, matchB.expression),
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

      const depsMatch = (myDepId: number | null, theirDepId: number | null) =>
        this.maybeGetDep(myDepId) === p.maybeGetDep(theirDepId);
      // Check LIMIT, OFFSET and CURSOR matches
      if (
        !depsMatch(this.firstStepId, p.firstStepId) ||
        !depsMatch(this.lastStepId, p.lastStepId) ||
        !depsMatch(this.offsetStepId, p.offsetStepId) ||
        !depsMatch(this.lowerIndexStepId, p.lowerIndexStepId) ||
        !depsMatch(this.upperIndexStepId, p.upperIndexStepId)
      ) {
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
    if (this.needsCursor) {
      replacement.needsCursor = true;
    }
  }

  optimize(): ExecutableStep {
    // In case we have any lock actions in future:
    this.lock();

    // PERF: we should serialize our `SELECT` clauses and then if any are
    // identical we should omit the later copies and have them link back to the
    // earliest version (resolve this in `execute` via mapping).

    // TODO: have connection validate cursor
    /*
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
      const $connection = this.getDep<ConnectionStep<any, any, any>>(
        this.connectionDepId,
      );
      $connection.addValidation(() => {
        return pgValidateParsedCursor(
          $parsedCursorPlan,
          digest,
          orderCount,
          beforeOrAfter,
        );
      });
    }
    */

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

  [$$toSQL]() {
    return this.alias;
  }
}

export class PgSelectRowsStep<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends ExecutableStep {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectRowsStep",
  };

  public isSyncAndSafe = false;

  constructor($pgSelect: PgSelectStep<TResource>) {
    super();
    this.addDependency($pgSelect);
  }

  public getClassStep(): PgSelectStep<TResource> {
    return this.getDep<PgSelectStep<TResource>>(0);
  }

  listItem(itemPlan: ExecutableStep) {
    return this.getClassStep().listItem(itemPlan);
  }

  public deduplicate(_peers: readonly ExecutableStep[]) {
    // We don't have any properties, and dependencies is already checked, so we're the same as our kin.
    return _peers;
  }

  // optimize() {
  //   const $access = access(this.getClassStep(), "items");
  //   $access.isSyncAndSafe = false;
  //   return $access;
  // }

  execute(executionDetails: ExecutionDetails) {
    const pgSelect = executionDetails.values[0];
    return executionDetails.indexMap((i) => pgSelect.at(i).items);
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
function makeOrderUniqueIfPossible<
  TResource extends PgResource<any, any, any, any, any>,
>(info: MutablePgSelectQueryInfo<TResource>): void {
  // If we're already uniquely ordered, no need to order
  if (info.isOrderUnique) return;
  // No need to order a unique record
  if (info.isUnique) return;
  const {
    alias,
    resource: {
      uniques,
      codec: { attributes },
    },
  } = info;
  const unique = (uniques as PgResourceUnique[])[0];
  // Nothing unique to order by
  if (unique == null) return;

  for (const c of unique.attributes) {
    info.orders.push({
      fragment: sql`${alias}.${sql.identifier(c as string)}`,
      codec: attributes![c].codec,
      direction: "ASC",
    });
  }
  info.isOrderUnique = true;
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

function calculateOrderBySQL(params: {
  reverse: boolean;
  orders: PgOrderSpec[];
  alias: SQL;
  codec: PgCodec;
}) {
  const { reverse, orders: rawOrders, alias, codec } = params;
  const orders = reverse
    ? rawOrders.map(
        (o): PgOrderSpec => ({
          ...o,
          direction: o.direction === "ASC" ? "DESC" : "ASC",
          nulls:
            o.nulls === "LAST"
              ? "FIRST"
              : o.nulls === "FIRST"
              ? "LAST"
              : o.nulls,
        }),
      )
    : rawOrders;
  return orders.length > 0
    ? sql`\norder by ${sql.join(
        orders.map((o) => {
          const [frag] = getFragmentAndCodecFromOrder(alias, o, codec);
          return sql`${frag} ${o.direction === "ASC" ? sql`asc` : sql`desc`}${
            o.nulls === "LAST"
              ? sql` nulls last`
              : o.nulls === "FIRST"
              ? sql` nulls first`
              : sql.blank
          }`;
        }),
        ", ",
      )}`
    : sql.blank;
}

interface PgSelectQueryInfo<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends PgStmtCommonQueryInfo {
  readonly name: string;
  readonly resource: TResource;
  readonly mode: PgSelectMode;
  /** Are we fetching just one record? */
  readonly isUnique: boolean;
  /** Is the order that was established at planning time unique? */
  readonly isOrderUnique: boolean;
  readonly fixedPlaceholderValues: ReadonlyMap<symbol, SQL>;
  readonly identifierMatches: readonly {
    readonly dependencyIndex: number;
    readonly expression: SQL;
    readonly codec: PgCodec;
  }[];
  readonly _symbolSubstitutes: ReadonlyMap<symbol, symbol>;

  readonly selects: ReadonlyArray<SQL>;
  readonly from: SQL | ((...args: Array<PgSelectArgumentDigest>) => SQL);
  readonly arguments: ReadonlyArray<PgSelectArgumentDigest>;
  readonly joins: ReadonlyArray<PgSelectPlanJoin>;
  readonly conditions: ReadonlyArray<SQL>;
  readonly orders: ReadonlyArray<PgOrderSpec>;
  readonly relationJoins: ReadonlyMap<
    keyof GetPgResourceRelations<TResource>,
    SQL
  >;
}
interface MutablePgSelectQueryInfo<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends PgSelectQueryInfo<TResource>,
    MutablePgStmtCommonQueryInfo {
  readonly selects: Array<SQL>;
  readonly joins: Array<PgSelectPlanJoin>;
  readonly conditions: Array<SQL>;
  readonly orders: Array<PgOrderSpec>;
  readonly groups: Array<PgGroupSpec>;
  readonly havingConditions: Array<SQL>;
  isOrderUnique: boolean;
  readonly relationJoins: Map<keyof GetPgResourceRelations<TResource>, SQL>;
}

function buildTheQuery<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
>(rawInfo: Readonly<PgSelectQueryInfo<TResource>>): QueryBuildResult {
  const info: MutablePgSelectQueryInfo<TResource> = {
    ...rawInfo,

    // Make mutable:
    selects: [...rawInfo.selects],
    conditions: [...rawInfo.conditions],
    orders: [...rawInfo.orders],
    groups: [...rawInfo.groups],
    havingConditions: [...rawInfo.havingConditions],
    relationJoins: new Map(rawInfo.relationJoins),
    joins: [...rawInfo.joins],

    // Will be populated by applyConditionFromCursor
    cursorLower: null,
    cursorUpper: null,
    cursorDigest: null,
    cursorIndicies: rawInfo.needsCursor ? [] : null,

    // Will be populated by applyCommonPaginationStuff
    first: null,
    last: null,
    offset: null,
    shouldReverseOrder: false,
  };

  function selectAndReturnIndex(expression: SQL): number {
    const existingIndex = info.selects.findIndex((s) =>
      sql.isEquivalent(s, expression),
    );
    if (existingIndex >= 0) return existingIndex;
    return info.selects.push(expression) - 1;
  }

  const meta = Object.create(null);
  const queryBuilder: PgSelectQueryBuilder = {
    alias: info.alias,
    [$$toSQL]() {
      return info.alias;
    },
    setMeta(key, value) {
      meta[key] = value;
    },
    orderBy(spec) {
      if (info.mode !== "aggregate") {
        info.orders.push(spec);
      } else {
        // Throw it away?
        // Maybe later we can use it in the aggregates themself - e.g. `array_agg(... order by <blah>)`
      }
    },
    setOrderIsUnique() {
      info.isOrderUnique = true;
    },
    singleRelation(relationIdentifier) {
      // NOTE: this is almost an exact copy of the same method on PgSelectStep,
      // except using `info`... We should harmonize them.
      const relation = info.resource.getRelation(
        relationIdentifier,
      ) as PgCodecRelation;
      if (!relation) {
        throw new Error(
          `${info.resource} does not have a relation named '${String(
            relationIdentifier,
          )}'`,
        );
      }
      if (!relation.isUnique) {
        throw new Error(
          `${info.resource} relation '${String(
            relationIdentifier,
          )}' is not unique so cannot be used with singleRelation`,
        );
      }

      const { remoteResource, localAttributes, remoteAttributes } = relation;

      // Join to this relation if we haven't already
      const cachedAlias = info.relationJoins.get(relationIdentifier);
      if (cachedAlias) {
        return cachedAlias;
      }
      const alias = sql.identifier(Symbol(relationIdentifier as string));
      if (typeof remoteResource.from === "function") {
        throw new Error(
          "Callback sources not currently supported via singleRelation",
        );
      }
      info.joins.push({
        type: "left",
        from: remoteResource.from,
        alias,
        conditions: localAttributes.map(
          (col, i) =>
            sql`${info.alias}.${sql.identifier(
              col as string,
            )} = ${alias}.${sql.identifier(remoteAttributes[i] as string)}`,
        ),
      });
      info.relationJoins.set(relationIdentifier, alias);
      return alias;
    },
    // TODO: where, whereBuilder, having, havingBuilder
    where(condition) {
      if (sql.isSQL(condition)) {
        info.conditions.push(condition);
      } else {
        switch (condition.type) {
          case "attribute": {
            info.conditions.push(
              condition.callback(
                sql`${info.alias}.${sql.identifier(condition.attribute)}`,
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
    },
    having(condition) {
      if (info.mode !== "aggregate") {
        throw new SafeError(`Cannot add having to a non-aggregate query`);
      }
      if (sql.isSQL(condition)) {
        info.havingConditions.push(condition);
      } else {
        const never: never = condition;
        console.error("Unsupported condition: ", never);
        throw new Error(`Unsupported condition`);
      }
    },
    whereBuilder() {
      return new PgCondition(this);
    },
    havingBuilder() {
      return new PgCondition(this, true);
    },
  };

  const { count, stream, values } = info.executionDetails;

  for (const applyDepId of info.applyDepIds) {
    const val = values[applyDepId].unaryValue();
    if (Array.isArray(val)) {
      val.forEach((v) => v?.(queryBuilder));
    } else {
      val?.(queryBuilder);
    }
  }

  // beforeLock("orderBy"): Now the runtime orders/etc have been added, mutate `orders` to be unique
  makeOrderUniqueIfPossible(info);

  // afterLock("orderBy"): Now the runtime orders/etc have been performed,

  const after = getUnary<any[] | null>(values, info.afterStepId);
  const before = getUnary<any[] | null>(values, info.beforeStepId);

  if (info.needsCursor || after != null || before != null) {
    info.cursorDigest = getOrderByDigest(info);
  }
  // PERF: only calculate this if needed
  const { sql: trueOrderBySQL } = buildOrderBy(info, false);
  if (info.cursorIndicies) {
    // PERF: calculate cursorDigest here instead?
    if (info.orders.length > 0) {
      for (const o of info.orders) {
        const [frag, codec] = getFragmentAndCodecFromOrder(
          info.alias,
          o,
          info.resource.codec,
        );
        info.cursorIndicies.push({
          index: selectAndReturnIndex(
            codec.castFromPg
              ? codec.castFromPg(frag, o.nullable === false)
              : sql`${frag}::text`,
          ),
          codec,
        });
      }
    } else {
      // No ordering; so use row number
      info.cursorIndicies.push({
        index: selectAndReturnIndex(
          sql`(row_number() over (partition by 1))::text`,
        ),
        codec: TYPES.int,
      });
    }
  }

  // apply conditions from the cursor
  applyConditionFromCursor(info, "after", after);
  applyConditionFromCursor(info, "before", before);

  applyCommonPaginationStuff(info);

  /****************************************
   *                                      *
   *      ALL MUTATION NOW COMPLETE       *
   *                                      *
   ****************************************/

  const {
    name,
    hasSideEffects,
    forceIdentity,
    fixedPlaceholderValues,
    identifierMatches,

    first,
    last,
    shouldReverseOrder,
    cursorDigest,
    cursorIndicies,
  } = info;

  const extraWheres: SQL[] = [];

  const {
    queryValues,
    placeholderValues,
    handlePlaceholder,
    identifiersSymbol,
    identifiersAlias,
  } = makeValues(info, name);

  // Handle fixed placeholder values
  for (const [key, value] of fixedPlaceholderValues) {
    placeholderValues.set(key, value);
  }

  // Handle identifiers
  for (const identifierMatch of identifierMatches) {
    const { expression, dependencyIndex } = identifierMatch;
    const symbol = Symbol(`dep-${dependencyIndex}`);
    extraWheres.push(sql`${expression} = ${sql.placeholder(symbol)}`);
    const alreadyEncoded = false;
    // Now it's essentially a placeholder:
    handlePlaceholder({ ...identifierMatch, symbol, alreadyEncoded });
  }

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
    identifierIndex: number | null;
  } => {
    const forceOrder = (stream && info.shouldReverseOrder) || false;
    if (
      queryValues.length > 0 ||
      (count !== 1 && (forceIdentity || hasSideEffects))
    ) {
      const extraSelects: SQL[] = [];

      const identifierIndexOffset =
        extraSelects.push(sql`${identifiersAlias}.idx`) - 1;
      // PERF: try and re-use existing trueOrderBySQL selection?
      const rowNumberIndexOffset =
        forceOrder || limit != null || offset != null
          ? extraSelects.push(
              sql`row_number() over (${sql.indent(trueOrderBySQL)})`,
            ) - 1
          : -1;

      const { sql: baseQuery, extraSelectIndexes } = buildQuery(info, {
        extraSelects,
        extraWheres,
        forceOrder,
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
       *   `shouldReverseOrder` then we must reverse the order
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

      const wrapperSymbol = Symbol(name + "_result");
      const wrapperAlias = sql.identifier(wrapperSymbol);

      const {
        text: lateralText,
        values: rawSqlValues,
        [$$symbolToIdentifier]: symbolToIdentifier,
      } = sql.compile(
        sql`lateral (${sql.indent(wrappedInnerQuery)}) as ${wrapperAlias}`,
        options,
      );

      const identifiersAliasText = symbolToIdentifier.get(identifiersSymbol);
      const wrapperAliasText = symbolToIdentifier.get(wrapperSymbol);

      /*
       * IMPORTANT: these wrapper queries are necessary so that queries
       * that have a limit/offset get the limit/offset applied _per
       * identifier group_; that's why this cannot just be another "from"
       * clause.
       */
      const text = `\
select ${wrapperAliasText}.*
from (select ids.ordinality - 1 as idx${
        queryValues.length > 0
          ? `, ${queryValues
              .map(({ codec }, idx) => {
                return `(ids.value->>${idx})::${
                  sql.compile(codec.sqlType).text
                } as "id${idx}"`;
              })
              .join(", ")}`
          : ""
      } from json_array_elements($${
        rawSqlValues.length + 1
      }::json) with ordinality as ids) as ${identifiersAliasText},
${lateralText};`;

      return { text, rawSqlValues, identifierIndex };
    } else if (
      (limit != null && limit >= 0) ||
      (offset != null && offset > 0)
    ) {
      // ENHANCEMENT: make this nicer; combine with the `if` branch above?

      const extraSelects: SQL[] = [];
      const rowNumberIndexOffset =
        forceOrder || limit != null || offset != null
          ? extraSelects.push(
              sql`row_number() over (${sql.indent(trueOrderBySQL)})`,
            ) - 1
          : -1;

      const { sql: baseQuery, extraSelectIndexes } = buildQuery(info, {
        extraSelects,
        extraWheres,
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
       *   `shouldReverseOrder` then we must reverse the order
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
      const { sql: query } = buildQuery(info, {
        extraWheres,
      });
      const { text, values: rawSqlValues } = sql.compile(
        sql`${query};`,
        options,
      );
      return { text, rawSqlValues, identifierIndex: null };
    }
  };

  const cursorDetails: PgCursorDetails | undefined =
    cursorDigest != null && cursorIndicies != null
      ? {
          digest: cursorDigest,
          indicies: cursorIndicies,
        }
      : undefined;

  if (stream) {
    // PERF: should use the queryForSingle optimization in here too

    // When streaming we can't reverse order in JS - we must do it in the DB.
    if (stream.initialCount > 0) {
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
        limit: stream.initialCount,
        options: { placeholderValues },
      });
      const {
        text: textForDeclare,
        rawSqlValues: rawSqlValuesForDeclare,
        identifierIndex: streamIdentifierIndex,
      } = makeQuery({
        offset: stream.initialCount,
        options: { placeholderValues },
      });
      if (initialFetchIdentifierIndex !== streamIdentifierIndex) {
        throw new Error(
          `GrafastInternalError<3760b02e-dfd0-4924-bf62-2e0ef9399605>: expected identifier indexes to match`,
        );
      }
      const identifierIndex = initialFetchIdentifierIndex;
      return {
        meta,
        text,
        rawSqlValues,
        textForDeclare,
        rawSqlValuesForDeclare,
        identifierIndex,
        shouldReverseOrder: false,
        streamInitialCount: stream.initialCount,
        queryValues,
        first,
        last,
        cursorDetails,
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
          placeholderValues,
        },
      });
      return {
        meta,
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
        queryValues,
        first,
        last,
        cursorDetails,
      };
    }
  } else {
    const { text, rawSqlValues, identifierIndex } = makeQuery({
      options: {
        placeholderValues,
      },
    });
    return {
      meta,
      text,
      rawSqlValues,
      identifierIndex,
      shouldReverseOrder,
      name: hash(text),
      queryValues,
      first,
      last,
      cursorDetails,
    };
  }
}

function applyConditionFromCursor<
  TResource extends PgResource<any, any, any, any, any>,
>(
  info: MutablePgSelectQueryInfo<TResource>,
  beforeOrAfter: "before" | "after",
  parsedCursor: Maybe<any[]>,
): void {
  if (parsedCursor == null) return;
  const { orders, isOrderUnique, alias, resource, cursorDigest } = info;
  if (cursorDigest == null) {
    throw new Error(`Cursor passed, but could not determine order digest.`);
  }
  const orderCount = orders.length;

  // Cursor validity check
  validateParsedCursor(parsedCursor, cursorDigest, orderCount, beforeOrAfter);

  if (orderCount === 0) {
    // Natural pagination `['natural', N]`
    const n = parsedCursor[1];
    if (beforeOrAfter === "after") {
      info.cursorLower = n;
    } else {
      info.cursorUpper = n;
    }
    return;
  }
  if (!isOrderUnique) {
    // ENHANCEMENT: make this smarter
    throw new SafeError(
      `Can only use '${beforeOrAfter}' cursor when there is a unique defined order.`,
    );
  }

  const condition = (i = 0): SQL => {
    const order = orders[i];
    const [orderFragment, orderCodec, nullable] = getFragmentAndCodecFromOrder(
      alias,
      order,
      resource.codec,
    );
    const { nulls, direction } = order;
    const sqlValue = sql`${sql.value(parsedCursor[i + 1])}::${
      orderCodec.sqlType
    }`;

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
  info.conditions.push(finalCondition);
}

/**
 * So we can quickly detect if cursors are invalid we use this digest,
 * passing this check does not mean that the cursor is valid but it at least
 * catches common user errors.
 */
function getOrderByDigest<
  TResource extends PgResource<any, any, any, any, any>,
>(info: MutablePgSelectQueryInfo<TResource>) {
  const {
    placeholders,
    deferreds,
    alias,
    resource,
    fixedPlaceholderValues,
    orders,
  } = info;
  if (orders.length === 0) {
    return "natural";
  }
  // The security of this hash is unimportant; the main aim is to protect the
  // user from themself. If they bypass this, that's their problem (it will
  // not introduce a security issue).
  const hash = createHash("sha256");
  hash.update(
    JSON.stringify(
      orders.map((o) => {
        const [frag] = getFragmentAndCodecFromOrder(alias, o, resource.codec);
        const placeholderValues = new Map<symbol, SQL>(fixedPlaceholderValues);
        for (let i = 0; i < placeholders.length; i++) {
          const { symbol } = placeholders[i];
          placeholderValues.set(symbol, sql.identifier(`PLACEHOLDER_${i}`));
        }
        for (let i = 0; i < deferreds.length; i++) {
          const { symbol } = deferreds[i];
          placeholderValues.set(symbol, sql.identifier(`DEFERRED_${i}`));
        }
        return sql.compile(frag, { placeholderValues }).text;
      }),
    ),
  );
  const digest = hash.digest("hex").slice(0, 10);
  return digest;
}

function buildQuery<TResource extends PgResource<any, any, any, any, any>>(
  info: MutablePgSelectQueryInfo<TResource>,
  options: {
    asJsonAgg?: boolean;
    withIdentifiers?: boolean;
    extraSelects?: SQL[];
    extraWheres?: SQL[];
    forceOrder?: boolean;
  } = Object.create(null),
): {
  sql: SQL;
  extraSelectIndexes: number[];
} {
  const { alias, resource, selects: baseSelects, _symbolSubstitutes } = info;
  function buildSelect(
    options: {
      extraSelects?: readonly SQL[];
    } = Object.create(null),
  ) {
    const { extraSelects = EMPTY_ARRAY } = options;
    const selects = [...baseSelects, ...extraSelects];
    const l = baseSelects.length;
    const extraSelectIndexes = extraSelects.map((_, i) => i + l);

    const fragmentsWithAliases = selects.map(
      (frag, idx) => sql`${frag} as ${sql.identifier(String(idx))}`,
    );

    const sqlAliases: SQL[] = [];
    for (const [a, b] of _symbolSubstitutes.entries()) {
      sqlAliases.push(sql.symbolAlias(a, b));
    }
    const aliases = sql.join(sqlAliases, "");

    const selection =
      fragmentsWithAliases.length > 0
        ? sql`\n${sql.indent(sql.join(fragmentsWithAliases, ",\n"))}`
        : sql` /* NOTHING?! */`;

    return { sql: sql`${aliases}select${selection}`, extraSelectIndexes };
  }

  function buildFrom() {
    const fromSql =
      typeof info.from === "function"
        ? info.from(...info.arguments)
        : info.from;
    return {
      sql: sql`\nfrom ${fromSql} as ${alias}${
        resource.codec.attributes ? sql.blank : sql`(v)`
      }`,
    };
  }

  function buildJoin() {
    const joins: SQL[] = info.joins.map((j) => {
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

  function buildWhereOrHaving(
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

  function buildGroupBy() {
    const groups = info.groups;
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

  // NOTE: according to the EdgesToReturn algorithm in the GraphQL Cursor
  // Connections Specification first is applied first, then last is applied.
  // For us this means that if first is present we set the limit to this and
  // then we do the last artificially later.
  // https://relay.dev/graphql/connections.htm#EdgesToReturn()

  const [limitAndOffsetSQL] = calculateLimitAndOffsetSQLFromInfo(info);

  function buildLimitAndOffset() {
    return {
      sql: limitAndOffsetSQL,
    };
  }

  const { sql: select, extraSelectIndexes } = buildSelect(options);
  const { sql: from } = buildFrom();
  const { sql: join } = buildJoin();
  const { sql: where } = buildWhereOrHaving(
    sql`where`,
    info.conditions,
    options,
  );
  const { sql: groupBy } = buildGroupBy();
  const { sql: having } = buildWhereOrHaving(
    sql`having`,
    info.havingConditions,
  );
  const { sql: orderBy } = buildOrderBy(
    info,
    options.forceOrder ? false : info.shouldReverseOrder,
  );
  const { sql: limitAndOffset } = buildLimitAndOffset();

  const baseQuery = sql`${select}${from}${join}${where}${groupBy}${having}${orderBy}${limitAndOffset}`;
  const query = options.asJsonAgg
    ? // 's' for 'subquery'
      sql`select json_agg(s) from (${sql.indent(baseQuery)}) s`
    : baseQuery;

  return { sql: query, extraSelectIndexes };
}

function buildOrderBy<TResource extends PgResource<any, any, any, any, any>>(
  info: MutablePgSelectQueryInfo<TResource>,
  reverse: boolean,
) {
  const {
    orders,
    alias,
    resource: { codec },
  } = info;
  return {
    sql: calculateOrderBySQL({
      reverse,
      orders,
      alias,
      codec,
    }),
  };
}

export interface PgSelectQueryBuilder<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends PgQueryBuilder {
  /** Instruct to add another order */
  orderBy(spec: PgOrderSpec): void;
  /** Inform that the resulting order is now unique */
  setOrderIsUnique(): void;
  /** Returns the SQL alias representing the table related to this relation */
  singleRelation<
    TRelationName extends keyof GetPgResourceRelations<TResource> & string,
  >(
    relationIdentifier: TRelationName,
  ): SQL;
  where(
    condition: PgWhereConditionSpec<
      keyof GetPgResourceAttributes<TResource> & string
    >,
  ): void;
  whereBuilder(): PgCondition<this>;
  having(
    condition: PgHavingConditionSpec<
      keyof GetPgResourceAttributes<TResource> & string
    >,
  ): void;
  havingBuilder(): PgCondition<this>;
}
