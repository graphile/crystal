import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type { PgConditionLikeStep } from "../interfaces.js";

export class PgBooleanFilter
  extends Modifier<PgConditionLikeStep>
  implements SQLable
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgBooleanFilter",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];
  public alias: SQL;

  constructor(
    classFilter: PgConditionLikeStep,
    public readonly expression: SQL,
  ) {
    super(classFilter);
    this.alias = classFilter.alias;
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  having(condition: SQL) {
    this.havingConditions.push(condition);
  }

  apply() {
    this.conditions.forEach((condition) => this.parent.where(condition));
    this.havingConditions.forEach((condition) => this.parent.having(condition));
  }
  [$$toSQL]() {
    return this.alias;
  }
}
