import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export class LambdaPlan<TIn, TOut> extends ExecutablePlan<TOut> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "LambdaPlan",
  };
  sync = true;

  private planId: number | null;
  constructor(
    $plan: ExecutablePlan<TIn> | null | undefined,
    private fn: (value: TIn) => TOut,
  ) {
    super();
    this.planId = $plan != null ? this.addDependency($plan) : null;
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
