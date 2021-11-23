import type { ExecutablePlan } from "graphile-crystal";
import { ModifierPlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";

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

  placeholder($plan: ExecutablePlan<any>, type: SQL): SQL {
    return this.$parent.placeholder($plan, type);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
