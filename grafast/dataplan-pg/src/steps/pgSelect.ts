import { createHash } from "crypto";
import debugFactory from "debug";
import type {
  ConnectionOptimizedStep,
  ConnectionStep,
  ExecutionDetails,
  GrafastResultsList,
  LambdaStep,
  Maybe,
  PromiseOrDirect,
  StepOptimizeOptions,
  UnbatchedExecutionExtra,
} from "grafast";
import {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __ItemStep,
  __TrackedValueStep,
  access,
  arrayOfLength,
  ConstantStep,
  DEFAULT_ACCEPT_FLAGS,
  exportAs,
  first,
  isAsyncIterable,
  isDev,
  isPromiseLike,
  lambda,
  reverseArray,
  SafeError,
  Step,
  stepAMayDependOnStepB,
  stepAShouldTryAndInlineIntoStepB,
  UnbatchedStep,
} from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql, { $$symbolToIdentifier, $$toSQL, arraysMatch } from "pg-sql2";

import type { PgCodecAttributes } from "../codecs.js";
import { listOfCodec, sqlValueWithCodec, TYPES } from "../codecs.js";
import type {
  PgResource,
  PgResourceParameter,
  PgResourceUnique,
} from "../datasource.js";
import type { PgExecutorContextPlans, PgExecutorInput } from "../executor.js";
import type {
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRelations,
  PgCodec,
  PgCodecRelation,
  PgGroupSpec,
  PgOrderSpec,
  PgQueryBuilder,
  PgSelectQueryBuilderCallback,
  PgSQLCallbackOrDirect,
  PgTypedStep,
  ReadonlyArrayOrDirect,
} from "../interfaces.js";
import { parseArray } from "../parseArray.js";
import { PgLocker } from "../pgLocker.js";
import { PgClassExpressionStep } from "./pgClassExpression.js";
import type {
  PgHavingConditionSpec,
  PgWhereConditionSpec,
} from "./pgCondition.js";
import { PgCondition } from "./pgCondition.js";
import type { PgCursorDetails } from "./pgCursor.js";
import { PgCursorStep } from "./pgCursor.js";
import type { PgSelectSinglePlanOptions } from "./pgSelectSingle.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";
import type {
  MutablePgStmtCommonQueryInfo,
  PgStmtCommonQueryInfo,
  PgStmtCompileQueryInfo,
  PgStmtDeferredPlaceholder,
  PgStmtDeferredSQL,
  ResolvedPgStmtCommonQueryInfo,
} from "./pgStmt.js";
import {
  applyCommonPaginationStuff,
  calculateLimitAndOffsetSQLFromInfo,
  getUnary,
  makeValues,
  PgStmtBaseStep,
} from "./pgStmt.js";
import { validateParsedCursor } from "./pgValidateParsedCursor.js";

const ALWAYS_ALLOWED = true;

export type PgSelectParsedCursorStep = Step<null | readonly any[]>;

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
  hasMore: false,
  items: [],
  cursorDetails: undefined,
  groupDetails: undefined,
  m: Object.create(null),
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
      step: Step;
      codec: PgCodec;
      matches: (alias: SQL) => SQL;
    }
  | {
      step: PgTypedStep<any>;
      codec?: PgCodec;
      matches: (alias: SQL) => SQL;
    };

export type PgSelectArgumentSpec =
  | {
      step: Step;
      pgCodec: PgCodec<any, any, any, any>;
      name?: string;
    }
  | {
      step: PgTypedStep<any>;
      pgCodec?: never;
      name?: string;
    };

export interface PgSelectArgumentDigest {
  position?: number;
  name?: string;
  placeholder: SQL;
  step?: never;
}

interface PgSelectArgumentBasics {
  position?: number;
  name?: string;
}
interface PgSelectArgumentPlaceholder extends PgSelectArgumentBasics {
  placeholder: SQL;
  step?: never;
  depId?: never;
}
interface PgSelectArgumentUnaryStep extends PgSelectArgumentBasics {
  placeholder?: never;
  step: Step;
}
interface PgSelectArgumentDepId extends PgSelectArgumentBasics {
  placeholder?: never;
  depId: number;
}
export interface PgSelectArgumentRuntimeValue extends PgSelectArgumentBasics {
  placeholder?: never;
  value: unknown;
}

interface QueryValue {
  dependencyIndex: number;
  codec: PgCodec;
  alreadyEncoded: boolean;
}

function assertSensible(step: Step): void {
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

/**
 * Something that's placeholder/deferredSQL capable; typically a PgSelectStep
 * but not guaranteed.
 */
export type PgRootStep = Step & {
  placeholder(step: Step, codec: PgCodec): SQL;
  deferredSQL($step: Step<SQL>): SQL;
};

export type PgSelectFromOption =
  | SQL
  | { callback: ($select: PgRootStep) => SQL }
  | ((...args: PgSelectArgumentDigest[]) => SQL);

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

  parameters?: readonly PgResourceParameter[];

  /**
   * If your `from` (or resource.from if omitted) is a function, the arguments
   * to pass to the function.
   */
  args?: ReadonlyArray<PgSelectArgumentSpec>;

  /**
   * If you want to build the data in a custom way (e.g. calling a function,
   * selecting from a view, building a complex query, etc) then you can
   * override the `resource.from` here with your own from code. Defaults to
   * `resource.from`.
   */
  from?: PgSelectFromOption;
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
  context?: Step<PgExecutorContextPlans<any>>;
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
  groupDetails: PgGroupDetails | undefined;
}

interface PgSelectStepResult {
  hasMore: boolean;
  /** a tuple based on what is selected at runtime */
  items: ReadonlyArray<unknown[]> | AsyncIterable<unknown[]>;
  cursorDetails: PgCursorDetails | undefined;
  groupDetails: PgGroupDetails | undefined;
  m: Record<string, unknown>;
}

export interface PgGroupDetails {
  readonly indicies: ReadonlyArray<{
    index: number;
    codec: PgCodec;
  }>;
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
    ConnectionOptimizedStep<
      any,
      PgSelectSingleStep<TResource> | PgClassExpressionStep<any, TResource>,
      PgSelectSingleStep<TResource> | PgClassExpressionStep<any, TResource>,
      null | readonly any[]
    >,
    /**
     * @internal PgSelectStep might not always implement PgSelectQueryBuilder;
     * we only use it for internal optimizations (specifically around
     * `.apply(...)`).
     */
    PgSelectQueryBuilder
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectStep",
  };

  isSyncAndSafe = false;

  // FROM
  private readonly from: SQL;
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
   * Set this true if your query includes any `VOLATILE` function (including
   * seemingly innocuous things such as `random()`) otherwise we might only
   * call the relevant function once and re-use the result.
   */
  public forceIdentity: boolean;

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

  private _meta: Record<string, any> = Object.create(null);

  /**
   * Hints that **ARE NOT COMPARED FOR DEDUPLICATE** and so can be thrown away
   * completely. Write stuff here at your own risk.
   *
   * @internal
   * @experimental
   */
  public hints: {
    isPgSelectFromRecordOf?: {
      parentId: number;
      expression: SQL;
    };
  } = Object.create(null);

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
      parameters = resource.parameters,
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

    this.contextId = this.addUnaryDependency(
      inContext ?? resource.executor.context(),
    );

    this.name = name ?? resource.name;
    this.symbol = _internalCloneSymbol ?? Symbol(this.name);
    this.alias = _internalCloneAlias ?? sql.identifier(this.symbol);
    this.hasImplicitOrder = inHasImplicitOrder ?? resource.hasImplicitOrder;
    this.joinAsLateral = inJoinAsLateral ?? !!this.resource.parameters;
    this.forceIdentity = inForceIdentity;

    {
      if (!identifiers) {
        throw new Error("Invalid construction of PgSelectStep");
      }
      identifiers.forEach((identifier) => {
        if (isDev) {
          assertSensible(identifier.step);
        }
        const { step, matches } = identifier;
        const codec =
          identifier.codec || (identifier.step as PgTypedStep<any>).pgCodec;
        const expression = matches(this.alias);
        const placeholder = this.placeholder(step, codec);
        this.where(sql`${expression} = ${placeholder}`);
      });

      const ourFrom = inFrom ?? resource.from;
      this.from = pgFromExpression(this, ourFrom, parameters, inArgs);
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
    $connection: ConnectionStep<any, any, any, any, any>,
    mode?: PgSelectMode,
  ): PgSelectStep<TResource> {
    const $plan = this.clone(mode);
    // In case any errors are raised
    $plan.connectionDepId = $plan.addStrongDependency($connection);
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
    $step: Step<ReadonlyArrayOrDirect<Maybe<PgSelectQueryBuilderCallback>>>,
  ) {
    if ($step instanceof ConstantStep) {
      ($step.data as PgSelectQueryBuilderCallback)(this);
    } else {
      this.applyDepIds.push(this.addUnaryDependency($step));
    }
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

  private getCursorDetails(): Step<PgCursorDetails> {
    this.needsCursor = true;
    return access(this, "cursorDetails");
  }

  /**
   * When selecting a connection we need to be able to get the cursor. The
   * cursor is built from the values of the `ORDER BY` clause so that we can
   * find nodes before/after it.
   */
  public cursorPlan(
    $row: PgSelectSingleStep<TResource>,
  ): PgCursorStep<PgSelectSingleStep<TResource>> {
    return new PgCursorStep<PgSelectSingleStep<TResource>>(
      $row,
      this.getCursorDetails(),
    );
  }

  private needsGroups = false;
  public getGroupDetails(): Step<PgGroupDetails> {
    this.needsGroups = true;
    return access(this, "groupDetails");
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
      groupDetails,
    } = buildTheQuery({
      executionDetails,

      // Stuff directly referencing dependency IDs
      firstStepId: this.firstStepId,
      lastStepId: this.lastStepId,
      offsetStepId: this.offsetStepId,
      afterStepId: this.afterStepId,
      beforeStepId: this.beforeStepId,
      applyDepIds: this.applyDepIds,

      // Stuff referencing dependency IDs in a nested fashion
      placeholders: this.placeholders,
      deferreds: this.deferreds,

      // Fixed stuff that is local to us (aka "StaticInfo")
      ...PgSelectStep.getStaticInfo(this),
    });
    if (first === 0 || last === 0) {
      return arrayOfLength(count, NO_ROWS);
    }
    const context = values[this.contextId].unaryValue();

    if (stream == null) {
      const specs = indexMap<PgExecutorInput<any>>((i) => {
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
        return createSelectResult(allVals, {
          first,
          last,
          fetchOneExtra: this.fetchOneExtra,
          shouldReverseOrder,
          meta,
          cursorDetails,
          groupDetails,
        });
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
            hasMore: false,
            items: iterable,
            cursorDetails,
            groupDetails,
            m: meta,
          };
        }

        // Munge the initialCount records into the streams
        const innerIterator = iterable[Symbol.asyncIterator]();

        let i = 0;
        let done = false;
        const l = initialFetchResult[idx].length;
        const mergedGenerator: AsyncGenerator<PromiseOrDirect<unknown[]>> = {
          async [Symbol.asyncDispose]() {
            await this.return(undefined);
          },
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
          hasMore: false,
          items: mergedGenerator,
          cursorDetails,
          groupDetails,
          m: meta,
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

      // Check DEFERREDs match
      if (
        !arraysMatch(this.deferreds, p.deferreds, (a, b) => {
          const equivalent = a.dependencyIndex === b.dependencyIndex;
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
          "Refusing to deduplicate %c with %c because the deferreds don't match",
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

      // Check FROM
      if (!sqlIsEquivalent(p.from, this.from)) {
        return false;
      }

      // Check SELECT matches
      if (!arraysMatch(this.selects, p.selects, sqlIsEquivalent)) {
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

  private getParentForInlining(): {
    $pgSelect: PgSelectStep<PgResource>;
    $pgSelectSingle: PgSelectSingleStep<PgResource>;
  } | null {
    /**
     * These are the dependencies that are not PgClassExpressionSteps, we just
     * need them to be at a higher level than $pgSelect
     */
    const otherDeps: Step[] = [];

    /**
     * This is the PgSelectStep that we would like to try and inline ourself
     * into. If `undefined`, this hasn't been found yet. If `null`, this has
     * been explicitly forbidden due to a mismatch of some kind.
     */
    let $pgSelect: PgSelectStep<PgResource> | null | undefined = undefined;

    /**
     * This is the pgSelectSingle representing a single record from $pgSelect,
     * it's used when remapping of keys is required after inlining ourself into
     * $pgSelect.
     */
    let $pgSelectSingle: PgSelectSingleStep<PgResource> | undefined = undefined;

    // Scan through the dependencies to find a suitable ancestor step to merge with
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
      const depOptions = this.getDepOptions(dependencyIndex);
      let $dep = depOptions.step;
      if (
        depOptions.acceptFlags !== DEFAULT_ACCEPT_FLAGS ||
        depOptions.onReject != null
      ) {
        console.info(
          `Forbidding inlining of ${$pgSelect} due to dependency ${dependencyIndex}/${$dep} having custom flags`,
        );
        // Forbid inlining
        return null;
      }
      if ($dep instanceof PgFromExpressionStep) {
        const digest0 = $dep.getDigest(0);
        if (digest0?.step && digest0.step instanceof PgClassExpressionStep) {
          $dep = digest0.step;
        }
      }
      if ($dep instanceof PgClassExpressionStep) {
        const $depPgSelectSingle = $dep.getParentStep();
        if (!($depPgSelectSingle instanceof PgSelectSingleStep)) {
          continue;
        }
        const $depPgSelect = $depPgSelectSingle.getClassStep();
        if ($depPgSelect === this) {
          throw new Error(
            `Recursion error - record plan ${$dep} is dependent on ${$depPgSelect}, and ${this} is dependent on ${$dep}`,
          );
        }

        if ($depPgSelect.hasSideEffects) {
          // It's a mutation; don't merge
          continue;
        }

        // Don't allow merging across a stream/defer/subscription boundary
        if (!stepAShouldTryAndInlineIntoStepB(this, $depPgSelect)) {
          continue;
        }

        // Don't want to make this a join as it can result in the order being
        // messed up
        if (
          $depPgSelect.hasImplicitOrder &&
          !this.joinAsLateral &&
          this.isUnique
        ) {
          continue;
        }

        /*
          if (!planGroupsOverlap(this, t2)) {
            // We're not in the same group (i.e. there's probably a @defer or
            // @stream between us) - do not merge.
            continue;
          }
          */

        if ($pgSelect === undefined && $pgSelectSingle === undefined) {
          $pgSelectSingle = $depPgSelectSingle;
          $pgSelect = $depPgSelect;
        } else if ($depPgSelect !== $pgSelect) {
          debugPlanVerbose(
            "Refusing to optimise %c due to dependency %c depending on different class (%c != %c)",
            this,
            $dep,
            $depPgSelect,
            $pgSelect,
          );
          $pgSelect = null;
          break;
        } else if ($depPgSelectSingle !== $pgSelectSingle) {
          debugPlanVerbose(
            "Refusing to optimise %c due to parent dependency mismatch: %c != %c",
            this,
            $depPgSelectSingle,
            $pgSelectSingle,
          );
          $pgSelect = null;
          break;
        }
      } else {
        otherDeps.push($dep);
      }
    }

    // Check the contexts are the same
    if ($pgSelect != null && $pgSelectSingle != null) {
      const myContext = this.getDep(this.contextId);
      const tsContext = $pgSelect.getDep($pgSelect.contextId);
      if (myContext !== tsContext) {
        debugPlanVerbose(
          "Refusing to optimise %c due to own context dependency %c differing from tables context dependency %c (%c, %c)",
          this,
          myContext,
          tsContext,
          $pgSelect.dependencies[$pgSelect.contextId],
          $pgSelect,
        );
        $pgSelect = null;
      }
    }

    // Check the dependencies can be moved across to `t`
    if ($pgSelect != null && $pgSelectSingle != null) {
      for (const dep of otherDeps) {
        if ($pgSelect.canAddDependency(dep)) {
          // All good; just move the dependency over
        } else {
          debugPlanVerbose(
            "Refusing to optimise %c due to dependency %c which cannot be added as a dependency of %c",
            this,
            dep,
            $pgSelect,
          );
          $pgSelect = null;
          break;
        }
      }
    }

    if ($pgSelect != null && $pgSelectSingle != null) {
      // Looks feasible.
      if ($pgSelect.id === this.id) {
        throw new Error(
          `Something's gone catastrophically wrong - ${this} is trying to merge with itself!`,
        );
      }
      return { $pgSelect, $pgSelectSingle };
    } else {
      return null;
    }
  }

  private mergeSelectsWith(otherPlan: PgSelectStep<PgResource>): {
    [desiredIndex: string]: string;
  } {
    const actualKeyByDesiredKey = Object.create(null);
    this.selects.forEach((frag, idx) => {
      actualKeyByDesiredKey[idx] = otherPlan.selectAndReturnIndex(frag);
    });
    return actualKeyByDesiredKey;
  }

  /**
   * - Merge placeholders
   * - Merge fixedPlaceholders
   * - Merge deferreds
   * - Merge _symbolSubstitutes
   */
  private mergePlaceholdersInto<TOtherStep extends PgSelectStep<PgResource>>(
    $target: TOtherStep,
  ): void {
    for (const placeholder of this.placeholders) {
      const { dependencyIndex, symbol, codec, alreadyEncoded } = placeholder;
      const depOptions = this.getDepOptions(dependencyIndex);
      const $dep = depOptions.step;
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
      if (stepAMayDependOnStepB($target, $dep)) {
        // Either dep is a static input plan (which isn't dependent on anything
        // else) or otherPlan is deeper than dep; either way we can use the dep
        // directly within otherPlan.
        const newPlanIndex = $target.addStrongDependency(depOptions);
        $target.placeholders.push({
          dependencyIndex: newPlanIndex,
          codec,
          symbol,
          alreadyEncoded,
        });
      } else if ($dep instanceof PgClassExpressionStep) {
        // Replace with a reference.
        $target.fixedPlaceholderValues.set(placeholder.symbol, $dep.toSQL());
      } else {
        throw new Error(
          `Could not merge placeholder from unsupported plan type: ${$dep}`,
        );
      }
    }
    for (const [
      sqlPlaceholder,
      placeholderValue,
    ] of this.fixedPlaceholderValues.entries()) {
      if (
        $target.fixedPlaceholderValues.has(sqlPlaceholder) &&
        $target.fixedPlaceholderValues.get(sqlPlaceholder) !== placeholderValue
      ) {
        throw new Error(
          `${$target} already has an identical placeholder with a different value when trying to mergePlaceholdersInto it from ${this}`,
        );
      }
      $target.fixedPlaceholderValues.set(sqlPlaceholder, placeholderValue);
    }

    for (const { symbol, dependencyIndex } of this.deferreds) {
      const depOptions = this.getDepOptions(dependencyIndex);
      const $dep = depOptions.step;
      if (stepAMayDependOnStepB($target, $dep)) {
        const newPlanIndex = $target.addStrongDependency(depOptions);
        $target.deferreds.push({
          dependencyIndex: newPlanIndex,
          symbol,
        });
      } else if ($dep instanceof PgFromExpressionStep) {
        const $newDep = $target.withLayerPlan(() => $dep.inlineInto($target));
        const newPlanIndex = $target.addStrongDependency($newDep);
        $target.deferreds.push({
          dependencyIndex: newPlanIndex,
          symbol,
        });
      } else {
        throw new Error(
          `Could not merge placeholder from unsupported plan type: ${$dep}`,
        );
      }
    }

    for (const [a, b] of this._symbolSubstitutes.entries()) {
      if (isDev) {
        if (
          $target._symbolSubstitutes.has(a) &&
          $target._symbolSubstitutes.get(a) !== b
        ) {
          throw new Error(
            `Conflict when setting a substitute whilst merging ${this} into ${$target}; symbol already has a substitute, and it's different.`,
          );
        }
      }
      $target._symbolSubstitutes.set(a, b);
    }
  }

  optimize({ stream }: StepOptimizeOptions): Step {
    // In case we have any lock actions in future:
    this.lock();

    // Inline ourself into our parent if we can.
    let parentDetails: ReturnType<typeof this.getParentForInlining>;
    if (
      !this.isInliningForbidden &&
      !this.hasSideEffects &&
      !stream &&
      !this.joins.some((j) => j.type !== "left") &&
      (parentDetails = this.getParentForInlining()) !== null &&
      parentDetails.$pgSelect.mode === "normal"
    ) {
      const { $pgSelect, $pgSelectSingle } = parentDetails;
      if (
        this.mode === "normal" &&
        this.isUnique &&
        this.firstStepId == null &&
        this.lastStepId == null &&
        this.offsetStepId == null &&
        // For uniques these should all pass anyway, but pays to be cautious..
        this.groups.length === 0 &&
        this.havingConditions.length === 0 &&
        this.orders.length === 0 &&
        !this.fetchOneExtra
      ) {
        // Allow, do it via left join
        debugPlanVerbose(
          "Merging %c into %c (via %c)",
          this,
          $pgSelect,
          $pgSelectSingle,
        );
        const recordOf = this.hints.isPgSelectFromRecordOf;
        // TODO: the logic around this should move inside PgSelectInlineApplyStep instead.
        let skipJoin = false;
        if (
          typeof this.symbol === "symbol" &&
          recordOf &&
          recordOf.parentId === $pgSelect.id
        ) {
          const symbol = sql.getIdentifierSymbol(recordOf.expression);
          if (symbol) {
            if (sql.isEquivalent($pgSelect.alias, recordOf.expression)) {
              skipJoin = true;
              $pgSelect._symbolSubstitutes.set(this.symbol, symbol);
            } else {
              const j = $pgSelect.joins.find((j) =>
                sql.isEquivalent(j.alias, recordOf.expression),
              );
              if (j) {
                const jSymbol = sql.getIdentifierSymbol(j.alias);
                if (jSymbol) {
                  skipJoin = true;
                  $pgSelect._symbolSubstitutes.set(jSymbol, symbol);
                }
              }
            }
          }
        }
        this.mergePlaceholdersInto($pgSelect);
        const identifier = `joinDetailsFor${this.id}`;
        $pgSelect.withLayerPlan(() => {
          $pgSelect.apply(
            new PgSelectInlineApplyStep(identifier, false, {
              staticInfo: PgSelectStep.getStaticInfo(this),
              $first: this.maybeGetDep(this.firstStepId),
              $last: this.maybeGetDep(this.lastStepId),
              $offset: this.maybeGetDep(this.offsetStepId),
              $after: this.maybeGetDep(this.afterStepId),
              $before: this.maybeGetDep(this.beforeStepId),
              applySteps: this.applyDepIds.map((depId) => this.getDep(depId)),
              skipJoin,
            }),
          );
        });
        const $details = $pgSelect.getMeta(
          identifier,
        ) as Step<PgSelectInlineViaJoinDetails>;
        return lambda(
          [$details, $pgSelectSingle],
          pgInlineViaJoinTransform,
          true,
        );
      } else {
        /*
        // TODO: this isn't really accurate plus it's expensive to calculate; fix it properly!
        // An approximation of "belongs to" is: we're referencing a unique combination of columns on the parent.
        const relationshipIsBelongsTo = $pgSelect.resource.uniques.some((u) =>
          u.attributes.every((remoteColumn) => {
            const remoteColumnExpression = sql`${
              $pgSelect.alias
            }.${sql.identifier(String(remoteColumn))}`;
            return identifierMatchesExpressions.some((e) =>
              sql.isEquivalent(e, remoteColumnExpression),
            );
          }),
        );
        */
        const relationshipIsBelongsTo = true;
        const allowed =
          ALWAYS_ALLOWED ||
          $pgSelectSingle.getAndFreezeIsUnary() ||
          (!$pgSelect.isUnique && relationshipIsBelongsTo);
        if (allowed) {
          // Add a nested select expression
          const $__item = $pgSelectSingle.getItemStep();
          this.mergePlaceholdersInto($pgSelect);
          const identifier = `subqueryDetailsFor${this.id}`;
          $pgSelect.withLayerPlan(() => {
            $pgSelect.apply(
              new PgSelectInlineApplyStep(identifier, true, {
                staticInfo: PgSelectStep.getStaticInfo(this),
                $first: this.maybeGetDep(this.firstStepId),
                $last: this.maybeGetDep(this.lastStepId),
                $offset: this.maybeGetDep(this.offsetStepId),
                $after: this.maybeGetDep(this.afterStepId),
                $before: this.maybeGetDep(this.beforeStepId),
                applySteps: this.applyDepIds.map((depId) => this.getDep(depId)),
              }),
            );
          });
          const $details = $pgSelect.getMeta(
            identifier,
          ) as Step<PgSelectInlineViaSubqueryDetails>;

          return lambda(
            [$details, $__item],
            pgInlineViaSubqueryTransform,
            true,
          );
        }
      }
    }

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
      const $connection = this.getDep<ConnectionStep<any, any, any, any, any>>(
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

  row($row: Step, options?: PgSelectSinglePlanOptions) {
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
    itemPlan: Step,
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
  whereBuilder() {
    return new PgCondition(this);
  }
  havingBuilder() {
    return new PgCondition(this, true);
  }
  setMeta(key: string, value: unknown): void {
    this._meta[key] = value;
  }
  getMetaRaw(key: string): unknown {
    return this._meta[key];
  }

  static getStaticInfo<TResource extends PgResource<any, any, any, any, any>>(
    $source: PgSelectStep<TResource>,
  ): StaticInfo<TResource> {
    return {
      sourceStepDescription: `PgSelectStep[${$source.id}]`,
      forceIdentity: $source.forceIdentity,
      havingConditions: $source.havingConditions,
      mode: $source.mode,
      hasSideEffects: $source.hasSideEffects,
      name: $source.name,
      alias: $source.alias,
      symbol: $source.symbol,
      resource: $source.resource,
      groups: $source.groups,
      orders: $source.orders,
      selects: $source.selects,
      fetchOneExtra: $source.fetchOneExtra,
      isOrderUnique: $source.isOrderUnique,
      isUnique: $source.isUnique,
      conditions: $source.conditions,
      from: $source.from,
      joins: $source.joins,
      needsCursor: $source.needsCursor,
      needsGroups: $source.needsGroups,
      relationJoins: $source.relationJoins,
      meta: $source._meta,
      placeholderSymbols: $source.placeholders.map((p) => p.symbol),
      deferredSymbols: $source.deferreds.map((p) => p.symbol),
      fixedPlaceholderValues: $source.fixedPlaceholderValues,
      _symbolSubstitutes: $source._symbolSubstitutes,
      joinAsLateral: $source.joinAsLateral,
    };
  }
}

export class PgSelectRowsStep<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends Step {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectRowsStep",
  };

  public isSyncAndSafe = false;

  constructor($pgSelect: PgSelectStep<TResource>) {
    super();
    this.addStrongDependency($pgSelect);
  }

  public getClassStep(): PgSelectStep<TResource> {
    return this.getDepOptions<PgSelectStep<TResource>>(0).step;
  }

  listItem(itemPlan: Step) {
    return this.getClassStep().listItem(itemPlan);
  }

  public deduplicate(_peers: readonly Step[]) {
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
  // Never re-order aggregates
  if (info.mode === "aggregate") return;
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
    | Step<readonly any[]>,
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

// Previously: digestsFromArgumentSpecs; now combined
export function pgFromExpression(
  $target: { getPgRoot(): PgRootStep },
  baseFrom: PgSelectFromOption,
  inParameters: readonly PgResourceParameter[] | undefined = undefined,
  specs: ReadonlyArray<PgSelectArgumentSpec | PgSelectArgumentDigest> = [],
): SQL {
  if (typeof baseFrom !== "function") {
    if (sql.isSQL(baseFrom)) {
      return baseFrom;
    } else {
      return baseFrom.callback($target.getPgRoot());
    }
  }
  if (specs.length === 0) {
    return baseFrom();
  }
  if (
    specs.every(
      (spec): spec is PgSelectArgumentDigest =>
        "placeholder" in spec && spec.placeholder != null,
    )
  ) {
    return baseFrom(...specs);
  }
  const $placeholderable = $target.getPgRoot();
  let parameters: readonly PgResourceParameter[];
  if (!inParameters) {
    const params = [];
    for (const spec of specs) {
      if (spec.step) {
        if (spec.pgCodec) {
          params.push({
            name: spec.name ?? null,
            codec: spec.pgCodec,
            required: false,
          });
        } else {
          params.push({
            name: spec.name ?? null,
            codec: spec.step.pgCodec,
            required: false,
          });
        }
      } else {
        throw new Error(
          `Cannot use placeholder steps without passing accurate placeholders`,
        );
      }
    }
    parameters = params;
  } else {
    parameters = inParameters;
  }
  if (specs.length > parameters.length) {
    throw new Error(
      `Attempted to build function-like from expression for ${$placeholderable}, but insufficient parameter definitions (${parameters.length}) were provided for the arguments passed (${specs.length}).`,
    );
  }
  const digests: Array<
    PgSelectArgumentPlaceholder | PgSelectArgumentUnaryStep
  > = [];
  for (const spec of specs) {
    if (spec.step) {
      if (isDev) {
        assertSensible(spec.step);
      }
      const { step, name } = spec;

      const codec = "pgCodec" in spec ? spec.pgCodec : spec.step.pgCodec;
      if (step.getAndFreezeIsUnary()) {
        // It's a unary step; depend on it directly because it allows us to do
        // things like not passing parameters to PostgreSQL functions where
        // those parameters are optional. (Without this, we'd supply `null`
        // to these parameters, which would result in a different behavior.)
        digests.push({
          name,
          step,
        });
      } else {
        const placeholder = $placeholderable.placeholder(step, codec);
        digests.push({
          name,
          placeholder,
        });
      }
    } else {
      digests.push(spec);
    }
  }
  return $placeholderable.withLayerPlan(() =>
    $placeholderable.deferredSQL(
      new PgFromExpressionStep(baseFrom, parameters, digests),
    ),
  );
}

/** @internal */
class PgFromExpressionStep extends UnbatchedStep<SQL> {
  private digests: ReadonlyArray<
    PgSelectArgumentPlaceholder | PgSelectArgumentDepId
  >;
  private parameterAnalysis: ReturnType<typeof generatePgParameterAnalysis>;
  public isSyncAndSafe = true;
  constructor(
    private from: (...args: PgSelectArgumentDigest[]) => SQL,
    private parameters: readonly PgResourceParameter[],
    digests: ReadonlyArray<
      PgSelectArgumentPlaceholder | PgSelectArgumentUnaryStep
    >,
  ) {
    super();
    if (this.getAndFreezeIsUnary() !== true) {
      throw new Error(`PgFromExpressionStep must be unary`);
    }
    this.parameterAnalysis = generatePgParameterAnalysis(this.parameters);
    this.digests = digests.map((digest) => {
      if (digest.step) {
        const { step, ...rest } = digest;
        const depId = this.addStrongDependency(digest.step);
        return { ...rest, depId };
      } else {
        return digest;
      }
    });
  }

  /** @internal */
  getDigest(index: number) {
    const digest = this.digests[index];
    if (!digest) return null;
    if (digest.depId != null) {
      const { depId, ...rest } = digest;
      return {
        ...rest,
        step: this.getDepOptions(depId).step,
      };
    } else {
      return digest;
    }
  }

  /** @internal */
  inlineInto($target: PgSelectStep) {
    return new PgFromExpressionStep(
      this.from,
      this.parameters,
      this.digests.map((d) => {
        if (d.depId != null) {
          const { depId, ...rest } = d;
          const step = this.getDep(depId);
          if (step instanceof PgClassExpressionStep) {
            const $parent = step.getParentStep();
            if ($parent instanceof PgSelectSingleStep) {
              const $pgSelect = $parent.getClassStep();
              if ($pgSelect === $target) {
                const { position, name } = rest;
                return {
                  position,
                  name,
                  placeholder: step.expression,
                };
              }
            }
          }
          return {
            ...rest,
            step,
          };
        } else {
          return d;
        }
      }),
    );
  }

  public deduplicate(
    peers: readonly PgFromExpressionStep[],
  ): readonly PgFromExpressionStep[] {
    return peers.filter((p) => {
      if (p.from !== this.from) {
        return false;
      }
      if (
        !arraysMatch(
          p.parameters,
          this.parameters,
          (a, b) =>
            a.name === b.name &&
            a.codec === b.codec &&
            a.notNull === b.notNull &&
            a.required === b.required &&
            a.extensions === b.extensions,
        )
      ) {
        return false;
      }
      if (
        !arraysMatch(p.digests, this.digests, (a, b) => {
          return (
            a.name === b.name &&
            a.position === b.position &&
            a.depId === b.depId &&
            a.placeholder === b.placeholder
          );
        })
      ) {
        return false;
      }
      return true;
    });
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, ...deps: any[]): SQL {
    const digests = this.digests.map((d) =>
      d.depId != null ? { ...d, value: deps[d.depId] } : d,
    );
    return pgFromExpressionRuntime(
      this.from,
      this.parameters,
      digests,
      this.parameterAnalysis,
    );
  }
}

const $$generationCheck = Symbol("Used parameterAnalysis()");
export function generatePgParameterAnalysis(
  parameters: readonly PgResourceParameter[],
) {
  const parameterByName = Object.create(null) as Record<
    string,
    PgResourceParameter
  >;
  let indexAfterWhichAllArgsAreNamed = 0;
  for (let i = 0, l = parameters.length; i < l; i++) {
    const param = parameters[i];
    if (param.name != null) {
      parameterByName[param.name] = param;
    }
    // Note that `name = ''` counts as having no name.
    if (!param.name) {
      indexAfterWhichAllArgsAreNamed = i + 1;
    }
  }
  return {
    /** DO NOT GENERATE THIS OBJECT YOURSELF! Use generateParameterAnalysis(parameters) */
    [$$generationCheck]: parameters,
    parameterByName,
    indexAfterWhichAllArgsAreNamed,
  };
}

export function pgFromExpressionRuntime(
  from: (...args: PgSelectArgumentDigest[]) => SQL,
  parameters: readonly PgResourceParameter[],
  digests: ReadonlyArray<
    PgSelectArgumentPlaceholder | PgSelectArgumentRuntimeValue
  >,
  parameterAnalysis: ReturnType<
    typeof generatePgParameterAnalysis
  > = generatePgParameterAnalysis(parameters),
) {
  if (!parameterAnalysis[$$generationCheck]) {
    throw new Error(
      `You must not generate the parameter analysis yourself; use generateParameterAnalysis(parameters)`,
    );
  }
  if (parameterAnalysis[$$generationCheck] !== parameters) {
    throw new Error(
      `This parameter analysis was produced for a different set of parameters; perhaps you sliced the array?`,
    );
  }
  const { parameterByName, indexAfterWhichAllArgsAreNamed } = parameterAnalysis;
  /**
   * If true, we can only use named parameters now. Set this if we skip an
   * entry, or if the input has a name that doesn't match the parameter name.
   */
  let namedOnly = false;
  let argIndex = 0;

  const args: PgSelectArgumentDigest[] = [];
  for (
    let digestIndex = 0, digestsCount = digests.length;
    digestIndex < digestsCount;
    digestIndex++
  ) {
    const digest = digests[digestIndex];
    if (
      !namedOnly &&
      // Note that name can be the empty string, we treat that as "no name"
      digest.name &&
      parameters[digestIndex].name !== digest.name
    ) {
      namedOnly = true;
    }
    if (namedOnly && !digest.name) {
      throw new Error(
        `Cannot have unnamed argument after named arguments at index ${digestIndex}`,
      );
    }
    const parameter = namedOnly
      ? parameterByName[digest.name!]
      : parameters[digestIndex];
    if (!parameter) {
      throw new Error(
        `Could not determine parameter for argument at index ${digestIndex}${
          digest.name ? ` (${digest.name})` : ""
        }`,
      );
    }
    let sqlValue: SQL;
    if (digest.placeholder) {
      // It's a placeholder, always use it
      sqlValue = digest.placeholder;
    } else {
      const dep = digest.value;
      if (
        dep === undefined &&
        (namedOnly ||
          (!parameter.required &&
            digestIndex >= indexAfterWhichAllArgsAreNamed - 1))
      ) {
        namedOnly = true;
        continue;
      }
      sqlValue = sqlValueWithCodec(dep ?? null, parameter.codec);
    }
    if (namedOnly) {
      args.push({
        placeholder: sqlValue,
        name: parameter.name!,
      });
    } else {
      args.push({
        placeholder: sqlValue,
        position: argIndex++,
      });
    }
  }
  return from(...args);
}

exportAs("@dataplan/pg", pgFromExpression, "pgFromExpression");

export function getFragmentAndCodecFromOrder(
  alias: SQL,
  order: PgOrderSpec,
  codecOrCodecs: PgCodec | PgCodec[],
): [fragment: SQL, codec: PgCodec, isNullable?: boolean] {
  if (order.attribute != null) {
    const isArray = Array.isArray(codecOrCodecs);
    const col = (isArray ? codecOrCodecs[0] : codecOrCodecs).attributes![
      order.attribute
    ];
    const colVia = col.via;
    const colCodec = col.codec;
    if (isArray) {
      for (const codec of codecOrCodecs) {
        const attr = codec.attributes![order.attribute];
        if (attr.codec !== colCodec || attr.via !== colVia) {
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
    let colFrag: SQL;
    if (colVia) {
      // TODO: consider solving this with a subquery.
      // colFrag = sql`(select ${newAlias}.${sql.identifier(order.attribute)} from ${relatedTable} ${newAlias} where ${joinConditions})`;
      throw new Error(
        `May not order by attribute that has 'via', please use expression instead`,
      );
    } else {
      colFrag = sql`${alias}.${sql.identifier(order.attribute)}`;
    }
    return order.callback
      ? order.callback(colFrag, colCodec, isNullable)
      : [colFrag, colCodec, isNullable];
  } else {
    return [order.fragment, order.codec, order.nullable];
  }
}

function calculateOrderBySQL(params: {
  reverse: boolean;
  orders: ReadonlyArray<PgOrderSpec>;
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
> extends PgStmtCommonQueryInfo,
    PgStmtCompileQueryInfo {
  /** For debugging only */
  readonly sourceStepDescription: string;
  readonly name: string;
  readonly resource: TResource;
  readonly mode: PgSelectMode;
  /** Are we fetching just one record? */
  readonly isUnique: boolean;
  readonly joinAsLateral: boolean;
  /** Is the order that was established at planning time unique? */
  readonly isOrderUnique: boolean;
  readonly fixedPlaceholderValues: ReadonlyMap<symbol, SQL>;
  readonly _symbolSubstitutes: ReadonlyMap<symbol, symbol>;
  readonly needsGroups: boolean;

  readonly selects: ReadonlyArray<SQL>;
  readonly from: SQL;
  readonly joins: ReadonlyArray<PgSelectPlanJoin>;
  readonly conditions: ReadonlyArray<SQL>;
  readonly orders: ReadonlyArray<PgOrderSpec>;
  readonly relationJoins: ReadonlyMap<
    keyof GetPgResourceRelations<TResource>,
    SQL
  >;
  readonly meta: { readonly [key: string]: any };
}

type CoreInfo<TResource extends PgResource<any, any, any, any, any>> = Readonly<
  Omit<PgSelectQueryInfo<TResource>, "placeholders" | "deferreds">
>;

interface MutablePgSelectQueryInfo<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends CoreInfo<TResource>,
    MutablePgStmtCommonQueryInfo {
  readonly selects: Array<SQL>;
  readonly joins: Array<PgSelectPlanJoin>;
  readonly conditions: Array<SQL>;
  readonly orders: Array<PgOrderSpec>;
  readonly groups: Array<PgGroupSpec>;
  readonly havingConditions: Array<SQL>;
  isOrderUnique: boolean;
  readonly relationJoins: Map<keyof GetPgResourceRelations<TResource>, SQL>;
  readonly meta: Record<string, any>;
  readonly groupIndicies: Array<{
    readonly index: number;
    readonly codec: PgCodec;
  }> | null;
}

interface ResolvedPgSelectQueryInfo<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends CoreInfo<TResource>,
    ResolvedPgStmtCommonQueryInfo {
  readonly groups: ReadonlyArray<PgGroupSpec>;
  readonly havingConditions: ReadonlyArray<SQL>;
}

function buildTheQueryCore<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
>(rawInfo: CoreInfo<TResource>) {
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
    meta: { __proto__: null, ...rawInfo.meta },

    // Will be populated by applyConditionFromCursor
    cursorLower: null,
    cursorUpper: null,
    cursorDigest: null,
    cursorIndicies: rawInfo.needsCursor ? [] : null,
    groupIndicies: rawInfo.needsGroups ? [] : null,

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

  const meta = info.meta;
  const queryBuilder: PgSelectQueryBuilder = {
    alias: info.alias,
    [$$toSQL]() {
      return info.alias;
    },
    selectAndReturnIndex,
    join(spec) {
      info.joins.push(spec);
    },
    setMeta(key, value) {
      meta[key] = value;
    },
    getMetaRaw(key) {
      return meta[key];
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
    groupBy(spec) {
      info.groups.push(spec);
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

  if (info.groupIndicies) {
    if (info.groups.length > 0) {
      for (const o of info.groups) {
        const { codec, fragment, guaranteedNotNull = false } = o;
        info.groupIndicies.push({
          index: selectAndReturnIndex(
            codec.castFromPg
              ? codec.castFromPg(fragment, guaranteedNotNull)
              : sql`${fragment}::text`,
          ),
          codec,
        });
      }
    } else {
      // No grouping
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

  return {
    count,
    trueOrderBySQL,
    info,
    stream,
    meta,
  };
}

function buildTheQuery<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
>(rawInfo: Readonly<PgSelectQueryInfo<TResource>>): QueryBuildResult {
  const {
    placeholders,
    deferreds,
    fixedPlaceholderValues,
    _symbolSubstitutes,
  } = rawInfo;
  const { count, trueOrderBySQL, info, stream, meta } =
    buildTheQueryCore(rawInfo);

  const {
    name,
    hasSideEffects,
    forceIdentity,

    first,
    last,
    shouldReverseOrder,
    cursorDigest,
    cursorIndicies,
    groupIndicies,
  } = info;

  const combinedInfo = {
    ...info,
    // Merge things necessary only for query building back in
    placeholders,
    deferreds,
    fixedPlaceholderValues,
    _symbolSubstitutes,
  };

  const {
    queryValues,
    placeholderValues,
    identifiersSymbol,
    identifiersAlias,
  } = makeValues(combinedInfo, name);

  // Handle fixed placeholder values
  for (const [key, value] of fixedPlaceholderValues) {
    placeholderValues.set(key, value);
  }
  const forceOrder = (stream && info.shouldReverseOrder) || false;

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
      const { sql: query } = buildQuery(info, {});
      const { text, values: rawSqlValues } = sql.compile(
        sql`${query};`,
        options,
      );
      return { text, rawSqlValues, identifierIndex: null };
    }
  };

  const cursorDetails: PgCursorDetails | undefined =
    cursorDigest != null && cursorIndicies != null
      ? { digest: cursorDigest, indicies: cursorIndicies }
      : undefined;
  const groupDetails: PgGroupDetails | undefined = groupIndicies
    ? { indicies: groupIndicies }
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
        groupDetails,
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
        groupDetails,
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
      groupDetails,
    };
  }
}

type StaticKeys =
  | "sourceStepDescription"
  | "forceIdentity"
  | "havingConditions"
  | "mode"
  | "hasSideEffects"
  | "name"
  | "alias"
  | "symbol"
  | "resource"
  | "groups"
  | "orders"
  | "selects"
  | "fetchOneExtra"
  | "isOrderUnique"
  | "isUnique"
  | "conditions"
  | "from"
  | "joins"
  | "needsCursor"
  | "needsGroups"
  | "relationJoins"
  | "meta"
  | "placeholderSymbols"
  | "deferredSymbols"
  | "fixedPlaceholderValues"
  | "_symbolSubstitutes"
  | "joinAsLateral";

type StaticInfo<TResource extends PgResource<any, any, any, any, any>> = Pick<
  CoreInfo<TResource>,
  StaticKeys
>;

class PgSelectInlineApplyStep<
  TResource extends PgResource<any, any, any, any, any>,
> extends Step {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectInlineApplyStep",
  };
  public isSyncAndSafe = true;

  private staticInfo: StaticInfo<TResource>;
  private firstStepId: number | null;
  private lastStepId: number | null;
  private offsetStepId: number | null;
  private afterStepId: number | null;
  private beforeStepId: number | null;
  private applyDepIds: number[];

  private skipJoin: boolean;
  constructor(
    private identifier: string,
    private viaSubquery: boolean,
    details: {
      staticInfo: StaticInfo<TResource>;
      $first: Step | null;
      $last: Step | null;
      $offset: Step | null;
      $after: Step | null;
      $before: Step | null;
      applySteps: Step[];
      /** @internal @experimental */
      skipJoin?: boolean;
    },
  ) {
    super();
    const {
      staticInfo,
      $first,
      $last,
      $offset,
      $after,
      $before,
      applySteps,
      skipJoin,
    } = details;
    this.skipJoin = skipJoin ?? false;
    this.staticInfo = staticInfo;
    this.firstStepId = $first ? this.addUnaryDependency($first) : null;
    this.lastStepId = $last ? this.addUnaryDependency($last) : null;
    this.offsetStepId = $offset ? this.addUnaryDependency($offset) : null;
    this.afterStepId = $after ? this.addUnaryDependency($after) : null;
    this.beforeStepId = $before ? this.addUnaryDependency($before) : null;
    this.applyDepIds = applySteps.map(($apply) =>
      this.addUnaryDependency($apply),
    );
  }

  execute(executionDetails: ExecutionDetails) {
    if (executionDetails.count !== 1) {
      throw new Error(`PgSelectInlineApplyStep must be unary!`);
    }
    return [
      (queryBuilder: PgSelectQueryBuilder) => {
        const { parts, info, meta } = buildPartsForInlining({
          executionDetails,

          // My own dependencies
          firstStepId: this.firstStepId,
          lastStepId: this.lastStepId,
          offsetStepId: this.offsetStepId,
          afterStepId: this.afterStepId,
          beforeStepId: this.beforeStepId,
          applyDepIds: this.applyDepIds,

          // Data that's independent of dependencies
          ...this.staticInfo,
          sourceStepDescription: `PgSelectInlineApplyStep[${this.id}] (from ${this.staticInfo.sourceStepDescription})`,
        });

        const { cursorDigest, cursorIndicies, groupIndicies } = info;
        const cursorDetails: PgCursorDetails | undefined =
          cursorDigest != null && cursorIndicies != null
            ? { digest: cursorDigest, indicies: cursorIndicies }
            : undefined;
        const groupDetails: PgGroupDetails | undefined =
          groupIndicies != null ? { indicies: groupIndicies } : undefined;

        if (this.viaSubquery) {
          const { first, last, fetchOneExtra, meta, shouldReverseOrder } = info;
          const { sql: baseQuery } = buildQueryFromParts(parts, {
            asArray: true,
          });
          const selectIndex = queryBuilder.selectAndReturnIndex(
            // 's' for 'subquery'
            sql`array(${sql.indent(baseQuery)})::text`,
          );

          const details: PgSelectInlineViaSubqueryDetails = {
            cursorDetails,
            groupDetails,
            shouldReverseOrder,
            fetchOneExtra,
            selectIndex,
            first,
            last,
            meta,
          };
          queryBuilder.setMeta(this.identifier, details);
        } else {
          const { whereConditions, joins, selects } = parts;
          const { from, alias, resource, joinAsLateral } = this.staticInfo;
          const where = buildWhereOrHaving(
            sql`/* WHERE becoming ON */`,
            whereConditions,
          );
          if (!this.skipJoin) {
            queryBuilder.join({
              type: "left",
              from,
              alias,
              attributeNames: resource.codec.attributes ? sql.blank : sql`(v)`,
              // Note the WHERE is now part of the JOIN condition (since
              // it's a LEFT JOIN).
              conditions: where !== sql.blank ? [where] : [],
              lateral: joinAsLateral,
            });
          }
          for (const join of joins) {
            queryBuilder.join(join);
          }
          const selectIndexes = selects.map((s) =>
            queryBuilder.selectAndReturnIndex(s),
          );
          const details: PgSelectInlineViaJoinDetails = {
            selectIndexes,
            cursorDetails,
            groupDetails,
            meta,
          };
          queryBuilder.setMeta(this.identifier, details);
        }
      },
    ];
  }
}

interface PgSelectInlineViaJoinDetails {
  selectIndexes: number[];
  cursorDetails: PgCursorDetails | undefined;
  groupDetails: PgGroupDetails | undefined;
  meta: Record<string, any>;
}
interface PgSelectInlineViaSubqueryDetails {
  selectIndex: number;
  cursorDetails: PgCursorDetails | undefined;
  groupDetails: PgGroupDetails | undefined;
  meta: Record<string, any>;
  fetchOneExtra: boolean;
  first: Maybe<number>;
  last: Maybe<number>;
  shouldReverseOrder: boolean;
}

function buildPartsForInlining<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
>(rawInfo: CoreInfo<TResource>) {
  const coreResult = buildTheQueryCore(rawInfo);
  return {
    ...coreResult,
    parts: buildQueryParts(coreResult.info, {}),
  };
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
    placeholderSymbols,
    deferredSymbols,
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
        for (let i = 0; i < placeholderSymbols.length; i++) {
          const symbol = placeholderSymbols[i];
          placeholderValues.set(symbol, sql.identifier(`PLACEHOLDER_${i}`));
        }
        for (let i = 0; i < deferredSymbols.length; i++) {
          const symbol = deferredSymbols[i];
          placeholderValues.set(symbol, sql.identifier(`DEFERRED_${i}`));
        }
        return sql.compile(frag, { placeholderValues }).text;
      }),
    ),
  );
  const digest = hash.digest("hex").slice(0, 10);
  return digest;
}

function buildQueryParts<TResource extends PgResource<any, any, any, any, any>>(
  info: ResolvedPgSelectQueryInfo<TResource>,
  options: {
    withIdentifiers?: boolean;
    extraSelects?: SQL[];
    forceOrder?: boolean;
  } = Object.create(null),
) {
  const { alias, resource, selects: baseSelects, _symbolSubstitutes } = info;

  function buildFrom() {
    return {
      sql: sql`\nfrom ${info.from} as ${alias}${
        resource.codec.attributes ? sql.blank : sql`(v)`
      }`,
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

  const { sql: from } = buildFrom();
  const { sql: groupBy } = buildGroupBy();
  const { sql: orderBy } = buildOrderBy(
    info,
    options.forceOrder ? false : info.shouldReverseOrder,
  );
  const { sql: limitAndOffset } = buildLimitAndOffset();

  const { extraSelects = EMPTY_ARRAY } = options;
  const selects = [...baseSelects, ...extraSelects];
  const l = baseSelects.length;
  const extraSelectIndexes = extraSelects.map((_, i) => i + l);

  return {
    comment: sql.comment(`From ${info.sourceStepDescription}`),
    selects,
    from,
    joins: info.joins,
    whereConditions: info.conditions,
    groupBy,
    havingConditions: info.havingConditions,
    orderBy,
    limitAndOffset,
    extraSelectIndexes,
    _symbolSubstitutes,
  };
}

function buildQuery<TResource extends PgResource<any, any, any, any, any>>(
  info: MutablePgSelectQueryInfo<TResource>,
  options: {
    withIdentifiers?: boolean;
    extraSelects?: SQL[];
    forceOrder?: boolean;
  } = Object.create(null),
): {
  sql: SQL;
  extraSelectIndexes: number[];
} {
  return buildQueryFromParts(buildQueryParts(info, options));
}

function buildQueryFromParts(
  parts: ReturnType<typeof buildQueryParts>,
  options: { asArray?: boolean } = {},
) {
  const {
    comment,
    selects,
    from,
    joins,
    whereConditions,
    groupBy,
    havingConditions,
    orderBy,
    limitAndOffset,
    extraSelectIndexes,
  } = parts;
  const select = buildSelect(selects, options.asArray);
  const aliases = buildAliases(parts._symbolSubstitutes);
  const join = buildJoin(joins);
  const where = buildWhereOrHaving(sql`where`, whereConditions);
  const having = buildWhereOrHaving(sql`having`, havingConditions);

  const baseQuery = sql`${comment}${aliases}${select}${from}${join}${where}${groupBy}${having}${orderBy}${limitAndOffset}`;
  return { sql: baseQuery, extraSelectIndexes };
}

function buildOrderBy<TResource extends PgResource<any, any, any, any, any>>(
  info: ResolvedPgSelectQueryInfo<TResource>,
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
  groupBy(group: PgGroupSpec): void;
  having(
    condition: PgHavingConditionSpec<
      keyof GetPgResourceAttributes<TResource> & string
    >,
  ): void;
  havingBuilder(): PgCondition<this>;
  // IMPORTANT: if you add `JOIN` here, **only** allow `LEFT JOIN`, otherwise
  // if we're inlined things may go wrong.
  join(spec: PgSelectPlanJoin): void;
  selectAndReturnIndex(fragment: SQL): number;
}

function buildWhereOrHaving(
  whereOrHaving: SQL,
  baseConditions: ReadonlyArray<SQL>,
) {
  const allConditions = baseConditions;
  const sqlConditions = sql.join(
    allConditions.map((c) => sql.parens(sql.indent(c))),
    " and ",
  );
  return allConditions.length === 0
    ? sql.blank
    : allConditions.length === 1
      ? sql`\n${whereOrHaving} ${sqlConditions}`
      : sql`\n${whereOrHaving}\n${sql.indent(sqlConditions)}`;
}

function buildJoin(inJoins: readonly PgSelectPlanJoin[]) {
  const joins: SQL[] = inJoins.map((j) => {
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

  return joins.length ? sql`\n${sql.join(joins, "\n")}` : sql.blank;
}

function buildSelect(selects: readonly SQL[], asArray = false) {
  if (asArray) {
    if (selects.length < 1) {
      // Cannot accumulate empty arrays
      return sql`select array[null]::text[]`;
    } else {
      return sql`select array[\n${sql.indent(
        sql.join(selects, ",\n"),
      )}\n]::text[]`;
    }
  }
  const fragmentsWithAliases = selects.map(
    (frag, idx) => sql`${frag} as ${sql.identifier(String(idx))}`,
  );

  const selection =
    fragmentsWithAliases.length > 0
      ? sql`\n${sql.indent(sql.join(fragmentsWithAliases, ",\n"))}`
      : sql` /* NOTHING?! */`;

  return sql`select${selection}`;
}

function buildAliases(_symbolSubstitutes: ReadonlyMap<symbol, symbol>) {
  const sqlAliases: SQL[] = [];
  for (const [a, b] of _symbolSubstitutes.entries()) {
    sqlAliases.push(sql.symbolAlias(a, b));
  }
  return sql.join(sqlAliases, "");
}

function createSelectResult(
  allVals: null | readonly any[],
  {
    first,
    last,
    fetchOneExtra,
    shouldReverseOrder,
    meta,
    cursorDetails,
    groupDetails,
  }: {
    first: Maybe<number> | null;
    last: Maybe<number> | null;
    fetchOneExtra: boolean;
    shouldReverseOrder: boolean;
    meta: Record<string, any>;
    cursorDetails: PgCursorDetails | undefined;
    groupDetails: PgGroupDetails | undefined;
  },
) {
  if (allVals == null) {
    return allVals as never;
  }
  const limit = first ?? last;
  const firstAndLast = first != null && last != null && last < first;
  const hasMore = fetchOneExtra && limit != null && allVals.length > limit;
  const trimFromStart = !shouldReverseOrder && last != null && first == null;
  const limitedRows = hasMore
    ? trimFromStart
      ? allVals.slice(Math.max(0, allVals.length - limit!))
      : allVals.slice(0, limit!)
    : allVals;
  const slicedRows =
    firstAndLast && limitedRows.length > last
      ? limitedRows.slice(-last)
      : limitedRows;
  const orderedRows = shouldReverseOrder
    ? reverseArray(slicedRows)
    : slicedRows;
  return {
    hasMore,
    items: orderedRows,
    cursorDetails,
    groupDetails,
    m: meta,
  };
}

function pgInlineViaJoinTransform([details, item]: readonly [
  PgSelectInlineViaJoinDetails,
  any[] | null,
]) {
  const { meta, selectIndexes, cursorDetails, groupDetails } = details;
  const items: unknown[][] = [];
  if (item != null) {
    const newItem = [];
    for (let i = 0, l = selectIndexes.length; i < l; i++) {
      newItem[i] = item[selectIndexes[i]];
    }
    items.push(newItem);
  }
  return {
    hasMore: false,
    // We return a list here because our children are going to use a
    // `first` plan on us.
    // NOTE: we don't need to reverse the list for relay pagination
    // because it only contains one entry.
    items,
    cursorDetails,
    groupDetails,
    m: meta,
  };
}

function pgInlineViaSubqueryTransform([details, item]: readonly [
  PgSelectInlineViaSubqueryDetails,
  any[],
]) {
  const allVals = parseArray(item[details.selectIndex]);
  return createSelectResult(allVals, details);
}
