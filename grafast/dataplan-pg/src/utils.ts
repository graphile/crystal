import type { ExecutableStep } from "grafast";

import type { PgResource } from "./datasource.js";
import type { PgClassSingleStep } from "./interfaces.js";
import { PgDeleteSingleStep } from "./steps/pgDeleteSingle.js";
import { PgInsertSingleStep } from "./steps/pgInsertSingle.js";
import { PgSelectSingleStep } from "./steps/pgSelectSingle.js";
import { PgUpdateSingleStep } from "./steps/pgUpdateSingle.js";

export function assertPgClassSingleStep<
  TResource extends PgResource<any, any, any, any, any>,
>(
  step: ExecutableStep | PgClassSingleStep<TResource>,
): asserts step is PgClassSingleStep<TResource> {
  if (
    !(
      step instanceof PgSelectSingleStep ||
      step instanceof PgInsertSingleStep ||
      step instanceof PgUpdateSingleStep ||
      step instanceof PgDeleteSingleStep
    )
  ) {
    throw new Error(
      `Expected a PgSelectSingleStep, PgInsertSingleStep, PgUpdateSingleStep or PgDeleteSingleStep, however we received '${step}'.`,
    );
  }
}
