import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export interface ConnectionCapablePlan<
  T extends ReadonlyArray<any> = ReadonlyArray<any>,
> extends ExecutablePlan<T> {
  clone(): ConnectionCapablePlan<any>; // TODO: `this`
  hasNextPage(): ExecutablePlan<boolean>;
  hasPreviousPage(): ExecutablePlan<boolean>;
}

export class ConnectionPlan<
  TPlan extends ConnectionCapablePlan,
> extends ExecutablePlan<unknown> {
  static $$export = {
    moduleName: "graphile-crystal",
    exportName: "ConnectionPlan",
  };

  private subplanId: number;

  constructor(subplan: TPlan) {
    super();
    // This is a _soft_ reference to the plan; we're not adding it as a
    // dependency since we do not actually need it to execute; it's our
    // children that need access to it.
    this.subplanId = subplan.id;
  }

  public toStringMeta(): string {
    return String(this.subplanId);
  }

  /**
   * This should not be called after 'finalizeArguments' has been called.
   */
  public getSubplan(): TPlan {
    if (this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionPlan.getSubplan after arguments finalize",
      );
    }
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan;
  }

  /**
   * This cannot be called before 'finalizeArguments' has been called.
   */
  public nodes(): TPlan {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionPlan.nodes before arguments finalize",
      );
    }
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.clone() as any;
  }

  public hasNextPage() {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.clone().hasNextPage();
  }

  public hasPreviousPage() {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.clone().hasNextPage();
  }

  public execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<Record<string, never>> {
    return values.map(() => ({}));
  }
}

export function connection<TPlan extends ConnectionCapablePlan>(
  plan: TPlan,
): ConnectionPlan<TPlan> {
  return new ConnectionPlan(plan);
}
