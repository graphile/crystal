"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgValidateParsedCursor = exports.PgValidateParsedCursorStep = void 0;
exports.validateParsedCursor = validateParsedCursor;
const grafast_1 = require("grafast");
/**
 * Lightweight plan to validate cursor. We couldn't do this with a lambda
 * because we want it to be optimised away, and for that we need to implement
 * the deduplicate method.
 *
 * @internal
 */
class PgValidateParsedCursorStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgValidateParsedCursorStep",
    }; }
    constructor($parsedCursorPlan, digest, orderCount, beforeOrAfter) {
        super();
        this.digest = digest;
        this.orderCount = orderCount;
        this.beforeOrAfter = beforeOrAfter;
        this.isSyncAndSafe = true;
        this.addDependency($parsedCursorPlan);
        if (this.getAndFreezeIsUnary() !== true) {
            throw new Error(`PgValidateParsedCursorStep must be unary, you should only use it with input variables`);
        }
    }
    deduplicate(plans) {
        return plans.filter((plan) => plan.digest === this.digest &&
            plan.orderCount === this.orderCount &&
            plan.beforeOrAfter === this.beforeOrAfter);
    }
    unbatchedExecute(_info, parsedCursor) {
        return validateParsedCursor(parsedCursor, this.digest, this.orderCount, this.beforeOrAfter);
    }
}
exports.PgValidateParsedCursorStep = PgValidateParsedCursorStep;
/**
 * Validates the given cursor matches the given details.
 */
const pgValidateParsedCursor = ($parsedCursorPlan, digest, orderCount, beforeOrAfter) => new PgValidateParsedCursorStep($parsedCursorPlan, digest, orderCount, beforeOrAfter);
exports.pgValidateParsedCursor = pgValidateParsedCursor;
function validateParsedCursor(decoded, digest, orderCount, beforeOrAfter) {
    if (!decoded) {
        return undefined;
    }
    try {
        const [cursorDigest, ...cursorParts] = decoded;
        if (!cursorDigest || cursorDigest !== digest) {
            throw new Error(`Invalid cursor digest - '${cursorDigest}' !== '${digest}'`);
        }
        if (cursorDigest === "natural") {
            if (cursorParts.length !== 1 || typeof cursorParts[0] !== "number") {
                throw new Error(`Invalid 'natural' cursor value - ${cursorParts}`);
            }
        }
        else if (cursorParts.length !== orderCount) {
            throw new Error(`Invalid cursor length - ${cursorParts.length} !== ${orderCount}`);
        }
        return undefined;
    }
    catch (e) {
        if (grafast_1.isDev) {
            console.error("Invalid cursor:");
            console.error(e);
        }
        throw new grafast_1.SafeError(`Invalid '${beforeOrAfter}' cursor - a cursor is only valid within a specific ordering, if you change the order then you'll need different cursors.`);
    }
}
//# sourceMappingURL=pgValidateParsedCursor.js.map