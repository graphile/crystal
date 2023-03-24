/* eslint-disable graphile-export/export-instances */
import chalk from "chalk";
import type {
  GrafastResultStreamList,
  GrafastValuesList,
  ObjectStep,
} from "grafast";
import {
  __ValueStep,
  arraysMatch,
  constant,
  ExecutableStep,
  partitionByIndex,
} from "grafast";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type {
  PgTypeColumns,
  PgTypeColumnVia,
  PgTypeColumnViaExplicit,
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
import { exportAs } from "./exportAs.js";
import type {
  GetPgCodecColumns,
  GetPgRegistryCodecs,
  GetPgRegistryCodecRelations,
  PgEnumTypeCodec,
  PgRefDefinition,
  PgRegistry,
  PgTypeCodec,
  PgTypeCodecAny,
  PlanByUniques,
  PgSourceParameterAny,
  PgCodecRelation,
  PgTypeCodecWithColumns,
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

/**
 * Extra metadata you can attach to a unique constraint.
 */
export interface PgSourceUniqueExtensions {}

/**
 * Space for extra metadata about this source
 */
export interface PgSourceExtensions {}

export interface PgSourceParameterExtensions {
  variant?: string;
}

/**
 * If this is a functional (rather than static) source, this describes one of
 * the parameters it accepts.
 */
export interface PgSourceParameter<
  TName extends string | null,
  TCodec extends PgTypeCodecAny,
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
  extensions?: PgSourceParameterExtensions;
}

/**
 * Description of a unique constraint on a PgSource.
 */
export interface PgSourceUnique<
  TColumns extends PgTypeColumns = PgTypeColumns,
> {
  /**
   * The columns that are unique
   */
  columns: ReadonlyArray<keyof TColumns & string>;
  /**
   * If this is true, this represents the "primary key" of the source.
   */
  isPrimary?: boolean;
  /**
   * Space for you to add your own metadata
   */
  extensions?: PgSourceUniqueExtensions;
}

export interface PgCodecRefPathEntry {
  relationName: string;
  // Could add conditions here
}

export type PgCodecRefPath = PgCodecRefPathEntry[];
export interface PgCodecRefExtensions {}

export interface PgCodecRef {
  definition: PgRefDefinition;
  paths: Array<PgCodecRefPath>;
  extensions?: PgCodecRefExtensions;
}

export interface PgCodecRefs {
  [refName: string]: PgCodecRef;
}

/**
 * Configuration options for your PgSource
 */
export interface PgSourceOptions<
  TCodec extends PgTypeCodecAny,
  TUniques extends ReadonlyArray<PgSourceUnique<GetPgCodecColumns<TCodec>>>,
  TParameters extends readonly PgSourceParameterAny[] | undefined = undefined,
  TName extends string = string,
> {
  /**
   * The associated codec for thsi source
   */
  codec: TCodec;
  /**
   * The PgExecutor to use when servicing this source; different executors can
   * have different caching rules. A plan that uses one executor cannot be
   * inlined into a plan for a different executor.
   */
  executor: PgExecutor;

  // TODO: auth should also apply to insert, update and delete, maybe via insertAuth, updateAuth, etc
  selectAuth?: (
    $step: PgSelectStep<PgSource<any, TCodec, any, any, any>>,
  ) => void;

  name: TName;
  identifier?: string;
  source: TParameters extends readonly PgSourceParameterAny[]
    ? (...args: PgSelectArgumentDigest[]) => SQL
    : SQL;
  uniques?: TUniques;
  extensions?: PgSourceExtensions;
  parameters?: TParameters;
  description?: string;
  /**
   * Set true if this source will only return at most one record - this is
   * generally only useful for PostgreSQL function sources, in which case you
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
   * "Virtual" sources cannot be selected from/inserted to/etc, they're
   * normally used to generate other sources that are _not_ virtual.
   */
  isVirtual?: boolean;
}

export interface PgFunctionSourceOptions<
  TCodec extends PgTypeCodecAny,
  TUniques extends ReadonlyArray<PgSourceUnique<GetPgCodecColumns<TCodec>>>,
  TNewParameters extends readonly PgSourceParameterAny[],
  TNewName extends string,
> {
  name: TNewName;
  identifier?: string;
  source: (...args: PgSelectArgumentDigest[]) => SQL;
  parameters: TNewParameters;
  returnsSetof: boolean;
  returnsArray: boolean;
  uniques?: TUniques;
  extensions?: PgSourceExtensions;
  isMutation?: boolean;
  selectAuth?: (
    $step: PgSelectStep<PgSource<any, TCodec, any, any, any>>,
  ) => void;
  description?: string;
}

const $$codecSource = Symbol("codecSource");
const $$codecCounter = Symbol("codecCounter");

// TODO: is this needed any more, now that we've moved codecs to owning relations?
type CodecWithSource<TCodec extends PgTypeCodecAny> = TCodec & {
  [$$codecSource]?: Map<any, any>;
  [$$codecCounter]?: number;
};

/**
 * PgSource represents any source of SELECT-able data in Postgres: tables,
 * views, functions, etc.
 */
export class PgSource<
  TRegistry extends PgRegistry<any, any, any>,
  TCodec extends PgTypeCodecAny,
  TUniques extends ReadonlyArray<PgSourceUnique<GetPgCodecColumns<TCodec>>>,
  TParameters extends readonly PgSourceParameterAny[] | undefined = undefined,
  TName extends string = string,
> {
  public readonly registry: TRegistry;
  public readonly codec: TCodec;
  public readonly executor: PgExecutor;
  public readonly name: TName;
  public readonly identifier: string;
  public readonly source: SQL | ((...args: PgSelectArgumentDigest[]) => SQL);
  public readonly uniques: TUniques;
  private selectAuth?: (
    $step: PgSelectStep<PgSource<TRegistry, TCodec, any, any, any>>,
  ) => void;

  // TODO: make a public interface for this information
  /**
   * If present, implies that the source represents a `setof composite[]` (i.e.
   * an array of arrays) - and thus is not appropriate to use for GraphQL
   * Cursor Connections.
   *
   * @internal
   */
  public sqlPartitionByIndex: SQL | null = null;

  public readonly parameters: TParameters;
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
   * "Virtual" sources cannot be selected from/inserted to/etc, they're
   * normally used to generate other sources that are _not_ virtual.
   */
  public readonly isVirtual: boolean;

  public extensions: Partial<PgSourceExtensions> | undefined;

  // TODO: delete me?
  static configFromCodec<TCodec extends PgTypeCodecAny>(
    executor: PgExecutor,
    baseCodec: TCodec,
  ): PgSourceOptions<TCodec, never[]> {
    const codec: CodecWithSource<typeof baseCodec> = baseCodec;
    if (!codec[$$codecSource]) {
      codec[$$codecSource] = new Map();
    }
    if (codec[$$codecSource].has(executor)) {
      return codec[$$codecSource].get(executor);
    }

    let counter = codec[$$codecCounter];
    if (counter) {
      counter++;
    } else {
      counter = 1;
    }
    codec[$$codecCounter] = counter;

    // "From Codec"
    const name = `frmcdc_${codec.name}_${counter}`;
    const source = EXPORTABLE(
      (codec, executor, name, sql) => ({
        executor,
        source: sql`(select 1/0 /* codec-only source; should not select directly */)`,
        codec,
        name,
        identifier: name,
      }),
      [codec, executor, name, sql],
    );

    codec[$$codecSource].set(executor, source);

    return source;
  }

  /**
   * @param source - the SQL for the `FROM` clause (without any
   * aliasing). If this is a subquery don't forget to wrap it in parens.
   * @param name - a nickname for this data source. Doesn't need to be unique
   * (but should be). Used for making the SQL query and debug messages easier
   * to understand.
   */
  constructor(
    registry: TRegistry,
    options: PgSourceOptions<TCodec, TUniques, TParameters, TName>,
  ) {
    const {
      codec,
      executor,
      name,
      identifier,
      source,
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
    this.source = source;
    this.uniques = uniques ?? ([] as never);
    this.parameters = parameters as TParameters;
    this.description = description;
    this.isUnique = !!isUnique;
    this.sqlPartitionByIndex = sqlPartitionByIndex ?? null;
    this.isMutation = !!isMutation;
    this.isList = !!isList;
    this.isVirtual = isVirtual ?? false;
    this.selectAuth = selectAuth;

    // parameters is null iff source is not a function
    const sourceIsFunction = typeof this.source === "function";
    if (this.parameters == null && sourceIsFunction) {
      throw new Error(
        `Source ${this} is invalid - it's a function but without a parameters array. If the function accepts no parameters please pass an empty array.`,
      );
    }
    if (this.parameters != null && !sourceIsFunction) {
      throw new Error(
        `Source ${this} is invalid - parameters can only be specified when the source is a function.`,
      );
    }

    if (this.codec.arrayOfCodec?.columns) {
      throw new Error(
        `Source ${this} is invalid - creating a source that returns an array of a composite type is forbidden; please \`unnest\` the array.`,
      );
    }

    if (this.isUnique && this.sqlPartitionByIndex) {
      throw new Error(
        `Source ${this} is invalid - cannot be unique and also partitionable`,
      );
    }
  }

  /**
   * Often you can access table records from a table directly but also from a
   * view or materialized view.  This method makes it convenient to construct
   * multiple datasources that all represent the same underlying table
   * type/relations/etc.
   */
  static alternativeSourceOptions<
    TCodec extends PgTypeCodecAny,
    const TNewUniques extends ReadonlyArray<
      PgSourceUnique<GetPgCodecColumns<TCodec>>
    >,
    const TNewName extends string,
  >(
    baseOptions: PgSourceOptions<TCodec, any, undefined, any>,
    overrideOptions: {
      name: TNewName;
      identifier?: string;
      source: SQL;
      uniques?: TNewUniques;
      extensions?: PgSourceExtensions;
    },
  ): PgSourceOptions<TCodec, TNewUniques, undefined, TNewName> {
    const { name, identifier, source, uniques, extensions } = overrideOptions;
    const { codec, executor, selectAuth } = baseOptions;
    return {
      codec,
      executor,
      name,
      identifier,
      source,
      uniques,
      parameters: undefined,
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
  static functionSourceOptions<
    TCodec extends PgTypeCodecAny,
    const TNewParameters extends readonly PgSourceParameterAny[],
    const TNewUniques extends ReadonlyArray<
      PgSourceUnique<GetPgCodecColumns<TCodec>>
    >,
    const TNewName extends string,
  >(
    baseOptions: PgSourceOptions<TCodec, any, any, any>,
    overrideOptions: PgFunctionSourceOptions<
      TCodec,
      TNewUniques,
      TNewParameters,
      TNewName
    >,
  ): PgSourceOptions<TCodec, TNewUniques, TNewParameters, TNewName> {
    const { codec, executor, selectAuth } = baseOptions;
    const {
      name,
      identifier,
      source: fnSource,
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
        source: fnSource as any,
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
      const source = EXPORTABLE(
        (fnSource, sql) =>
          (...args: PgSelectArgumentDigest[]) =>
            sql`unnest(${fnSource(...args)})`,
        [fnSource, sql],
      );
      return {
        codec,
        executor,
        name,
        identifier,
        source: source as any,
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
      const source = EXPORTABLE(
        (fnSource, sql, sqlPartitionByIndex, sqlTmp) =>
          (...args: PgSelectArgumentDigest[]) =>
            sql`${fnSource(
              ...args,
            )} with ordinality as ${sqlTmp} (arr, ${sqlPartitionByIndex}) cross join lateral unnest (${sqlTmp}.arr)`,
        [fnSource, sql, sqlPartitionByIndex, sqlTmp],
      );
      return {
        codec,
        executor,
        name,
        identifier,
        source: source as any,
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
    return chalk.bold.blue(`PgSource(${this.name})`);
  }

  public getRelations(): GetPgRegistryCodecRelations<TRegistry, TCodec> {
    return this.registry.pgRelations[this.codec.name];
  }

  public getRelation<
    TRelationName extends keyof GetPgRegistryCodecRelations<TRegistry, TCodec>,
  >(
    name: TRelationName,
  ): GetPgRegistryCodecRelations<TRegistry, TCodec>[TRelationName] {
    return this.getRelations()[name];
  }

  public resolveVia(
    via: PgTypeColumnVia,
    attr: string,
  ): PgTypeColumnViaExplicit {
    if (!via) {
      throw new Error("No via to resolve");
    }
    if (typeof via === "string") {
      // Check
      const relation = this.getRelation(via);
      if (!relation) {
        throw new Error(`Unknown relation '${via}' in ${this}`);
      }
      if (!relation.source.codec.columns[attr]) {
        throw new Error(
          `${this} relation '${via}' does not have column '${attr}'`,
        );
      }
      return { relation: via, attribute: attr };
    } else {
      return via;
    }
  }

  public getReciprocal<
    TOtherCodec extends GetPgRegistryCodecs<TRegistry>[keyof GetPgRegistryCodecs<TRegistry>],
    TOtherRelationName extends keyof GetPgRegistryCodecRelations<
      TRegistry,
      TOtherCodec
    >,
  >(
    otherCodec: TOtherCodec,
    otherRelationName: TOtherRelationName,
  ):
    | [
        relationName: keyof GetPgRegistryCodecRelations<TRegistry, TCodec>,
        relation: GetPgRegistryCodecRelations<
          TRegistry,
          TCodec
        >[keyof GetPgRegistryCodecRelations<TRegistry, TCodec>],
      ]
    | null {
    if (this.parameters) {
      throw new Error(
        ".getReciprocal() cannot be used with functional sources; please use .execute()",
      );
    }
    const otherRelation =
      this.registry.pgRelations[otherCodec.name]?.[otherRelationName];
    const relations = this.getRelations();
    const reciprocal = (
      Object.entries(relations) as Array<
        [
          relationName: keyof GetPgRegistryCodecRelations<TRegistry, TCodec>,
          relation: GetPgRegistryCodecRelations<
            TRegistry,
            TCodec
          >[keyof GetPgRegistryCodecRelations<TRegistry, TCodec>],
        ]
      >
    ).find(([_relationName, relation]) => {
      if (relation.source.codec !== otherCodec) {
        return false;
      }
      if (!arraysMatch(relation.localColumns, otherRelation.remoteColumns)) {
        return false;
      }
      if (!arraysMatch(relation.remoteColumns, otherRelation.localColumns)) {
        return false;
      }
      return true;
    });
    return reciprocal || null;
  }

  public get(
    spec: PlanByUniques<GetPgCodecColumns<TCodec>, TUniques>,
    // This is internal, it's an optimisation we can use but you shouldn't.
    _internalOptionsDoNotPass?: PgSelectSinglePlanOptions,
  ): GetPgCodecColumns<TCodec> extends PgTypeColumns
    ? PgSelectSingleStep<this>
    : PgClassExpressionStep<TCodec, this> {
    if (this.parameters) {
      throw new Error(
        ".get() cannot be used with functional sources; please use .execute()",
      );
    }
    if (!spec) {
      throw new Error(`Cannot ${this}.get without a valid spec`);
    }
    const keys = Object.keys(spec) as ReadonlyArray<string> as ReadonlyArray<
      keyof GetPgCodecColumns<TCodec>
    >;
    if (
      !this.uniques.some((uniq) =>
        uniq.columns.every((key) => keys.includes(key as any)),
      )
    ) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) at child field (TODO: which one?) but that combination of columns is not unique (uniques: ${JSON.stringify(
          this.uniques,
        )}). Did you mean to call .find() instead?`,
      );
    }
    return this.find(spec).single(_internalOptionsDoNotPass) as any;
  }

  public find(
    spec: {
      [key in keyof GetPgCodecColumns<TCodec>]?:
        | ExecutableStep
        | string
        | number;
    } = Object.create(null),
  ): PgSelectStep<this> {
    if (this.parameters) {
      throw new Error(
        ".get() cannot be used with functional sources; please use .execute()",
      );
    }
    if (!this.codec.columns) {
      throw new Error("Cannot call find if there's no columns");
    }
    const columns = this.codec.columns as NonNullable<
      GetPgCodecColumns<TCodec>
    >;
    const keys = Object.keys(spec); /* as Array<keyof typeof columns>*/
    const invalidKeys = keys.filter((key) => columns[key] == null);
    if (invalidKeys.length > 0) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) but that request included columns that we don't know about: '${invalidKeys.join(
          "', '",
        )}'`,
      );
    }

    const identifiers = keys.map((key): PgSelectIdentifierSpec => {
      const column = columns[key];
      if ("via" in column && column.via) {
        throw new Error(
          `Attribute '${String(
            key,
          )}' is defined with a 'via' and thus cannot be used as an identifier for '.find()' or '.get()' calls (requested keys: '${keys.join(
            "', '",
          )}').`,
        );
      }
      const { codec } = column;
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
            : constant(stepOrConstant),
        codec,
        matches: (alias: SQL) =>
          typeof column.expression === "function"
            ? column.expression(alias)
            : sql`${alias}.${sql.identifier(key as string)}`,
      };
    });
    return pgSelect({ source: this, identifiers }) as PgSelectStep<this>;
  }

  execute(
    args: Array<PgSelectArgumentSpec> = [],
    mode: PgSelectMode = this.isMutation ? "mutation" : "normal",
  ): ExecutableStep<unknown> {
    const $select = pgSelect({
      source: this,
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
      this.selectAuth(
        $step as unknown as PgSelectStep<
          PgSource<TRegistry, TCodec, any, any, any>
        >,
      );
    }
    // e.g. $step.where(sql`user_id = ${me}`);
    return;
  }

  /**
   * @deprecated Please use `.executor.context()` instead - all sources for the
   * same executor must use the same context to allow for SQL inlining, unions,
   * etc.
   */
  public context(): ObjectStep<PgExecutorContextPlans> {
    return this.executor.context();
  }

  public executeWithCache<TInput = any, TOutput = any>(
    values: GrafastValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: GrafastValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.executeWithCache(values, options);
  }

  public executeWithoutCache<TInput = any, TOutput = any>(
    values: GrafastValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: GrafastValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.executeWithoutCache(values, options);
  }

  public executeStream<TInput = any, TOutput = any>(
    values: GrafastValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ streams: GrafastResultStreamList<TOutput> }> {
    return this.executor.executeStream(values, options);
  }

  public executeMutation<TData>(
    options: PgExecutorMutationOptions,
  ): Promise<PgClientResult<TData>> {
    return this.executor.executeMutation<TData>(options);
  }

  /**
   * Returns an SQL fragment that evaluates to `'true'` (string) if the row is
   * non-null and `'false'` or `null` otherwise.
   *
   * @see {@link PgTypeCodec.notNullExpression}
   */
  public getNullCheckExpression(alias: SQL): SQL | null {
    if (this.codec.notNullExpression) {
      // Use the user-provided check
      return this.codec.notNullExpression(alias);
    } else {
      // Every column in a primary key is non-nullable; so just see if one is null
      const pk = this.uniques.find((u) => u.isPrimary);
      const nonNullableColumn = this.codec.columns
        ? Object.entries(this.codec.columns).find(
            ([_columnName, spec]) =>
              !spec.via && !spec.expression && spec.notNull,
          )?.[0]
        : null ?? pk?.columns[0];
      if (nonNullableColumn) {
        const firstColumn = sql`${alias}.${sql.identifier(nonNullableColumn)}`;
        return sql`(not (${firstColumn} is null))::text`;
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
exportAs(PgSource, "PgSource");

export interface PgEnumSourceExtensions {}

export interface PgEnumSourceOptions<TValue extends string> {
  codec: PgEnumTypeCodec<TValue>;
  extensions?: PgEnumSourceExtensions;
}

// TODO: is this the best way of solving the problem of enums vs sources?
export class PgEnumSource<TValue extends string> {
  public readonly codec: PgEnumTypeCodec<TValue>;
  public readonly extensions: PgEnumSourceExtensions | undefined;
  constructor(options: PgEnumSourceOptions<TValue>) {
    this.codec = options.codec;
    this.extensions = options.extensions || {};
  }
}
exportAs(PgEnumSource, "PgEnumSource");

/*
export function makeRegistry<
TInCodec,
TInSource
>(codecs: TCodecs[], sources: TSources[]) {
  const foo = {
    withRelation(relation: PgCodecRelation<>):
  };
  return foo;
  return function withRelations(relations: TRelations):  {
  }
}
*/

export type Simplify<T> = { [TKey in keyof T]: T[TKey] } & {};

export interface PgRegistryBuilder<
  TCodecs extends {
    [name in string]: PgTypeCodec<
      name,
      PgTypeColumns | undefined,
      any,
      any,
      any,
      any,
      any
    >;
  },
  TSources extends {
    [name in string]: PgSourceOptions<
      PgTypeCodecAny,
      ReadonlyArray<PgSourceUnique<PgTypeColumns>>,
      readonly PgSourceParameterAny[] | undefined,
      name
    >;
  },
  TRelations extends {
    [codecName in keyof TCodecs]?: {
      [relationName in string]: PgCodecRelation<
        PgTypeCodec<string, PgTypeColumns, any, any, undefined, any, undefined>,
        PgSourceOptions<PgTypeCodecWithColumns, any, any, any>
      >;
    };
  },
> {
  addCodec<const TCodec extends PgTypeCodecAny>(
    codec: TCodec,
  ): PgRegistryBuilder<
    TCodec extends PgTypeCodec<infer UName, any, any, any, any, any, any>
      ? Simplify<
          TCodecs & {
            [name in UName]: TCodec;
          }
        >
      : never,
    TSources,
    TRelations
  >;
  addSource<const TSource extends PgSourceOptions<any, any, any, any>>(
    source: TSource,
  ): PgRegistryBuilder<
    TSource extends PgSourceOptions<infer UCodec, any, any, any>
      ? UCodec extends PgTypeCodec<infer UName, any, any, any, any, any, any>
        ? Simplify<
            TCodecs & {
              [name in UName]: UCodec;
            }
          >
        : never
      : never,
    TSource extends PgSourceOptions<any, any, any, infer UName>
      ? Simplify<
          TSources & {
            [name in UName]: TSource;
          }
        >
      : never,
    TRelations
  >;
  addRelation<
    TCodec extends PgTypeCodec<
      string,
      PgTypeColumns,
      any,
      any,
      undefined,
      any,
      undefined
    >,
    const TCodecRelationName extends string,
    TRemoteSource extends PgSourceOptions<any, any, any, any>,
    const TCodecRelation extends Omit<
      PgCodecRelation<TCodec, TRemoteSource>,
      "localCodec" | "remoteSource"
    >,
  >(
    codec: TCodec,
    relationName: TCodecRelationName,
    remoteSource: TRemoteSource,
    relation: TCodecRelation,
  ): PgRegistryBuilder<
    TCodecs,
    TSources,
    TCodec extends PgTypeCodec<infer UName, any, any, any, any, any, any>
      ? Simplify<
          TRelations & {
            [relationName in TCodecRelationName]: TRelations[UName] &
              TCodecRelation;
          }
        >
      : never
  >;

  /** Only use this for building sources */
  getUntypedRegistry(): PgRegistry<any, any, any>;
  build(): PgRegistry<TCodecs, TSources, TRelations>;
}

export function makeRegistryBuilder(): PgRegistryBuilder<{}, {}, {}> {
  const registry: PgRegistry<any, any, any> = {
    pgCodecs: {},
    pgSources: {},
    pgRelations: {},
  };
  const builder: PgRegistryBuilder<any, any, any> = {
    addCodec(codec) {
      registry.pgCodecs[codec.name] = codec;
      return builder;
    },
    addCodecs(codecs) {
      for (const codec of codecs) {
        registry.pgCodecs[codec.name] = codec;
      }
      return builder;
    },
    addSource(source) {
      registry.pgSources[source.name] = source;
      return builder;
    },
    addSources(sources) {
      for (const source of sources) {
        registry.pgSources[source.name] = source;
      }
      return builder;
    },
    addRelation(localCodec, relationName, remoteSource, relation) {
      if (!registry.pgRelations[localCodec.name]) {
        registry.pgRelations[localCodec.name] = Object.create(null);
      }
      registry.pgRelations[localCodec.name][relationName] = {
        localCodec,
        remoteSource,
        ...relation,
      };
      return builder;
    },
    getUntypedRegistry() {
      return registry;
    },
    build() {
      return registry;
    },
  };
  return builder;
}

exportAs(makeRegistryBuilder, "makeRegistryBuilder");

export function makePgSourceOptions<
  const TSourceOptions extends PgSourceOptions<any, any, any, any>,
>(options: TSourceOptions) {
  return options;
}
exportAs(makePgSourceOptions, "makePgSourceOptions");
