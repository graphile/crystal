import { Modifier } from "grafast";
import sql from "pg-sql2";

import type { PgResource } from "../datasource.ts";
import { PgTempTable } from "../steps/pgTempTable.ts";
import { PgClassFilter } from "./pgClassFilter.ts";

export class PgManyFilter<
  TChildResource extends PgResource<any, any, any, any, any>,
> extends Modifier<PgClassFilter> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgManyFilter",
  };

  public someTemp: PgTempTable<TChildResource> | null = null;
  public childDataSource: TChildResource;
  private myAttrs: string[];
  private theirAttrs: string[];
  constructor(
    $parentFilterPlan: PgClassFilter,
    childDataSource: TChildResource,
    myAttrs: string[],
    theirAttrs: string[],
  ) {
    super($parentFilterPlan);
    this.childDataSource = childDataSource;
    this.myAttrs = myAttrs;
    this.theirAttrs = theirAttrs;
    if (myAttrs.length !== theirAttrs.length) {
      throw new Error(
        "Expected the local and remote attributes to have the same number of entries.",
      );
    }
  }

  some() {
    const tempTable = new PgTempTable(this.parent, this.childDataSource);

    // Implement the relationship
    this.myAttrs.forEach((attr, i) => {
      tempTable.where(
        sql`${this.parent.alias}.${sql.identifier(attr)} = ${
          tempTable.alias
        }.${sql.identifier(this.theirAttrs[i])}`,
      );
    });

    const $filter = new PgClassFilter(tempTable.wherePlan(), tempTable.alias);
    this.someTemp = tempTable;
    return $filter;
  }

  apply() {
    if (this.someTemp) {
      const conditions = this.someTemp.conditions;
      const from = sql`\nfrom ${this.someTemp.fromExpression()} as ${
        this.someTemp.alias
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
      this.parent.where(
        sql`exists(${sql.indent(sql`select 1${from}${where}`)})`,
      );
    }
  }
}
