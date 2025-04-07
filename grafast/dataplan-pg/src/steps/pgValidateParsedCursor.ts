import type { ExecutableStep, ExecutionExtra, Maybe } from "grafast";
import { isDev, SafeError, UnbatchedStep } from "grafast";

/**
 * Lightweight plan to validate cursor. We couldn't do this with a lambda
 * because we want it to be optimised away, and for that we need to implement
 * the deduplicate method.
 *
 * @internal
 */
export class PgValidateParsedCursorStep extends UnbatchedStep<undefined> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgValidateParsedCursorStep",
  };

  isSyncAndSafe = true;

  constructor(
    $parsedCursorPlan: ExecutableStep<readonly any[] | null>,
    private digest: string,
    private orderCount: number,
    private beforeOrAfter: "before" | "after",
  ) {
    super();
    this.addDependency($parsedCursorPlan);
    if (this.getAndFreezeIsUnary() !== true) {
      throw new Error(
        `PgValidateParsedCursorStep must be unary, you should only use it with input variables`,
      );
    }
  }

  deduplicate(
    plans: PgValidateParsedCursorStep[],
  ): PgValidateParsedCursorStep[] {
    return plans.filter(
      (plan) =>
        plan.digest === this.digest &&
        plan.orderCount === this.orderCount &&
        plan.beforeOrAfter === this.beforeOrAfter,
    );
  }

  unbatchedExecute(_info: ExecutionExtra, parsedCursor: readonly any[] | null) {
    return validateParsedCursor(
      parsedCursor,
      this.digest,
      this.orderCount,
      this.beforeOrAfter,
    );
  }
}

/**
 * Validates the given cursor matches the given details.
 */
export const pgValidateParsedCursor = (
  $parsedCursorPlan: ExecutableStep<readonly any[] | null>,
  digest: string,
  orderCount: number,
  beforeOrAfter: "before" | "after",
) =>
  new PgValidateParsedCursorStep(
    $parsedCursorPlan,
    digest,
    orderCount,
    beforeOrAfter,
  );

export function validateParsedCursor(
  decoded: Maybe<readonly any[]>,
  digest: string,
  orderCount: number,
  beforeOrAfter: "before" | "after",
) {
  if (!decoded) {
    return undefined;
  }
  try {
    const [cursorDigest, ...cursorParts] = decoded;
    if (!cursorDigest || cursorDigest !== digest) {
      throw new Error(
        `Invalid cursor digest - '${cursorDigest}' !== '${digest}'`,
      );
    }
    if (cursorDigest === "natural") {
      if (cursorParts.length !== 1 || typeof cursorParts[0] !== "number") {
        throw new Error(`Invalid 'natural' cursor value - ${cursorParts}`);
      }
    } else if (cursorParts.length !== orderCount) {
      throw new Error(
        `Invalid cursor length - ${cursorParts.length} !== ${orderCount}`,
      );
    }
    return undefined;
  } catch (e) {
    if (isDev) {
      console.error("Invalid cursor:");
      console.error(e);
    }
    throw new SafeError(
      `Invalid '${beforeOrAfter}' cursor - a cursor is only valid within a specific ordering, if you change the order then you'll need different cursors.`,
    );
  }
}
