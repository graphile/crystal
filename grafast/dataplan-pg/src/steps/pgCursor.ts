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

  private cursorValuesDepId: number;
  private classSingleStepId: number;
  private digest: string;

  constructor(itemPlan: TStep) {
    super();
    this.classSingleStepId = itemPlan.id;
    const [digest, step] = itemPlan.getCursorDigestAndStep();
    this.digest = digest;
    this.cursorValuesDepId = this.addDependency(step);
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
    v: any[] | null,
  ): string | null {
    return v == null || v!.every((v) => v == null)
      ? null
      : Buffer.from(JSON.stringify([this.digest, ...v]), "utf8").toString(
          "base64",
        );
  }
}
