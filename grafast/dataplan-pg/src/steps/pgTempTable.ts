import type { ExecutableStep } from "grafast";
import { BaseStep } from "grafast";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgResource } from "../datasource.js";
import type { PgClassFilterStep } from "../filters/pgClassFilter.js";
import type { PgCodec } from "../interfaces.js";
import type { PgConditionCapableParentStep } from "./pgCondition.js";
import { PgConditionStep } from "./pgCondition.js";

export class PgTempTableStep<
    TResource extends PgResource<any, any, any, any, any>,
  >
  extends BaseStep
  implements PgConditionCapableParentStep
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "TempTableStep",
  };

  public readonly alias: SQL;
  public readonly conditions: SQL[] = [];
  constructor(
    public readonly $parent: PgClassFilterStep,
    public readonly resource: TResource,
  ) {
    super();
    this.alias = sql.identifier(Symbol(`${resource.name}_filter`));
  }

  placeholder($step: ExecutableStep, codec: PgCodec): SQL {
    return this.$parent.placeholder($step, codec);
  }

  where(condition: SQL): void {
    this.conditions.push(condition);
  }
  wherePlan() {
    return new PgConditionStep(this);
  }

  fromExpression() {
    const from = this.resource.from;
    if (typeof from === "function") {
      throw new Error("TempTableStep doesn't support function sources yet.");
    } else {
      return from;
    }
  }
}
