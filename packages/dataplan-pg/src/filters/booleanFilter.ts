import type { ExecutablePlan } from "graphile-crystal";
import { ModifierPlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";

import type { ClassFilterPlan } from "./classFilter";

export class BooleanFilterPlan extends ModifierPlan<ClassFilterPlan> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "BooleanFilterPlan",
  };

  private conditions: SQL[] = [];

  constructor(
    $classFilterPlan: ClassFilterPlan,
    public readonly expression: SQL,
  ) {
    super($classFilterPlan);
  }

  placeholder($plan: ExecutablePlan<any>, type: SQL): SQL {
    return this.$parent.placeholder($plan, type);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
