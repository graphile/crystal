import { ExecutableStep, isDev } from "grafast";
import type { PgSQL, SQL, Transformer } from "pg-sql2";
import sql, { isSQL } from "pg-sql2";

import type { PgResource } from "./datasource.js";
import type {
  PgClassSingleStep,
  PgCodec,
  PgConditionLike,
  PgQueryBuilder,
  PgQueryRootStep,
  PgSQLCallback,
  PgSQLCallbackOrDirect,
  PgTypedStep,
} from "./interfaces.js";
import { PgDeleteSingleStep } from "./steps/pgDeleteSingle.js";
import { PgInsertSingleStep } from "./steps/pgInsertSingle.js";
import { PgSelectSingleStep } from "./steps/pgSelectSingle.js";
import { PgUpdateSingleStep } from "./steps/pgUpdateSingle.js";

export function assertPgClassSingleStep<
  TResource extends PgResource<any, any, any, any, any>,
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
export type PlantimeEmbeddable = PgTypedStep<PgCodec>;

export function makeScopedSQL<TThis extends { placeholder(value: any): SQL }>(
  that: TThis,
): <T>(cb: PgSQLCallbackOrDirect<T, TThis | PgTypedStep>) => T {
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
        throw new Error(`Don't know how to embed ${value}`);
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
      if (isDev && !isSQL(value)) {
        console.log(`Expected SQL item, but found`, value);
      }
      return value;
    }
  };
  return <T>(cb: PgSQLCallbackOrDirect<T, TThis | PgTypedStep>) =>
    typeof cb === "function"
      ? sql.withTransformer(
          sqlTransformer,
          cb as PgSQLCallback<T, TThis | PgTypedStep>,
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
    if (isDev && !isSQL(value)) {
      console.log(`Expected SQL item, but found`, value);
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
