import type { ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";

import type { _AnyPgCodec } from "../interfaces.js";
import type {
  PgConditionCapableParentStep,
  PgConditionStep,
} from "../steps/pgCondition.js";

export class PgClassFilterStep<
  TParentStep extends
    PgConditionCapableParentStep = PgConditionCapableParentStep,
> extends ModifierStep<PgConditionStep<TParentStep>> {
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

  placeholder<TCodec extends _AnyPgCodec>(
    $step: ExecutableStep,
    codec: TCodec,
  ): SQL {
    return this.$parent.placeholder($step, codec);
  }

  apply() {
    this.conditions.forEach((condition) => this.$parent.where(condition));
  }
}
