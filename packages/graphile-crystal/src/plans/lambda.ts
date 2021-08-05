import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export class LambdaPlan<TIn, TOut> extends ExecutablePlan<TOut> {
  private planId: number;
  constructor($plan: ExecutablePlan<TIn>, private fn: (value: TIn) => TOut) {
    super();
    this.planId = this.addDependency($plan);
  }

  execute(values: CrystalValuesList<[TIn]>): CrystalResultsList<TOut> {
    return values.map((v) => this.fn(v[this.planId]));
  }
}

export function lambda<TIn, TOut>(
  $plan: ExecutablePlan<TIn>,
  fn: (value: TIn) => TOut,
): LambdaPlan<TIn, TOut> {
  return new LambdaPlan<TIn, TOut>($plan, fn);
}
