import { ExecutableStep, inspect } from "grafast";
import type { SQL, Transformer } from "pg-sql2";
import sql from "pg-sql2";

import type { PgResource } from "./datasource.ts";
import type {
  PgClassSingleStep,
  PgCodec,
  PgConditionLike,
  PgQueryBuilder,
  PgQueryRootStep,
  PgSQLCallback,
  PgSQLCallbackOrDirect,
  PgTypedStep,
} from "./interfaces.ts";
import { PgDeleteSingleStep } from "./steps/pgDeleteSingle.ts";
import { PgInsertSingleStep } from "./steps/pgInsertSingle.ts";
import { PgSelectSingleStep } from "./steps/pgSelectSingle.ts";
import { PgUpdateSingleStep } from "./steps/pgUpdateSingle.ts";

export function assertPgClassSingleStep<
  TResource extends PgResource<any, any, any, any, any, any, any>,
>(
  step: ExecutableStep | PgClassSingleStep<TResource>,
): asserts step is PgClassSingleStep<TResource> {
  if (
    !(
      step instanceof PgSelectSingleStep ||
      step instanceof PgInsertSingleStep ||
      step instanceof PgUpdateSingleStep ||
      step instanceof PgDeleteSingleStep
    )
  ) {
    throw new Error(
      `Expected a PgSelectSingleStep, PgInsertSingleStep, PgUpdateSingleStep or PgDeleteSingleStep, however we received '${step}'.`,
    );
  }
}

function hasAlias(t: any): t is { alias: SQL } {
  return t != null && t.alias != null && sql.isSQL(t.alias);
}

function hasGetPgRoot(t: any): t is { getPgRoot(): PgQueryRootStep } {
  return t != null && typeof t.getPgRoot === "function";
}

export type RuntimeEmbeddable = PgQueryBuilder | PgConditionLike;
/**
 * At plantime we can embed a PgTypedStep, or anything that can be embedded at
 * runtime (since if an argument is a constant rather than variable, we may be
 * able to evaluate its value at plantime as an optimization).
 */
export type PlantimeEmbeddable = PgTypedStep<PgCodec> | RuntimeEmbeddable;

export type RuntimeSQLThunk = PgSQLCallbackOrDirect<SQL, RuntimeEmbeddable>;

export function makeScopedSQL<TThis extends { placeholder(value: any): SQL }>(
  that: TThis,
): <T>(cb: PgSQLCallbackOrDirect<T, TThis | PlantimeEmbeddable>) => T {
  function isThis(value: any): value is TThis {
    return value === that;
  }
  const sqlTransformer: Transformer<PlantimeEmbeddable | TThis> = (
    sql,
    value,
  ) => {
    if (isThis(value)) {
      if (hasAlias(that)) {
        return that.alias;
      } else if (hasGetPgRoot(that)) {
        return that.getPgRoot().alias;
      } else {
        throw new Error(`Don't know how to embed ${inspect(value)}`);
      }
    }
    if (value instanceof ExecutableStep && "pgCodec" in value) {
      if (value.pgCodec) {
        return that.placeholder(value);
      } else {
        throw new Error(`${value} has invalid value for pgCodec`);
      }
    } else if (hasAlias(value)) {
      return value.alias;
    } else {
      return value;
    }
  };
  return <T>(cb: PgSQLCallbackOrDirect<T, TThis | PlantimeEmbeddable>) =>
    typeof cb === "function"
      ? sql.withTransformer(
          sqlTransformer,
          cb as PgSQLCallback<T, TThis | PlantimeEmbeddable>,
        )
      : cb;
}

const runtimeSQLTransformer: Transformer<RuntimeEmbeddable> = (sql, value) => {
  if (hasAlias(value)) {
    return value.alias;
  } else {
    if (value instanceof ExecutableStep) {
      throw new Error(`Cannot reference steps at runtime`);
    }
    return value;
  }
};

export function runtimeScopedSQL<T>(
  cb: PgSQLCallbackOrDirect<T, RuntimeEmbeddable>,
): T {
  return typeof cb === "function"
    ? sql.withTransformer(
        runtimeSQLTransformer,
        cb as PgSQLCallback<T, RuntimeEmbeddable>,
      )
    : cb;
}

function compare0<T>(_a: readonly T[], _b: readonly T[]) {
  return true;
}
function compare1<T>(a: readonly T[], b: readonly T[]) {
  return a[0] === b[0];
}
function compare2<T>(a: readonly T[], b: readonly T[]) {
  return a[0] === b[0] && a[1] === b[1];
}
function compare3<T>(a: readonly T[], b: readonly T[]) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function compare4<T>(a: readonly T[], b: readonly T[]) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export function getSameLengthArraysMatchFunction(
  length: number,
): <T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>) => boolean {
  switch (length) {
    case 0:
      return compare0;
    case 1:
      return compare1;
    case 2:
      return compare2;
    case 3:
      return compare3;
    case 4:
      return compare4;
    default:
      return function sameLengthArraysMatch<T>(
        array1: ReadonlyArray<T>,
        array2: ReadonlyArray<T>,
      ) {
        for (let i = 0; i < length; i++) {
          if (array1[i] !== array2[i]) {
            return false;
          }
        }
        return true;
      };
  }
}
