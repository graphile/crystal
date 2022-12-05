import assert from "assert";
import type { BaseStep, ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces.js";

export type PgWhereConditionSpec<TAttribute extends string> =
  | SQL
  | {
      type: "attribute";
      attribute: TAttribute;
      callback: (fragment: SQL) => SQL;
    };

export type PgHavingConditionSpec<_TAttribute extends string> = SQL;
// | ...

export interface PgConditionStepExtensions {}

export interface PgConditionCapableParentStep extends BaseStep {
  alias: SQL;
  placeholder(
    $step: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL;
  where(condition: PgWhereConditionSpec<any>): void;
  having?(condition: PgHavingConditionSpec<any>): void;
}

export class PgConditionStep<
  TParentStep extends PgConditionCapableParentStep,
> extends ModifierStep<TParentStep> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgConditionStep",
  };

  private conditions: PgWhereConditionSpec<any>[] = [];
  private havingConditions: PgHavingConditionSpec<any>[] = [];

  public readonly alias: SQL;

  public extensions: PgConditionStepExtensions = Object.create(null);

  constructor(
    $parent: TParentStep,
    private isHaving = false,
    private mode: "PASS_THRU" | "AND" | "OR" | "NOT" = "PASS_THRU",
  ) {
    super($parent);
    this.alias = $parent.alias;
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

  where(condition: PgWhereConditionSpec<any>): void {
    assert.equal(
      this.isHaving,
      false,
      `cannot call .where() on a 'having' condition`,
    );
    this.conditions.push(condition);
  }

  having(condition: PgHavingConditionSpec<any>): void {
    assert.equal(
      this.isHaving,
      true,
      `cannot call .having() on a 'where' condition`,
    );
    this.havingConditions.push(condition);
  }

  placeholder(
    $step: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any, any>,
  ): SQL {
    return this.$parent.placeholder($step, codec);
  }

  private transform(conditions: PgWhereConditionSpec<any>[]): SQL {
    const mappedConditions = conditions.map((c) => {
      if (sql.isSQL(c)) {
        const frag = sql.parens(c);
        return this.mode === "NOT" ? sql.parens(sql`not ${frag}`) : frag;
      } else {
        switch (c.type) {
          case "attribute": {
            const frag = c.callback(
              sql`${this.alias}.${sql.identifier(c.attribute)}`,
            );
            return this.mode === "NOT" ? sql.parens(sql`not ${frag}`) : frag;
          }
          default: {
            const never: never = c;
            throw new Error(`Unsupported condition: ` + (never as any).type);
          }
        }
      }
    });
    const joined = sql.join(
      mappedConditions,
      this.mode === "OR" ? " or " : " and ",
    );
    return sql.parens(joined);
  }

  apply(): void {
    if (this.isHaving) {
      if (!this.$parent.having) {
        throw new Error(`${this.$parent} doesn't support 'having'`);
      }
      if (this.mode === "PASS_THRU") {
        this.havingConditions.forEach((condition) => {
          this.$parent.having!(condition);
        });
      } else {
        this.$parent.having!(this.transform(this.havingConditions));
      }
    } else {
      if (this.mode === "PASS_THRU") {
        this.conditions.forEach((condition) => {
          this.$parent.where(condition);
        });
      } else {
        this.$parent.where(this.transform(this.conditions));
      }
    }
  }
}
