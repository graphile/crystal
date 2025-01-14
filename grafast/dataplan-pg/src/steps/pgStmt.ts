import type { ExecutionDetails } from "grafast";
import { applyTransforms, ExecutableStep } from "grafast";
import { type SQL, sql } from "pg-sql2";

import type { PgCodec, PgTypedExecutableStep } from "../interfaces.js";
import type { PgLocker } from "../pgLocker.js";
import { makeScopedSQL } from "../utils.js";

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

const UNHANDLED_PLACEHOLDER = sql`(1/0) /* ERROR! Unhandled pgSelect placeholder! */`;

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
    return sql.placeholder(symbol, UNHANDLED_PLACEHOLDER);
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
}
