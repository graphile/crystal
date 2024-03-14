import type { ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";

import type { PgCodec } from "../interfaces.js";
import type {
  PgConditionCapableParentStep,
  PgConditionStep,
} from "../steps/pgCondition.js";

export class PgClassFilterStep<
    TParentStep extends
      PgConditionCapableParentStep = PgConditionCapableParentStep,
  >
  extends ModifierStep<PgConditionStep<TParentStep>>
  implements SQLable
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgClassFilterStep",
  };

  private conditions: SQL[] = [];

  constructor(
    parent: PgConditionStep<TParentStep>,
    public readonly alias: SQL,
  ) {
    super(parent);
  }

  where(condition: SQL) {
    this.conditions.push(condition);
  }

  placeholder($step: ExecutableStep, codec: PgCodec): SQL {
    return this.$parent.placeholder($step, codec);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }

  [$$toSQL]() {
    return this.alias;
  }
}
