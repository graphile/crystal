import type { ExecutablePlan } from "graphile-crystal";
import { BasePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgSource } from "../datasource";
import type { ClassFilterPlan } from "../filters/classFilter";
import type { PgConditionCapableParentPlan } from "./pgCondition";
import { PgConditionPlan } from "./pgCondition";

export class TempTablePlan<TDataSource extends PgSource<any, any, any, any>>
  extends BasePlan
  implements PgConditionCapableParentPlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "TempTablePlan",
  };

  public readonly alias: SQL;
  public readonly conditions: SQL[] = [];
  constructor(
    public readonly $parent: ClassFilterPlan,
    public readonly source: TDataSource,
  ) {
    super();
    this.alias = sql.identifier(Symbol(`${source.name}_filter`));
  }

  placeholder($plan: ExecutablePlan<any>, type: SQL): SQL {
    return this.$parent.placeholder($plan, type);
  }

  where(condition: SQL): void {
    this.conditions.push(condition);
  }
  wherePlan() {
    return new PgConditionPlan(this);
  }

  fromExpression() {
    const source = this.source.source;
    if (typeof source === "function") {
      throw new Error("TempTablePlan doesn't support function sources yet.");
    } else {
      return source;
    }
  }
}
