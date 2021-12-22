import type {
  CrystalResultsList,
  CrystalValuesList,
  PageInfoCapablePlan,
} from "graphile-crystal";
import { constant, ExecutablePlan } from "graphile-crystal";

import { PgSelectPlan } from "./pgSelect";

/**
 * Invoking PgPageInfoPlan should have no direct overhead (e.g.
 * `pageInfo { __typename }` is free); cost should not be incurred until one of
 * the submethods is called.
 */
export class PgPageInfoPlan<TPlan extends PgSelectPlan<any, any, any, any>>
  extends ExecutablePlan<any>
  implements PageInfoCapablePlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPageInfoPlan",
  };

  private classPlanId: number;

  constructor(selectPlan: TPlan) {
    super();
    this.classPlanId = selectPlan.id;
  }

  public getClassPlan(): TPlan {
    const plan = this.getPlan(this.classPlanId);
    if (!(plan instanceof PgSelectPlan)) {
      throw new Error(
        `Expected ${this.classPlanId} (${plan}) to be a PgSelectPlan`,
      );
    }
    return plan as TPlan;
  }

  public hasNextPage(): ExecutablePlan<boolean> {
    // TODO!
    return constant(true);
  }

  public hasPreviousPage(): ExecutablePlan<boolean> {
    return constant(true);
  }

  public totalCount(): ExecutablePlan<number> {
    return constant(-1);
  }

  execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
  ): CrystalResultsList<object> {
    return values.map((_value) => ({}));
  }
}

export function pgPageInfo<TPlan extends PgSelectPlan<any, any, any, any>>(
  selectPlan: TPlan,
): PgPageInfoPlan<TPlan> {
  return new PgPageInfoPlan(selectPlan);
}
