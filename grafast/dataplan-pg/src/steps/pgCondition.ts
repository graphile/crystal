import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL, sql } from "pg-sql2";

import { TYPES } from "../index.js";
import type { PgCodec, PgQueryBuilder } from "../interfaces.js";

export type PgWhereConditionSpec<TAttribute extends string> =
  | SQL
  | PgWhereConditionAttributeSpec<TAttribute>;

export interface PgWhereConditionAttributeSpec<TAttribute extends string> {
  type: "attribute";
  attribute: TAttribute;
  callback: (fragment: SQL) => SQL;
}

export type PgHavingConditionSpec<_TAttribute extends string> = SQL;
// | ...

/** @deprecated Use DataplanPg.PgConditionStepExtensions instead */
export type PgConditionStepExtensions = DataplanPg.PgConditionStepExtensions;

export interface PgConditionCapableParentQueryBuilder extends PgQueryBuilder {
  where(condition: PgWhereConditionSpec<any>): void;
  having?(condition: PgHavingConditionSpec<any>): void;
}

type PgConditionModeExists = {
  mode: "EXISTS";
  tableExpression: SQL;
  alias?: string;
  equals?: boolean;
};

export type PgConditionResolvedMode =
  | { mode: "PASS_THRU" }
  | { mode: "AND" }
  | { mode: "OR" }
  | { mode: "NOT" }
  | PgConditionModeExists;

export type PgConditionStepMode =
  | "PASS_THRU"
  | "AND"
  | "OR"
  | "NOT"
  | PgConditionResolvedMode;

export class PgConditionQueryBuilder<
    TParentQueryBuilder extends
      PgConditionCapableParentQueryBuilder = PgConditionCapableParentQueryBuilder,
  >
  extends Modifier<TParentQueryBuilder>
  implements PgConditionCapableParentQueryBuilder, SQLable
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgConditionStep",
  };

  private conditions: PgWhereConditionSpec<any>[] = [];
  private havingConditions: PgHavingConditionSpec<any>[] = [];

  public readonly alias: SQL;

  public extensions: PgConditionStepExtensions = Object.create(null);
  private mode: PgConditionResolvedMode;

  constructor(
    $parent: TParentQueryBuilder,
    private isHaving = false,
    mode: PgConditionStepMode = "PASS_THRU",
  ) {
    super($parent);
    if (typeof mode === "string") {
      this.mode = { mode };
    } else {
      this.mode = mode;
    }
    switch (this.mode.mode) {
      case "PASS_THRU":
      case "AND":
      case "OR":
      case "NOT": {
        this.alias = $parent.alias;
        break;
      }
      case "EXISTS": {
        this.alias = sql.identifier(Symbol(this.mode.alias ?? "exists"));
        break;
      }
    }
  }

  public toStringMeta(): string {
    return `${(this.$parent as any).id}/${this.mode.mode}`;
  }

  orPlan() {
    return new PgConditionStep(this, this.isHaving, "OR");
  }

  andPlan() {
    return new PgConditionStep(this, this.isHaving, "AND");
  }

  notPlan() {
    return new PgConditionStep(this, this.isHaving, "NOT");
  }

  existsPlan(options: Omit<PgConditionModeExists, "mode">) {
    if (this.isHaving) {
      // Is this true?
      throw new Error(`EXISTS inside having is currently unsupported`);
    }
    return new PgConditionStep(this, this.isHaving, {
      ...options,
      mode: "EXISTS",
    });
  }

  where(condition: PgWhereConditionSpec<any>): void {
    if (this.isHaving) {
      throw new Error(`Cannot call .where() on a 'having' condition`);
    }
    this.conditions.push(condition);
  }

  having(condition: PgHavingConditionSpec<any>): void {
    if (!this.isHaving) {
      throw new Error(`cannot call .having() on a 'where' condition`);
    }
    this.havingConditions.push(condition);
  }

  placeholder($step: ExecutableStep, codec: PgCodec): SQL {
    return this.$parent.placeholder($step, codec);
  }

  private transform(conditions: PgWhereConditionSpec<any>[]): SQL | null {
    const sqlCondition = pgWhereConditionSpecListToSQL(
      this.alias,
      conditions,
      this.mode.mode === "OR" ? "or" : "and",
      this.mode.mode === "NOT"
        ? (frag) => sql.parens(sql`not ${sql.parens(frag)}`)
        : (frag) => frag,
    );
    if (sqlCondition === null) {
      return null;
    }

    switch (this.mode.mode) {
      case "PASS_THRU": {
        throw new Error("Should never reach here");
      }
      case "AND":
      case "OR":
      case "NOT": {
        return sqlCondition;
      }
      case "EXISTS": {
        const sqlExists = sql`exists(${sql.indent`\
select 1
from ${this.mode.tableExpression} as ${this.alias}
where ${sqlCondition}`})`;
        if (this.mode.$equals) {
          return sql`${sqlExists} = ${this.placeholder(
            this.mode.$equals,
            TYPES.boolean,
          )}`;
        } else {
          // Assume true
          return sqlExists;
        }
      }
      default: {
        const never: never = this.mode;
        throw new Error(`Unhandled mode: ${(never as any).mode}`);
      }
    }
  }

  apply(): void {
    if (this.isHaving) {
      if (!this.$parent.having) {
        throw new Error(`${this.$parent} doesn't support 'having'`);
      }
      if (this.mode.mode === "PASS_THRU") {
        this.havingConditions.forEach((condition) => {
          this.$parent.having!(condition);
        });
      } else {
        const frag = this.transform(this.havingConditions);
        if (frag) {
          this.$parent.having!(frag);
        }
      }
    } else {
      if (this.mode.mode === "PASS_THRU") {
        this.conditions.forEach((condition) => {
          this.$parent.where(condition);
        });
      } else {
        const frag = this.transform(this.conditions);
        if (frag) {
          this.$parent.where(frag);
        }
      }
    }
  }
  [$$toSQL]() {
    return this.alias;
  }
}

export function pgWhereConditionSpecListToSQL(
  alias: SQL,
  conditions: PgWhereConditionSpec<any>[],
  andOr: "and" | "or" = "and",
  transform: (frag: SQL) => SQL = (frag) => frag,
): SQL | null {
  const mappedConditions = [];
  for (const c of conditions) {
    if (sql.isSQL(c)) {
      if (sql.isEquivalent(c, sql.blank)) {
        continue;
      }
      const frag = sql.parens(c);
      mappedConditions.push(sql.indent(transform(frag)));
      continue;
    } else {
      switch (c.type) {
        case "attribute": {
          const frag = c.callback(sql`${alias}.${sql.identifier(c.attribute)}`);
          mappedConditions.push(sql.indent(transform(frag)));
          continue;
        }
        default: {
          const never: never = c.type;
          throw new Error(`Unsupported condition: ` + (never as any));
        }
      }
    }
  }
  if (mappedConditions.length === 0) {
    return null;
  }
  const joined = sql.join(mappedConditions, `\n${andOr}\n`);
  const sqlCondition = sql.parens(joined);
  return sqlCondition;
}
