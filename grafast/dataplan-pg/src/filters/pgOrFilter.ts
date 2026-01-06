import { Modifier } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL, sql } from "pg-sql2";

import type { PgConditionLike } from "../interfaces.js";
import type { RuntimeSQLThunk } from "../utils.js";
import { runtimeScopedSQL } from "../utils.js";

export class PgOrFilter
  extends Modifier<PgConditionLike>
  implements PgConditionLike
{
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

  where(condition: RuntimeSQLThunk) {
    this.conditions.push(runtimeScopedSQL(condition));
  }

  having(condition: RuntimeSQLThunk) {
    this.havingConditions.push(runtimeScopedSQL(condition));
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

  /**
   * @deprecated Only present for backwards compatibility, we want TypeScript to reject these embeds.
   * @internal
   */
  private [$$toSQL]() {
    return this.alias;
  }
}
