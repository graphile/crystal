import type { ExecutablePlan } from "graphile-crystal";
import { ModifierPlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces";
import type { PgConditionPlan } from "../plans/pgCondition";

export class ClassFilterPlan extends ModifierPlan<PgConditionPlan<any>> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "ClassFilterPlan",
  };

  private conditions: SQL[] = [];

  constructor(parent: PgConditionPlan<any>, public readonly alias: SQL) {
    super(parent);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  placeholder(
    $plan: ExecutablePlan<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL {
    return this.$parent.placeholder($plan, codec);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
