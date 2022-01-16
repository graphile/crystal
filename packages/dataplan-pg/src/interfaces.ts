import type { ExecutablePlan } from "graphile-crystal";
import type { SQL, SQLRawValue } from "pg-sql2";

import type {
  PgSourceColumns,
  PgSourceParameter,
  PgSourceRelation,
} from "./datasource";
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
  TParameters extends PgSourceParameter[] | undefined = undefined,
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
export type PgDecode<TForJavaScript, TFromPostgres = string> = (
  value: TFromPostgres,
) => TForJavaScript;

export interface PgTypeCodecExtensions {}

export interface PgTypeCodec<
  TColumns extends PgSourceColumns | undefined,
  TFromPostgres,
  TFromJavaScript = TFromPostgres,
> {
  /**
   * Given a value of type TFromJavaScript, returns an `SQL` value to insert into an SQL
   * statement.
   */
  toPg: PgEncode<TFromJavaScript>;

  /**
   * Given a text value from PostgreSQL, returns the value cast to TCanonical.
   */
  fromPg: PgDecode<TFromJavaScript, TFromPostgres>;

  // TODO: rename?
  /**
   * We'll append `::text` by default to each selection; however if this type
   * needs something special (e.g. `money` should be converted to `numeric`
   * before being converted to `text`) then you can provide this custom
   * callback to provide your own casting - this could even include function
   * calls if you want.
   */
  castFromPg?: (fragment: SQL) => SQL;

  /**
   * If you provide `castFromPg` you probably ought to also specify
   * `listCastFromPg` so that a list of this type can be converted properly.
   */
  listCastFromPg?: (fragment: SQL) => SQL;

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

  /**
   * If true, this represents a PostgreSQL array type. Please note: array types
   * should NOT be nested.
   */
  isArray?: boolean;

  extensions?: Partial<PgTypeCodecExtensions>;
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

export interface PgGroupSpec {
  fragment: SQL;
  // codec: PgTypeCodec<any, any, any>;
  // TODO: consider if 'cube', 'rollup', 'grouping sets' need special handling or can just be part of the fragment
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
