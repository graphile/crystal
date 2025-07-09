"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeStep = exports.ConnectionStep = void 0;
exports.assertPageInfoCapableStep = assertPageInfoCapableStep;
exports.assertEdgeCapableStep = assertEdgeCapableStep;
exports.connection = connection;
exports.itemsOrStep = itemsOrStep;
const tslib_1 = require("tslib");
const assert = tslib_1.__importStar(require("../assert.js"));
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const constant_js_1 = require("./constant.js");
const each_js_1 = require("./each.js");
function assertPageInfoCapableStep($step) {
    const $typed = $step;
    if (typeof $typed.hasNextPage !== "function" ||
        typeof $typed.hasPreviousPage !== "function" ||
        typeof $typed.startCursor !== "function" ||
        typeof $typed.endCursor !== "function") {
        throw new Error(`Expected a PageInfoCapableStep, but found '${$step}'`);
    }
}
const EMPTY_OBJECT = Object.freeze(Object.create(null));
/**
 * Handles GraphQL cursor pagination in a standard and consistent way
 * indepdenent of data source.
 */
class ConnectionStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ConnectionStep",
    }; }
    // TYPES: if subplan is `ConnectionCapableStep<EdgeCapableStep<any>>` then `nodePlan`/`cursorPlan` aren't needed; otherwise `cursorPlan` is required.
    constructor(subplan, config = {}) {
        super();
        this.isSyncAndSafe = true;
        // Pagination stuff
        this._firstDepId = null;
        this._lastDepId = null;
        this._offsetDepId = null;
        this._beforeDepId = undefined;
        this._afterDepId = undefined;
        const { edgeDataPlan, nodePlan, cursorPlan } = config;
        this.edgeDataPlan = edgeDataPlan;
        this.itemPlan = nodePlan;
        this.cursorPlan = cursorPlan;
        if (!cursorPlan) {
            // ENHANCE: Assert that the `nodePlan` has a `.cursor()` method.
        }
        // This is a _soft_ reference to the plan; we're not adding it as a
        // dependency since we do not actually need it to execute; it's our
        // children that need access to it.
        this.subplanId = subplan.id;
    }
    toStringMeta() {
        return String(this.subplanId);
    }
    getFirst() {
        return this.maybeGetDep(this._firstDepId);
    }
    setFirst(first) {
        if (this._firstDepId != null) {
            throw new Error(`${this}->setFirst already called`);
        }
        const $first = typeof first === "number" ? (0, constant_js_1.constant)(first) : first;
        this._firstDepId = this.addUnaryDependency({
            step: $first,
            nonUnaryMessage: () => `${this}.setFirst(...) must be passed a _unary_ step, but ${$first} is not unary. See: https://err.red/gud#connection`,
        });
    }
    getLast() {
        return this.maybeGetDep(this._lastDepId);
    }
    setLast(last) {
        if (this._lastDepId != null) {
            throw new Error(`${this}->setLast already called`);
        }
        const $last = typeof last === "number" ? (0, constant_js_1.constant)(last) : last;
        this._lastDepId = this.addUnaryDependency({
            step: $last,
            nonUnaryMessage: () => `${this}.setLast(...) must be passed a _unary_ step, but ${$last} is not unary. See: https://err.red/gud#connection`,
        });
    }
    getOffset() {
        return this.maybeGetDep(this._offsetDepId);
    }
    setOffset(offset) {
        if (this._offsetDepId != null) {
            throw new Error(`${this}->setOffset already called`);
        }
        const $offset = typeof offset === "number" ? (0, constant_js_1.constant)(offset) : offset;
        this._offsetDepId = this.addUnaryDependency({
            step: $offset,
            nonUnaryMessage: () => `${this}.setOffset(...) must be passed a _unary_ step, but ${$offset} is not unary. See: https://err.red/gud#connection`,
        });
    }
    getBefore() {
        return this.maybeGetDep(this._beforeDepId, true);
    }
    setBefore($beforePlan) {
        if ($beforePlan instanceof constant_js_1.ConstantStep && $beforePlan.data == null) {
            return;
        }
        if (this._beforeDepId !== undefined) {
            throw new Error(`${this}->setBefore already called`);
        }
        const $parsedBeforePlan = this.getSubplan().parseCursor($beforePlan);
        this._beforeDepId = this.addUnaryDependency({
            step: $parsedBeforePlan,
            nonUnaryMessage: () => `${this}.setBefore(...) must be passed a _unary_ step, but ${$parsedBeforePlan} (and presumably ${$beforePlan}) is not unary. See: https://err.red/gud#connection`,
        });
    }
    getAfter() {
        return this.maybeGetDep(this._afterDepId, true);
    }
    setAfter($afterPlan) {
        if ($afterPlan instanceof constant_js_1.ConstantStep && $afterPlan.data == null) {
            return;
        }
        if (this._afterDepId !== undefined) {
            throw new Error(`${this}->setAfter already called`);
        }
        const $parsedAfterPlan = this.getSubplan().parseCursor($afterPlan);
        this._afterDepId = this.addUnaryDependency({
            step: $parsedAfterPlan,
            nonUnaryMessage: () => `${this}.setAfter(...) must be passed a _unary_ step, but ${$parsedAfterPlan} (and presumably ${$afterPlan}) is not unary. See: https://err.red/gud#connection`,
        });
    }
    /**
     * This should not be called after the arguments have been finalized.
     */
    getSubplan() {
        if (this.isArgumentsFinalized) {
            throw new Error("Forbidden to call ConnectionStep.getSubplan after arguments finalize");
        }
        const plan = this.getStep(this.subplanId);
        return plan;
    }
    /**
     * This represents the entire collection with conditions and ordering
     * applied, but without any pagination constraints (before, after, first,
     * last, offset) applied. It's useful for the following:
     *
     * - performing aggregates e.g. totalCount across the entire collection
     * - determining fields for pageInfo, e.g. is there a next/previous page
     *
     * This cannot be called before the arguments have been finalized.
     */
    cloneSubplanWithoutPagination(...args) {
        if (!this.isArgumentsFinalized) {
            throw new Error("Forbidden to call ConnectionStep.nodes before arguments finalize");
        }
        const plan = this.getStep(this.subplanId);
        const clonedPlan = plan.connectionClone(this, ...args);
        return clonedPlan;
    }
    /**
     * This represents a single page from the collection - not only have
     * conditions and ordering been applied but we've also applied the pagination
     * constraints (before, after, first, last, offset). It's useful for
     * returning the actual edges and nodes of the connection.
     *
     * This cannot be called before the arguments have been finalized.
     */
    cloneSubplanWithPagination(
    // TYPES: ugh. The `|[]` shouldn't be needed.
    ...args) {
        const clonedPlan = this.cloneSubplanWithoutPagination(...args);
        {
            const plan = this.getBefore();
            if (plan !== null) {
                clonedPlan.setBefore(plan);
            }
        }
        {
            const plan = this.getAfter();
            if (plan !== null) {
                clonedPlan.setAfter(plan);
            }
        }
        {
            const plan = this.getFirst();
            if (plan !== null) {
                clonedPlan.setFirst(plan);
            }
        }
        {
            const plan = this.getLast();
            if (plan !== null) {
                clonedPlan.setLast(plan);
            }
        }
        {
            const plan = this.getOffset();
            if (plan !== null) {
                clonedPlan.setOffset(plan);
            }
        }
        return clonedPlan;
    }
    /**
     * Subplans may call this from their `setBefore`/`setAfter`/etc plans in order
     * to add a dependency to us, which is typically useful for adding validation
     * functions so that they are thrown "earlier", avoiding error bubbling.
     */
    addValidation(callback) {
        this.withMyLayerPlan(() => {
            this.addDependency(callback());
        });
    }
    get(fieldName) {
        switch (fieldName) {
            case "edges":
                return this.edges();
            case "nodes":
                return this.nodes();
            case "pageInfo":
                return this.pageInfo();
        }
    }
    edges() {
        if (this.cursorPlan || this.itemPlan || this.edgeDataPlan) {
            return (0, each_js_1.each)(this.cloneSubplanWithPagination(), ($intermediate) => this.wrapEdge($intermediate));
        }
        else {
            // Assuming the subplan is an EdgeCapableStep
            return this.cloneSubplanWithPagination();
        }
    }
    nodes() {
        if (this.itemPlan !== undefined) {
            return (0, each_js_1.each)(this.cloneSubplanWithPagination(), ($intermediate) => this.itemPlan($intermediate));
        }
        else {
            return this.cloneSubplanWithPagination();
        }
    }
    wrapEdge($edge) {
        return new EdgeStep(this, $edge);
    }
    pageInfo() {
        return this.cloneSubplanWithPagination().pageInfo(this);
    }
    /*
  
    **IMPORTANT**: we cannot optimize this by replacing ourself with a constant
    because otherwise errors in cursors/etc will be pushed down a level.
  
    public optimize() {
      return constant(EMPTY_OBJECT, false);
    }
    */
    execute({ count, }) {
        // Fake execution; data actually comes from the child plans
        return (0, utils_js_1.arrayOfLength)(count, EMPTY_OBJECT);
    }
    unbatchedExecute() {
        return EMPTY_OBJECT;
    }
}
exports.ConnectionStep = ConnectionStep;
function assertEdgeCapableStep($step) {
    const $typed = $step;
    if (typeof $typed.node !== "function" ||
        typeof $typed.cursor !== "function") {
        throw new Error(`Expected a EdgeCapableStep, but found '${$step}'`);
    }
}
class EdgeStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "EdgeStep",
    }; }
    constructor($connection, $item, skipCursor = false) {
        super();
        this.skipCursor = skipCursor;
        this.isSyncAndSafe = true;
        this.needCursor = false;
        const itemDepId = this.addDependency($item);
        assert.strictEqual(itemDepId, 0, "GrafastInternalError<89cc75cd-ccaf-4b7e-873f-a629c36d55f7>: item must be first dependency");
        if (!skipCursor) {
            const $cursor = $connection.cursorPlan?.($item) ??
                $item.cursor?.();
            if (!$cursor) {
                throw new Error(`No cursor plan known for '${$item}'`);
            }
            this.cursorDepId = this.addDependency($cursor);
            assert.strictEqual(this.cursorDepId, 1, "GrafastInternalError<46e4b5ca-0c11-4737-973d-0edd0be060c9>: cursor must be second dependency");
        }
        else {
            this.cursorDepId = null;
        }
        this.connectionDepId = this.addDependency($connection);
    }
    get(fieldName) {
        switch (fieldName) {
            case "node":
                return this.node();
            case "cursor":
                return this.cursor();
        }
    }
    getConnectionStep() {
        return this.getDep(this.connectionDepId);
    }
    getItemStep() {
        return this.getDep(0);
    }
    data() {
        const $item = this.getItemStep();
        return this.getConnectionStep().edgeDataPlan?.($item) ?? $item;
    }
    node() {
        const $item = this.getItemStep();
        return this.getConnectionStep().itemPlan?.($item) ?? $item;
    }
    cursor() {
        this.needCursor = true;
        return this.getDep(this.cursorDepId);
    }
    optimize() {
        if (!this.needCursor && this.cursorDepId !== null) {
            return new EdgeStep(this.getConnectionStep(), this.getItemStep(), true);
        }
        return this;
    }
    deduplicate(_peers) {
        return _peers;
    }
    deduplicatedWith(replacement) {
        if (this.needCursor) {
            replacement.needCursor = true;
        }
    }
    unbatchedExecute(_extra, record, cursor) {
        // Handle nulls; everything else comes from the child plans
        return record == null && (this.cursorDepId == null || cursor == null)
            ? null
            : EMPTY_OBJECT;
    }
}
exports.EdgeStep = EdgeStep;
let warned = false;
/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
function connection(step, config) {
    if (typeof config === "function") {
        if (!warned) {
            warned = true;
            console.warn(`The call signature for connection() has changed, arguments after the first argument should be specified via a config object`);
        }
        return connection(step, {
            // eslint-disable-next-line prefer-rest-params
            nodePlan: arguments[1],
            // eslint-disable-next-line prefer-rest-params
            cursorPlan: arguments[2],
        });
    }
    return new ConnectionStep(step, config);
}
function itemsOrStep($step) {
    return "items" in $step && typeof $step.items === "function"
        ? $step.items()
        : $step;
}
//# sourceMappingURL=connection.js.map