import chalk from "chalk";
import type {
  CrystalValuesList,
  ExecutablePlan,
  ObjectPlan,
} from "graphile-crystal";
import { __ValuePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type {
  PgExecutor,
  PgExecutorContext,
  PgExecutorInput,
  PgExecutorOptions,
} from "./executor";
import type { PgTypeCodec } from "./interfaces";
import { PgSelectPlan } from "./plans/pgSelect";
import type { PgSelectSinglePlan } from "./plans/pgSelectSingle";

export type PgSourceColumns = {
  [columnName: string]: PgSourceColumn<any>;
};

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
}

type PgSourceRow<TColumns extends PgSourceColumns> = {
  [key in keyof TColumns]: ReturnType<TColumns[key]["codec"]["fromPg"]>;
};

type TuplePlanMap<
  TColumns extends { [column: string]: any },
  TTuple extends ReadonlyArray<keyof TColumns>,
> = {
  [Index in keyof TTuple]: {
    [key in TTuple[number]]: ExecutablePlan<
      ReturnType<TColumns[key]["pg2gql"]>
    >;
  };
};

type PlanByUniques<
  TColumns extends { [column: string]: any },
  TCols extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
> = TuplePlanMap<TColumns, TCols[number]>[number];

export interface PgSourceRelation {
  targetTable: SQL;
  localColumns: string[];
  remoteColumns: string[];
  isUnique: boolean;
}

export interface PgSourceOptions<
  TColumns extends PgSourceColumns,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends { [identifier: string]: PgSourceRelation },
  TParameters extends { [key: string]: any } | never = never,
> {
  alias?: string;
  executor: PgExecutor;
  name: string;
  source: SQL | ((args: SQL[]) => SQL);
  columns: TColumns;
  uniques: TUniques;
  relations?: TRelations;
}

/**
 * PG class data source represents a PostgreSQL data source. This could be a table,
 * view, materialized view, setof function call, join, etc. Anything table-like.
 */
export class PgSource<
  TColumns extends PgSourceColumns,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends { [identifier: string]: PgSourceRelation },
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

  public readonly alias: string | null;
  public readonly executor: PgExecutor;
  public readonly name: string;
  public readonly source: SQL | ((args: SQL[]) => SQL);
  public readonly columns: TColumns;
  public readonly uniques: TUniques;
  public readonly relations: TRelations;

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
    const { alias, executor, name, source, columns, uniques, relations } =
      options;
    this.alias = alias ?? null;
    this.executor = executor;
    this.name = name;
    this.source = source;
    this.columns = columns;
    this.uniques = uniques;
    this.relations = relations || ({} as TRelations);
  }

  public toString(): string {
    return chalk.bold.blue(`PgSource(${this.name})`);
  }

  public get(
    spec: PlanByUniques<TColumns, TUniques>,
  ): PgSelectSinglePlan<this> {
    const keys: ReadonlyArray<keyof TColumns> = Object.keys(spec);
    if (!this.uniques.some((uniq) => uniq.every((key) => keys.includes(key)))) {
      throw new Error(
        `Attempted to call ${this}.get({${keys.join(
          ", ",
        )}}) but that combination of columns is not unique. Did you mean to call .find() instead?`,
      );
    }
    return this.find(spec).single();
  }

  public find(
    spec: { [key in keyof TColumns]?: ExecutablePlan } = {},
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
      const {
        codec: { sqlType: type },
      } = column;
      const plan: ExecutablePlan | undefined = spec[key];
      if (plan == undefined) {
        throw new Error(
          `Attempted to call ${this}.get({${keys.join(
            ", ",
          )}}) but failed to provide a plan for '${key}'`,
        );
      }
      return {
        plan,
        type,
        matches: (alias: SQL) => sql`${alias}.${sql.identifier(key as string)}`,
      };
    });
    return new PgSelectPlan(this, identifiers);
  }

  public applyAuthorizationChecksToPlan($plan: PgSelectPlan<this>): void {
    // e.g. $plan.where(sql`user_id = ${me}`);
    $plan.where(sql`true /* authorization checks */`);
    return;
  }

  public context(): ObjectPlan<PgExecutorContext> {
    return this.executor.context();
  }

  public execute<TInput = any, TOutput = any>(
    values: CrystalValuesList<PgExecutorInput<TInput>>,
    options: PgExecutorOptions,
  ): Promise<{ values: CrystalValuesList<ReadonlyArray<TOutput>> }> {
    return this.executor.execute(values, options);
  }
}
