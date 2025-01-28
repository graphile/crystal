import type { __InputStaticLeafStep, ExecutionDetails, Maybe } from "grafast";
import {
  access,
  applyTransforms,
  ExecutableStep,
  lambda,
  SafeError,
} from "grafast";
import { type SQL, sql } from "pg-sql2";

import type {
  PgCodec,
  PgGroupSpec,
  PgTypedExecutableStep,
} from "../interfaces.js";
import type { PgLocker } from "../pgLocker.js";
import { makeScopedSQL } from "../utils.js";
import type { PgSelectParsedCursorStep } from "./pgSelect.js";

export interface QueryValue {
  dependencyIndex: number;
  codec: PgCodec;
  alreadyEncoded: boolean;
}

/**
 * Sometimes we want to refer to something that might change later - e.g. we
 * might have SQL that specifies a list of explicit values, or it might later
 * want to be replaced with a reference to an existing table value (e.g. when a
 * query is being inlined). PgStmtDeferred allows for this kind of
 * flexibility. It's really important to keep in mind that the same placeholder
 * might be used in multiple different SQL queries, and in the different
 * queries it might end up with different values - this is particularly
 * relevant when using `@stream`/`@defer`, for example.
 */
export type PgStmtDeferredPlaceholder = {
  symbol: symbol;
  dependencyIndex: number;
  codec: PgCodec;
  alreadyEncoded: boolean;
};

export type PgStmtDeferredSQL = {
  symbol: symbol;
  dependencyIndex: number;
};

const UNHANDLED_PLACEHOLDER = sql`(1/0) /* ERROR! Unhandled placeholder! */`;
const UNHANDLED_DEFERRED = sql`(1/0) /* ERROR! Unhandled deferred! */`;

export abstract class PgStmtBaseStep<T> extends ExecutableStep<T> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgStmtBaseStep",
  };

  protected abstract locker: PgLocker<any>;

  /**
   * Values used in this plan.
   */
  protected abstract placeholders: Array<PgStmtDeferredPlaceholder>;
  protected abstract deferreds: Array<PgStmtDeferredSQL>;
  protected abstract firstStepId: number | null;
  protected abstract lastStepId: number | null;
  protected abstract fetchOneExtra: boolean;
  protected abstract offsetStepId: number | null;
  protected abstract beforeStepId: number | null;
  protected abstract afterStepId: number | null;

  protected needsCursor = false;

  public scopedSQL = makeScopedSQL(this);

  /**
   * If we can't figure out the SQL until runtime, we can pass a step that
   * resolves to an SQL fragment.
   *
   * IMPORTANT: this step must be a "unary" step; i.e. it can only depend on
   * request-global dependencies such as variableValues, context, and input
   * arguments.
   */
  public deferredSQL($step: ExecutableStep<SQL>): SQL {
    const symbol = Symbol(`deferred-${$step.id}`);
    const dependencyIndex = this.addUnaryDependency($step);
    this.deferreds.push({ symbol, dependencyIndex });
    return sql.placeholder(symbol, UNHANDLED_DEFERRED);
  }

  public placeholder($step: PgTypedExecutableStep<PgCodec>): SQL;
  public placeholder(
    $step: ExecutableStep,
    codec: PgCodec,
    alreadyEncoded?: boolean,
  ): SQL;
  public placeholder(
    $step: ExecutableStep | PgTypedExecutableStep<PgCodec>,
    overrideCodec?: PgCodec,
    alreadyEncoded = false,
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
      // throw new Error(
      //   `Step ${$step} does not contain pgCodec information, please wrap ` +
      //     `it in \`pgCast\`. E.g. \`pgCast($step, TYPES.boolean)\``,
      // );
    }

    const $evalledStep = applyTransforms($step);
    const dependencyIndex = this.addDependency($evalledStep);
    const symbol = Symbol(`placeholder-${$step.id}`);
    this.placeholders.push({
      symbol,
      dependencyIndex,
      codec,
      alreadyEncoded,
    });
    // This allows us to replace the SQL that will be compiled, for example
    // when we're inlining this into a parent query.
    return sql.placeholder(symbol, UNHANDLED_PLACEHOLDER);
  }

  protected makeValues(executionDetails: ExecutionDetails, name: string) {
    const { values, count } = executionDetails;
    const identifiersSymbol = Symbol(name + "_identifiers");
    const identifiersAlias = sql.identifier(identifiersSymbol);
    /**
     * Since this is effectively like a DataLoader it processes the data for many
     * different resolvers at once. This list of (hopefully scalar) plans is used
     * to represent queryValues the query will need such as identifiers for which
     * records in the result set should be returned to which GraphQL resolvers,
     * parameters for conditions or orders, etc.
     */
    const queryValues: Array<QueryValue> = [];
    const placeholderValues = new Map<symbol, SQL>();
    const handlePlaceholder = (placeholder: PgStmtDeferredPlaceholder) => {
      const { symbol, dependencyIndex, codec, alreadyEncoded } = placeholder;
      const ev = values[dependencyIndex];
      if (!ev.isBatch || count === 1) {
        const value = ev.at(0);
        const encodedValue =
          value == null ? null : alreadyEncoded ? value : codec.toPg(value);
        placeholderValues.set(
          symbol,
          sql`${sql.value(encodedValue)}::${codec.sqlType}`,
        );
      } else {
        // Fine a existing match for this dependency of this type
        const existingIndex = queryValues.findIndex(
          (v) => v.dependencyIndex === dependencyIndex && v.codec === codec,
        );

        // If none exists, add one to our query values
        const idx =
          existingIndex >= 0
            ? existingIndex
            : queryValues.push(placeholder) - 1;

        // Finally alias this symbol to a reference to this placeholder
        placeholderValues.set(
          placeholder.symbol,
          sql`${identifiersAlias}.${sql.identifier(`id${idx}`)}`,
        );
      }
    };
    this.placeholders.forEach(handlePlaceholder);

    // Handle deferreds
    this.deferreds.forEach((placeholder) => {
      const { symbol, dependencyIndex } = placeholder;
      const fragment = values[dependencyIndex].unaryValue();
      if (!sql.isSQL(fragment)) {
        throw new Error(`Deferred SQL must be a valid SQL fragment`);
      }
      placeholderValues.set(symbol, fragment);
    });

    return {
      queryValues,
      placeholderValues,
      identifiersSymbol,
      identifiersAlias,
      handlePlaceholder,
    };
  }
  protected abstract assertCursorPaginationAllowed(): void;

  public setFirst($first: ExecutableStep<Maybe<number>>): this {
    this.locker.assertParameterUnlocked("first");
    this.firstStepId = this.addUnaryDependency($first);
    this.locker.lockParameter("first");
    return this;
  }

  public setLast($last: ExecutableStep<Maybe<number>>): this {
    this.assertCursorPaginationAllowed();
    this.locker.assertParameterUnlocked("orderBy");
    this.locker.assertParameterUnlocked("last");
    this.lastStepId = this.addUnaryDependency($last);
    this.locker.lockParameter("last");
    return this;
  }

  public setOffset($offset: ExecutableStep<Maybe<number>>): this {
    this.locker.assertParameterUnlocked("offset");
    this.offsetStepId = this.addUnaryDependency($offset);
    this.locker.lockParameter("offset");
    return this;
  }

  setAfter($parsedCursorPlan: PgSelectParsedCursorStep): void {
    this.afterStepId = this.addUnaryDependency($parsedCursorPlan);
  }

  setBefore($parsedCursorPlan: PgSelectParsedCursorStep): void {
    this.beforeStepId = this.addUnaryDependency($parsedCursorPlan);
  }

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

  // TODO: delete this
  shouldReverseOrder() {
    throw new Error("shouldReverseOrder RUNTIME ONLY PLZ");
  }

  /**
   * Someone (probably pageInfo) wants to know if there's more records. To
   * determine this we fetch one extra record and then throw it away.
   */
  public hasMore(): ExecutableStep<boolean> {
    this.fetchOneExtra = true;
    return access(this, "hasMore", false);
  }
}

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

export function getUnary<T>(
  values: ExecutionDetails["values"],
  stepId: number,
): T;
export function getUnary<T>(
  values: ExecutionDetails["values"],
  stepId: number | null,
): T | undefined;
export function getUnary<T>(
  values: ExecutionDetails["values"],
  stepId: number | null,
): T | undefined {
  return stepId == null ? undefined : (values[stepId].unaryValue() as T);
}

export function calculateLimitAndOffsetSQL(params: {
  cursorLower: Maybe<number>;
  cursorUpper: Maybe<number>;
  first: Maybe<number>;
  last: Maybe<number>;
  offset: Maybe<number>;
  fetchOneExtra: boolean;
}) {
  const { cursorLower, cursorUpper, first, last, offset, fetchOneExtra } =
    params;
  let limitValue: Maybe<number>;
  let offsetValue: Maybe<number>;
  let innerLimitValue: Maybe<number>;
  if (cursorLower != null || cursorUpper != null) {
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
     * Using `offset` with `after`/`before` is forbidden, so we do not need to
     * consider that.
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
    if (first != null) {
      upper = Math.min(upper, lower + first + 1);
    }

    // Apply 'last', if present
    if (last != null) {
      lower = Math.max(0, lower, upper - last - 1);
    }

    // Apply 'offset', if present
    if (offset != null && offset > 0) {
      lower = Math.min(lower + offset, maxUpper);
      upper = Math.min(upper + offset, maxUpper);
    }

    // If 'fetch one extra', adjust:
    if (fetchOneExtra) {
      if (first != null) {
        upper = upper + 1;
      } else if (last != null) {
        lower = Math.max(0, lower - 1);
      }
    }

    /** lower, but 0-indexed and inclusive */
    const lower0 = lower - 1 + 1;
    /** upper, but 0-indexed and inclusive */
    const upper0 = upper - 1 - 1;

    // Calculate the final limit/offset
    limitValue = isFinite(upper0) ? Math.max(0, upper0 - lower0 + 1) : null;
    offsetValue = lower0;

    innerLimitValue = limitValue != null ? limitValue + offsetValue : null;
  } else {
    limitValue =
      first != null
        ? first + (fetchOneExtra ? 1 : 0)
        : last != null
        ? last + (fetchOneExtra ? 1 : 0)
        : null;
    offsetValue = offset;

    innerLimitValue =
      first != null || last != null
        ? (first ?? last ?? 0) + (offset ?? 0) + (fetchOneExtra ? 1 : 0)
        : null;
  }
  // PERF: consider changing from `${sql.literal(v)}` to
  // `${sql.value(v)}::"int4"`. (The advantage being that fewer SQL queries are
  // generated, and thus chances of reusing a query are greater.)
  const limitSql =
    limitValue == null ? sql.blank : sql`\nlimit ${sql.literal(limitValue)}`;
  const offsetSql =
    offsetValue == null || offsetValue === 0
      ? sql.blank
      : sql`\noffset ${sql.literal(offsetValue)}`;
  const limitAndOffset = sql`${limitSql}${offsetSql}`;
  const innerLimitSQL: SQL =
    innerLimitValue != null
      ? sql`\nlimit ${sql.literal(innerLimitValue)}`
      : sql.blank;
  return [limitAndOffset, innerLimitSQL];
}

export interface PgStmtCommonQueryInfo {
  readonly alias: SQL;
  readonly hasSideEffects: boolean;

  readonly executionDetails: ExecutionDetails;
  readonly placeholders: ReadonlyArray<PgStmtDeferredPlaceholder>;
  readonly deferreds: ReadonlyArray<PgStmtDeferredSQL>;
  readonly fetchOneExtra: boolean;
  readonly forceIdentity: boolean;
  readonly needsCursor: boolean;

  readonly firstStepId: number | null;
  readonly lastStepId: number | null;
  readonly offsetStepId: number | null;
  readonly beforeStepId: number | null;
  readonly afterStepId: number | null;

  readonly groups: ReadonlyArray<PgGroupSpec>;
  readonly havingConditions: ReadonlyArray<SQL>;
}

export interface MutablePgStmtCommonQueryInfo {
  // New properties
  cursorLower: Maybe<number>;
  cursorUpper: Maybe<number>;

  first: Maybe<number>;
  last: Maybe<number>;
  shouldReverseOrder: boolean;
  offset: Maybe<number>;
}

export function calculateLimitAndOffsetSQLFromInfo(
  info: PgStmtCommonQueryInfo & {
    readonly cursorLower: Maybe<number>;
    readonly cursorUpper: Maybe<number>;
  },
) {
  const {
    executionDetails: { values },
    fetchOneExtra,
    cursorUpper,
    cursorLower,
  } = info;
  return calculateLimitAndOffsetSQL({
    first: getUnary(values, info.firstStepId),
    last: getUnary(values, info.lastStepId),
    offset: getUnary(values, info.offsetStepId),
    cursorLower,
    cursorUpper,
    fetchOneExtra,
  });
}

export function applyCommonPaginationStuff(
  info: PgStmtCommonQueryInfo & MutablePgStmtCommonQueryInfo,
): void {
  const {
    cursorUpper,
    cursorLower,
    executionDetails: { values },
  } = info;

  const first = getUnary<Maybe<number>>(values, info.firstStepId);
  const last = getUnary<Maybe<number>>(values, info.lastStepId);
  const offset = getUnary<Maybe<number>>(values, info.offsetStepId);

  if (offset != null && last != null) {
    throw new SafeError("Cannot use 'offset' with 'last'");
  }
  info.first = first;
  info.last = last;
  info.offset = offset;
  /**
   * If `last` is in use then we reverse the order from the database and then
   * re-reverse it in JS-land.
   */
  info.shouldReverseOrder =
    first == null && last != null && cursorLower == null && cursorUpper == null;
}

export function makeValues(info: PgStmtCommonQueryInfo, name: string) {
  const { executionDetails, placeholders, deferreds } = info;
  const { values, count } = executionDetails;
  const identifiersSymbol = Symbol(name + "_identifiers");
  const identifiersAlias = sql.identifier(identifiersSymbol);
  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to represent queryValues the query will need such as identifiers for which
   * records in the result set should be returned to which GraphQL resolvers,
   * parameters for conditions or orders, etc.
   */
  const queryValues: Array<QueryValue> = [];
  const placeholderValues = new Map<symbol, SQL>();
  const handlePlaceholder = (placeholder: PgStmtDeferredPlaceholder) => {
    const { symbol, dependencyIndex, codec, alreadyEncoded } = placeholder;
    const ev = values[dependencyIndex];
    if (!ev.isBatch || count === 1) {
      const value = ev.at(0);
      const encodedValue =
        value == null ? null : alreadyEncoded ? value : codec.toPg(value);
      placeholderValues.set(
        symbol,
        sql`${sql.value(encodedValue)}::${codec.sqlType}`,
      );
    } else {
      // Fine a existing match for this dependency of this type
      const existingIndex = queryValues.findIndex(
        (v) => v.dependencyIndex === dependencyIndex && v.codec === codec,
      );

      // If none exists, add one to our query values
      const idx =
        existingIndex >= 0 ? existingIndex : queryValues.push(placeholder) - 1;

      // Finally alias this symbol to a reference to this placeholder
      placeholderValues.set(
        placeholder.symbol,
        sql`${identifiersAlias}.${sql.identifier(`id${idx}`)}`,
      );
    }
  };
  placeholders.forEach(handlePlaceholder);

  // Handle deferreds
  deferreds.forEach((placeholder) => {
    const { symbol, dependencyIndex } = placeholder;
    const fragment = values[dependencyIndex].unaryValue();
    if (!sql.isSQL(fragment)) {
      throw new Error(`Deferred SQL must be a valid SQL fragment`);
    }
    placeholderValues.set(symbol, fragment);
  });

  return {
    queryValues,
    placeholderValues,
    identifiersSymbol,
    identifiersAlias,
    handlePlaceholder,
  };
}
