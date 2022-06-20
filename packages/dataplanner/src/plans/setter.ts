import type { BasePlan, ExecutablePlan } from "../plan.js";
import { ModifierPlan } from "../plan.js";

export interface SetterCapablePlan<
  TPlans extends {
    [key: string]: ExecutablePlan<any>;
  },
> extends BasePlan {
  set<TKey extends keyof TPlans>(key: TKey, value: TPlans[TKey]): void;
}

export class SetterPlan<
  TPlans extends {
    [key: string]: ExecutablePlan<any>;
  } = {
    [key: string]: ExecutablePlan<any>;
  },
  TParentPlan extends SetterCapablePlan<TPlans> = SetterCapablePlan<TPlans>,
> extends ModifierPlan<TParentPlan> {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "SetterPlan",
  };

  private setters = new Map<keyof TPlans, TPlans[keyof TPlans]>();

  constructor($parent: TParentPlan) {
    super($parent);
  }

  set<TKey extends keyof TPlans>(key: TKey, valuePlan: TPlans[TKey]): void {
    this.setters.set(key, valuePlan);
  }

  apply(): void {
    for (const [key, valuePlan] of this.setters.entries()) {
      this.$parent.set(key, valuePlan);
    }
  }
}

export function setter<
  TPlans extends {
    [key: string]: ExecutablePlan<any>;
  } = {
    [key: string]: ExecutablePlan<any>;
  },
  TParentPlan extends SetterCapablePlan<TPlans> = SetterCapablePlan<TPlans>,
>($parent: TParentPlan) {
  return new SetterPlan<TPlans, TParentPlan>($parent);
}
