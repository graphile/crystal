import { ModifierStep } from "grafast";
import sql from "pg-sql2";

import type { PgResource } from "../datasource.js";
import { PgTempTableStep } from "../steps/pgTempTable.js";
import { PgClassFilterStep } from "./pgClassFilter.js";

export class PgManyFilterStep<
  TChildResource extends PgResource<any, any, any, any, any>,
> extends ModifierStep<PgClassFilterStep> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgManyFilterStep",
  };

  public $some: PgTempTableStep<TChildResource> | null = null;
  constructor(
    $parentFilterPlan: PgClassFilterStep,
    public childDataSource: TChildResource,
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
    const $table = new PgTempTableStep(this.$parent, this.childDataSource);

    // Implement the relationship
    this.myAttrs.forEach((attr, i) => {
      $table.where(
        sql`${this.$parent.alias}.${sql.identifier(attr)} = ${
          $table.alias
        }.${sql.identifier(this.theirAttrs[i])}`,
      );
    });

    const $filter = new PgClassFilterStep($table.wherePlan(), $table.alias);
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
