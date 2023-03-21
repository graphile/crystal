import type { ExecutableStep } from "grafast";

import type { PgTypeColumns } from "./codecs.js";
import type {
  PgSourceParameter,
  PgSourceRelation,
  PgSourceUnique,
} from "./datasource.js";
import type { PgClassSingleStep } from "./interfaces.js";
import { PgDeleteStep } from "./steps/pgDelete.js";
import { PgInsertStep } from "./steps/pgInsert.js";
import { PgSelectSingleStep } from "./steps/pgSelectSingle.js";
import { PgUpdateStep } from "./steps/pgUpdate.js";

export function assertPgClassSingleStep<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  step:
    | ExecutableStep<any>
    | PgClassSingleStep<TColumns, TUniques, TRelations, TParameters>,
): asserts step is PgClassSingleStep<
  TColumns,
  TUniques,
  TRelations,
  TParameters
> {
  if (
    !(
      step instanceof PgSelectSingleStep ||
      step instanceof PgInsertStep ||
      step instanceof PgUpdateStep ||
      step instanceof PgDeleteStep
    )
  ) {
    throw new Error(
      `Expected a PgSelectSingleStep, PgInsertStep, PgUpdateStep or PgDeleteStep, however we received '${step}'.`,
    );
  }
}
