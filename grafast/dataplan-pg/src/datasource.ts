import chalk from "chalk";
import type { GrafastValuesList, ObjectStep } from "grafast";
import {
  __ValueStep,
  arraysMatch,
  constant,
  ExecutableStep,
  exportAs,
  partitionByIndex,
} from "grafast";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type {
  _AnyPgCodecAttribute,
  GenericPgCodecAttribute,
  PgCodecAttributeName,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
} from "./codecs.js";
import { TYPES } from "./codecs.js";
import type {
  PgClientResult,
  PgExecutor,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
} from "./executor.js";
import { inspect } from "./inspect.js";
import type {
  _AnyPgCodec,
  _AnyPgCodecRelationConfig,
  _AnyPgRegistry,
  _AnyPgRegistryConfig,
  _AnyScalarPgCodec,
  Expand,
  GenericPgCodec,
  GenericPgCodecRelationConfig,
  GetPgRegistryCodecRelationConfigs,
  GetPgRegistryCodecRelations,
  GetPgRegistryCodecs,
  PgCodecAttributes,
  PgCodecName,
  PgCodecRelationConfig,
  PgCodecRelationConfigName,
  PgRefDefinition,
  PgRegistry,
  PgRegistryConfig,
  PgRegistryConfigCodecs,
  PgRegistryConfigRelationConfigs,
  PgRegistryConfigResourceOptions,
  PlanByUniques,
} from "./interfaces.js";
import type { PgClassExpressionStep } from "./steps/pgClassExpression.js";
import type {
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectStep,
} from "./steps/pgSelect.js";
import { pgSelect } from "./steps/pgSelect.js";
import type {
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
} from "./steps/pgSelectSingle.js";

export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
): T {
  const fn: T = factory(...args);
  if (
    (typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
    });
  }
  return fn;
}

/** @deprecated Use DataplanPg.PgResourceUniqueExtensions instead */
export type PgResourceUniqueExtensions = DataplanPg.PgResourceUniqueExtensions;

/** @deprecated Use DataplanPg.PgResourceExtensions instead */
export type PgResourceExtensions = DataplanPg.PgResourceExtensions;

/** @deprecated Use DataplanPg.PgResourceParameterExtensions instead */
export type PgResourceParameterExtensions =
  DataplanPg.PgResourceParameterExtensions;

/** @internal */
export interface _AnyPgResourceParameter
  extends PgResourceParameter<any, any> {}
export interface GenericPgResourceParameter
  extends PgResourceParameter<string | null, GenericPgCodec> {}

/**
 * If this is a functional (rather than static) resource, this describes one of
 * the parameters it accepts.
 */
export interface PgResourceParameter<
  TName extends string | null,
  TCodec extends _AnyPgCodec,
> {
  /**
   * Name of the parameter, if null then we must use positional rather than
   * named arguments
   */
  name: TName;
  /**
   * The type of this parameter
   */
  codec: TCodec;
  /**
   * If true, then this parameter must be supplied, otherwise it's optional.
   */
  required: boolean;
  /**
   * If true and the parameter is supplied, then the parameter must not be
   * null.
   */
  notNull?: boolean;
  extensions?: PgResourceParameterExtensions;
}

/** @internal */
export interface _AnyPgResourceUnique extends PgResourceUnique<any> {}
export interface GenericPgResourceUnique
  extends PgResourceUnique<GenericPgCodecAttribute> {}
/**
 * Description of a unique constraint on a PgResource.
 */
export interface PgResourceUnique<TAttributes extends _AnyPgCodecAttribute> {
  /**
   * The attributes that are unique
   */
  attributes: Array<PgCodecAttributeName<TAttributes>>;
  /**
   * If this is true, this represents the "primary key" of the resource.
   */
  isPrimary?: boolean;
  description?: string;
  /**
   * Space for you to add your own metadata
   */
  extensions?: PgResourceUniqueExtensions;
}

export interface PgCodecRefPathEntry {
  relationName: string;
  // Could add conditions here
}

export type PgCodecRefPath = PgCodecRefPathEntry[];
/** @deprecated Use DataplanPg.PgCodecRefExtensions instead */
export type PgCodecRefExtensions = DataplanPg.PgCodecRefExtensions;

export interface PgCodecRef {
  definition: PgRefDefinition;
  paths: Array<PgCodecRefPath>;
  description?: string;
  extensions?: PgCodecRefExtensions;
}

export interface PgCodecRefs {
  [refName: string]: PgCodecRef;
}
export interface GenericPgResourceOptions<
  TCodec extends GenericPgCodec = GenericPgCodec,
> extends PgResourceOptions<
    string,
    TCodec,
    GenericPgResourceUnique,
    GenericPgResourceParameter
  > {}

/** @internal */
export interface _AnyPgResourceOptions
  extends PgResourceOptions<any, any, any, any> {}

export type PgResourceOptionName<U> = U extends PgResourceOptions<
  infer TName,
  any,
  any,
  any
>
  ? TName
  : never;
export type PgResourceOptionCodec<U> = U extends PgResourceOptions<
  any,
  infer TCodec,
  any,
  any
>
  ? TCodec
  : never;
export type PgResourceOptionUniques<U> = U extends PgResourceOptions<
  any,
  any,
  infer TUniques,
  any
>
  ? TUniques
  : never;
export type PgResourceOptionParameters<U> = U extends PgResourceOptions<
  any,
  any,
  any,
  infer TParameters
>
  ? TParameters
  : never;

/**
 * Configuration options for your PgResource
 */
export interface PgResourceOptions<
  TName extends string,
  TCodec extends _AnyPgCodec,
  TUniques extends PgResourceUnique<PgCodecAttributes<TCodec>>,
  TParameters extends _AnyPgResourceParameter,
> {
  /**
   * The associated codec for this resource
   */
  codec: TCodec;
  /**
   * The PgExecutor to use when servicing this resource; different executors can
   * have different caching rules. A plan that uses one executor cannot be
   * inlined into a plan for a different executor.
   */
  executor: PgExecutor;

  // TODO: auth should also apply to insert, update and delete, maybe via insertAuth, updateAuth, etc
  selectAuth?: ($step: PgSelectStep<_AnyPgResource>) => void;

  name: TName;
  identifier?: string;
  // see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
  from: SQL | ((...args: PgSelectArgumentDigest[]) => SQL);
  uniques?: [TUniques] extends [never] ? never : ReadonlyArray<TUniques>;
  extensions?: PgResourceExtensions;
  parameters?: [TParameters] extends [never]
    ? never
    : ReadonlyArray<TParameters>;
  description?: string;
  /**
   * Set true if this resource will only return at most one record - this is
   * generally only useful for PostgreSQL function resources, in which case you
   * should set it false if the function `returns setof` and true otherwise.
   */
  isUnique?: boolean;
  sqlPartitionByIndex?: SQL;
  isMutation?: boolean;
  /**
   * If true, this indicates that this was originally a list (array) and thus
   * should be treated as having a predetermined and reasonable length rather
   * than being unbounded. It's just a hint to schema generation, it doesn't
   * affect planning.
   */
  isList?: boolean;

  /**
   * "Virtual" resources cannot be selected from/inserted to/etc, they're
   * normally used to generate other resources that are _not_ virtual.
   */
  isVirtual?: boolean;
}

/** @internal */
export interface _AnyPgFunctionResourceOptions
  extends PgFunctionResourceOptions<any, any, any, any> {}
export interface GenericPgFunctionResourceOptions
  extends PgFunctionResourceOptions<
    string,
    GenericPgCodec,
    GenericPgResourceUnique,
    GenericPgResourceParameter
  > {}

export interface PgFunctionResourceOptions<
  TNewName extends string,
  TCodec extends _AnyPgCodec,
  TUniques extends PgResourceUnique<PgCodecAttributes<TCodec>>,
  TNewParameters extends _AnyPgResourceParameter,
> {
  name: TNewName;
  identifier?: string;
  from: (...args: PgSelectArgumentDigest[]) => SQL;
  parameters?: [TNewParameters] extends [never]
    ? never
    : ReadonlyArray<TNewParameters>;
  returnsSetof: boolean;
  returnsArray: boolean;
  uniques?: [TUniques] extends [never] ? never : ReadonlyArray<TUniques>;
  extensions?: PgResourceExtensions;
  isMutation?: boolean;
  selectAuth?: ($step: PgSelectStep<_AnyPgResource>) => void;
  description?: string;
}
export type PgResourceName<U> = U extends PgResource<
  infer TName,
  any,
  any,
  any,
  any
>
  ? TName
  : never;
export type PgResourceCodec<U> = U extends PgResource<
  any,
  infer TCodec,
  any,
  any,
  any
>
  ? TCodec
  : never;

export type PgResourceUniques<U> = U extends PgResource<
  any,
  any,
  infer TUniques,
  any,
  any
>
  ? TUniques
  : never;
export type PgResourceParameters<U> = U extends PgResource<
  any,
  any,
  any,
  infer TParameters,
  any
>
  ? TParameters
  : never;
export type PgResourceRegistry<U> = U extends PgResource<
  any,
  any,
  any,
  any,
  infer TRegistry
>
  ? TRegistry
  : never;
export interface GenericPgResource
  extends PgResource<
    string,
    GenericPgCodec,
    GenericPgResourceUnique,
    GenericPgResourceParameter,
    any
  > {}
/** @internal */
export interface _AnyPgResource extends PgResource<any, any, any, any, any> {}
/** @internal */
export interface _AnyScalarPgResource
  extends PgResource<any, _AnyScalarPgCodec, any, any, any> {}

/**
 * PgResource represents any resource of SELECT-able data in Postgres: tables,
 * views, functions, etc.
 */
export class PgResource<
  TName extends string,
  TCodec extends _AnyPgCodec,
  TUniques extends PgResourceUnique<PgCodecAttributes<TCodec>>,
  TParameters extends _AnyPgResourceParameter,
  TRegistry extends _AnyPgRegistry,
> {
  public readonly registry: TRegistry;
  public readonly codec: TCodec;
  public readonly executor: PgExecutor;
  public readonly name: TName;
  public readonly identifier: string;
  public readonly from: SQL | ((...args: PgSelectArgumentDigest[]) => SQL);
  public readonly uniques: [TUniques] extends [never]
    ? never
    : ReadonlyArray<TUniques>;
  private selectAuth?: ($step: PgSelectStep<_AnyPgResource>) => void;

  // TODO: make a public interface for this information
  /**
   * If present, implies that the resource represents a `setof composite[]` (i.e.
   * an array of arrays) - and thus is not appropriate to use for GraphQL
   * Cursor Connections.
   *
   * @internal
   */
  public sqlPartitionByIndex: SQL | null = null;

  public readonly parameters: [TParameters] extends [never]
    ? never
    : ReadonlyArray<TParameters>;
  public readonly description: string | undefined;
  public readonly isUnique: boolean;
  public readonly isMutation: boolean;
  /**
   * If true, this indicates that this was originally a list (array) and thus
   * should be treated as having a predetermined and reasonable length rather
   * than being unbounded. It's just a hint to schema generation, it doesn't
   * affect planning.
   */
  public readonly isList: boolean;

  /**
   * "Virtual" resources cannot be selected from/inserted to/etc, they're
   * normally used to generate other resources that are _not_ virtual.
   */
  public readonly isVirtual: boolean;

  public extensions: Partial<DataplanPg.PgResourceExtensions> | undefined;

  /**
   * @param from - the SQL for the `FROM` clause (without any
   * aliasing). If this is a subquery don't forget to wrap it in parens.
   * @param name - a nickname for this resource. Doesn't need to be unique
   * (but should be). Used for making the SQL query and debug messages easier
   * to understand.
   */
  constructor(
    registry: TRegistry,
    options: PgResourceOptions<TName, TCodec, TUniques, TParameters>,
  ) {
    const {
      codec,
      executor,
      name,
      identifier,
      from,
      uniques,
      extensions,
      parameters,
      description,
      isUnique,
      sqlPartitionByIndex,
      isMutation,
      selectAuth,
      isList,
      isVirtual,
    } = options;
    this.registry = registry;
    this.extensions = extensions;
    this.codec = codec;
    this.executor = executor;
    this.name = name;
    this.identifier = identifier ?? name;
    this.from = from;
    this.uniques = uniques ?? ([] as never);
    this.parameters = parameters ?? ([] as never);
    this.description = description;
    this.isUnique = !!isUnique;
    this.sqlPartitionByIndex = sqlPartitionByIndex ?? null;
    this.isMutation = !!isMutation;
    this.isList = !!isList;
    this.isVirtual = isVirtual ?? false;
    this.selectAuth = selectAuth;
    // parameters is null iff from is not a function
    const sourceIsFunction = typeof this.from === "function";
    if (this.parameters == null && sourceIsFunction) {
      throw new Error(
        `Resource ${this} is invalid - it's a function but without a parameters array. If the function accepts no parameters please pass an empty array.`,
      );
    }
    if (this.parameters != null && !sourceIsFunction) {
      throw new Error(
        `Resource ${this} is invalid - parameters can only be specified when the resource is a function.`,
      );
    }

    if (this.codec.arrayOfCodec?.attributes) {
      throw new Error(
        `Resource ${this} is invalid - creating a resource that returns an array of a composite type is forbidden; please \`unnest\` the array.`,
      );
    }

    if (this.isUnique && this.sqlPartitionByIndex) {
      throw new Error(
        `Resource ${this} is invalid - cannot be unique and also partitionable`,
      );
    }
  }

  /**
   * Often you can access table records from a table directly but also from a
   * view or materialized view.  This method makes it convenient to construct
   * multiple datasources that all represent the same underlying table
   * type/relations/etc.
   */
  static alternativeResourceOptions<
    TCodec extends _AnyPgCodec,
    const TNewUniques extends PgResourceUnique<PgCodecAttributes<TCodec>>,
    const TNewName extends string,
  >(
    baseOptions: PgResourceOptions<any, TCodec, any, never>,
    overrideOptions: {
      name: TNewName;
      identifier?: string;
      from: SQL;
      uniques?: [TNewUniques] extends [never]
        ? never
        : ReadonlyArray<TNewUniques>;
      extensions?: DataplanPg.PgResourceExtensions;
    },
  ): PgResourceOptions<TNewName, TCodec, TNewUniques, never> {
    const { name, identifier, from, uniques, extensions } = overrideOptions;
    const { codec, executor, selectAuth } = baseOptions;
    return {
      codec,
      executor,
      name,
      identifier,
      from,
      uniques,
      extensions,
      selectAuth,
    };
  }

  /**
   * Often you can access table records from a table directly but also from a
   * number of functions. This method makes it convenient to construct multiple
   * datasources that all represent the same underlying table
   * type/relations/etc but pull their rows from functions.
   */
  static functionResourceOptions<
    TCodec extends _AnyPgCodec,
    const TNewParameters extends _AnyPgResourceParameter,
    const TNewUniques extends PgResourceUnique<PgCodecAttributes<TCodec>>,
    const TNewName extends string,
  >(
    baseOptions: Pick<
      PgResourceOptions<any, TCodec, any, any>,
      "codec" | "executor" | "selectAuth"
    >,
    overrideOptions: PgFunctionResourceOptions<
      TNewName,
      TCodec,
      TNewUniques,
      TNewParameters
    >,
  ): PgResourceOptions<TNewName, TCodec, TNewUniques, TNewParameters> {
    const { codec, executor, selectAuth } = baseOptions;
    const {
      name,
      identifier,
      from: fnFrom,
      parameters,
      returnsSetof,
      returnsArray,
      uniques,
      extensions,
      isMutation,
      selectAuth: overrideSelectAuth,
      description,
    } = overrideOptions;
    if (!returnsArray) {
      // This is the easy case
      return {
        codec,
        executor,
        name,
        identifier,
        from: fnFrom as any,
        uniques,
        parameters,
        extensions,
        isUnique: !returnsSetof,
        isMutation: Boolean(isMutation),
        selectAuth: overrideSelectAuth ?? selectAuth,
        description,
      };
    } else if (!returnsSetof) {
      // This is a `composite[]` function; convert it to a `setof composite` function:
      const from = EXPORTABLE(
        (fnFrom, sql) =>
          (...args: PgSelectArgumentDigest[]) =>
            sql`unnest(${fnFrom(...args)})`,
        [fnFrom, sql],
      );
      return {
        codec,
        executor,
        name,
        identifier,
        from: from as any,
        uniques,
        parameters,
        extensions,
        isUnique: false, // set now, not unique
        isMutation: Boolean(isMutation),
        selectAuth: overrideSelectAuth ?? selectAuth,
        isList: true,
        description,
      };
    } else {
      // This is a `setof composite[]` function; convert it to `setof composite` and indicate that we should partition it.
      const sqlTmp = sql.identifier(Symbol(`${name}_tmp`));
      const sqlPartitionByIndex = sql.identifier(Symbol(`${name}_idx`));
      const from = EXPORTABLE(
        (fnFrom, sql, sqlPartitionByIndex, sqlTmp) =>
          (...args: PgSelectArgumentDigest[]) =>
            sql`${fnFrom(
              ...args,
            )} with ordinality as ${sqlTmp} (arr, ${sqlPartitionByIndex}) cross join lateral unnest (${sqlTmp}.arr)`,
        [fnFrom, sql, sqlPartitionByIndex, sqlTmp],
      );
      return {
        codec,
        executor,
        name,
        identifier,
        from: from as any,
        uniques,
        parameters,
        extensions,
        isUnique: false, // set now, not unique
        sqlPartitionByIndex,
        isMutation: Boolean(isMutation),
        selectAuth: overrideSelectAuth ?? selectAuth,
        description,
      };
    }
  }

  public toString(): string {
    return chalk.bold.blue(`PgResource(${this.name})`);
  }

  public getRelations(): GetPgRegistryCodecRelations<TRegistry, TCodec> {
    return (this.registry.pgRelations[this.codec.name] ??
      Object.create(null)) as any;
  }

  public getRelation<
    TRelationName extends PgCodecRelationConfigName<
      GetPgRegistryCodecRelationConfigs<TRegistry, TCodec>
    >,
  >(
    name: TRelationName,
  ): GetPgRegistryCodecRelations<TRegistry, TCodec>[TRelationName] {
    return this.getRelations()[name];
  }

  public resolveVia<
    TRelationName extends PgCodecRelationConfigName<
      GetPgRegistryCodecRelationConfigs<TRegistry, TCodec>
    >,
    TAttribute extends string,
  >(
    via: PgCodecAttributeVia<TRelationName, TAttribute>,
    attr: TAttribute,
  ): PgCodecAttributeViaExplicit<TRelationName, TAttribute> {
    if (!via) {
      throw new Error("No via to resolve");
    }
    if (typeof via === "string") {
      // Check
      const relation = this.getRelation(via);
      if (!relation) {
        throw new Error(`Unknown relation '${via}' in ${this}`);
      }
      if (!relation.remoteResource.codec.attributes![attr]) {
        throw new Error(
          `${this} relation '${via}' does not have attribute '${attr}'`,
        );
      }
      return { relation: via, attribute: attr };
    } else {
      return via;
    }
  }

  // PERF: this needs optimization.
  public getReciprocal<
    TOtherCodec extends GetPgRegistryCodecs<TRegistry>,
    TOtherRelationName extends GetPgRegistryCodecRelationConfigs<
      TRegistry,
      TOtherCodec
    >["name"],
  >(
    otherCodec: TOtherCodec,
    otherRelationName: TOtherRelationName,
  ):
    | [
        relationName: GetPgRegistryCodecRelationConfigs<
          TRegistry,
          TCodec
        >["name"],
        relation: GetPgRegistryCodecRelationConfigs<TRegistry, TCodec>,
      ]
    | null {
    if (this.parameters) {
      throw new Error(
        ".getReciprocal() cannot be used with functional resources; please use .execute()",
      );
    }
    const otherRelation =
      this.registry.pgRelations[otherCodec.name]?.[otherRelationName];
    const relations = this.getRelations();
    const reciprocal = Object.entries(relations).find(
      ([_relationName, relation]) => {
        if (relation.remoteResource.codec !== otherCodec) {
          return false;
        }
        if (
          !arraysMatch(relation.localAttributes, otherRelation.remoteAttributes)
        ) {
          return false;
        }
        if (
          !arraysMatch(relation.remoteAttributes, otherRelation.localAttributes)
        ) {
          return false;
        }
        return true;
      },
    );

    // TODO: this is still a bit tricky, :-(, but we're almost here!
    return (reciprocal as [any, any]) || null;
  }

  public get<
    TSelectSinglePlanOptions extends PgSelectSinglePlanOptions<this>,
    TSpec extends Expand<PlanByUniques<PgCodecAttributes<TCodec>, TUniques>>,
  >(
    spec: TSpec,
    // This is internal, it's an optimisation we can use but you shouldn't.
    _internalOptionsDoNotPass?: TSelectSinglePlanOptions,
  ): PgSelectSingleStep<this>;
  public get<
    TSelectSinglePlanOptions extends PgSelectSinglePlanOptions<this>,
    TSpec extends Expand<PlanByUniques<PgCodecAttributes<TCodec>, TUniques>>,
  >(
    spec: TSpec,
    // This is internal, it's an optimisation we can use but you shouldn't.
    _internalOptionsDoNotPass?: TSelectSinglePlanOptions,
  ): PgClassExpressionStep<TCodec, this>;
  public get<
    TSelectSinglePlanOptions extends PgSelectSinglePlanOptions<this>,
    TSpec extends Expand<PlanByUniques<PgCodecAttributes<TCodec>, TUniques>>,
  >(
    spec: TSpec,
    // This is internal, it's an optimisation we can use but you shouldn't.
    _internalOptionsDoNotPass?: TSelectSinglePlanOptions,
  ): PgClassExpressionStep<TCodec, this> | PgSelectSingleStep<this> {
    if (this.parameters) {
      throw new Error(
        ".get() cannot be used with functional resources; please use .execute()",
      );
    }
    if (!spec) {
      throw new Error(`Cannot ${this}.get without a valid spec`);
    }
    const keys = Object.keys(spec);
    if (
      !this.uniques.some((uniq: _AnyPgResourceUnique) =>
        uniq.attributes.every((key) => keys.includes(key)),
      )
    ) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) at child field (TODO: which one?) but that combination of attributes is not unique (uniques: ${JSON.stringify(
          this.uniques,
        )}). Did you mean to call .find() instead?`,
      );
    }

    return this.find(spec).single(_internalOptionsDoNotPass);
  }

  public find(
    spec: {
      [attribute in PgCodecAttributes<TCodec> as PgCodecAttributeName<attribute>]?:
        | ExecutableStep
        | string
        | number;
    } = Object.create(null),
  ): PgSelectStep<this> {
    if (this.parameters) {
      throw new Error(
        ".get() cannot be used with functional resources; please use .execute()",
      );
    }
    if (!this.codec.attributes) {
      throw new Error("Cannot call find if there's no attributes");
    }
    const attributes = this.codec.attributes;
    const keys = Object.keys(spec) as Array<
      PgCodecAttributeName<PgCodecAttributes<TCodec>>
    >;
    const invalidKeys = keys.filter((key) => attributes[key] == null);
    if (invalidKeys.length > 0) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) but that request included attributes that we don't know about: '${invalidKeys.join(
          "', '",
        )}'`,
      );
    }

    const identifiers = keys.map((key): PgSelectIdentifierSpec => {
      const attribute = attributes[key];
      if ("via" in attribute && attribute.via) {
        throw new Error(
          `Attribute '${String(
            key,
          )}' is defined with a 'via' and thus cannot be used as an identifier for '.find()' or '.get()' calls (requested keys: '${keys.join(
            "', '",
          )}').`,
        );
      }
      const { codec } = attribute;
      const stepOrConstant = spec[key];
      if (stepOrConstant == undefined) {
        throw new Error(
          `Attempted to call ${this}.find({${keys.join(
            ", ",
          )}}) but failed to provide a plan for '${String(key)}'`,
        );
      }
      return {
        step:
          stepOrConstant instanceof ExecutableStep
            ? stepOrConstant
            : constant(stepOrConstant, false),
        codec,
        matches: (alias: SQL) =>
          typeof attribute.expression === "function"
            ? attribute.expression(alias)
            : sql`${alias}.${sql.identifier(key)}`,
      };
    });
    return pgSelect({ resource: this, identifiers });
  }

  execute(
    args: Array<PgSelectArgumentSpec> = [],
    mode: PgSelectMode = this.isMutation ? "mutation" : "normal",
  ): ExecutableStep<unknown> {
    const $select = pgSelect({
      resource: this,
      identifiers: [],
      args,
      mode,
    });
    if (this.isUnique) {
      return $select.single();
    }
    const sqlPartitionByIndex = this.sqlPartitionByIndex;
    if (sqlPartitionByIndex) {
      // We're a setof array of composite type function, e.g. `setof users[]`, so we need to reconstitute the plan.
      return partitionByIndex(
        $select,
        ($row) =>
          ($row as PgSelectSingleStep<any>).select(
            sqlPartitionByIndex,
            TYPES.int,
          ),
        // Ordinality is 1-indexed but we want a 0-indexed number
        1,
      );
    } else {
      return $select;
    }
  }

  public applyAuthorizationChecksToPlan($step: PgSelectStep<this>): void {
    if (this.selectAuth) {
      this.selectAuth($step as any);
    }
    // e.g. $step.where(sql`user_id = ${me}`);
    return;
  }

  /**
   * @deprecated Please use `.executor.context()` instead - all resources for the
   * same executor must use the same context to allow for SQL inlining, unions,
   * etc.
   */
  public context(): ObjectStep<PgExecutorContextPlans> {
    return this.executor.context();
  }

  /** @internal */
  public executeWithCache<TInput = any, TOutput = any>(
    values: GrafastValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: GrafastValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.executeWithCache(values, options);
  }

  /** @internal */
  public executeWithoutCache<TInput = any, TOutput = any>(
    values: GrafastValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: GrafastValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.executeWithoutCache(values, options);
  }

  /** @internal */
  public executeStream<TInput = any, TOutput = any>(
    values: GrafastValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ) {
    return this.executor.executeStream<TInput, TOutput>(values, options);
  }

  /** @internal */
  public executeMutation<TData>(
    options: PgExecutorMutationOptions,
  ): Promise<PgClientResult<TData>> {
    return this.executor.executeMutation<TData>(options);
  }

  /**
   * Returns an SQL fragment that evaluates to `'true'` (string) if the row is
   * non-null and `'false'` or `null` otherwise.
   *
   * @see {@link PgCodec.notNullExpression}
   *
   * @internal
   */
  public getNullCheckExpression(alias: SQL): SQL | null {
    if (this.codec.notNullExpression) {
      // Use the user-provided check
      return this.codec.notNullExpression(alias);
    } else {
      // Every column in a primary key is non-nullable; so just see if one is null
      const pk = this.uniques.find((u) => u.isPrimary);
      const nonNullableAttribute = this.codec.attributes
        ? Object.entries(
            this.codec.attributes as Record<string, _AnyPgCodecAttribute>,
          ).find(
            ([_attributeName, spec]) =>
              !spec.via && !spec.expression && spec.notNull,
          )?.[0]
        : null ?? pk?.attributes[0];
      if (nonNullableAttribute) {
        const firstAttribute = sql`${alias}.${sql.identifier(
          nonNullableAttribute,
        )}`;
        return sql`(not (${firstAttribute} is null))::text`;
      } else {
        // Fallback

        // NOTE: we cannot use `is distinct from null` here because it's
        // commonly used for `select * from ((select my_table.composite).*)`
        // and the rows there _are_ distinct from null even if the underlying
        // data is not.

        return sql`(not (${alias} is null))::text`;
      }
    }
  }
}
exportAs("@dataplan/pg", PgResource, "PgResource");

/** @internal */
export interface _AnyPgRegistryBuilder
  extends PgRegistryBuilder<any, any, any> {}
export interface EmptyRegistryBuilder
  extends PgRegistryBuilder<never, never, never> {}
export interface DefaultRegistryBuilder
  extends PgRegistryBuilder<
    GenericPgCodec,
    GenericPgResourceOptions,
    GenericPgCodecRelationConfig
  > {}

export interface PgRegistryBuilder<
  TCodecs extends _AnyPgCodec,
  TResourceOptions extends _AnyPgResourceOptions,
  TRelationConfigs extends _AnyPgCodecRelationConfig,
> {
  getRegistryConfig(): PgRegistryConfig<
    TCodecs,
    TResourceOptions,
    TRelationConfigs
  >;
  addCodec<const TCodec extends _AnyPgCodec>(
    codec: TCodec,
  ): PgRegistryBuilder<TCodecs | TCodec, TResourceOptions, TRelationConfigs>;

  addResource<const TResourceOption extends _AnyPgResourceOptions>(
    resource: TResourceOption,
  ): PgRegistryBuilder<
    TCodecs | PgResourceOptionCodec<TResourceOption>,
    TResourceOptions | TResourceOption,
    TRelationConfigs
  >;

  addRelation<
    TCodec extends _AnyPgCodec,
    const TCodecRelationName extends string,
    const TRemoteResource extends _AnyPgResourceOptions,
    const TCodecRelation extends Omit<
      PgCodecRelationConfig<TCodecRelationName, TCodec, TRemoteResource>,
      "localCodec" | "remoteResourceOptions" | "name"
    >,
  >(
    codec: TCodec,
    relationName: TCodecRelationName,
    remoteResource: TRemoteResource,
    relation: TCodecRelation,
  ): PgRegistryBuilder<
    TCodecs,
    TResourceOptions,
    | TRelationConfigs
    | (TCodecRelation & {
        name: TCodecRelationName;
        localCodec: TCodec;
        remoteResourceOptions: TRemoteResource;
      })
  >;

  build(): PgRegistry<TCodecs, TResourceOptions, TRelationConfigs>;
}

export function makeRegistry<
  TConfig extends PgRegistryConfig<
    any,
    PgResourceOptions<any, any, any, _AnyPgResourceParameter>,
    _AnyPgCodecRelationConfig
  >,
>(
  config: TConfig,
): PgRegistry<
  PgRegistryConfigCodecs<TConfig>,
  PgRegistryConfigResourceOptions<TConfig>,
  PgRegistryConfigRelationConfigs<TConfig>
> {
  const registry: _AnyPgRegistry = {
    pgCodecs: Object.create(null) as any,
    pgResources: Object.create(null) as any,
    pgRelations: Object.create(null) as any,
  };

  // Tell the system to read the built pgCodecs, pgResources, pgRelations from the registry
  Object.defineProperties(registry.pgCodecs, {
    $exporter$args: { value: [registry] },
    $exporter$factory: {
      value: (registry: _AnyPgRegistry) => registry.pgCodecs,
    },
  });
  Object.defineProperties(registry.pgResources, {
    $exporter$args: { value: [registry] },
    $exporter$factory: {
      value: (registry: _AnyPgRegistry) => registry.pgResources,
    },
  });
  Object.defineProperties(registry.pgRelations, {
    $exporter$args: { value: [registry] },
    $exporter$factory: {
      value: (registry: _AnyPgRegistry) => registry.pgRelations,
    },
  });

  let addCodecForbidden = false;
  function addCodec<TCodec extends _AnyPgCodec>(codec: TCodec): TCodec {
    if (addCodecForbidden) {
      throw new Error(`It's too late to call addCodec now`);
    }
    const codecName = codec.name;
    if (registry.pgCodecs[codecName]) {
      if (registry.pgCodecs[codecName] !== codec) {
        console.dir({
          existing: registry.pgCodecs[codecName],
          new: codec,
        });
        throw new Error(
          `Codec named '${codecName}' is already registered; you cannot have two codecs with the same name`,
        );
      }
      return codec;
    } else if ((codec as any).$$export || (codec as any).$exporter$factory) {
      registry.pgCodecs[codecName] = codec;
      return codec;
    } else {
      // Custom spec, pin it back to the registry
      registry.pgCodecs[codecName] = codec;

      if (codec.attributes) {
        const prevCols = codec.attributes as Record<
          string,
          _AnyPgCodecAttribute
        >;
        for (const col of Object.values(prevCols)) {
          addCodec(col.codec);
        }
      }
      if (codec.arrayOfCodec) {
        addCodec(codec.arrayOfCodec);
      }
      if (codec.domainOfCodec) {
        addCodec(codec.domainOfCodec);
      }
      if (codec.rangeOfCodec) {
        addCodec(codec.rangeOfCodec);
      }

      // Tell the system to read the built codec from the registry
      Object.defineProperties(codec, {
        $exporter$args: { value: [registry, codecName] },
        $exporter$factory: {
          value: (registry: _AnyPgRegistry, codecName: string) =>
            registry.pgCodecs[codecName],
        },
      });

      return codec;
    }
  }

  for (const [codecName, codecSpec] of Object.entries(config.pgCodecs)) {
    if (codecName !== codecSpec.name) {
      throw new Error(`Codec added to registry with wrong name`);
    }
    addCodec(codecSpec);
  }

  for (const [resourceName, rawConfig] of Object.entries(config.pgResources)) {
    const resourceConfig: _AnyPgResourceOptions = {
      ...rawConfig,
      codec: addCodec(rawConfig.codec),
      parameters: rawConfig.parameters
        ? rawConfig.parameters.map((p) => ({
            ...p,
            codec: addCodec(p.codec),
          }))
        : rawConfig.parameters,
    };
    const resource = EXPORTABLE(
      (PgResource, registry, resourceConfig) =>
        new PgResource(registry, resourceConfig),
      [PgResource, registry, resourceConfig],
    );

    // This is the magic that breaks the circular reference: rather than
    // building PgResource via a factory we tell the system to just retrieve it
    // from the already build registry.
    Object.defineProperties(resource, {
      $exporter$args: { value: [registry, resourceName] },
      $exporter$factory: {
        value: (registry: _AnyPgRegistry, resourceName: string) =>
          registry.pgResources[resourceName],
      },
    });

    registry.pgResources[resourceName] = resource;
  }

  // Ensure all the relation codecs are also added
  for (const codecName of Object.keys(config.pgRelations)) {
    const relations = config.pgRelations[codecName];
    if (!relations) {
      continue;
    }
    for (const relationName of Object.keys(relations)) {
      const relationConfig = relations![relationName];
      if (relationConfig) {
        addCodec(relationConfig.localCodec);
      }
    }
  }

  // DO NOT CALL addCodec BELOW HERE
  addCodecForbidden = true;

  /**
   * If the user uses a codec with attributes as a column type (or an array of
   * the codec is the column type, etc) then we need to have a resource for
   * processing this codec. So we add all table-like codecs here, then we
   * remove the ones that already have resources, then we build resources for the
   * remainder.
   */
  const tableLikeCodecsWithoutTableLikeResources = new Set<_AnyPgCodec>();
  const walkCodec = <TCodec extends _AnyPgCodec>(
    codec: TCodec,
    isAccessibleViaAttribute = false,
    seen = new Set<_AnyPgCodec>(),
  ) => {
    if (seen.has(codec)) {
      return;
    }
    seen.add(codec);
    if (
      isAccessibleViaAttribute &&
      codec.attributes &&
      codec.executor &&
      !codec.isAnonymous
    ) {
      tableLikeCodecsWithoutTableLikeResources.add(codec);
    }
    if (codec.attributes) {
      for (const col of Object.values(
        codec.attributes as Record<string, _AnyPgCodecAttribute>,
      )) {
        if (isAccessibleViaAttribute) {
          walkCodec(col.codec, isAccessibleViaAttribute, seen);
        } else {
          walkCodec(col.codec, true, new Set());
        }
      }
    }
    if (codec.arrayOfCodec) {
      walkCodec(codec.arrayOfCodec, isAccessibleViaAttribute, seen);
    }
    if (codec.rangeOfCodec) {
      walkCodec(codec.rangeOfCodec, isAccessibleViaAttribute, seen);
    }
    if (codec.domainOfCodec) {
      walkCodec(codec.domainOfCodec, isAccessibleViaAttribute, seen);
    }
  };

  // Add table-like codecs used within attributes
  for (const codec of Object.values(registry.pgCodecs)) {
    walkCodec(codec);
  }

  // Remove from these those codecs that already have resources
  for (const resource of Object.values(registry.pgResources)) {
    if (!resource.parameters) {
      tableLikeCodecsWithoutTableLikeResources.delete(resource.codec);
    }
  }

  // Now add resources for the table-like codecs that don't have them already
  for (const codec of tableLikeCodecsWithoutTableLikeResources) {
    if (codec.executor) {
      const resourceName = `frmcdc_${codec.name}`;
      const resource = EXPORTABLE(
        (PgResource, codec, registry, resourceName, sql) =>
          new PgResource(registry, {
            name: resourceName,
            executor: codec.executor!,
            from: sql`(select 1/0 /* codec-only resource; should not select directly */)` as any,
            codec,
            identifier: resourceName,
            isVirtual: true,
            extensions: {
              tags: {
                behavior: "-*",
              },
            },
          }),
        [PgResource, codec, registry, resourceName, sql],
      );

      Object.defineProperties(resource, {
        $exporter$args: { value: [registry, resourceName] },
        $exporter$factory: {
          value: (registry: _AnyPgRegistry, resourceName: string) =>
            registry.pgResources[resourceName],
        },
      });

      registry.pgResources[resourceName] = resource;
    }
  }

  for (const codecName of Object.keys(config.pgRelations)) {
    const relations = config.pgRelations[codecName];
    if (!relations) {
      continue;
    }

    const builtRelations = Object.create(null);

    // Tell the system to read the built relations from the registry
    Object.defineProperties(builtRelations, {
      $exporter$args: { value: [registry, codecName] },
      $exporter$factory: {
        value: (registry: _AnyPgRegistry, codecName: string) =>
          registry.pgRelations[codecName],
      },
    });

    for (const relationName of Object.keys(relations)) {
      const relationConfig = relations[relationName];
      if (!relationConfig) {
        continue;
      }
      const { localCodec, remoteResourceOptions, ...rest } = relationConfig;

      const builtRelation = {
        ...rest,
        localCodec,
        remoteResource: registry.pgResources[remoteResourceOptions.name],
      };

      // Tell the system to read the built relation from the registry
      Object.defineProperties(builtRelation, {
        $exporter$args: { value: [registry, codecName, relationName] },
        $exporter$factory: {
          value: (
            registry: _AnyPgRegistry,
            codecName: string,
            relationName: string,
          ) => registry.pgRelations[codecName][relationName],
        },
      });

      builtRelations[relationName] = builtRelation;
    }

    registry.pgRelations[codecName] = builtRelations;
  }

  validateRelations(registry);

  return registry;
}
exportAs("@dataplan/pg", makeRegistry, "makeRegistry");

function validateRelations<
  TCodecs extends _AnyPgCodec,
  TResourceOptions extends _AnyPgResourceOptions,
  TRelationConfigs extends _AnyPgCodecRelationConfig,
>(registry: PgRegistry<TCodecs, TResourceOptions, TRelationConfigs>): void {
  // PERF: skip this if not isDev?

  const reg = registry;

  for (const codec of Object.values(reg.pgCodecs) as Array<TCodecs>) {
    // Check that all the `via` and `identicalVia` match actual relations.
    const relationKeys = Object.keys(
      reg.pgRelations[codec.name as PgCodecName<TCodecs>] ?? {},
    );
    if (codec.attributes) {
      Object.entries(
        codec.attributes as Record<string, _AnyPgCodecAttribute>,
      ).forEach(([attributeName, col]) => {
        const { via, identicalVia } = col;
        if (via != null) {
          if (typeof via === "string") {
            if (!relationKeys.includes(via)) {
              throw new Error(
                `${codec.name} claims attribute '${attributeName}' is via relation '${via}', but there is no such relation.`,
              );
            }
          } else {
            if (!relationKeys.includes(via.relation)) {
              throw new Error(
                `${codec.name} claims attribute '${attributeName}' is via relation '${via.relation}', but there is no such relation.`,
              );
            }
          }
        }
        if (identicalVia) {
          if (typeof identicalVia === "string") {
            if (!relationKeys.includes(identicalVia)) {
              throw new Error(
                `${codec.name} claims attribute '${attributeName}' is identicalVia relation '${identicalVia}', but there is no such relation.`,
              );
            }
          } else {
            if (!relationKeys.includes(identicalVia.relation)) {
              throw new Error(
                `${codec.name} claims attribute '${attributeName}' is identicalVia relation '${identicalVia.relation}', but there is no such relation.`,
              );
            }
          }
        }
      });
    }
  }
}

export function makeRegistryBuilder(): EmptyRegistryBuilder {
  const registryConfig: _AnyPgRegistryConfig = {
    pgCodecs: Object.create(null),
    pgResources: Object.create(null),
    pgRelations: Object.create(null),
  };

  const builder: _AnyPgRegistryBuilder = {
    getRegistryConfig() {
      return registryConfig;
    },

    addCodec(codec) {
      const existing = registryConfig.pgCodecs[codec.name];
      if (existing) {
        if (existing !== codec) {
          throw new Error(
            `Attempted to add a second codec named '${
              codec.name
            }' (existing: ${inspect(existing)}, new: ${inspect(codec)})`,
          );
        }
        return builder;
      }
      registryConfig.pgCodecs[codec.name] = codec;
      if (codec.arrayOfCodec) {
        this.addCodec(codec.arrayOfCodec);
      }
      if (codec.domainOfCodec) {
        this.addCodec(codec.domainOfCodec);
      }
      if (codec.rangeOfCodec) {
        this.addCodec(codec.rangeOfCodec);
      }
      if (codec.attributes) {
        for (const col of Object.values(
          codec.attributes as Record<string, _AnyPgCodecAttribute>,
        )) {
          this.addCodec(col.codec);
        }
      }
      return builder;
    },

    addResource(resource) {
      const existing = registryConfig.pgResources[resource.name];
      if (existing) {
        if (existing !== resource) {
          throw new Error(
            `Attempted to add a second resource named '${
              resource.name
            }':\n  First represented ${printResourceFrom(
              existing,
            )}.\n  Second represents ${printResourceFrom(
              resource,
            )}.\n  Details: ${chalk.bold.blue.underline`https://err.red/p2rc`}`,
          );
        }
        return builder;
      }
      this.addCodec(resource.codec);
      registryConfig.pgResources[resource.name] = resource;
      return builder;
    },

    addRelation(localCodec, relationName, remoteResourceOptions, relation) {
      if (!registryConfig.pgCodecs[localCodec.name]) {
        throw new Error(
          `Adding a relation before adding the codec is forbidden.`,
        );
      }
      if (!registryConfig.pgResources[remoteResourceOptions.name]) {
        throw new Error(
          `Adding a relation before adding the resource is forbidden.`,
        );
      }
      if (!registryConfig.pgRelations[localCodec.name]) {
        registryConfig.pgRelations[localCodec.name] = Object.create(null);
      }
      registryConfig.pgRelations[localCodec.name][relationName] = {
        localCodec,
        remoteResourceOptions,
        name: relationName,
        ...relation,
      };
      return builder;
    },

    build() {
      return EXPORTABLE(
        (makeRegistry, registryConfig) => makeRegistry(registryConfig),
        [makeRegistry, registryConfig],
      );
    },
  };
  return builder;
}

exportAs("@dataplan/pg", makeRegistryBuilder, "makeRegistryBuilder");

export function makePgResourceOptions<
  const TName extends string,
  const TCodec extends _AnyPgCodec,
  const TAttributes extends PgCodecAttributes<TCodec>,
  const TUniques extends PgResourceUnique<
    TAttributes[keyof TAttributes]
  > = never,
  const TParameters extends _AnyPgResourceParameter = never,
>(
  options: PgResourceOptions<TName, TCodec, TUniques, TParameters>,
): PgResourceOptions<TName, TCodec, TUniques, TParameters> {
  return options;
}

exportAs("@dataplan/pg", makePgResourceOptions, "makePgResourceOptions");

function printResourceFrom<
  TResource extends PgResourceOptions<
    any,
    _AnyPgCodec,
    any,
    _AnyPgResourceParameter
  >,
>(resource: TResource): string {
  if (typeof resource.from === "function") {
    return `a function accepting ${resource.parameters
      ?.length} parameters and returning SQL type '${
      sql.compile(resource.codec.sqlType).text
    }'`;
  } else {
    return `a table/view/etc called '${sql.compile(resource.from).text}'`;
  }
}
