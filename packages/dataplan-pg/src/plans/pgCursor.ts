import type { CrystalResultsList, CrystalValuesList } from "dataplanner";
import { ExecutablePlan, list } from "dataplanner";
import sql from "pg-sql2";

import { TYPES } from "../codecs.js";
import { PgSelectSinglePlan } from "./pgSelectSingle.js";

/**
 * Given a PgSelectSinglePlan, this will build a cursor by looking at all the
 * orders applied and then fetching them and building a cursor string from
 * them.
 */
export class PgCursorPlan<
  TPlan extends PgSelectSinglePlan<any, any, any, any>,
> extends ExecutablePlan<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCursorPlan",
  };
  isSyncAndSafe = true;

  private cursorValuesDepId: number;
  private classSinglePlanId: string;
  private digest: string;

  constructor(itemPlan: TPlan) {
    super();
    const classPlan = itemPlan.getClassPlan();
    this.classSinglePlanId = itemPlan.id;
    this.digest = classPlan.getOrderByDigest();
    const orders = classPlan.getOrderBy();
    const plan = list(
      orders.length > 0
        ? orders.map((o) => itemPlan.expression(o.fragment, o.codec))
        : // No ordering; so use row number
          [
            itemPlan.expression(
              sql`row_number() over (partition by 1)`,
              TYPES.int,
            ),
          ],
    );
    this.cursorValuesDepId = this.addDependency(plan);
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
    values: [CrystalValuesList<any[] | null>],
  ): CrystalResultsList<string | null> {
    return values[this.cursorValuesDepId].map((v) => {
      return v == null || v!.every((v) => v == null)
        ? null
        : Buffer.from(JSON.stringify([this.digest, ...v]), "utf8").toString(
            "base64",
          );
    });
  }
}
