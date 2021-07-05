import type { ExecutablePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";

/**
 * Given a value of type TInput, returns an `SQL` value to insert into an SQL
 * statement.
 */
export type PgEncode<TInput> = (value: TInput) => SQL;

/**
 * Given a text value from PostgreSQL, returns the value cast to TCanonical.
 */
export type PgDecode<TCanonical> = (value: string) => TCanonical;

export interface PgTypeCodec<TCanonical = any, TInput = TCanonical> {
  /**
   * Given a value of type TInput, returns an `SQL` value to insert into an SQL
   * statement.
   */
  toPg: PgEncode<TInput>;

  /**
   * Given a text value from PostgreSQL, returns the value cast to TCanonical.
   */
  fromPg: PgDecode<TCanonical>;

  /**
   * When we have an expression of this type, we can safely cast it within
   * Postgres using the cast `(${expression})::${sqlType}` to make the type
   * explicit.
   */
  sqlType: SQL;
}

export interface PgTypedExecutablePlan<TCanonical = any, TInput = TCanonical>
  extends ExecutablePlan<any> {
  pgCodec: PgTypeCodec<TCanonical, TInput>;
}
