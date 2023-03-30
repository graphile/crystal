import type { ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";

import type { PgCodec } from "../interfaces.js";
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

  placeholder($step: ExecutableStep<any>, codec: PgCodec<any, any, any>): SQL {
    return this.$parent.placeholder($step, codec);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
