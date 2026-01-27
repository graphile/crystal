import type { ExecutableStep, Step, UnbatchedExecutionExtra } from "grafast";
import { UnbatchedStep } from "grafast";

import type { PgCodec } from "../index.ts";

export interface PgCursorDetails {
  readonly digest: string;
  readonly indicies: ReadonlyArray<{
    index: number;
    codec: PgCodec;
  }>;
}

/**
 * Given a PgSelectSingleStep, this will build a cursor by looking at all the
 * orders applied and then fetching them and building a cursor string from
 * them.
 */
export class PgCursorStep extends UnbatchedStep<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCursorStep",
  };
  isSyncAndSafe = true;

  itemDepId: number;
  cursorDetailsDepId: number;

  constructor(
    $item: Step<readonly [...(readonly any[])] | null>,
    $cursorDetails: ExecutableStep<PgCursorDetails | null>,
  ) {
    super();
    this.itemDepId = this.addDependency($item);
    this.cursorDetailsDepId = this.addDependency($cursorDetails);
  }

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    itemTuple: any[] | null,
    cursorDetails: PgCursorDetails | null,
  ): string | null {
    if (itemTuple == null || cursorDetails == null) return null;
    const { digest, indicies } = cursorDetails;
    const cursorTuple = [digest];
    let hasNonNull = false;
    for (let i = 0, l = indicies.length; i < l; i++) {
      const { index, codec } = indicies[i];
      const orderVal = itemTuple[index];
      if (!hasNonNull && orderVal != null) {
        hasNonNull = true;
      }
      cursorTuple.push(codec.fromPg(orderVal));
    }
    if (!hasNonNull) return null;
    return Buffer.from(JSON.stringify(cursorTuple), "utf8").toString("base64");
  }
}
