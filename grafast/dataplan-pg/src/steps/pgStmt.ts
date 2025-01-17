import { applyTransforms, ExecutableStep } from "grafast";
import { type SQL, sql } from "pg-sql2";

import type { PgCodec, PgTypedExecutableStep } from "..";
import type { PgLocker } from "../pgLocker";
import { makeScopedSQL } from "../utils.js";

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
    const symbol = Symbol(`step-${$step.id}`);
    const sqlPlaceholder = sql.placeholder(symbol, UNHANDLED_PLACEHOLDER);
    const p: PgStmtDeferredPlaceholder = {
      symbol,
      dependencyIndex,
      codec,
      alreadyEncoded,
    };
    this.placeholders.push(p);
    // This allows us to replace the SQL that will be compiled, for example
    // when we're inlining this into a parent query.
    return sqlPlaceholder;
  }
}
