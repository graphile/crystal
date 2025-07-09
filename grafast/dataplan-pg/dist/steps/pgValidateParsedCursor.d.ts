import type { ExecutableStep, Maybe } from "grafast";
/**
 * Validates the given cursor matches the given details.
 */
export declare const pgValidateParsedCursor: ($parsedCursorPlan: ExecutableStep<readonly any[] | null>, digest: string, orderCount: number, beforeOrAfter: "before" | "after") => PgValidateParsedCursorStep;
export declare function validateParsedCursor(decoded: Maybe<readonly any[]>, digest: string, orderCount: number, beforeOrAfter: "before" | "after"): undefined;
//# sourceMappingURL=pgValidateParsedCursor.d.ts.map