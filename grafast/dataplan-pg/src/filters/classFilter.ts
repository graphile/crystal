import type { ExecutableStep } from "grafast";
import { ModifierStep } from "grafast";
import type { SQL } from "pg-sql2";

import type { PgCodec } from "../interfaces.js";
import type {
  PgConditionCapableParentStep,
  PgConditionStep,
} from "../steps/pgCondition.js";

export class ClassFilterStep<
  TParentStep extends PgConditionCapableParentStep = PgConditionCapableParentStep,
> extends ModifierStep<PgConditionStep<TParentStep>> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "ClassFilterStep",
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
}
