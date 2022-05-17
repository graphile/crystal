import { ModifierPlan } from "dataplanner";
import sql from "pg-sql2";

import type { PgSource } from "../datasource.js";
import { TempTablePlan } from "../plans/tempTable.js";
import { ClassFilterPlan } from "./classFilter.js";

export class ManyFilterPlan<
  TChildDataSource extends PgSource<any, any, any, any>,
> extends ModifierPlan<ClassFilterPlan> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "ManyFilterPlan",
  };

  public $some: TempTablePlan<TChildDataSource> | null = null;
  constructor(
    $parentFilterPlan: ClassFilterPlan,
    public childDataSource: TChildDataSource,
    private myAttrs: string[],
    private theirAttrs: string[],
  ) {
    super($parentFilterPlan);
    if (myAttrs.length !== theirAttrs.length) {
      throw new Error(
        "Expected the local and remote attributes to have the same number of entries.",
      );
    }
  }

  some() {
    const $table = new TempTablePlan(this.$parent, this.childDataSource);

    // Implement the relationship
    this.myAttrs.forEach((attr, i) => {
      $table.where(
        sql`${this.$parent.alias}.${sql.identifier(attr)} = ${
          $table.alias
        }.${sql.identifier(this.theirAttrs[i])}`,
      );
    });

    const $filter = new ClassFilterPlan($table.wherePlan(), $table.alias);
    this.$some = $table;
    return $filter;
  }

  apply() {
    if (this.$some) {
      const conditions = this.$some.conditions;
      const from = sql`\nfrom ${this.$some.fromExpression()} as ${
        this.$some.alias
      }`;
      const sqlConditions = sql.join(
        conditions.map((c) => sql.parens(sql.indent(c))),
        " and ",
      );
      const where =
        conditions.length === 0
          ? sql.blank
          : conditions.length === 1
          ? sql`\nwhere ${sqlConditions}`
          : sql`\nwhere\n${sql.indent(sqlConditions)}`;
      this.$parent.where(
        sql`exists(${sql.indent(sql`select 1${from}${where}`)})`,
      );
    }
  }
}
