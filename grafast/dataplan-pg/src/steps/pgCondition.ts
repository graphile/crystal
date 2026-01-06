import { Modifier } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL, sql } from "pg-sql2";

import type { PgConditionLike } from "../interfaces.js";

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

export interface PgConditionCapableParent {
  alias: SQL;
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

export type PgConditionMode =
  | "PASS_THRU"
  | "AND"
  | "OR"
  | "NOT"
  | PgConditionResolvedMode;

export class PgCondition<
    TParent extends PgConditionCapableParent = PgConditionCapableParent,
  >
  extends Modifier<TParent>
  implements PgConditionCapableParent, PgConditionLike
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCondition",
  };

  private conditions: PgWhereConditionSpec<any>[] = [];
  private havingConditions: PgHavingConditionSpec<any>[] = [];

  public readonly alias: SQL;

  public extensions: DataplanPg.PgConditionExtensions = Object.create(null);
  public readonly resolvedMode: PgConditionResolvedMode;

  constructor(
    parent: TParent,
    private isHaving = false,
    mode: PgConditionMode = "PASS_THRU",
  ) {
    super(parent);
    if (typeof mode === "string") {
      this.resolvedMode = { mode };
    } else {
      this.resolvedMode = mode;
    }
    switch (this.resolvedMode.mode) {
      case "PASS_THRU":
      case "AND":
      case "OR":
      case "NOT": {
        this.alias = parent.alias;
        break;
      }
      case "EXISTS": {
        this.alias = sql.identifier(
          Symbol(this.resolvedMode.alias ?? "exists"),
        );
        break;
      }
    }
  }

  /**
   * Manipulating an ancestor may have unintended consequences. Please exercise
   * extreme caution, and think through all possible side effects. In
   * particular, you don't necessarily know what the ancestor is going to be,
   * so it might not be safe to attempt to manipulate it in the way you have
   * planned.
   */
  public dangerouslyGetParent() {
    return this.parent;
  }

  public toStringMeta(): string {
    return `${(this.parent as any).id}/${this.resolvedMode.mode}`;
  }

  orPlan() {
    return new PgCondition(this, this.isHaving, "OR");
  }

  andPlan() {
    return new PgCondition(this, this.isHaving, "AND");
  }

  notPlan() {
    return new PgCondition(this, this.isHaving, "NOT");
  }

  existsPlan(options: Omit<PgConditionModeExists, "mode">) {
    if (this.isHaving) {
      // Is this true?
      throw new Error(`EXISTS inside having is currently unsupported`);
    }
    return new PgCondition(this, this.isHaving, {
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

  private transform(conditions: PgWhereConditionSpec<any>[]): SQL | null {
    const sqlCondition = pgWhereConditionSpecListToSQL(
      this.alias,
      conditions,
      this.resolvedMode.mode === "OR" ? "or" : "and",
      this.resolvedMode.mode === "NOT"
        ? (frag) => sql.parens(sql`not ${sql.parens(frag)}`)
        : (frag) => frag,
    );
    if (sqlCondition === null) {
      return null;
    }

    switch (this.resolvedMode.mode) {
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
from ${this.resolvedMode.tableExpression} as ${this.alias}
where ${sqlCondition}`})`;
        if (this.resolvedMode.equals != null) {
          return sql`${sqlExists} = ${
            this.resolvedMode.equals ? sql.true : sql.false
          }`;
        } else {
          // Assume true
          return sqlExists;
        }
      }
      default: {
        const never: never = this.resolvedMode;
        throw new Error(`Unhandled mode: ${(never as any).mode}`);
      }
    }
  }

  apply(): void {
    if (this.isHaving) {
      if (!this.parent.having) {
        throw new Error(`${this.parent} doesn't support 'having'`);
      }
      if (this.resolvedMode.mode === "PASS_THRU") {
        this.havingConditions.forEach((condition) => {
          this.parent.having!(condition);
        });
      } else {
        const frag = this.transform(this.havingConditions);
        if (frag) {
          this.parent.having!(frag);
        }
      }
    } else {
      if (this.resolvedMode.mode === "PASS_THRU") {
        this.conditions.forEach((condition) => {
          this.parent.where(condition);
        });
      } else {
        const frag = this.transform(this.conditions);
        if (frag) {
          this.parent.where(frag);
        }
      }
    }
  }

  /**
   * @deprecated Only present for backwards compatibility, we want TypeScript to reject these embeds.
   * @internal
   */
  private [$$toSQL]() {
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
          // TODO: attributes with `via` should either be rejected or should
          // result in subquery.
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
