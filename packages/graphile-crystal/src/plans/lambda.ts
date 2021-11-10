import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export class LambdaPlan<TIn, TOut> extends ExecutablePlan<TOut> {
  private planId: number | null;
  constructor(
    $plan: ExecutablePlan<TIn> | null | undefined,
    private fn: (value: TIn) => TOut,
  ) {
    super();
    this.planId = $plan != null ? this.addDependency($plan) : null;
  }

  execute(values: CrystalValuesList<[TIn]>): CrystalResultsList<TOut> {
    const { planId } = this;
    if (planId != null) {
      return values.map((v) => this.fn(v[planId]));
    } else {
      return values.map(() => this.fn(undefined as any));
    }
  }
}

export function lambda<TIn, TOut>(
  $plan: ExecutablePlan<TIn> | null | undefined,
  fn: (value: TIn) => TOut,
): LambdaPlan<TIn, TOut> {
  return new LambdaPlan<TIn, TOut>($plan, fn);
}
