import assert from "assert";
import type { BasePlan, ExecutablePlan } from "dataplanner";
import { ModifierPlan } from "dataplanner";
import type { SQL } from "pg-sql2";

import type { PgTypeCodec } from "../interfaces";

export interface PgSetCapableParentPlan<TKey extends string> extends BasePlan {
  // See PgConditionCapableParentPlan for a similar plan
  set(key: TKey, value: ExecutablePlan): void;
}

export class PgSetPlan<
  TKey extends string,
  TParentPlan extends PgSetCapableParentPlan<TKey>,
> extends ModifierPlan<TParentPlan> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSetPlan",
  };

  private sets = new Map<TKey, ExecutablePlan>();

  constructor($parent: TParentPlan, private isHaving = false) {
    super($parent);
  }

  set(key: TKey, valuePlan: ExecutablePlan): void {
    this.sets.set(key, valuePlan);
  }

  apply(): void {
    for (const [key, valuePlan] of this.sets.entries()) {
      this.$parent.set(key, valuePlan);
    }
  }
}
