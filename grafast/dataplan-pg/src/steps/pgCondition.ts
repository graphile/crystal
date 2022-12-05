import assert from "assert";
import type { BaseStep, ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";

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

  constructor($parent: TParentStep, private isHaving = false) {
    super($parent);
    this.alias = $parent.alias;
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

  apply(): void {
    if (this.isHaving) {
      if (!this.$parent.having) {
        throw new Error(`${this.$parent} doesn't support 'having'`);
      }
      this.havingConditions.forEach((condition) => {
        this.$parent.having!(condition);
      });
    } else {
      this.conditions.forEach((condition) => {
        this.$parent.where(condition);
      });
    }
  }
}
