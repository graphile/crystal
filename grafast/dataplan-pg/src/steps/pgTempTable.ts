import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgResource } from "../datasource.js";
import type { PgClassFilter } from "../filters/pgClassFilter.js";
import type { PgConditionCapableParent } from "./pgCondition.js";
import { PgCondition } from "./pgCondition.js";

export class PgTempTable<TResource extends PgResource<any, any, any, any, any>>
  implements PgConditionCapableParent
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgTempTable",
  };

  public readonly alias: SQL;
  public readonly conditions: SQL[] = [];
  constructor(
    public readonly parent: PgClassFilter,
    public readonly resource: TResource,
  ) {
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
