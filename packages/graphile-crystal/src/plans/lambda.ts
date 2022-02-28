import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export class LambdaPlan<TIn, TOut> extends ExecutablePlan<TOut> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "LambdaPlan",
  };
  sync = true;

  private planDep: number | null;
  constructor(
    $plan: ExecutablePlan<TIn> | null | undefined,
    private fn: (value: TIn) => TOut,
  ) {
    super();
    this.planDep = $plan != null ? this.addDependency($plan) : null;
  }

  toStringMeta() {
    return (this.fn as any).displayName || this.fn.name;
  }

  deduplicate(peers: LambdaPlan<any, any>[]): LambdaPlan<TIn, TOut> {
    for (const peer of peers) {
      if (peer.fn === this.fn) {
        return peer;
      }
    }
    return this;
  }

  execute(values: [CrystalValuesList<TIn>]): CrystalResultsList<TOut> {
    const { planDep } = this;
    if (planDep != null) {
      return values[planDep].map(this.fn);
    } else {
      return values[0].map(this.fn);
    }
  }
}

export function lambda<TIn, TOut>(
  $plan: ExecutablePlan<TIn> | null | undefined,
  fn: (value: TIn) => TOut,
): LambdaPlan<TIn, TOut> {
  return new LambdaPlan<TIn, TOut>($plan, fn);
}