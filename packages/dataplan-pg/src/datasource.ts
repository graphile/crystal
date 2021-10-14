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
} from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type {
  PgClientResult,
  PgExecutor,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
} from "./executor";
import type { PgTypeCodec, PlanByUniques } from "./interfaces";
import type { PgSelectPlan } from "./plans/pgSelect";
import { pgSelect } from "./plans/pgSelect";
import type {
  PgSelectSinglePlan,
  PgSelectSinglePlanOptions,
} from "./plans/pgSelectSingle";

export type PgSourceColumns = {
  [columnName: string]: PgSourceColumn<any>;
};

export type PgSourceColumnViaExplicit = { relation: string; attribute: string };
export type PgSourceColumnVia = string | PgSourceColumnViaExplicit;

export interface PgSourceColumn<TCanonical = any, TInput = TCanonical> {
  /**
   * How to translate to/from PG and how to cast.
   */
  codec: PgTypeCodec<TCanonical, TInput>;

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
}

type PgSourceRow<TColumns extends PgSourceColumns> = {
  [key in keyof TColumns]: ReturnType<TColumns[key]["codec"]["fromPg"]>;
};

export interface PgSourceRelation<
  TSource extends
    | PgSourceBuilder<any, PgSourceColumns, any, any>
    | PgSource<any, PgSourceColumns, any, any, any>,
  TLocalColumns extends PgSourceColumns,
> {
  source: TSource;
  localColumns: readonly (keyof TLocalColumns)[];

  remoteColumns: TSource extends PgSourceBuilder<any, infer U, any, any>
    ? ReadonlyArray<keyof U>
    : TSource extends PgSource<any, infer U, any, any, any>
    ? ReadonlyArray<keyof U>
    : never;
  isUnique: boolean;
}

export interface PgSourceOptions<
  TCodec extends PgTypeCodec<any, any>,
  TColumns extends PgSourceColumns,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends { [identifier: string]: PgSourceRelation<any, TColumns> },
  _TParameters extends { [key: string]: any } | never = never,
> {
  codec: TCodec;
  executor: PgExecutor;
  name: string;
  source: SQL | ((...args: SQL[]) => SQL);
  columns: TColumns | null;
  uniques?: TUniques;
  relations?: TRelations | (() => TRelations);
}

/**
 * This class hacks around TypeScript inference issues by allowing us to define
 * the relations at a later step to avoid circular references.
 */
export class PgSourceBuilder<
  TCodec extends PgTypeCodec<any, any>,
  TColumns extends PgSourceColumns,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TParameters extends { [key: string]: any } | never = never,
> {
  private built: PgSource<TCodec, TColumns, TUniques, any, TParameters> | null =
    null;
  public codec: TCodec;
  public columns: TColumns | null;
  public uniques: TUniques | undefined;
  constructor(
    private options: Omit<
      PgSourceOptions<TCodec, TColumns, TUniques, any, TParameters>,
      "relations"
    >,
  ) {
    this.codec = options.codec;
    this.columns = options.columns;
    this.uniques = options.uniques;
  }

  build<
    TRelations extends {
      [identifier: string]: PgSourceRelation<
        PgSourceBuilder<any, any, any, any> | PgSource<any, any, any, any>,
        TColumns
      >;
    },
  >({
    relations,
  }: {
    relations?: TRelations;
  }): PgSource<TCodec, TColumns, TUniques, TRelations, TParameters> {
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

  get(): PgSource<TCodec, TColumns, TUniques, any, TParameters> {
    if (!this.built) {
      throw new Error("This builder has not been built!");
    }
    return this.built;
  }
}

/**
 * PG class data source represents a PostgreSQL data source. This could be a table,
 * view, materialized view, setof function call, join, etc. Anything table-like.
 */
export class PgSource<
  TCodec extends PgTypeCodec<any, any>,
  TColumns extends PgSourceColumns,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends { [identifier: string]: PgSourceRelation<any, TColumns> },
  TParameters extends { [key: string]: any } | never = never,
> {
  /**
   * TypeScript hack so that we can retrieve the TRow type from a Postgres data
   * source at a later time - needed so we can have strong typing on `.get()`
   * and similar methods.
   *
   * @internal
   */
  TRow!: PgSourceRow<TColumns>;

  public readonly codec: TCodec;
  public readonly executor: PgExecutor;
  public readonly name: string;
  public readonly source: SQL | ((...args: SQL[]) => SQL);
  public readonly columns: TColumns;
  public readonly uniques: TUniques;
  private readonly _options: PgSourceOptions<
    TCodec,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >;
  private relationsThunk: (() => TRelations) | null;
  private _relations: TRelations | null = null;

  /**
   * @param source - the SQL for the `FROM` clause (without any
   * aliasing). If this is a subquery don't forget to wrap it in parens.
   * @param name - a nickname for this data source. Doesn't need to be unique
   * (but should be). Used for making the SQL query and debug messages easier
   * to understand.
   */
  constructor(
    options: PgSourceOptions<
      TCodec,
      TColumns,
      TUniques,
      TRelations,
      TParameters
    >,
  ) {
    const { codec, executor, name, source, columns, uniques, relations } =
      options;
    this._options = options;
    this.codec = codec;
    this.executor = executor;
    this.name = name;
    this.source = source;
    this.columns = columns ?? ({} as TColumns);
    this.uniques =
      uniques ?? ([] as TUniques extends never[] ? TUniques : never);
    this.relationsThunk = typeof relations === "function" ? relations : null;
    if (typeof relations !== "function") {
      this._relations = relations || ({} as TRelations);
      this.validateRelations();
    }
  }

  /**
   * Often you can access table records from a table directly but also from a
   * number of functions. This method makes it convenient to construct multiple
   * datasources that all represent the same underlying table
   * type/relations/etc.
   */
  public alternativeSource<
    TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
    TNewParameters extends { [key: string]: any } | never = never,
  >(overrideOptions: {
    name: string;
    source: SQL | ((...args: SQL[]) => SQL);
    uniques?: TUniques;
  }): PgSource<TCodec, TColumns, TUniques, TRelations, TNewParameters> {
    const { name, source, uniques } = overrideOptions;
    const { codec, executor, columns, relations } = this._options;
    return new PgSource({
      codec,
      executor,
      name,
      source,
      columns,
      uniques,
      relations,
    });
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
    Object.entries(this.columns).forEach(([columnName, col]) => {
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

  private getRelations(): TRelations {
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
      const relation: PgSourceRelation<PgSource<any, any, any, any, any>, any> =
        this.getRelation(via);
      if (!relation) {
        throw new Error(`Unknown relation '${via}' in ${this}`);
      }
      if (!relation.source.columns[attr]) {
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
    TOtherDataSource extends PgSource<any, any, any, any, any>,
    TOtherRelationName extends Parameters<TOtherDataSource["getRelation"]>[0],
  >(
    otherDataSource: TOtherDataSource,
    otherRelationName: TOtherRelationName,
  ): [keyof TRelations, TRelations[keyof TRelations]] | null {
    const otherRelation: PgSourceRelation<TOtherDataSource, any> =
      otherDataSource.getRelation(otherRelationName);
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
  ): PgSelectSinglePlan<this> {
    const keys: ReadonlyArray<keyof TColumns> = Object.keys(spec);
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
  ): PgSelectPlan<this> {
    const keys: ReadonlyArray<keyof TColumns> = Object.keys(spec);
    const invalidKeys = keys.filter((key) => this.columns[key] == null);
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
      const column = this.columns[key];
      if (column.via) {
        throw new Error(
          `Attribute '${key}' is defined with a 'via' and thus cannot be used as an identifier for '.find()' or '.get()' calls (requested keys: '${keys.join(
            "', '",
          )}').`,
        );
      }
      const {
        codec: { sqlType: type },
      } = column;
      const plan = spec[key];
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

  public applyAuthorizationChecksToPlan($plan: PgSelectPlan<this>): void {
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
