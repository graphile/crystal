import type { CrystalResultsList, CrystalValuesList } from "../interfaces";
import { ExecutablePlan } from "../plan";

export interface PageInfoCapablePlan extends ExecutablePlan<any> {
  hasNextPage(): ExecutablePlan<boolean>;
  hasPreviousPage(): ExecutablePlan<boolean>;
}

export interface ConnectionCapablePlan<
  T extends ReadonlyArray<any> = ReadonlyArray<any>,
> extends ExecutablePlan<T> {
  clone(...args: any[]): ConnectionCapablePlan<any>; // TODO: `this`
  pageInfo(): PageInfoCapablePlan;
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
  public cloneSubplan(...args: Parameters<TPlan["clone"]>): TPlan {
    if (!this.isArgumentsFinalized) {
      throw new Error(
        "Forbidden to call ConnectionPlan.nodes before arguments finalize",
      );
    }
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.clone(...args) as any;
  }

  public pageInfo() {
    const plan = this.getPlan(this.subplanId) as TPlan;
    return plan.clone().pageInfo();
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
