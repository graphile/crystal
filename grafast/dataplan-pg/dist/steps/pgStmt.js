"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgStmtBaseStep = void 0;
exports.getUnary = getUnary;
exports.calculateLimitAndOffsetSQL = calculateLimitAndOffsetSQL;
exports.calculateLimitAndOffsetSQLFromInfo = calculateLimitAndOffsetSQLFromInfo;
exports.applyCommonPaginationStuff = applyCommonPaginationStuff;
exports.makeValues = makeValues;
const grafast_1 = require("grafast");
const pg_sql2_1 = require("pg-sql2");
const utils_js_1 = require("../utils.js");
const UNHANDLED_PLACEHOLDER = (0, pg_sql2_1.sql) `(1/0) /* ERROR! Unhandled placeholder! */`;
const UNHANDLED_DEFERRED = (0, pg_sql2_1.sql) `(1/0) /* ERROR! Unhandled deferred! */`;
class PgStmtBaseStep extends grafast_1.Step {
    constructor() {
        super(...arguments);
        this.needsCursor = false;
        this.scopedSQL = (0, utils_js_1.makeScopedSQL)(this);
    }
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgStmtBaseStep",
    }; }
    /**
     * If we can't figure out the SQL until runtime, we can pass a step that
     * resolves to an SQL fragment.
     *
     * IMPORTANT: this step must be a "unary" step; i.e. it can only depend on
     * request-global dependencies such as variableValues, context, and input
     * arguments.
     */
    deferredSQL($step) {
        const symbol = Symbol(`deferred-${$step.id}`);
        const dependencyIndex = this.addUnaryDependency($step);
        this.deferreds.push({ symbol, dependencyIndex });
        return pg_sql2_1.sql.placeholder(symbol, UNHANDLED_DEFERRED);
    }
    placeholder($step, overrideCodec, alreadyEncoded = false) {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot add placeholders once plan is locked`);
        }
        if (this.placeholders.length >= 100000) {
            throw new Error(`There's already ${this.placeholders.length} placeholders; wanting more suggests there's a bug somewhere`);
        }
        const codec = overrideCodec ?? ("pgCodec" in $step ? $step.pgCodec : null);
        if (!codec) {
            console.trace(`${this}.placeholder(${$step}) call, no codec`);
            throw new Error(`Step ${$step} does not contain pgCodec information, please pass the codec explicitly to the 'placeholder' method.`);
            // throw new Error(
            //   `Step ${$step} does not contain pgCodec information, please wrap ` +
            //     `it in \`pgCast\`. E.g. \`pgCast($step, TYPES.boolean)\``,
            // );
        }
        const $evalledStep = (0, grafast_1.applyTransforms)($step);
        const dependencyIndex = this.addDependency($evalledStep);
        const symbol = Symbol(`placeholder-${$step.id}`);
        this.placeholders.push({
            symbol,
            dependencyIndex,
            codec,
            alreadyEncoded,
        });
        // This allows us to replace the SQL that will be compiled, for example
        // when we're inlining this into a parent query.
        return pg_sql2_1.sql.placeholder(symbol, UNHANDLED_PLACEHOLDER);
    }
    makeValues(executionDetails, name) {
        const { values, count } = executionDetails;
        const identifiersSymbol = Symbol(name + "_identifiers");
        const identifiersAlias = pg_sql2_1.sql.identifier(identifiersSymbol);
        /**
         * Since this is effectively like a DataLoader it processes the data for many
         * different resolvers at once. This list of (hopefully scalar) plans is used
         * to represent queryValues the query will need such as identifiers for which
         * records in the result set should be returned to which GraphQL resolvers,
         * parameters for conditions or orders, etc.
         */
        const queryValues = [];
        const placeholderValues = new Map();
        const handlePlaceholder = (placeholder) => {
            const { symbol, dependencyIndex, codec, alreadyEncoded } = placeholder;
            const ev = values[dependencyIndex];
            if (!ev.isBatch || count === 1) {
                const value = ev.at(0);
                const encodedValue = value == null ? null : alreadyEncoded ? value : codec.toPg(value);
                placeholderValues.set(symbol, (0, pg_sql2_1.sql) `${pg_sql2_1.sql.value(encodedValue)}::${codec.sqlType}`);
            }
            else {
                // Fine a existing match for this dependency of this type
                const existingIndex = queryValues.findIndex((v) => v.dependencyIndex === dependencyIndex && v.codec === codec);
                // If none exists, add one to our query values
                const idx = existingIndex >= 0
                    ? existingIndex
                    : queryValues.push(placeholder) - 1;
                // Finally alias this symbol to a reference to this placeholder
                placeholderValues.set(placeholder.symbol, (0, pg_sql2_1.sql) `${identifiersAlias}.${pg_sql2_1.sql.identifier(`id${idx}`)}`);
            }
        };
        this.placeholders.forEach(handlePlaceholder);
        // Handle deferreds
        this.deferreds.forEach((placeholder) => {
            const { symbol, dependencyIndex } = placeholder;
            const fragment = values[dependencyIndex].unaryValue();
            if (!pg_sql2_1.sql.isSQL(fragment)) {
                throw new Error(`Deferred SQL must be a valid SQL fragment`);
            }
            placeholderValues.set(symbol, fragment);
        });
        return {
            queryValues,
            placeholderValues,
            identifiersSymbol,
            identifiersAlias,
            handlePlaceholder,
        };
    }
    setFirst($first) {
        this.locker.assertParameterUnlocked("first");
        this.firstStepId = this.addUnaryDependency($first);
        this.locker.lockParameter("first");
        return this;
    }
    setLast($last) {
        this.assertCursorPaginationAllowed();
        this.locker.assertParameterUnlocked("orderBy");
        this.locker.assertParameterUnlocked("last");
        this.lastStepId = this.addUnaryDependency($last);
        this.locker.lockParameter("last");
        return this;
    }
    setOffset($offset) {
        this.locker.assertParameterUnlocked("offset");
        this.offsetStepId = this.addUnaryDependency($offset);
        this.locker.lockParameter("offset");
        return this;
    }
    setAfter($parsedCursorPlan) {
        this.afterStepId = this.addUnaryDependency($parsedCursorPlan);
    }
    setBefore($parsedCursorPlan) {
        this.beforeStepId = this.addUnaryDependency($parsedCursorPlan);
    }
    parseCursor($cursorPlan) {
        this.assertCursorPaginationAllowed();
        const $parsedCursorPlan = (0, grafast_1.lambda)($cursorPlan, parseCursor);
        return $parsedCursorPlan;
    }
    /**
     * Someone (probably pageInfo) wants to know if there's more records. To
     * determine this we fetch one extra record and then throw it away.
     */
    hasMore() {
        this.fetchOneExtra = true;
        return (0, grafast_1.access)(this, "hasMore", false);
    }
    getPgRoot() {
        return this;
    }
}
exports.PgStmtBaseStep = PgStmtBaseStep;
function parseCursor(cursor) {
    if (cursor == null) {
        return null;
    }
    try {
        if (typeof cursor !== "string") {
            throw new Error("Invalid cursor");
        }
        const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
        if (!Array.isArray(decoded)) {
            throw new Error("Expected array");
        }
        return decoded;
    }
    catch (e) {
        throw new grafast_1.SafeError("Invalid cursor, please enter a cursor from a previous request, or null.");
    }
}
parseCursor.isSyncAndSafe = true; // Optimization
function getUnary(values, stepId) {
    return stepId == null ? undefined : values[stepId].unaryValue();
}
function calculateLimitAndOffsetSQL(params) {
    const { cursorLower, cursorUpper, first, last, offset, fetchOneExtra } = params;
    let limitValue;
    let offsetValue;
    let innerLimitValue;
    if (cursorLower != null || cursorUpper != null) {
        /*
         * When using cursor-base pagination with 'natural' cursors, we are actually
         * applying limit/offset under the hood (presumably because we're paginating
         * something that has no explicit order, like a function).
         *
         * If you have:
         * - first: 3
         * - after: ['natural', 4]
         *
         * Then we want `limit 3 offset 4`.
         * With `fetchOneExtra` it'd be `limit 4 offset 4`.
         *
         * For:
         * - last: 2
         * - before: ['natural', 6]
         *
         * We want `limit 2 offset 4`
         * With `fetchOneExtra` it'd be `limit 3 offset 3`.
         *
         * For:
         * - last: 2
         * - before: ['natural', 3]
         *
         * We want `limit 2`
         * With `fetchOneExtra` it'd still be `limit 2`.
         *
         * For:
         * - last: 2
         * - before: ['natural', 4]
         *
         * We want `limit 2 offset 1`
         * With `fetchOneExtra` it'd be `limit 3`.
         *
         * Using `offset` with `after`/`before` is forbidden, so we do not need to
         * consider that.
         *
         * For:
         * - after: ['natural', 2]
         * - before: ['natural', 6]
         *
         * We want `limit 4 offset 2`
         * With `fetchOneExtra` it'd be `limit 4 offset 2` still.
         *
         * For:
         * - first: 2
         * - after: ['natural', 2]
         * - before: ['natural', 6]
         *
         * We want `limit 2 offset 2`
         * With `fetchOneExtra` it'd be `limit 3 offset 2` still.
         */
        /** lower bound - exclusive (1-indexed) */
        let lower = 0;
        /** upper bound - exclusive (1-indexed) */
        let upper = Infinity;
        // Apply 'after', if present
        if (cursorLower != null) {
            lower = Math.max(0, cursorLower);
        }
        // Apply 'before', if present
        if (cursorUpper != null) {
            upper = cursorUpper;
        }
        // Cannot go beyond these bounds
        const maxUpper = upper;
        // Apply 'first', if present
        if (first != null) {
            upper = Math.min(upper, lower + first + 1);
        }
        // Apply 'last', if present
        if (last != null) {
            lower = Math.max(0, lower, upper - last - 1);
        }
        // Apply 'offset', if present
        if (offset != null && offset > 0) {
            lower = Math.min(lower + offset, maxUpper);
            upper = Math.min(upper + offset, maxUpper);
        }
        // If 'fetch one extra', adjust:
        if (fetchOneExtra) {
            if (first != null) {
                upper = upper + 1;
            }
            else if (last != null) {
                lower = Math.max(0, lower - 1);
            }
        }
        /** lower, but 0-indexed and inclusive */
        const lower0 = lower - 1 + 1;
        /** upper, but 0-indexed and inclusive */
        const upper0 = upper - 1 - 1;
        // Calculate the final limit/offset
        limitValue = isFinite(upper0) ? Math.max(0, upper0 - lower0 + 1) : null;
        offsetValue = lower0;
        innerLimitValue = limitValue != null ? limitValue + offsetValue : null;
    }
    else {
        limitValue =
            first != null
                ? first + (fetchOneExtra ? 1 : 0)
                : last != null
                    ? last + (fetchOneExtra ? 1 : 0)
                    : null;
        offsetValue = offset;
        innerLimitValue =
            first != null || last != null
                ? (first ?? last ?? 0) + (offset ?? 0) + (fetchOneExtra ? 1 : 0)
                : null;
    }
    // PERF: consider changing from `${sql.literal(v)}` to
    // `${sql.value(v)}::"int4"`. (The advantage being that fewer SQL queries are
    // generated, and thus chances of reusing a query are greater.)
    const limitSql = limitValue == null ? pg_sql2_1.sql.blank : (0, pg_sql2_1.sql) `\nlimit ${pg_sql2_1.sql.literal(limitValue)}`;
    const offsetSql = offsetValue == null || offsetValue === 0
        ? pg_sql2_1.sql.blank
        : (0, pg_sql2_1.sql) `\noffset ${pg_sql2_1.sql.literal(offsetValue)}`;
    const limitAndOffset = (0, pg_sql2_1.sql) `${limitSql}${offsetSql}`;
    const innerLimitSQL = innerLimitValue != null
        ? (0, pg_sql2_1.sql) `\nlimit ${pg_sql2_1.sql.literal(innerLimitValue)}`
        : pg_sql2_1.sql.blank;
    return [limitAndOffset, innerLimitSQL];
}
function calculateLimitAndOffsetSQLFromInfo(info) {
    const { executionDetails: { values }, fetchOneExtra, cursorUpper, cursorLower, } = info;
    return calculateLimitAndOffsetSQL({
        first: getUnary(values, info.firstStepId),
        last: getUnary(values, info.lastStepId),
        offset: getUnary(values, info.offsetStepId),
        cursorLower,
        cursorUpper,
        fetchOneExtra,
    });
}
function applyCommonPaginationStuff(info) {
    const { cursorUpper, cursorLower, executionDetails: { values }, } = info;
    const first = getUnary(values, info.firstStepId);
    const last = getUnary(values, info.lastStepId);
    const offset = getUnary(values, info.offsetStepId);
    if (offset != null && last != null) {
        throw new grafast_1.SafeError("Cannot use 'offset' with 'last'");
    }
    info.first = first;
    info.last = last;
    info.offset = offset;
    /**
     * If `last` is in use then we reverse the order from the database and then
     * re-reverse it in JS-land.
     */
    info.shouldReverseOrder =
        first == null && last != null && cursorLower == null && cursorUpper == null;
}
function makeValues(info, name) {
    const { executionDetails, placeholders, deferreds } = info;
    const { values, count } = executionDetails;
    const identifiersSymbol = Symbol(name + "_identifiers");
    const identifiersAlias = pg_sql2_1.sql.identifier(identifiersSymbol);
    /**
     * Since this is effectively like a DataLoader it processes the data for many
     * different resolvers at once. This list of (hopefully scalar) plans is used
     * to represent queryValues the query will need such as identifiers for which
     * records in the result set should be returned to which GraphQL resolvers,
     * parameters for conditions or orders, etc.
     */
    const queryValues = [];
    const placeholderValues = new Map();
    const handlePlaceholder = (placeholder) => {
        const { symbol, dependencyIndex, codec, alreadyEncoded } = placeholder;
        const ev = values[dependencyIndex];
        if (!ev.isBatch || count === 1) {
            const value = ev.at(0);
            const encodedValue = value == null ? null : alreadyEncoded ? value : codec.toPg(value);
            placeholderValues.set(symbol, (0, pg_sql2_1.sql) `${pg_sql2_1.sql.value(encodedValue)}::${codec.sqlType}`);
        }
        else {
            // Fine a existing match for this dependency of this type
            const existingIndex = queryValues.findIndex((v) => v.dependencyIndex === dependencyIndex && v.codec === codec);
            // If none exists, add one to our query values
            const idx = existingIndex >= 0 ? existingIndex : queryValues.push(placeholder) - 1;
            // Finally alias this symbol to a reference to this placeholder
            placeholderValues.set(placeholder.symbol, (0, pg_sql2_1.sql) `${identifiersAlias}.${pg_sql2_1.sql.identifier(`id${idx}`)}`);
        }
    };
    placeholders.forEach(handlePlaceholder);
    // Handle deferreds
    deferreds.forEach((placeholder) => {
        const { symbol, dependencyIndex } = placeholder;
        const fragment = values[dependencyIndex].unaryValue();
        if (!pg_sql2_1.sql.isSQL(fragment)) {
            throw new Error(`Deferred SQL must be a valid SQL fragment`);
        }
        placeholderValues.set(symbol, fragment);
    });
    return {
        queryValues,
        placeholderValues,
        identifiersSymbol,
        identifiersAlias,
        handlePlaceholder,
    };
}
//# sourceMappingURL=pgStmt.js.map