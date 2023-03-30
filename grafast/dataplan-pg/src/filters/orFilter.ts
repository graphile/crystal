import type { ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgCodec, PgConditionLikeStep } from "../interfaces.js";

export class OrFilterStep extends ModifierStep<PgConditionLikeStep> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "OrFilterStep",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];
  public alias: SQL;

  constructor($classFilterPlan: PgConditionLikeStep) {
    super($classFilterPlan);
    this.alias = $classFilterPlan.alias;
  }

  placeholder($step: ExecutableStep<any>, codec: PgCodec<any, any, any>): SQL {
    return this.$parent.placeholder($step, codec);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  having(condition: SQL) {
    this.havingConditions.push(condition);
  }

  apply() {
    if (this.conditions.length > 0) {
      this.$parent.where(
        sql`(${sql.join(
          this.conditions.map((frag) => sql.indent(sql.parens(frag))),
          "\nOR\n",
        )})`,
      );
    }
    if (this.havingConditions.length > 0) {
      this.$parent.having(
        sql`(${sql.join(
          this.havingConditions.map((frag) => sql.indent(sql.parens(frag))),
          "\nOR\n",
        )})`,
      );
    }
  }
}
