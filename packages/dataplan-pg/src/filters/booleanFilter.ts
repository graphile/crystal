import type { ExecutableStep } from "dataplanner";
import { ModifierStep } from "dataplanner";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces.js";
import type { ClassFilterStep } from "./classFilter.js";

export class BooleanFilterStep extends ModifierStep<ClassFilterStep> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "BooleanFilterStep",
  };

  private conditions: SQL[] = [];

  constructor(
    $classFilterPlan: ClassFilterStep,
    public readonly expression: SQL,
  ) {
    super($classFilterPlan);
  }

  placeholder(
    $plan: ExecutableStep<any>,
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
