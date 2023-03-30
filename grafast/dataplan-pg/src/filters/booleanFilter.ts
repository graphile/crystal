import type { ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";

import type { PgCodec, PgConditionLikeStep } from "../interfaces.js";

export class BooleanFilterStep extends ModifierStep<PgConditionLikeStep> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "BooleanFilterStep",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];
  public alias: SQL;

  constructor(
    $classFilterPlan: PgConditionLikeStep,
    public readonly expression: SQL,
  ) {
    super($classFilterPlan);
    this.alias = $classFilterPlan.alias;
  }

  placeholder(
    $step: ExecutableStep<any>,
    codec: PgCodec<any, any, any, any>,
  ): SQL {
    return this.$parent.placeholder($step, codec);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  having(condition: SQL) {
    this.havingConditions.push(condition);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
    this.havingConditions.forEach((condition) =>
      this.$parent.having(condition),
    );
  }
}
