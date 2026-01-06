import { Modifier } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type { PgConditionLike } from "../index.js";
import type {
  PgCondition,
  PgConditionCapableParent,
} from "../steps/pgCondition.js";
import type { RuntimeSQLThunk } from "../utils.js";
import { runtimeScopedSQL } from "../utils.js";

export class PgClassFilter<
    TParent extends PgConditionCapableParent = PgConditionCapableParent,
  >
  extends Modifier<PgCondition<TParent>>
  implements PgConditionLike
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
