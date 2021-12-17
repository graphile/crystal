import type { ExecutablePlan } from "graphile-crystal";
import type { SQL, SQLRawValue } from "pg-sql2";

import type { PgSourceColumns, PgSourceRelation } from "./datasource";
import type { PgDeletePlan } from "./plans/pgDelete";
import type { PgInsertPlan } from "./plans/pgInsert";
import type { PgSelectSinglePlan } from "./plans/pgSelectSingle";
import type { PgUpdatePlan } from "./plans/pgUpdate";

/**
 * A class-like source of information - could be from `SELECT`-ing a row, or
 * `INSERT...RETURNING` or similar. *ALWAYS* represents a single row (or null).
 */
export type PgClassSinglePlan<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgSourceColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends { [key: string]: any } | never = never,
> =
  | PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters>
  | PgInsertPlan<TColumns, TUniques, TRelations>
  | PgUpdatePlan<TColumns, TUniques, TRelations>
  | PgDeletePlan<TColumns, TUniques, TRelations>;

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
  TColumns extends PgSourceColumns | undefined,
  TCanonical,
  TInput = TCanonical,
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

  // TODO: extract this to a different interface
  /**
   * If this is a composite type, the columns it supports.
   */
  columns: TColumns;
}

export interface PgEnumTypeCodec<TValue extends string>
  extends PgTypeCodec<undefined, string, TValue> {
  values: TValue[];
}

export interface PgTypedExecutablePlan<
  TCodec extends PgTypeCodec<any, any, any>,
> extends ExecutablePlan<any> {
  pgCodec: TCodec;
}

export interface PgOrderSpec {
  fragment: SQL;
  codec: PgTypeCodec<any, any, any>;
  direction: "ASC" | "DESC";
  nulls?: "FIRST" | "LAST" | null;
}

export type TuplePlanMap<
  TColumns extends { [column: string]: any },
  TTuple extends ReadonlyArray<keyof TColumns>,
> = {
  [Index in keyof TTuple]: {
    // Optional columns
    [key in keyof TColumns as Exclude<
      key,
      keyof TTuple[number]
    >]?: ExecutablePlan<ReturnType<TColumns[key]["pg2gql"]>>;
  } & {
    // Required unique combination of columns
    [key in TTuple[number]]: ExecutablePlan<
      ReturnType<TColumns[key]["pg2gql"]>
    >;
  };
};

export type PlanByUniques<
  TColumns extends PgSourceColumns | undefined,
  TUniqueColumns extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
> = TColumns extends PgSourceColumns
  ? TuplePlanMap<TColumns, TUniqueColumns[number]>[number]
  : undefined;
