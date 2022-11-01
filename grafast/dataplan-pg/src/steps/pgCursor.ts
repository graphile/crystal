import type { ExecutionExtra } from "grafast";
import { list, UnbatchedExecutableStep } from "grafast";
import sql from "pg-sql2";

import { TYPES } from "../codecs.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgUnionAllSingleStep } from "./pgUnionAll.js";

/**
 * Given a PgSelectSingleStep, this will build a cursor by looking at all the
 * orders applied and then fetching them and building a cursor string from
 * them.
 */
export class PgCursorStep<
  TStep extends PgSelectSingleStep<any, any, any, any> | PgUnionAllSingleStep,
> extends UnbatchedExecutableStep<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCursorStep",
  };
  isSyncAndSafe = true;

  private cursorValuesDepId: number;
  private classSingleStepId: number;
  private digest: string;

  constructor(itemPlan: TStep) {
    super();
    const classPlan = itemPlan.getClassStep();
    this.classSingleStepId = itemPlan.id;
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

  public getClassSingleStep(): TStep {
    const plan = this.getStep(this.classSingleStepId);
    if (!(plan instanceof PgSelectSingleStep)) {
      throw new Error(
        `Expected ${this.classSingleStepId} (${plan}) to be a PgSelectSingleStep`,
      );
    }
    return plan as TStep;
  }

  unbatchedExecute(extra: ExecutionExtra, v: any[] | null): string | null {
    return v == null || v!.every((v) => v == null)
      ? null
      : Buffer.from(JSON.stringify([this.digest, ...v]), "utf8").toString(
          "base64",
        );
  }
}
