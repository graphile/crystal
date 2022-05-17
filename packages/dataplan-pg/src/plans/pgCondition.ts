import assert from "assert";
import type { BasePlan, ExecutablePlan } from "dataplanner";
import { ModifierPlan } from "dataplanner";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces.js";

export interface PgConditionCapableParentPlan extends BasePlan {
  alias: SQL;
  placeholder(
    $plan: ExecutablePlan<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL;
  where(condition: SQL): void;
  having?(condition: SQL): void;
}

export class PgConditionPlan<
  TParentPlan extends PgConditionCapableParentPlan,
> extends ModifierPlan<TParentPlan> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgConditionPlan",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];

  public readonly alias: SQL;

  constructor($parent: TParentPlan, private isHaving = false) {
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
    $plan: ExecutablePlan<any>,
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
