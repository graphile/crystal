import type { ExecutablePlan } from "graphile-crystal";
import { ModifierPlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgDataSource } from "../datasource";
import type { PgClassSelectPlan } from "./pgClassSelect";

export class PgConditionPlan<
  TDataSource extends PgDataSource<any, any>,
> extends ModifierPlan<PgClassSelectPlan<TDataSource>> {
  private conditions: SQL[] = [];

  // TODO: rename this?
  public readonly tableAlias: SQL;

  constructor($parent: PgClassSelectPlan<TDataSource>) {
    super($parent);
    this.tableAlias = $parent.alias;
  }

  where(condition: SQL): void {
    this.conditions.push(condition);
  }

  placeholder($plan: ExecutablePlan<any>): SQL {
    return this.$parent.placeholder($plan);
  }

  apply(): void {
    if (this.conditions.length) {
      this.$parent.where(sql`(${sql.join(this.conditions, ") and (")})`);
    }
  }
}
