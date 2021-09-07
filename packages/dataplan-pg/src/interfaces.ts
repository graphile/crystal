import type { ExecutablePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";

import type { PgSourceColumns } from "./datasource";

/**
 * Most notably SQLCapableValue cannot be an object (e.g. a JSON object) - you
 * must convert it into something `pg` can use first. E.g. for JSON you could
 * use `JSON.stringify` via the `toPg` converter.
 */
export type SQLCapableValue =
  | null
  | boolean
  | number
  | string
  | Array<SQLCapableValue>;

/**
 * Given a value of type TInput, returns an `SQL` value to insert into an SQL
 * statement.
 */
export type PgEncode<TInput> = (value: TInput) => SQLCapableValue;

/**
 * Given a text value from PostgreSQL, returns the value cast to TCanonical.
 */
export type PgDecode<TCanonical> = (value: string) => TCanonical;

export interface PgTypeCodec<
  TCanonical = any,
  TInput = TCanonical,
  TColumns extends PgSourceColumns | undefined = any,
> {
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

  /**
   * If this is a composite type, the columns it supports.
   */
  columns?: TColumns;
}

export interface PgTypedExecutablePlan<TCodec extends PgTypeCodec = PgTypeCodec>
  extends ExecutablePlan<any> {
  pgCodec: TCodec;
}

export interface PgOrderSpec {
  fragment: SQL;
  codec: PgTypeCodec;
  direction: "ASC" | "DESC";
  nulls?: "FIRST" | "LAST" | null;
}
