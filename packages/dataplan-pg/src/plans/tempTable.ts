import type { ExecutablePlan } from "dataplanner";
import { BasePlan } from "dataplanner";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgSource } from "../datasource.js";
import type { ClassFilterPlan } from "../filters/classFilter.js";
import type { PgTypeCodec } from "../interfaces.js";
import type { PgConditionCapableParentPlan } from "./pgCondition.js";
import { PgConditionPlan } from "./pgCondition.js";

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

  placeholder(
    $plan: ExecutablePlan<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL {
    return this.$parent.placeholder($plan, codec);
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
