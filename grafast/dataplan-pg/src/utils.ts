import type { ExecutableStep } from "grafast";

import type { PgResource } from "./datasource.js";
import type { PgClassSingleStep } from "./interfaces.js";
import { PgDeleteStep } from "./steps/pgDelete.js";
import { PgInsertStep } from "./steps/pgInsert.js";
import { PgSelectSingleStep } from "./steps/pgSelectSingle.js";
import { PgUpdateStep } from "./steps/pgUpdate.js";

export function assertPgClassSingleStep<
  TResource extends PgResource<any, any, any, any, any>,
>(
  step: ExecutableStep | PgClassSingleStep<TResource>,
): asserts step is PgClassSingleStep<TResource> {
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
