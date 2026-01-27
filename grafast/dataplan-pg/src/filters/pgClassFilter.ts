import { Modifier } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type { PgConditionLike } from "../index.ts";
import type {
  PgCondition,
  PgConditionCapableParent,
} from "../steps/pgCondition.ts";
import type { RuntimeSQLThunk } from "../utils.ts";
import { runtimeScopedSQL } from "../utils.ts";

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
  public readonly alias: SQL;

  constructor(parent: PgCondition<TParent>, alias: SQL) {
    super(parent);
    this.alias = alias;
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
