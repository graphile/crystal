import type { ExecutablePlan } from "graphile-crystal";
import type { SQL, SQLRawValue } from "pg-sql2";

import type { PgSource, PgSourceColumns } from "./datasource";
import type { PgDeletePlan } from "./plans/pgDelete";
import type { PgInsertPlan } from "./plans/pgInsert";
import type { PgSelectSinglePlan } from "./plans/pgSelectSingle";
import type { PgUpdatePlan } from "./plans/pgUpdate";

/**
 * A class-like source of information - could be from `SELECT`-ing a row, or
 * `INSERT...RETURNING` or similar. *ALWAYS* represents a single row (or null).
 */
export type PgClassSinglePlan<
  TDataSource extends PgSource<any, any, any, any, any>,
> =
  | PgSelectSinglePlan<TDataSource>
  | PgInsertPlan<TDataSource>
  | PgUpdatePlan<TDataSource>
  | PgDeletePlan<TDataSource>;

/**
 * Given a value of type TInput, returns an `SQL` value to insert into an SQL
 * statement.
 */
export type PgEncode<TInput> = (value: TInput) => SQLRawValue;

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

export type TuplePlanMap<
  TColumns extends { [column: string]: any },
  TTuple extends ReadonlyArray<keyof TColumns>,
> = {
  [Index in keyof TTuple]: {
    [key in TTuple[number]]: ExecutablePlan<
      ReturnType<TColumns[key]["pg2gql"]>
    >;
  };
};

export type PlanByUniques<
  TColumns extends { [column: string]: any },
  TUniqueColumns extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
> = TuplePlanMap<TColumns, TUniqueColumns[number]>[number];
