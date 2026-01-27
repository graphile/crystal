import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgResource } from "../datasource.ts";
import type { PgClassFilter } from "../filters/pgClassFilter.ts";
import type { PgConditionCapableParent } from "./pgCondition.ts";
import { PgCondition } from "./pgCondition.ts";

export class PgTempTable<TResource extends PgResource<any, any, any, any, any>>
  implements PgConditionCapableParent
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgTempTable",
  };

  public readonly alias: SQL;
  public readonly conditions: SQL[] = [];
  public readonly parent: PgClassFilter;
  public readonly resource: TResource;
  constructor(
    parent: PgClassFilter,
    resource: TResource,
  ) {
    this.parent = parent;
    this.resource = resource;
    this.alias = sql.identifier(Symbol(`${resource.name}_filter`));
  }

  where(condition: SQL): void {
    this.conditions.push(condition);
  }
  wherePlan() {
    return new PgCondition(this);
  }

  fromExpression() {
    const from = this.resource.from;
    if (typeof from === "function") {
      throw new Error("PgTempTable doesn't support function sources yet.");
    } else {
      return from;
    }
  }
}
