import type { ExecutableStep, UnbatchedExecutionExtra } from "grafast";
import { UnbatchedStep } from "grafast";

import type { PgCodec } from "../index.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgUnionAllSingleStep } from "./pgUnionAll.js";

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
export class PgCursorStep<
  TStep extends PgSelectSingleStep<any> | PgUnionAllSingleStep,
> extends UnbatchedStep<any> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCursorStep",
  };
  isSyncAndSafe = true;

  itemDepId: number;
  cursorDetailsDepId: number;

  constructor(
    $item: TStep,
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
