import { Modifier } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type { PgConditionLike } from "../interfaces.js";
import type { RuntimeSQLThunk } from "../utils.js";
import { runtimeScopedSQL } from "../utils.js";

export class PgBooleanFilter
  extends Modifier<PgConditionLike>
  implements PgConditionLike
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgBooleanFilter",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];
  public alias: SQL;
  public readonly expression;

  constructor(classFilter: PgConditionLike, expression: RuntimeSQLThunk) {
    super(classFilter);
    this.alias = classFilter.alias;
    this.expression = runtimeScopedSQL(expression);
  }

  where(condition: RuntimeSQLThunk) {
    this.conditions.push(runtimeScopedSQL(condition));
  }

  having(condition: RuntimeSQLThunk) {
    this.havingConditions.push(runtimeScopedSQL(condition));
  }

  apply() {
    this.conditions.forEach((condition) => this.parent.where(condition));
    this.havingConditions.forEach((condition) => this.parent.having(condition));
  }

  /**
   * @deprecated Only present for backwards compatibility, we want TypeScript to reject these embeds.
   * @internal
   */
  private [$$toSQL]() {
    return this.alias;
  }
}
