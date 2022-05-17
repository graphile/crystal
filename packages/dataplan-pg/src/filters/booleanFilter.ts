import type { ExecutablePlan } from "dataplanner";
import { ModifierPlan } from "dataplanner";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces.js";
import type { ClassFilterPlan } from "./classFilter.js";

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

  placeholder(
    $plan: ExecutablePlan<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL {
    return this.$parent.placeholder($plan, codec);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
