import type { ExecutableStep, GrafastSubscriber, ModifierStep } from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";

import type { PgAdaptorOptions } from "./adaptors/pg.js";
import type { PgTypeColumns } from "./codecs.js";
import type {
  PgSourceParameter,
  PgSourceRelation,
  PgSourceUnique,
} from "./datasource.js";
import type { WithPgClient } from "./executor.js";
import type { PgDeleteStep } from "./steps/pgDelete.js";
import type { PgInsertStep } from "./steps/pgInsert.js";
import type { PgSelectSingleStep } from "./steps/pgSelectSingle.js";
import type { PgUpdateStep } from "./steps/pgUpdate.js";

/**
 * A class-like source of information - could be from `SELECT`-ing a row, or
 * `INSERT...RETURNING` or similar. *ALWAYS* represents a single row (or null).
 */
export type PgClassSingleStep<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
> =
  | PgSelectSingleStep<TColumns, TUniques, TRelations, TParameters>
  | PgInsertStep<TColumns, TUniques, TRelations>
  | PgUpdateStep<TColumns, TUniques, TRelations>
  | PgDeleteStep<TColumns, TUniques, TRelations>;

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

export interface PgRefDefinitionExtensions {}
export interface PgRefDefinition {
  graphqlType?: string;
  singular?: boolean;
  extensions?: PgRefDefinitionExtensions;
  singleRecordFieldName?: string;
  listFieldName?: string;
  connectionFieldName?: string;
}
export interface PgRefDefinitions {
  [refName: string]: PgRefDefinition;
}

/**
 * Custom metadata for a codec
 */
export interface PgTypeCodecExtensions {
  oid?: string;
  pg?: {
    databaseName: string;
    schemaName: string;
    name: string;
  };
  description?: string;
  listItemNonNull?: boolean;
}

export interface PgTypeCodecPolymorphismSingleTypeColumnSpec<
  TColumnName extends string,
> {
  column: TColumnName;
  isNotNull?: boolean;
  rename?: string;
}

export interface PgTypeCodecPolymorphismSingleTypeSpec<
  TColumnName extends string,
> {
  name: string;
  // TODO: make this optional?
  columns: Array<PgTypeCodecPolymorphismSingleTypeColumnSpec<TColumnName>>;
}
export interface PgTypeCodecPolymorphismSingle<TColumnName extends string> {
  mode: "single";
  typeColumns: readonly TColumnName[];
  // TODO: make this optional?
  commonColumns: readonly TColumnName[];
  types: {
    [typeKey: string]: PgTypeCodecPolymorphismSingleTypeSpec<TColumnName>;
  };
}

export interface PgTypeCodecPolymorphismRelationalTypeSpec {
  name: string;
  /** The name of the database table this type relates to (useful before the relations are established) */
  references: string;
  /** The name of the relation to follow to get the related record */
  relationName: string;
  // Currently assumes it's joined via PK, but we might expand that in future
}
export interface PgTypeCodecPolymorphismRelational<TColumnName extends string> {
  mode: "relational";
  typeColumns: readonly TColumnName[];
  types: {
    [typeKey: string]: PgTypeCodecPolymorphismRelationalTypeSpec;
  };
}

export interface PgTypeCodecPolymorphismUnion {
  mode: "union";
}

export type PgTypeCodecPolymorphism<TColumnName extends string> =
  | PgTypeCodecPolymorphismSingle<TColumnName>
  | PgTypeCodecPolymorphismRelational<TColumnName>
  | PgTypeCodecPolymorphismUnion;

/**
 * A codec for a Postgres type, tells us how to convert to-and-from Postgres
 * (including changes to the SQL statement itself). Also includes metadata
 * about the type, for example any of the attributes it has.
 */
export interface PgTypeCodec<
  TColumns extends PgTypeColumns | undefined,
  TFromPostgres,
  TFromJavaScript = TFromPostgres,
  TArrayItemCodec extends
    | PgTypeCodec<any, any, any, undefined, any, any>
    | undefined = undefined,
  TDomainItemCodec extends
    | PgTypeCodec<any, any, any, any, any, any>
    | undefined = undefined,
  TRangeItemCodec extends
    | PgTypeCodec<undefined, any, any, undefined, any, undefined>
    | undefined = undefined,
> {
  /**
   * Unique name to identify this codec.
   */
  name: string;

  /**
   * Given a value of type TFromJavaScript, returns an `SQL` value to insert into an SQL
   * statement.
   *
   * **IMPORTANT**: nulls must already be handled!
   */
  toPg: PgEncode<TFromJavaScript>;

  /**
   * Given a text value from PostgreSQL, returns the value cast to TCanonical.
   *
   * **IMPORTANT**: nulls must already be handled!
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

  /**
   * If true, this is an anonymous type (e.g. the return type of a
   * `returns record` or `returns table` PostgreSQL function) and thus should
   * not be referenced via `sqlType` directly.
   */
  isAnonymous?: boolean;

  // TODO: extract this to a different interface
  /**
   * If this is a composite type, the columns it supports.
   */
  columns: TColumns;

  /**
   * A callback to return `'true'` (text string) if the composite type
   * represented by this codec is non-null, and `null` or `'false'` otherwise.
   *
   * If this codec represents a composite type (e.g. a row or other type with
   * multiple columns) and this type can be returned from a function then
   * there's a risk that the function may return null/an all-nulls composite
   * type. This can occur with `returns some_composite_type` or
   * `returns setof some_composite_type`, though the former is more common as
   * you explicitly need to return nulls in the latter.
   *
   * We can't simply do `not (foo is null)` because you might be using
   * column-level select grants which would prevent this happening. As such we
   * give you a chance to provide your own non-null check. In most table cases
   * you can use `(${alias}.id is not null)::text` (assuming 'id' is the name
   * of your primary key); for composite types you can normally do
   * `(not (${alias} is null))::text`.
   */
  notNullExpression?: (alias: SQL) => SQL;

  /**
   * If set, this represents a PostgreSQL array type. Please note: array types
   * should NOT be nested.
   */
  arrayOfCodec?: TArrayItemCodec;

  /**
   * The underlying codec that this type is a domain over.
   */
  domainOfCodec?: TDomainItemCodec;
  /**
   * If this is a domain, does it add a non-null constraint?
   */
  notNull?: boolean;

  /**
   * The underlying codec that this type is a range over.
   */
  rangeOfCodec?: TRangeItemCodec;

  polymorphism?: PgTypeCodecPolymorphism<any>;

  /**
   * Arbitrary metadata
   */
  extensions?: Partial<PgTypeCodecExtensions>;
}

export type PgEnumValue<TValue extends string = string> = {
  value: TValue;
  description?: string;
};

/**
 * A PgTypeCodec specifically for enums
 */
export interface PgEnumTypeCodec<TValue extends string>
  extends PgTypeCodec<undefined, string, TValue> {
  values: PgEnumValue<TValue>[];
}

/**
 * A PgTypedExecutableStep has a 'pgCodec' property which means we don't need
 * to also state the pgCodec to use, this can be an added convenience.
 */
export interface PgTypedExecutableStep<
  TCodec extends PgTypeCodec<any, any, any>,
> extends ExecutableStep<any> {
  pgCodec: TCodec;
}

type PgOrderCommonSpec = {
  direction: "ASC" | "DESC";
  /** `NULLS FIRST` or `NULLS LAST` or nothing */
  nulls?: "FIRST" | "LAST" | null;
};

export type PgOrderFragmentSpec = {
  /** The expression we're ordering by. */
  fragment: SQL;
  /** The codec of the expression that we're ordering by, this is useful when constructing a cursor for it. */
  codec: PgTypeCodec<any, any, any>;

  attribute?: never;
  callback?: never;
} & PgOrderCommonSpec;

export type PgOrderAttributeSpec = {
  /** The attribute you're using for ordering */
  attribute: string;
  /** An optional expression to wrap this column with, and the type that expression returns */
  callback?: (
    attributeExpression: SQL,
    attributeCodec: PgTypeCodec<any, any, any>,
  ) => [SQL, PgTypeCodec<any, any, any>];

  fragment?: never;
  codec?: never;
} & PgOrderCommonSpec;

/**
 * The information required to specify an entry in an 'ORDER BY' clause.
 */
export type PgOrderSpec = PgOrderFragmentSpec | PgOrderAttributeSpec;

/**
 * The information required to specify an entry in a `GROUP BY` clause.
 */
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
    >]?: ExecutableStep<ReturnType<TColumns[key]["pg2gql"]>>;
  } & {
    // Required unique combination of columns
    [key in TTuple[number]]: ExecutableStep<
      ReturnType<TColumns[key]["pg2gql"]>
    >;
  };
};

/**
 * Represents a spec like `{user_id: ExecutableStep}` or
 * `{organization_id: ExecutableStep, item_id: ExecutableStep}`. The keys in
 * the spec can be any of the columns in TColumns, however there must be at
 * least one of the unique sets of columns represented (as specified in
 * TUniqueColumns) - you can then add arbitrary additional columns if you need
 * to.
 */
export type PlanByUniques<
  TColumns extends PgTypeColumns | undefined,
  TUniqueColumns extends ReadonlyArray<
    PgSourceUnique<Exclude<TColumns, undefined>>
  >,
> = TColumns extends PgTypeColumns
  ? TuplePlanMap<TColumns, TUniqueColumns[number]["columns"] & string[]>[number]
  : undefined;

export type PgConditionLikeStep = (ModifierStep<any> | ExecutableStep) & {
  alias: SQL;
  placeholder(
    $step: ExecutableStep,
    codec: PgTypeCodec<any, any, any, any>,
  ): SQL;
  where(condition: SQL): void;
  having(condition: SQL): void;
};

export type KeysOfType<TObject, TValueType> = {
  [key in keyof TObject]: TObject[key] extends TValueType ? key : never;
}[keyof TObject];

declare global {
  namespace GraphileConfig {
    interface PgDatabaseConfiguration<
      TAdaptor extends keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
    > {
      name: string;
      schemas?: string[];

      adaptor: TAdaptor;
      adaptorSettings?: GraphileConfig.PgDatabaseAdaptorOptions[TAdaptor];

      /** The key on 'context' where the withPgClient function will be sourced */
      withPgClientKey: KeysOfType<Grafast.Context & object, WithPgClient>;

      /** Return settings to set in the session */
      pgSettings?: (
        requestContext: Grafast.RequestContext,
      ) => { [key: string]: string } | null;

      /** Settings to set in the session that performs introspection (during gather phase) */
      pgSettingsForIntrospection?: { [key: string]: string } | null;

      /** The key on 'context' where the pgSettings for this DB will be sourced */
      pgSettingsKey?: KeysOfType<
        Grafast.Context & object,
        { [key: string]: string } | null | undefined
      >;

      /** The GrafastSubscriber to use for subscriptions */
      pgSubscriber?: GrafastSubscriber<Record<string, string>> | null;

      /** Where on the context should the PgSubscriber be stored? */
      pgSubscriberKey?: KeysOfType<
        Grafast.Context & object,
        GrafastSubscriber<any> | null | undefined
      >;
    }

    interface Preset {
      pgConfigs?: ReadonlyArray<PgDatabaseConfiguration>;
    }

    interface PgDatabaseAdaptorOptions {
      "@dataplan/pg/adaptors/pg": PgAdaptorOptions;
      /* Add your own via declaration merging */
    }
  }
}

export interface MakePgConfigOptions
  extends Partial<
    Pick<
      GraphileConfig.PgDatabaseConfiguration,
      | "name"
      | "pgSettings"
      | "pgSettingsForIntrospection"
      | "withPgClientKey"
      | "pgSettingsKey"
      | "pgSubscriber"
      | "pgSubscriberKey"
    >
  > {
  connectionString?: string;
  schemas?: string | string[];
  superuserConnectionString?: string;
  pubsub?: boolean;
}
