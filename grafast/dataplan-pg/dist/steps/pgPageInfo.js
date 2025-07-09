"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgPageInfoStep = void 0;
exports.pgPageInfo = pgPageInfo;
const grafast_1 = require("grafast");
/*
 * **IMPORTANT**: see pgPageInfo.md for reasoning behind decisions made in this file
 */
// Reduce GC overhead by reusing the same empty object over and over.
const EMPTY_OBJECT = Object.freeze(Object.create(null));
/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * Invoking PgPageInfoStep should have no direct overhead (e.g.
 * `pageInfo { __typename }` is free); cost should not be incurred until one of
 * the submethods is called.
 *
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
class PgPageInfoStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgPageInfoStep",
    }; }
    constructor(connectionPlan) {
        super();
        this.isSyncAndSafe = true;
        this.connectionStepId = this.addDependency(connectionPlan);
    }
    /**
     * Might come in handy later?
     *
     * @internal
     */
    getConnectionStep() {
        const plan = this.getDep(this.connectionStepId);
        if (!(plan instanceof grafast_1.ConnectionStep)) {
            throw new Error(`Expected ${plan} to be a ConnectionStep`);
        }
        return plan;
    }
    /**
     * Returns true if the following hold:
     *
     * - first is set
     * - last is not set
     * - if first had been one larger, another record would have been returned.
     *
     * In all other cases, false is returned.
     *
     * @see {@link https://relay.dev/graphql/connections.htm#HasNextPage()}
     */
    hasNextPage() {
        const $connection = this.getConnectionStep();
        const $first = $connection.getFirst() ?? (0, grafast_1.constant)(undefined);
        const $last = $connection.getLast() ?? (0, grafast_1.constant)(undefined);
        const $node = $connection.cloneSubplanWithPagination();
        const $hasMore = $node.hasMore();
        return (0, grafast_1.lambda)({ first: $first, last: $last, hasMore: $hasMore }, hasNextPageCb, true);
    }
    /**
     * Returns true if the following hold:
     *
     * - last is set
     * - first is not set
     * - if last had been one larger, another record would have been returned.
     *
     * In all other cases, false is returned.
     *
     * @see {@link https://relay.dev/graphql/connections.htm#HasPreviousPage()}
     */
    hasPreviousPage() {
        const $connection = this.getConnectionStep();
        const $first = $connection.getFirst() ?? (0, grafast_1.constant)(undefined);
        const $last = $connection.getLast() ?? (0, grafast_1.constant)(undefined);
        const $offset = $connection.getOffset() ?? (0, grafast_1.constant)(undefined);
        const $node = $connection.cloneSubplanWithPagination();
        const $hasMore = $node.hasMore();
        return (0, grafast_1.lambda)({ first: $first, last: $last, offset: $offset, hasMore: $hasMore }, hasPreviousPageCb, true);
    }
    startCursor() {
        const $connection = this.getConnectionStep();
        const $rows = $connection.cloneSubplanWithPagination();
        return $rows.row((0, grafast_1.first)($rows)).cursor();
    }
    endCursor() {
        const $connection = this.getConnectionStep();
        const $rows = $connection.cloneSubplanWithPagination();
        return $rows.row((0, grafast_1.last)($rows)).cursor();
    }
    execute({ count }) {
        return new Array(count).fill(EMPTY_OBJECT);
    }
    unbatchedExecute() {
        return EMPTY_OBJECT;
    }
}
exports.PgPageInfoStep = PgPageInfoStep;
/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
function pgPageInfo(connectionPlan) {
    return new PgPageInfoStep(connectionPlan);
}
function hasNextPageCb(parts) {
    const { first, last, hasMore } = parts;
    return first != null && last == null && first !== 0 ? hasMore : false;
}
function hasPreviousPageCb(parts) {
    const { first, last, offset, hasMore } = parts;
    if (first === 0 || last === 0) {
        return false;
    }
    if (last != null && first == null) {
        return hasMore;
    }
    else if (offset != null && offset !== 0) {
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=pgPageInfo.js.map