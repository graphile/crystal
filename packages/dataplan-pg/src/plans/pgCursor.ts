import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan, list } from "graphile-crystal";

import type { PgSource } from "../datasource";
import { PgSelectSinglePlan } from "./pgSelectSingle";

export class PgCursorPlan<
  TPlan extends PgSelectSinglePlan<any, any, any, any>,
> extends ExecutablePlan<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCursorPlan",
  };

  private cursorValuesPlanId: number;
  private classSinglePlanId: number;
  private digest: string;

  constructor(itemPlan: TPlan) {
    super();
    const classPlan = itemPlan.getClassPlan();
    this.classSinglePlanId = itemPlan.id;
    this.digest = classPlan.getOrderByDigest();
    const orders = classPlan.getOrderBy();
    const plan = list(
      orders.map((o) => itemPlan.expression(o.fragment, o.codec)),
    );
    this.cursorValuesPlanId = this.addDependency(plan);
  }

  public getClassSinglePlan(): TPlan {
    const plan = this.getPlan(this.classSinglePlanId);
    if (!(plan instanceof PgSelectSinglePlan)) {
      throw new Error(
        `Expected ${this.classSinglePlanId} (${plan}) to be a PgSelectSinglePlan`,
      );
    }
    return plan as TPlan;
  }

  execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
  ): CrystalResultsList<string> {
    return values.map((value) =>
      Buffer.from(
        JSON.stringify([this.digest, ...value[this.cursorValuesPlanId]]),
        "utf8",
      ).toString("base64"),
    );
  }
}
