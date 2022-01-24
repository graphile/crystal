/* eslint-disable graphile-exporter/export-instances */
import chalk from "chalk";
import type {
  CrystalResultStreamList,
  CrystalValuesList,
  ObjectPlan,
} from "graphile-crystal";
import {
  __ValuePlan,
  arraysMatch,
  constant,
  ExecutablePlan,
  getCurrentParentPathIdentity,
  partitionByIndex,
} from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import { TYPES } from "./codecs";
import type {
  PgClientResult,
  PgExecutor,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
} from "./executor";
import { exportAs } from "./exportAs";
import type { PgEnumTypeCodec, PgTypeCodec, PlanByUniques } from "./interfaces";
import type { PgClassExpressionPlan } from "./plans/pgClassExpression";
import type { PgSelectArgumentSpec, PgSelectPlan } from "./plans/pgSelect";
import { pgSelect } from "./plans/pgSelect";
import type {
  PgSelectSinglePlan,
  PgSelectSinglePlanOptions,
} from "./plans/pgSelectSingle";

export type PgSourceColumns = {
  [columnName: string]: PgSourceColumn<any>;
};

// TODO: feels like we should be able to type these more strongly
export type PgSourceColumnViaExplicit = { relation: string; attribute: string };
export type PgSourceColumnVia = string | PgSourceColumnViaExplicit;

export interface PgSourceColumnExtensions {}

export interface PgSourceColumn<TCanonical = any, TInput = TCanonical> {
  /**
   * How to translate to/from PG and how to cast.
   */
  codec: PgTypeCodec<any, TCanonical, TInput>;

  /**
   * Is the column/attribute guaranteed to not be null?
   */
  notNull: boolean;

  /**
   * The SQL expression for a derivative attributes, e.g.:
   *
   * ```js
   * expression: (alias) => sql`${alias}.first_name || ' ' || ${alias}.last_name`
   * ```
   */
  expression?: (alias: SQL) => SQL;

  // TODO: we could make TypeScript understand the relations on the object
  // rather than just being string.
  /**
   * If this column actually exists on a relation rather than locally, the name
   * of the (unique) relation this column belongs to.
   */
  via?: PgSourceColumnVia;

  /**
   * If the column exists identically on a relation and locally (e.g.
   * `posts.author_id` and `users.id` have exactly the same value due to a
   * foreign key reference) then the plans can choose which one to grab.
   *
   * @remarks
   *
   * ```
   * create table users (id serial primary key);
   * create table posts (id serial primary key, author_id int references users);
   * create table comments (id serial primary key, user_id int references users);
   * create table pets (id serial primary key, owner_id int references users);
   * ```
   *
   * Here:
   * - posts.author_id *identical via* 'author.id'
   * - comments.user_id *identical via* 'user.id'
   * - pets.owner_id *identical via* 'owner.id'
   *
   * Note however that `users.id` is not *identical via* anything, because
   * these are all plural relationships. So identicalVia is generally one-way
   * (except in 1-to-1 relationships).
   */
  identicalVia?: PgSourceColumnVia;
  // TODO: can identicalVia be plural? Is that useful? Maybe a column that has
  // multiple foreign key references?

  extensions?: Partial<PgSourceColumnExtensions>;
}

export type PgSourceRowAttribute<
  TColumns extends PgSourceColumns,
  TAttribute extends keyof TColumns,
> = ReturnType<TColumns[TAttribute]["codec"]["fromPg"]>;
export type PgSourceRow<TColumns extends PgSourceColumns | undefined> =
  TColumns extends PgSourceColumns
    ? {
        [key in keyof TColumns]: PgSourceRowAttribute<TColumns, key>;
      }
    : undefined;

export interface PgSourceRelationExtensions {}

export interface PgSourceRelation<
  TLocalColumns extends PgSourceColumns,
  TRemoteColumns extends PgSourceColumns,
> {
  source:
    | PgSourceBuilder<TRemoteColumns, any, any>
    | PgSource<TRemoteColumns, any, any, any>;
  localColumns: readonly (keyof TLocalColumns)[];

  remoteColumns: ReadonlyArray<keyof TRemoteColumns>;
  isUnique: boolean;
  extensions?: PgSourceRelationExtensions;
}

export interface PgSourceExtensions {}

export interface PgSourceParameter {
  name: string | null;
  codec: PgTypeCodec<any, any, any>;
  required: boolean;
  notNull?: boolean;
}

export interface PgSourceOptions<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgSourceColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
> {
  codec: PgTypeCodec<TColumns, any, any, any>;
  executor: PgExecutor;
  name: string;
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
}

/**
 * This class hacks around TypeScript inference issues by allowing us to define
 * the relations at a later step to avoid circular references.
 */
export class PgSourceBuilder<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
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
  constructor(
    private options: Omit<
      PgSourceOptions<TColumns, TUniques, any, TParameters>,
      "relations"
    >,
  ) {
    this.codec = options.codec;
    this.uniques = options.uniques;
    this.extensions = options.extensions;
  }

  public toString(): string {
    return chalk.bold.blueBright(`PgSourceBuilder(${this.options.name})`);
  }

  build<
    TRelations extends {
      [identifier: string]: TColumns extends PgSourceColumns
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
 * PG class data source represents a PostgreSQL data source. This could be a table,
 * view, materialized view, setof function call, join, etc. Anything table-like.
 */
export class PgSource<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgSourceColumns
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

  public readonly extensions: Partial<PgSourceExtensions> | undefined;

  static fromCodec<TColumns extends PgSourceColumns>(
    executor: PgExecutor,
    codec: PgTypeCodec<TColumns, any, any>,
  ): PgSource<TColumns, any, any, undefined> {
    if (!codec[$$codecSource]) {
      codec[$$codecSource] = new Map();
    }
    if (codec[$$codecSource].has(executor)) {
      return codec[$$codecSource].get(executor);
    }

    const source = new PgSource({
      executor,
      source: sql`(select 1/0 /* codec-only source; should not select directly */)`,
      codec,
      name: `TemporarySource${++temporarySourceCounter}`,
    });

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
      source,
      uniques,
      relations,
      extensions,
      parameters,
      description,
      isUnique,
      sqlPartitionByIndex,
    } = options;
    this._options = options;
    this.extensions = extensions;
    this.codec = codec;
    this.executor = executor;
    this.name = name;
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
    TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  >(overrideOptions: {
    name: string;
    source: SQL;
    uniques?: TUniques;
    extensions?: PgSourceExtensions;
  }): PgSource<TColumns, TUniques, TRelations, undefined> {
    const { name, source, uniques, extensions } = overrideOptions;
    const { codec, executor, relations } = this._options;
    return new PgSource({
      codec,
      executor,
      name,
      source: source as any,
      uniques,
      relations,
      parameters: undefined,
      extensions,
    });
  }

  /**
   * Often you can access table records from a table directly but also from a
   * number of functions. This method makes it convenient to construct multiple
   * datasources that all represent the same underlying table
   * type/relations/etc but pull their rows from functions.
   */
  public functionSource<
    TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
    TNewParameters extends PgSourceParameter[],
  >(overrideOptions: {
    name: string;
    source: (...args: SQL[]) => SQL;
    parameters: TNewParameters;
    returnsSetof: boolean;
    returnsArray: boolean;
    uniques?: TUniques;
    extensions?: PgSourceExtensions;
  }) {
    const {
      name,
      source: fnSource,
      parameters,
      returnsSetof,
      returnsArray,
      uniques,
      extensions,
    } = overrideOptions;
    const { codec, executor, relations } = this._options;
    if (!returnsArray) {
      // This is the easy case
      return new PgSource<TColumns, TUniques, TRelations, TNewParameters>({
        codec,
        executor,
        name,
        source: fnSource as any,
        uniques,
        relations,
        parameters,
        extensions,
        isUnique: !returnsSetof,
      });
    } else if (!returnsSetof) {
      // This is a `composite[]` function; convert it to a `setof composite` function:
      const source = (...args: SQL[]) => sql`unnest(${fnSource(...args)})`;
      return new PgSource<TColumns, TUniques, TRelations, TNewParameters>({
        codec,
        executor,
        name,
        source: source as any,
        uniques,
        relations,
        parameters,
        extensions,
        isUnique: false, // set now, not unique
      });
    } else {
      // This is a `setof composite[]` function; convert it to `setof composite` and indicate that we should partition it.
      const sqlTmp = sql.identifier(Symbol(`${name}_tmp`));
      const sqlPartitionByIndex = sql.identifier(Symbol(`${name}_idx`));
      const source = (...args: SQL[]) =>
        sql`${fnSource(
          ...args,
        )} with ordinality as ${sqlTmp} (arr, ${sqlPartitionByIndex}) cross join lateral unnest (${sqlTmp}.arr)`;
      return new PgSource<TColumns, TUniques, TRelations, TNewParameters>({
        codec,
        executor,
        name,
        source: source as any,
        uniques,
        relations,
        parameters,
        extensions,
        isUnique: false, // set now, not unique
        sqlPartitionByIndex,
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
    via: PgSourceColumnVia,
    attr: string,
  ): PgSourceColumnViaExplicit {
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
  ): TColumns extends PgSourceColumns
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
    if (!this.uniques.some((uniq) => uniq.every((key) => keys.includes(key)))) {
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
          `Attribute '${key}' is defined with a 'via' and thus cannot be used as an identifier for '.find()' or '.get()' calls (requested keys: '${keys.join(
            "', '",
          )}').`,
        );
      }
      const {
        codec: { sqlType: type },
      } = column;
      const plan = spec[key as keyof TColumns];
      if (plan == undefined) {
        throw new Error(
          `Attempted to call ${this}.find({${keys.join(
            ", ",
          )}}) but failed to provide a plan for '${key}'`,
        );
      }
      return {
        plan: plan instanceof ExecutablePlan ? plan : constant(plan),
        type,
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
    // e.g. $plan.where(sql`user_id = ${me}`);
    $plan.where(sql`true /* authorization checks */`);
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
}
exportAs(PgSource, "PgSource");

export interface PgEnumSourceExtensions {}

export interface PgEnumSourceOptions<TValue extends string> {
  codec: PgEnumTypeCodec<TValue>;
  extensions?: PgEnumSourceExtensions;
}

export class PgEnumSource<TValue extends string> {
  public readonly codec: PgEnumTypeCodec<TValue>;
  public readonly extensions: PgEnumSourceExtensions | undefined;
  constructor(options: PgEnumSourceOptions<TValue>) {
    this.codec = options.codec;
    this.extensions = options.extensions || {};
  }
}
exportAs(PgEnumSource, "PgEnumSource");
