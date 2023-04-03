import type { BaseStep, ExecutableStep } from "../step.js";
import { ModifierStep } from "../step.js";

export interface SetterCapableStep<
  TPlans extends {
    [key: string]: ExecutableStep;
  },
> extends BaseStep {
  set<TKey extends keyof TPlans>(key: TKey, value: TPlans[TKey]): void;
}

export class SetterStep<
  TPlans extends {
    [key: string]: ExecutableStep;
  } = {
    [key: string]: ExecutableStep;
  },
  TParentStep extends SetterCapableStep<TPlans> = SetterCapableStep<TPlans>,
> extends ModifierStep<TParentStep> {
  static $$export = {
    moduleName: "grafast",
    exportName: "SetterStep",
  };

  private setters = new Map<keyof TPlans, TPlans[keyof TPlans]>();

  constructor($parent: TParentStep) {
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
    [key: string]: ExecutableStep;
  } = {
    [key: string]: ExecutableStep;
  },
  TParentStep extends SetterCapableStep<TPlans> = SetterCapableStep<TPlans>,
>($parent: TParentStep) {
  return new SetterStep<TPlans, TParentStep>($parent);
}
