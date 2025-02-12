import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL, sql } from "pg-sql2";

import type { PgConditionLike } from "../interfaces.js";

export class PgOrFilter extends Modifier<PgConditionLike> implements SQLable {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgOrFilter",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];
  public alias: SQL;

  constructor($classFilterPlan: PgConditionLike) {
    super($classFilterPlan);
    this.alias = $classFilterPlan.alias;
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  having(condition: SQL) {
    this.havingConditions.push(condition);
  }

  apply() {
    if (this.conditions.length > 0) {
      this.parent.where(
        sql`(${sql.join(
          this.conditions.map((frag) => sql.indent(sql.parens(frag))),
          "\nOR\n",
        )})`,
      );
    }
    if (this.havingConditions.length > 0) {
      this.parent.having(
        sql`(${sql.join(
          this.havingConditions.map((frag) => sql.indent(sql.parens(frag))),
          "\nOR\n",
        )})`,
      );
    }
  }

  [$$toSQL]() {
    return this.alias;
  }
}
