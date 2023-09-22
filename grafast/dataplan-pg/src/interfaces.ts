import type { ExecutableStep, GrafastSubscriber, ModifierStep } from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";

import type { PgAdaptorOptions } from "./adaptors/pg.js";
import type { PgCodecAttributes } from "./codecs.js";
import type {
  PgCodecRefs,
  PgResource,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
} from "./datasource.js";
import type { PgExecutor, WithPgClient } from "./executor.js";
import type { PgDeleteSingleStep } from "./steps/pgDeleteSingle.js";
import type { PgInsertSingleStep } from "./steps/pgInsertSingle.js";
import type { PgSelectSingleStep } from "./steps/pgSelectSingle.js";
import type { PgUpdateSingleStep } from "./steps/pgUpdateSingle.js";

/**
 * A class-like source of information - could be from `SELECT`-ing a row, or
 * `INSERT...RETURNING` or similar. *ALWAYS* represents a single row (or null).
 */
export type PgClassSingleStep<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> =
  | PgSelectSingleStep<TResource>
  | PgInsertSingleStep<TResource>
  | PgUpdateSingleStep<TResource>
  | PgDeleteSingleStep<TResource>;

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

/** @deprecated Use DataplanPg.PgRefDefinitionExtensions instead */
export type PgRefDefinitionExtensions = DataplanPg.PgRefDefinitionExtensions;
export interface PgRefDefinition {
  graphqlType?: string;
  singular?: boolean;
  description?: string;
  extensions?: DataplanPg.PgRefDefinitionExtensions;
  singleRecordFieldName?: string;
  listFieldName?: string;
  connectionFieldName?: string;
}
export interface PgRefDefinitions {
  [refName: string]: PgRefDefinition;
}

/** @deprecated Use DataplanPg.PgCodecExtensions instead */
export type PgCodecExtensions = DataplanPg.PgCodecExtensions;

export interface PgCodecPolymorphismSingleTypeAttributeSpec<
  TAttributeName extends string = string,
> {
  attribute: TAttributeName;
  isNotNull?: boolean;
  rename?: string;
}

export interface PgCodecPolymorphismSingleTypeSpec<
  TAttributeName extends string = string,
> {
  /** The name of the polymorphic subentry of the parent single table polymorphic codec */
  name: string;
  /** The attributes that are specific to this concrete type (including any modifiers); empty array is valid */
  attributes: Array<PgCodecPolymorphismSingleTypeAttributeSpec<TAttributeName>>;
}
export interface PgCodecPolymorphismSingle<
  TAttributeName extends string = string,
> {
  mode: "single";
  /** The list of attributes that is used to determine which polymorphic type the record is. Currently this should always have length 1. */
  typeAttributes: readonly TAttributeName[];
  /** These attributes are shared by every concrete type of this codec; empty array is valid */
  commonAttributes: readonly TAttributeName[];
  /** Details the concrete types from this polymorphic single table, including what to call it, and what columns it has. */
  types: {
    [typeKey: string]: PgCodecPolymorphismSingleTypeSpec<TAttributeName>;
  };
}

export interface PgCodecPolymorphismRelationalTypeSpec {
  name: string;
  /** The name of the database table this type relates to (useful before the relations are established) */
  references: string;
  /** The name of the relation to follow to get the related record */
  relationName: string;
  // Currently assumes it's joined via PK, but we might expand that in future
}
export interface PgCodecPolymorphismRelational<
  TAttributeName extends string = string,
> {
  mode: "relational";
  typeAttributes: readonly TAttributeName[];
  types: {
    [typeKey: string]: PgCodecPolymorphismRelationalTypeSpec;
  };
}

export interface PgCodecPolymorphismUnion {
  mode: "union";
}

export type PgCodecPolymorphism<TAttributeName extends string> =
  | PgCodecPolymorphismSingle<TAttributeName>
  | PgCodecPolymorphismRelational<TAttributeName>
  | PgCodecPolymorphismUnion;

/**
 * A codec for a Postgres type, tells us how to convert to-and-from Postgres
 * (including changes to the SQL statement itself). Also includes metadata
 * about the type, for example any of the attributes it has.
 */
export interface PgCodec<
  TName extends string = string,
  TAttributes extends PgCodecAttributes | undefined =
    | PgCodecAttributes
    | undefined,
  TFromPostgres = any,
  TFromJavaScript = TFromPostgres,
  TArrayItemCodec extends
    | PgCodec<string, any, any, any, any, any, any>
    | undefined = PgCodec<string, any, any, any, any, any, any> | undefined,
  TDomainItemCodec extends
    | PgCodec<string, any, any, any, any, any, any>
    | undefined = PgCodec<string, any, any, any, any, any, any> | undefined,
  TRangeItemCodec extends
    | PgCodec<string, undefined, any, any, undefined, any, undefined>
    | undefined =
    | PgCodec<string, undefined, any, any, undefined, any, undefined>
    | undefined,
> {
  /**
   * Unique name to identify this codec.
   */
  name: TName;

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

  /**
   * True if this type is a binary type (e.g. bytea)
   */
  isBinary?: boolean;

  /**
   * If this is a composite type, the attributes it supports.
   */
  attributes: TAttributes;

  /**
   * A callback to return `'true'` (text string) if the composite type
   * represented by this codec is non-null, and `null` or `'false'` otherwise.
   *
   * If this codec represents a composite type (e.g. a row or other type with
   * multiple attributes) and this type can be returned from a function then
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

  polymorphism?: PgCodecPolymorphism<any>;

  description?: string;

  /**
   * Arbitrary metadata
   */
  extensions?: Partial<PgCodecExtensions>;

  /**
   * Relations to follow for shortcut references, can be polymorphic, can be
   * many-to-many.
   */
  refs?: PgCodecRefs;

  /**
   * If this codec came from a specific database, we should list the executor
   * here. If the codec is used with multiple databases, leave this null, but
   * note that if it has attributes then it will not be able to be used as the
   * type of an attribute itself.
   */
  executor: PgExecutor | null;
}

export type PgCodecWithAttributes<
  TAttributes extends PgCodecAttributes = PgCodecAttributes,
> = PgCodec<any, TAttributes, any, any, undefined, any, undefined>;

export type PgCodecAnyScalar = PgCodec<
  string,
  undefined,
  any,
  any,
  undefined,
  any,
  any
>;

export type PgCodecList<
  TInnerCodec extends PgCodec<string, any, any, any, any, any, any> = PgCodec<
    string,
    any,
    any,
    any,
    any,
    any,
    any
  >,
> = PgCodec<string, undefined, any, any, TInnerCodec, undefined, undefined>;

export type PgEnumValue<TValue extends string = string> = {
  value: TValue;
  description?: string;
};

/**
 * A PgCodec specifically for enums
 */
export interface PgEnumCodec<
  TName extends string = string,
  TValue extends string = string,
> extends PgCodec<
    TName,
    undefined,
    string,
    TValue,
    undefined,
    undefined,
    undefined
  > {
  values: PgEnumValue<TValue>[];
}

/**
 * A PgTypedExecutableStep has a 'pgCodec' property which means we don't need
 * to also state the pgCodec to use, this can be an added convenience.
 */
export interface PgTypedExecutableStep<TCodec extends PgCodec>
  extends ExecutableStep {
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
  codec: PgCodec<string, any, any, any, any, any, any>;

  attribute?: never;
  callback?: never;

  nullable?: boolean;
} & PgOrderCommonSpec;

export type PgOrderAttributeSpec = {
  /** The attribute you're using for ordering */
  attribute: string;
  /** An optional expression to wrap this attribute with, and the type that expression returns */
  callback?: (
    attributeExpression: SQL,
    attributeCodec: PgCodec,
    nullable: boolean,
  ) => [fragment: SQL, codec: PgCodec, nullable?: boolean];

  fragment?: never;
  codec?: never;
  nullable?: boolean;
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
  // codec: PgCodec<string, any, any, any>;
  // ENHANCE: consider if 'cube', 'rollup', 'grouping sets' need special handling or can just be part of the fragment
}

export type TuplePlanMap<
  TAttributes extends PgCodecAttributes,
  TTuple extends ReadonlyArray<keyof TAttributes>,
> = {
  [Index in keyof TTuple]: {
    // Optional attributes
    [key in keyof TAttributes as Exclude<
      key,
      keyof TTuple[number]
    >]?: ExecutableStep<ReturnType<TAttributes[key]["codec"]["fromPg"]>>;
  } & {
    // Required unique combination of attributes
    [key in TTuple[number]]: ExecutableStep<
      ReturnType<TAttributes[key]["codec"]["fromPg"]>
    >;
  };
};

/**
 * Represents a spec like `{user_id: ExecutableStep}` or
 * `{organization_id: ExecutableStep, item_id: ExecutableStep}`. The keys in
 * the spec can be any of the attributes in TAttributes, however there must be at
 * least one of the unique sets of attributes represented (as specified in
 * TUniqueAttributes) - you can then add arbitrary additional attributes if you need
 * to.
 */
export type PlanByUniques<
  TAttributes extends PgCodecAttributes,
  TUniqueAttributes extends ReadonlyArray<PgResourceUnique<TAttributes>>,
> = TAttributes extends PgCodecAttributes
  ? TuplePlanMap<
      TAttributes,
      TUniqueAttributes[number]["attributes"] & string[]
    >[number]
  : undefined;

export type PgConditionLikeStep = (ModifierStep<any> | ExecutableStep) & {
  alias: SQL;
  placeholder($step: ExecutableStep, codec: PgCodec): SQL;
  where(condition: SQL): void;
  having(condition: SQL): void;
};

export type KeysOfType<TObject, TValueType> = {
  [key in keyof TObject]: TObject[key] extends TValueType ? key : never;
}[keyof TObject];

declare global {
  namespace GraphileConfig {
    interface PgServiceConfiguration<
      TAdaptor extends
        keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
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
      pgServices?: ReadonlyArray<PgServiceConfiguration>;
    }

    interface PgDatabaseAdaptorOptions {
      "@dataplan/pg/adaptors/pg": PgAdaptorOptions;
      /* Add your own via declaration merging */
    }
  }
  namespace DataplanPg {
    interface PgConditionStepExtensions {}
    /**
     * Custom metadata for a codec
     */
    interface PgCodecExtensions {
      oid?: string;
      pg?: {
        serviceName: string;
        schemaName: string;
        name: string;
      };
      listItemNonNull?: boolean;
    }

    /**
     * Extra metadata you can attach to a unique constraint.
     */
    interface PgResourceUniqueExtensions {}

    /**
     * Space for extra metadata about this resource
     */
    interface PgResourceExtensions {}

    interface PgResourceParameterExtensions {
      variant?: string;
    }

    interface PgCodecRefExtensions {}
    interface PgCodecAttributeExtensions {}
    interface PgRefDefinitionExtensions {}
    interface PgCodecRelationExtensions {}
  }
}

export interface MakePgServiceOptions
  extends Partial<
    Pick<
      GraphileConfig.PgServiceConfiguration,
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

/** @deprecated Use DataplanPg.PgCodecRelationExtensions instead */
export type PgCodecRelationExtensions = DataplanPg.PgCodecRelationExtensions;

export interface PgCodecRelationBase<
  TLocalCodec extends PgCodec = PgCodec,
  TRemoteAttributes extends string = string,
> {
  /** Where the relationship starts */
  localCodec: TLocalCodec;
  /** If localCodec is polymorphic, which of the concrete subtypes should this relationship apply to? */
  localCodecPolymorphicTypes?: string[];

  /**
   * The attributes locally used in this relationship.
   */
  localAttributes: readonly (keyof TLocalCodec["attributes"])[];

  /**
   * The remote attributes that are joined against.
   */
  remoteAttributes: readonly TRemoteAttributes[];

  /**
   * If true then there's at most one record this relationship will find.
   */
  isUnique: boolean;

  /**
   * If true then this is a reverse lookup (where our local attributes are
   * referenced by the remote tables remote attributes, rather than the other way
   * around), so multiple rows may be found (unless isUnique is true).
   */
  isReferencee?: boolean;

  /**
   * Space for you to add your own metadata.
   */
  extensions?: PgCodecRelationExtensions;

  description?: string;
}

export interface PgCodecRelationConfig<
  TLocalCodec extends PgCodec = PgCodecWithAttributes,
  TRemoteResourceOptions extends PgResourceOptions = PgResourceOptions<
    any,
    PgCodecWithAttributes,
    any,
    any
  >,
> extends PgCodecRelationBase<
    TLocalCodec,
    TRemoteResourceOptions extends PgResourceOptions<
      any,
      PgCodec<any, infer UAttributes, any, any, any, any, any>,
      any,
      any
    >
      ? keyof UAttributes
      : never
  > {
  remoteResourceOptions: TRemoteResourceOptions;
}

/**
 * Describes a relation from a codec to a resource
 */
export interface PgCodecRelation<
  TLocalCodec extends PgCodecWithAttributes = PgCodecWithAttributes,
  TRemoteResource extends PgResource<
    any,
    PgCodecWithAttributes,
    any,
    any,
    any
  > = PgResource<any, PgCodecWithAttributes, any, any, any>,
> extends PgCodecRelationBase<
    TLocalCodec,
    TRemoteResource extends PgResource<
      any,
      PgCodec<any, infer UAttributes, any, any, any, any, any>,
      any,
      any,
      any
    >
      ? keyof UAttributes
      : never
  > {
  /**
   * The remote resource this relation relates to.
   */
  remoteResource: TRemoteResource;
}

export interface PgRegistryConfig<
  TCodecs extends {
    [name in string]: PgCodec<
      name,
      PgCodecAttributes | undefined,
      any,
      any,
      any,
      any,
      any
    >;
  },
  TResourceOptions extends {
    [name in string]: PgResourceOptions<
      name,
      PgCodec,
      ReadonlyArray<PgResourceUnique<PgCodecAttributes<any>>>,
      readonly PgResourceParameter[] | undefined
    >;
  },
  TRelations extends {
    [codecName in keyof TCodecs]?: {
      [relationName in string]: PgCodecRelationConfig<
        PgCodec<string, PgCodecAttributes, any, any, undefined, any, undefined>,
        PgResourceOptions<any, PgCodecWithAttributes, any, any>
      >;
    };
  },
> {
  pgCodecs: TCodecs;
  pgResources: TResourceOptions;
  pgRelations: TRelations;
}

// https://github.com/microsoft/TypeScript/issues/47980#issuecomment-1049304607
export type Expand<T> = T extends unknown
  ? { [TKey in keyof T]: T[TKey] }
  : never;

export interface PgRegistry<
  TCodecs = Record<
    string,
    PgCodec<string, PgCodecAttributes | undefined, any, any, any, any, any>
  >,
  TResourceOptions = Record<
    string,
    PgResourceOptions<
      string,
      // TYPES: This maybe shouldn't be PgCodecWithAttributes, but PgCodec instead?
      PgCodecWithAttributes, // TCodecs[keyof TCodecs],
      ReadonlyArray<PgResourceUnique<PgCodecAttributes>>,
      readonly PgResourceParameter[] | undefined
    >
  >,
  TRelations = Record<
    string,
    Record<
      string,
      PgCodecRelationConfig<
        // TCodecs[keyof TCodecs] &
        PgCodec<string, PgCodecAttributes, any, any, undefined, any, undefined>,
        // TResourceOptions[keyof TResourceOptions] &
        PgResourceOptions<
          any,
          // TCodecs[keyof TCodecs] &
          PgCodecWithAttributes,
          any,
          any
        >
      >
    >
  >,
> {
  pgCodecs: TCodecs;
  pgResources: {
    [name in keyof TResourceOptions]: TResourceOptions[name] extends PgResourceOptions<
      infer UName,
      infer UCodec,
      infer UUniques,
      infer UParameters
    >
      ? PgResource<
          UName,
          UCodec,
          UUniques,
          UParameters,
          PgRegistry<TCodecs, TResourceOptions, TRelations>
        >
      : never;
  };
  pgRelations: {
    [codecName in keyof TRelations]: {
      [relationName in keyof TRelations[codecName]]: Expand<
        Omit<TRelations[codecName][relationName], "remoteResourceOptions"> & {
          remoteResource: TRelations[codecName][relationName] extends {
            remoteResourceOptions: PgResourceOptions<
              infer UName,
              infer UCodec,
              infer UUniques,
              infer UParameters
            >;
          }
            ? PgResource<
                UName,
                UCodec,
                UUniques,
                UParameters,
                PgRegistry<TCodecs, TResourceOptions, TRelations>
              >
            : never;
        }
      >;
    };
  };
}

export type GetPgRegistryCodecs<TRegistry extends PgRegistry<any, any, any>> =
  TRegistry["pgCodecs"];
export type GetPgRegistrySources<TRegistry extends PgRegistry<any, any, any>> =
  TRegistry["pgResources"];
export type GetPgRegistryCodecRelations<
  TRegistry extends PgRegistry<any, any, any>,
  TCodec extends PgCodec<any, any, any, any, any, any, any>,
> = TRegistry["pgRelations"][TCodec["name"]];
export type GetPgCodecAttributes<
  TCodec extends PgCodec<any, any, any, any, any, any, any>,
> = TCodec extends PgCodec<any, infer UAttributes, any, any, any, any, any>
  ? UAttributes extends undefined
    ? never
    : UAttributes
  : PgCodecAttributes;
export type GetPgResourceRegistry<
  TResource extends PgResource<any, any, any, any, any>,
> = TResource["registry"];
export type GetPgResourceCodec<
  TResource extends PgResource<any, any, any, any, any>,
> = TResource["codec"];
export type GetPgResourceAttributes<
  TResource extends PgResource<any, any, any, any, any>,
> = GetPgCodecAttributes<TResource["codec"]>;
export type GetPgResourceRelations<
  TResource extends PgResource<any, any, any, any, any>,
> = TResource["registry"]["pgRelations"][TResource["codec"]["name"]];
export type GetPgResourceUniques<
  TResource extends PgResource<any, any, any, any, any>,
> = TResource["uniques"];
