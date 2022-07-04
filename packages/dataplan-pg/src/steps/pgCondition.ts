import assert from "assert";
import type { BaseStep, ExecutableStep } from "dataplanner";
import { ModifierStep } from "dataplanner";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces.js";

export interface PgConditionCapableParentStep extends BaseStep {
  alias: SQL;
  placeholder(
    $plan: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL;
  where(condition: SQL): void;
  having?(condition: SQL): void;
}

export class PgConditionStep<
  TParentStep extends PgConditionCapableParentStep,
> extends ModifierStep<TParentStep> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgConditionStep",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];

  public readonly alias: SQL;

  constructor($parent: TParentStep, private isHaving = false) {
    super($parent);
    this.alias = $parent.alias;
  }

  where(condition: SQL): void {
    assert.equal(
      this.isHaving,
      false,
      `cannot call .where() on a 'having' condition`,
    );
    this.conditions.push(condition);
  }

  having(condition: SQL): void {
    assert.equal(
      this.isHaving,
      true,
      `cannot call .having() on a 'where' condition`,
    );
    this.havingConditions.push(condition);
  }

  placeholder(
    $plan: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL {
    return this.$parent.placeholder($plan, codec);
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
