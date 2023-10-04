import type { ExecutableStep } from "grafast";
import { BaseStep } from "grafast";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { AnyPgResource } from "../datasource.js";
import type { PgClassFilterStep } from "../filters/pgClassFilter.js";
import type { AnyPgCodec } from "../interfaces.js";
import type { PgConditionCapableParentStep } from "./pgCondition.js";
import { PgConditionStep } from "./pgCondition.js";

export class PgTempTableStep<TResource extends AnyPgResource>
  extends BaseStep
  implements PgConditionCapableParentStep
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgTempTableStep",
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

  placeholder<TCodec extends AnyPgCodec>(
    $step: ExecutableStep,
    codec: TCodec,
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
    const from = this.resource.from;
    if (typeof from === "function") {
      throw new Error("PgTempTableStep doesn't support function sources yet.");
    } else {
      return from;
    }
  }
}
