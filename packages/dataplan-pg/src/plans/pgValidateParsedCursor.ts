import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan, isDev } from "graphile-crystal";

/**
 * Lightweight plan to validate cursor. We couldn't do this with a lambda
 * because we want it to be optimised away, and for that we need to implement
 * the deduplicate method.
 *
 * @internal
 */
export class PgValidateParsedCursorPlan extends ExecutablePlan<undefined> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgValidateParsedCursorPlan",
  };

  constructor(
    $parsedCursorPlan: ExecutablePlan<readonly any[] | null>,
    private digest: string,
    private orderCount: number,
    private beforeOrAfter: "before" | "after",
  ) {
    super();
    this.addDependency($parsedCursorPlan);
  }

  deduplicate(plans: PgValidateParsedCursorPlan[]): PgValidateParsedCursorPlan {
    for (const plan of plans) {
      if (
        plan.digest === this.digest &&
        plan.orderCount === this.orderCount &&
        plan.beforeOrAfter === this.beforeOrAfter
      ) {
        return plan;
      }
    }
    return this;
  }

  execute(
    values: CrystalValuesList<[string | null]>,
  ): CrystalResultsList<undefined> {
    return values.map(([decoded]) => {
      if (!decoded) {
        return;
      }
      try {
        const [cursorDigest, ...cursorParts] = decoded;
        if (!cursorDigest || cursorDigest !== this.digest) {
          throw new Error(
            `Invalid cursor digest - '${cursorDigest}' !== '${this.digest}'`,
          );
        }
        if (cursorParts.length !== this.orderCount) {
          throw new Error(
            `Invalid cursor length - ${cursorParts.length} !== ${this.orderCount}`,
          );
        }
        return undefined;
      } catch (e) {
        if (isDev) {
          console.error("Invalid cursor:");
          console.error(e);
        }
        throw new Error(
          `Invalid '${this.beforeOrAfter}' cursor - a cursor is only valid within a specific ordering, if you change the order then you'll need different cursors.`,
        );
      }
    });
  }
}

export const pgValidateParsedCursor = (
  $parsedCursorPlan: ExecutablePlan<readonly any[] | null>,
  digest: string,
  orderCount: number,
  beforeOrAfter: "before" | "after",
) =>
  new PgValidateParsedCursorPlan(
    $parsedCursorPlan,
    digest,
    orderCount,
    beforeOrAfter,
  );
