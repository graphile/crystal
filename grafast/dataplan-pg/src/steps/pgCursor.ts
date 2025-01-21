import type { UnbatchedExecutionExtra } from "grafast";
import { UnbatchedExecutableStep } from "grafast";

import { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgUnionAllSingleStep } from "./pgUnionAll.js";

/**
 * Given a PgSelectSingleStep, this will build a cursor by looking at all the
 * orders applied and then fetching them and building a cursor string from
 * them.
 */
export class PgCursorStep<
  TStep extends PgSelectSingleStep<any> | PgUnionAllSingleStep,
> extends UnbatchedExecutableStep<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCursorStep",
  };
  isSyncAndSafe = true;

  private classSingleStepId: number;

  constructor(itemPlan: TStep) {
    super();
    this.classSingleStepId = itemPlan.id;
    const $dandv = itemPlan.getCursorDigestAndValues();
    this.addDependency($dandv);
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

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    deets: [digest: string, values: any[] | null] | null,
  ): string | null {
    if (!deets) return null;
    const [digest, values] = deets;
    return values == null || values!.every((v: any) => v == null)
      ? null
      : Buffer.from(JSON.stringify([digest, ...values]), "utf8").toString(
          "base64",
        );
  }
}
