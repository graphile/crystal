import { ExecutableStep } from "grafast";
import type { PgSQL, SQL, Transformer } from "pg-sql2";
import sql from "pg-sql2";

import type { PgResource } from "./datasource.js";
import type {
  PgClassSingleStep,
  PgCodec,
  PgTypedExecutableStep,
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

export function makeScopedSQL<T extends { placeholder(value: any): SQL }>(
  that: T,
) {
  const sqlTransformer: Transformer<PgTypedExecutableStep<PgCodec>> = (
    sql,
    value,
  ) => {
    if (value instanceof ExecutableStep && "pgCodec" in value) {
      if (value.pgCodec) {
        return that.placeholder(value);
      } else {
        throw new Error(`${value} has invalid value for pgCodec`);
      }
    } else {
      return value;
    }
  };
  return <T>(cb: (sql: PgSQL<PgTypedExecutableStep<PgCodec>>) => T): T =>
    sql.withTransformer<PgTypedExecutableStep<PgCodec>, T>(sqlTransformer, cb);
}
