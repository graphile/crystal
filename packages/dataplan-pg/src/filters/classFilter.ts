import type { ExecutableStep } from "dataplanner";
import { ModifierStep } from "dataplanner";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces.js";
import type { PgConditionStep } from "../steps/pgCondition.js";

export class ClassFilterStep extends ModifierStep<PgConditionStep<any>> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "ClassFilterStep",
  };

  private conditions: SQL[] = [];

  constructor(parent: PgConditionStep<any>, public readonly alias: SQL) {
    super(parent);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  placeholder(
    $plan: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL {
    return this.$parent.placeholder($plan, codec);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
