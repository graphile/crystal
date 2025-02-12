import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type { PgConditionLike } from "../index.js";
import type {
  PgCondition,
  PgConditionCapableParent,
} from "../steps/pgCondition.js";

export class PgClassFilter<
    TParent extends PgConditionCapableParent = PgConditionCapableParent,
  >
  extends Modifier<PgCondition<TParent>>
  implements SQLable, PgConditionLike
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgClassFilter",
  };

  private conditions: SQL[] = [];
  private havingConditions: SQL[] = [];

  constructor(
    parent: PgCondition<TParent>,
    public readonly alias: SQL,
  ) {
    super(parent);
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
