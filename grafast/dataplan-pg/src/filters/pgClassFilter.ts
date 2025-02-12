import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type {
  PgCondition,
  PgConditionCapableParent,
} from "../steps/pgCondition.js";

export class PgClassFilter<
    TParent extends PgConditionCapableParent = PgConditionCapableParent,
  >
  extends Modifier<PgCondition<TParent>>
  implements SQLable
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgClassFilter",
  };

  private conditions: SQL[] = [];

  constructor(
    parent: PgCondition<TParent>,
    public readonly alias: SQL,
  ) {
    super(parent);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  apply() {
    this.conditions.forEach((condition) => this.parent.where(condition));
  }

  [$$toSQL]() {
    return this.alias;
  }
}
