import type { ExecutableStep } from "grafast";
import { BaseStep } from "grafast";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgResource } from "../datasource.js";
import type { ClassFilterStep } from "../filters/classFilter.js";
import type { PgTypeCodec } from "../interfaces.js";
import type { PgConditionCapableParentStep } from "./pgCondition.js";
import { PgConditionStep } from "./pgCondition.js";

export class TempTableStep<
    TDataSource extends PgResource<any, any, any, any, any>,
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
    public readonly $parent: ClassFilterStep,
    public readonly source: TDataSource,
  ) {
    super();
    this.alias = sql.identifier(Symbol(`${source.name}_filter`));
  }

  placeholder(
    $step: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL {
    return this.$parent.placeholder($step, codec);
  }

  where(condition: SQL): void {
    this.conditions.push(condition);
  }
  wherePlan() {
    return new PgConditionStep(this);
  }

  fromExpression() {
    const source = this.source.source;
    if (typeof source === "function") {
      throw new Error("TempTableStep doesn't support function sources yet.");
    } else {
      return source;
    }
  }
}
