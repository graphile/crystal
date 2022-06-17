/* eslint-disable graphile-export/export-instances */
import chalk from "chalk";
import type {
  CrystalResultStreamList,
  CrystalValuesList,
  ObjectPlan,
} from "dataplanner";
import {
  __ValuePlan,
  arraysMatch,
  constant,
  ExecutablePlan,
  getCurrentParentPathIdentity,
  partitionByIndex,
} from "dataplanner";
import { EXPORTABLE } from "graphile-export";
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
  PgEnumTypeCodec,
  PgTypeCodec,
  PlanByUniques,
} from "./interfaces.js";
import type { PgClassExpressionPlan } from "./plans/pgClassExpression.js";
import type { PgSelectArgumentSpec, PgSelectPlan } from "./plans/pgSelect.js";
import { pgSelect } from "./plans/pgSelect.js";
import type {
  PgSelectSinglePlan,
  PgSelectSinglePlanOptions,
} from "./plans/pgSelectSingle.js";

// TODO: PgSourceRow and PgSourceRowAttribute are lies; we don't use them even
// though we claim to. Everything that references them needs to be typed in a
// different way.
export type PgSourceRowAttribute<
  TColumns extends PgTypeColumns,
  TAttribute extends keyof TColumns,
> = ReturnType<TColumns[TAttribute]["codec"]["fromPg"]>;
export type PgSourceRow<TColumns extends PgTypeColumns | undefined> =
  TColumns extends PgTypeColumns
    ? {
        [key in keyof TColumns]: PgSourceRowAttribute<TColumns, key>;
      }
    : undefined;

/**
 * Extra metadata you can attach to a source relation.
 */
export interface PgSourceRelationExtensions {}
/**
 * Extra metadata you can attach to a unique constraint.
 */
export interface PgSourceUniqueExtensions {}

/**
 * Describes a relation to another source
 */
export interface PgSourceRelation<
  TLocalColumns extends PgTypeColumns,
  TRemoteColumns extends PgTypeColumns,
> {
  /**
   * The remote source this relation relates to.
   */
  source:
    | PgSourceBuilder<TRemoteColumns, any, any>
    | PgSource<TRemoteColumns, any, any, any>;

  /**
   * The columns locally used in this relationship.
   */
  localColumns: readonly (keyof TLocalColumns)[];

  /**
   * The remote columns that are joined against.
   */
  remoteColumns: ReadonlyArray<keyof TRemoteColumns>;

  /**
   * If true then there's at most one record this relationship will find.
   */
  isUnique: boolean;

  /**
   * If true then this is a reverse lookup, so multiple rows may be found
   * (unless isUnique is true).
   */
  isBackwards?: boolean;

  /**
   * Space for you to add your own metadata.
   */
  extensions?: PgSourceRelationExtensions;
}

/**
 * Space for extra metadata about this source
 */
export interface PgSourceExtensions {}

/**
 * If this is a functional (rather than static) source, this describes one of
 * the parameters it accepts.
 */
export interface PgSourceParameter {
  /**
   * Name of the parameter, if null then we must use positional rather than
   * named arguments
   */
  name: string | null;
  /**
   * The type of this parameter
   */
  codec: PgTypeCodec<any, any, any>;
  /**
   * If true, then this parameter must be supplied, otherwise it's optional.
   */
  required: boolean;
  /**
   * If true and the parameter is supplied, then the parameter must not be
   * null.
   */
  notNull?: boolean;
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

/**
 * Configuration options for your PgSource
 */
export interface PgSourceOptions<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
> {
  /**
   * The associated codec for thsi source
   */
  codec: PgTypeCodec<TColumns, any, any, any>;
  /**
   * The PgExecutor to use when servicing this source; different executors can
   * have different caching rules. A plan that uses one executor cannot be
   * inlined into a plan for a different executor.
   */
  executor: PgExecutor;

  // TODO: auth should also apply to insert, update and delete, maybe via insertAuth, updateAuth, etc
  selectAuth?: ($plan: PgSelectPlan<any, any, any, any>) => void;

  name: string;
  identifier?: string;
  source: TParameters extends PgSourceParameter[]
    ? (...args: SQL[]) => SQL
    : SQL;
  uniques?: TUniques;
  relations?: TRelations | (() => TRelations);
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
}

export interface PgFunctionSourceOptions<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TNewParameters extends PgSourceParameter[],
> {
  name: string;
  identifier?: string;
  source: (...args: SQL[]) => SQL;
  parameters: TNewParameters;
  returnsSetof: boolean;
  returnsArray: boolean;
  uniques?: TUniques;
  extensions?: PgSourceExtensions;
  isMutation?: boolean;
  selectAuth?: ($plan: PgSelectPlan<any, any, any, any>) => void;
}
// TODO: is there a better way?
/**
 * This class hacks around TypeScript inference issues by allowing us to define
 * the relations at a later step to avoid circular references.
 */
export class PgSourceBuilder<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TParameters extends PgSourceParameter[] | undefined = undefined,
> {
  /** TypeScript hack, avoid. @internal */
  TColumns!: TColumns;
  /** TypeScript hack, avoid. @internal */
  TUniques!: TUniques;
  /** TypeScript hack, avoid. @internal */
  TRelations!: never;
  /** TypeScript hack, avoid. @internal */
  TParameters!: TParameters;

  private built: PgSource<TColumns, TUniques, any, TParameters> | null = null;
  public codec: PgTypeCodec<TColumns, any, any>;
  public uniques: TUniques | undefined;
  public readonly extensions: Partial<PgSourceExtensions> | undefined;
  private readonly name: string;
  constructor(
    private options: Omit<
      PgSourceOptions<TColumns, TUniques, any, TParameters>,
      "relations"
    >,
  ) {
    this.codec = options.codec;
    this.uniques = options.uniques;
    this.extensions = options.extensions;
    this.name = options.name;
  }

  public toString(): string {
    return chalk.bold.blueBright(`PgSourceBuilder(${this.options.name})`);
  }

  build<
    TRelations extends {
      [identifier: string]: TColumns extends PgTypeColumns
        ? PgSourceRelation<TColumns, any>
        : never;
    },
  >({
    relations,
  }: {
    relations?: TRelations;
  }): PgSource<TColumns, TUniques, TRelations, TParameters> {
    if (this.built) {
      throw new Error("This builder has already been built!");
    }
    this.built = new PgSource({
      ...this.options,
      ...(relations
        ? {
            relations: () => {
              // Replace the PgSourceBuilders with PgSources
              return Object.keys(relations).reduce((memo, key) => {
                const spec = relations[key];
                if (spec.source instanceof PgSourceBuilder) {
                  const { source: sourceBuilder, ...rest } = spec;
                  const source = sourceBuilder.get();
                  memo[key] = {
                    source,
                    ...rest,
                  };
                } else {
                  memo[key] = spec;
                }
                return memo;
              }, {});
            },
          }
        : null),
    });
    return this.built;
  }

  get(): PgSource<TColumns, TUniques, any, TParameters> {
    if (!this.built) {
      throw new Error(
        `This builder (${this.options.name}) has not been built!`,
      );
    }
    return this.built;
  }
}
exportAs(PgSourceBuilder, "PgSourceBuilder");

const $$codecSource = Symbol("codecSource");
let temporarySourceCounter = 0;

/**
 * PgSource represents any source of SELECT-able data in Postgres: tables,
 * views, functions, etc.
 */
export class PgSource<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
> {
  /** TypeScript hack, avoid. @internal */
  TColumns!: TColumns;
  /** TypeScript hack, avoid. @internal */
  TUniques!: TUniques;
  /** TypeScript hack, avoid. @internal */
  TRelations!: TRelations;
  /** TypeScript hack, avoid. @internal */
  TParameters!: TParameters;

  public readonly codec: PgTypeCodec<TColumns, any, any, any>;
  public readonly executor: PgExecutor;
  public readonly name: string;
  public readonly identifier: string;
  public readonly source: SQL | ((...args: SQL[]) => SQL);
  public readonly uniques: TUniques;
  private readonly _options: PgSourceOptions<
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >;
  private relationsThunk: (() => TRelations) | null;
  private _relations: TRelations | null = null;
  private selectAuth?: ($plan: PgSelectPlan<any, any, any, any>) => void;

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

  public readonly extensions: Partial<PgSourceExtensions> | undefined;

  static fromCodec<TColumns extends PgTypeColumns>(
    executor: PgExecutor,
    codec: PgTypeCodec<TColumns, any, any>,
  ): PgSource<TColumns, any, any, undefined> {
    if (!codec[$$codecSource]) {
      codec[$$codecSource] = new Map();
    }
    if (codec[$$codecSource].has(executor)) {
      return codec[$$codecSource].get(executor);
    }

    const name = `TemporarySource${++temporarySourceCounter}`;
    const source = EXPORTABLE(
      (PgSource, codec, executor, name, sql) =>
        new PgSource({
          executor,
          source: sql`(select 1/0 /* codec-only source; should not select directly */)`,
          codec,
          name,
          identifier: name,
        }),
      [PgSource, codec, executor, name, sql],
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
    options: PgSourceOptions<TColumns, TUniques, TRelations, TParameters>,
  ) {
    const {
      codec,
      executor,
      name,
      identifier,
      source,
      uniques,
      relations,
      extensions,
      parameters,
      description,
      isUnique,
      sqlPartitionByIndex,
      isMutation,
      selectAuth,
      isList,
    } = options;
    this._options = options;
    this.extensions = extensions;
    this.codec = codec;
    this.executor = executor;
    this.name = name;
    this.identifier = identifier ?? name;
    this.source = source;
    this.uniques =
      uniques ?? ([] as TUniques extends never[] ? TUniques : never);
    this.relationsThunk = typeof relations === "function" ? relations : null;
    if (typeof relations !== "function") {
      this._relations = relations || ({} as TRelations);
      this.validateRelations();
    }
    this.parameters = parameters as TParameters;
    this.description = description;
    this.isUnique = !!isUnique;
    this.sqlPartitionByIndex = sqlPartitionByIndex ?? null;
    this.isMutation = !!isMutation;
    this.isList = !!isList;
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
  public alternativeSource<
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TColumns, undefined>>
    >,
  >(overrideOptions: {
    name: string;
    identifier?: string;
    source: SQL;
    uniques?: TUniques;
    extensions?: PgSourceExtensions;
  }): PgSource<TColumns, TUniques, TRelations, undefined> {
    const { name, identifier, source, uniques, extensions } = overrideOptions;
    const { codec, executor, relations, selectAuth } = this._options;
    return new PgSource({
      codec,
      executor,
      name,
      identifier,
      source: source as any,
      uniques,
      relations,
      parameters: undefined,
      extensions,
      selectAuth,
    });
  }

  /**
   * Often you can access table records from a table directly but also from a
   * number of functions. This method makes it convenient to construct multiple
   * datasources that all represent the same underlying table
   * type/relations/etc but pull their rows from functions.
   */
  public functionSource<
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TColumns, undefined>>
    >,
    TNewParameters extends PgSourceParameter[],
  >(
    overrideOptions: PgFunctionSourceOptions<
      TColumns,
      TUniques,
      TNewParameters
    >,
  ) {
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
    } = overrideOptions;
    const { codec, executor, relations, selectAuth } = this._options;
    if (!returnsArray) {
      // This is the easy case
      return new PgSource<TColumns, TUniques, TRelations, TNewParameters>({
        codec,
        executor,
        name,
        identifier,
        source: fnSource as any,
        uniques,
        relations,
        parameters,
        extensions,
        isUnique: !returnsSetof,
        isMutation: Boolean(isMutation),
        selectAuth: overrideSelectAuth ?? selectAuth,
      });
    } else if (!returnsSetof) {
      // This is a `composite[]` function; convert it to a `setof composite` function:
      const source = EXPORTABLE(
        (fnSource, sql) =>
          (...args: SQL[]) =>
            sql`unnest(${fnSource(...args)})`,
        [fnSource, sql],
      );
      return new PgSource<TColumns, TUniques, TRelations, TNewParameters>({
        codec,
        executor,
        name,
        identifier,
        source: source as any,
        uniques,
        relations,
        parameters,
        extensions,
        isUnique: false, // set now, not unique
        isMutation: Boolean(isMutation),
        selectAuth: overrideSelectAuth ?? selectAuth,
        isList: true,
      });
    } else {
      // This is a `setof composite[]` function; convert it to `setof composite` and indicate that we should partition it.
      const sqlTmp = sql.identifier(Symbol(`${name}_tmp`));
      const sqlPartitionByIndex = sql.identifier(Symbol(`${name}_idx`));
      const source = EXPORTABLE(
        (fnSource, sql, sqlPartitionByIndex, sqlTmp) =>
          (...args: SQL[]) =>
            sql`${fnSource(
              ...args,
            )} with ordinality as ${sqlTmp} (arr, ${sqlPartitionByIndex}) cross join lateral unnest (${sqlTmp}.arr)`,
        [fnSource, sql, sqlPartitionByIndex, sqlTmp],
      );
      return new PgSource<TColumns, TUniques, TRelations, TNewParameters>({
        codec,
        executor,
        name,
        identifier,
        source: source as any,
        uniques,
        relations,
        parameters,
        extensions,
        isUnique: false, // set now, not unique
        sqlPartitionByIndex,
        isMutation: Boolean(isMutation),
        selectAuth: overrideSelectAuth ?? selectAuth,
      });
    }
  }

  public toString(): string {
    return chalk.bold.blue(`PgSource(${this.name})`);
  }

  private validateRelations(): void {
    // TODO: skip this if not isDev?

    if (!this._relations) {
      return;
    }

    // Check that all the `via` and `identicalVia` match actual relations.
    const relationKeys = Object.keys(this._relations);
    if (this.codec.columns) {
      Object.entries(this.codec.columns).forEach(([columnName, col]) => {
        const { via, identicalVia } = col;
        if (via) {
          if (typeof via === "string") {
            if (!relationKeys.includes(via)) {
              throw new Error(
                `${this} claims column '${columnName}' is via relation '${via}', but there is no such relation.`,
              );
            }
          } else {
            if (!relationKeys.includes(via.relation)) {
              throw new Error(
                `${this} claims column '${columnName}' is via relation '${via.relation}', but there is no such relation.`,
              );
            }
          }
        }
        if (identicalVia) {
          if (typeof identicalVia === "string") {
            if (!relationKeys.includes(identicalVia)) {
              throw new Error(
                `${this} claims column '${columnName}' is identicalVia relation '${identicalVia}', but there is no such relation.`,
              );
            }
          } else {
            if (!relationKeys.includes(identicalVia.relation)) {
              throw new Error(
                `${this} claims column '${columnName}' is identicalVia relation '${identicalVia.relation}', but there is no such relation.`,
              );
            }
          }
        }
      });
    }
  }

  public getRelations(): TRelations {
    if (typeof this.relationsThunk === "function") {
      this._relations = this.relationsThunk();
      this.relationsThunk = null;
      this.validateRelations();
    }
    if (!this._relations) {
      throw new Error("PgSource relations must not be null");
    }
    return this._relations;
  }

  public getRelation<TRelationName extends keyof TRelations>(
    name: TRelationName,
  ): TRelations[TRelationName] {
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
    TOtherDataSource extends PgSource<any, any, any, any>,
    TOtherRelationName extends Parameters<TOtherDataSource["getRelation"]>[0],
  >(
    otherDataSource: TOtherDataSource,
    otherRelationName: TOtherRelationName,
  ): [keyof TRelations, TRelations[keyof TRelations]] | null {
    if (this.parameters) {
      throw new Error(
        ".getReciprocal() cannot be used with functional sources; please use .execute()",
      );
    }
    const otherRelation = otherDataSource.getRelation(otherRelationName);
    const relations = this.getRelations();
    const reciprocal = (
      Object.entries(relations) as Array<
        [keyof TRelations, TRelations[keyof TRelations]]
      >
    ).find(([_relationName, relation]) => {
      if (relation.source !== otherDataSource) {
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
    spec: PlanByUniques<TColumns, TUniques>,
    // This is internal, it's an optimisation we can use but you shouldn't.
    _internalOptionsDoNotPass?: PgSelectSinglePlanOptions,
  ): TColumns extends PgTypeColumns
    ? PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters>
    : PgClassExpressionPlan<
        undefined,
        PgTypeCodec<undefined, any, any>,
        TColumns,
        TUniques,
        TRelations,
        TParameters
      > {
    if (this.parameters) {
      throw new Error(
        ".get() cannot be used with functional sources; please use .execute()",
      );
    }
    if (!spec) {
      throw new Error(`Cannot ${this}.get without a valid spec`);
    }
    const keys = Object.keys(spec) as ReadonlyArray<string> as ReadonlyArray<
      keyof TColumns
    >;
    if (
      !this.uniques.some((uniq) =>
        uniq.columns.every((key) => keys.includes(key as any)),
      )
    ) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) at child field (TODO: which one?) of '${getCurrentParentPathIdentity()}' but that combination of columns is not unique (uniques: ${JSON.stringify(
          this.uniques,
        )}). Did you mean to call .find() instead?`,
      );
    }
    return this.find(spec).single(_internalOptionsDoNotPass);
  }

  public find(
    spec: {
      [key in keyof TColumns]?: ExecutablePlan | string | number;
    } = Object.create(null),
  ): PgSelectPlan<TColumns, TUniques, TRelations, TParameters> {
    if (this.parameters) {
      throw new Error(
        ".get() cannot be used with functional sources; please use .execute()",
      );
    }
    if (!this.codec.columns) {
      throw new Error("Cannot call find if there's no columns");
    }
    const columns = this.codec.columns as NonNullable<TColumns>;
    const keys = Object.keys(spec) as Array<keyof typeof columns>;
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

    const identifiers = keys.map((key) => {
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
      const plan = spec[key as keyof TColumns];
      if (plan == undefined) {
        throw new Error(
          `Attempted to call ${this}.find({${keys.join(
            ", ",
          )}}) but failed to provide a plan for '${String(key)}'`,
        );
      }
      return {
        plan: plan instanceof ExecutablePlan ? plan : constant(plan),
        codec,
        matches: (alias: SQL) =>
          typeof column.expression === "function"
            ? column.expression(alias)
            : sql`${alias}.${sql.identifier(key as string)}`,
      };
    });
    return pgSelect({ source: this, identifiers });
  }

  execute(args: Array<PgSelectArgumentSpec> = []) {
    const $select = pgSelect({
      source: this,
      identifiers: [],
      args,
    });
    if (this.isMutation) {
      $select.hasSideEffects = true;
    }
    if (this.isUnique) {
      return $select.single();
    }
    const sqlPartitionByIndex = this.sqlPartitionByIndex;
    if (sqlPartitionByIndex) {
      // We're a setof array of composite type function, e.g. `setof users[]`, so we need to reconstitute the plan.
      return partitionByIndex(
        $select,
        ($row) =>
          ($row as PgSelectSinglePlan<any, any, any, any>).select(
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

  public applyAuthorizationChecksToPlan(
    $plan: PgSelectPlan<TColumns, TUniques, TRelations, TParameters>,
  ): void {
    if (this.selectAuth) {
      this.selectAuth($plan);
    }
    // e.g. $plan.where(sql`user_id = ${me}`);
    return;
  }

  public context(): ObjectPlan<PgExecutorContextPlans> {
    return this.executor.context();
  }

  public executeWithCache<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: CrystalValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.executeWithCache(values, options);
  }

  public executeWithoutCache<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: CrystalValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.executeWithoutCache(values, options);
  }

  public executeStream<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ streams: CrystalResultStreamList<TOutput> }> {
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
        return sql`(${alias} is distinct from null)::text`;
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
