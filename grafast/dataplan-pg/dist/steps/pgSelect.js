"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSelectRowsStep = exports.PgSelectStep = void 0;
exports.pgSelect = pgSelect;
exports.pgSelectFromRecords = pgSelectFromRecords;
exports.sqlFromArgDigests = sqlFromArgDigests;
exports.pgFromExpression = pgFromExpression;
exports.generatePgParameterAnalysis = generatePgParameterAnalysis;
exports.pgFromExpressionRuntime = pgFromExpressionRuntime;
exports.getFragmentAndCodecFromOrder = getFragmentAndCodecFromOrder;
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const debug_1 = tslib_1.__importDefault(require("debug"));
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importStar(require("pg-sql2"));
const codecs_js_1 = require("../codecs.js");
const parseArray_js_1 = require("../parseArray.js");
const pgLocker_js_1 = require("../pgLocker.js");
const pgClassExpression_js_1 = require("./pgClassExpression.js");
const pgCondition_js_1 = require("./pgCondition.js");
const pgPageInfo_js_1 = require("./pgPageInfo.js");
const pgSelectSingle_js_1 = require("./pgSelectSingle.js");
const pgStmt_js_1 = require("./pgStmt.js");
const pgValidateParsedCursor_js_1 = require("./pgValidateParsedCursor.js");
const ALWAYS_ALLOWED = true;
// Maximum identifier length in Postgres is 63 chars, so trim one off. (We
// could do base64... but meh.)
const hash = (text) => (0, crypto_1.createHash)("sha256").update(text).digest("hex").slice(0, 63);
const debugPlan = (0, debug_1.default)("@dataplan/pg:PgSelectStep:plan");
// const debugExecute = debugFactory("@dataplan/pg:PgSelectStep:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");
const EMPTY_ARRAY = Object.freeze([]);
const NO_ROWS = Object.freeze({
    hasMore: false,
    items: [],
    cursorDetails: undefined,
    groupDetails: undefined,
    m: Object.create(null),
});
function assertSensible(step) {
    if (step instanceof PgSelectStep) {
        throw new Error("You passed a PgSelectStep as an identifier, perhaps you forgot to add `.record()`?");
    }
    if (step instanceof pgSelectSingle_js_1.PgSelectSingleStep) {
        throw new Error("You passed a PgSelectSingleStep as an identifier, perhaps you forgot to add `.record()`?");
    }
}
/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <attributes>, <cursor?> FROM <table>`. You can also add
 * `JOIN`, `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`. You cannot add `GROUP BY`
 * because that would invalidate the identifiers; and as such you can't use
 * `HAVING` or functions that implicitly turn the query into an aggregate. We
 * don't allow `UNION`/`INTERSECT`/`EXCEPT`/`FOR UPDATE`/etc at this time,
 * purely because it hasn't been sufficiently considered.
 */
class PgSelectStep extends pgStmt_js_1.PgStmtBaseStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgSelectStep",
    }; }
    static clone(cloneFrom, mode = cloneFrom.mode) {
        const cloneFromMatchingMode = cloneFrom?.mode === mode ? cloneFrom : null;
        const $clone = new PgSelectStep({
            identifiers: [], //We'll overwrite teh result of this in a moment
            args: undefined, // We'll overwrite the result of this in a moment
            context: cloneFrom.getDep(cloneFrom.contextId),
            resource: cloneFrom.resource,
            from: cloneFrom.from,
            ...(cloneFrom.hasImplicitOrder === false
                ? { hasImplicitOrder: cloneFrom.hasImplicitOrder }
                : {}),
            name: cloneFrom.name,
            mode,
            joinAsLateral: cloneFrom.joinAsLateral,
            forceIdentity: cloneFrom.forceIdentity,
            _internalCloneSymbol: cloneFrom.symbol,
            _internalCloneAlias: cloneFrom.alias,
        });
        if ($clone.dependencies.length !== 1) {
            throw new Error("Should not have any dependencies other than context yet");
        }
        cloneFrom.dependencies.forEach((planId, idx) => {
            if (idx === 0)
                return;
            const myIdx = $clone.addDependency({
                ...cloneFrom.getDepOptions(idx),
                skipDeduplication: true,
            });
            if (myIdx !== idx) {
                throw new Error(`Failed to clone ${cloneFrom}; dependency indexes did not match: ${myIdx} !== ${idx}`);
            }
        });
        $clone.applyDepIds = [...cloneFrom.applyDepIds];
        $clone.isTrusted = cloneFrom.isTrusted;
        // TODO: should `isUnique` only be set if mode matches?
        $clone.isUnique = cloneFrom.isUnique;
        $clone.isInliningForbidden = cloneFrom.isInliningForbidden;
        for (const [k, v] of cloneFrom._symbolSubstitutes) {
            $clone._symbolSubstitutes.set(k, v);
        }
        for (const v of cloneFrom.placeholders) {
            $clone.placeholders.push(v);
        }
        for (const v of cloneFrom.deferreds) {
            $clone.deferreds.push(v);
        }
        for (const [k, v] of cloneFrom.fixedPlaceholderValues) {
            $clone.fixedPlaceholderValues.set(k, v);
        }
        for (const [k, v] of cloneFrom.relationJoins) {
            $clone.relationJoins.set(k, v);
        }
        for (const v of cloneFrom.joins) {
            $clone.joins.push(v);
        }
        for (const v of cloneFrom.conditions) {
            $clone.conditions.push(v);
        }
        if (cloneFromMatchingMode) {
            for (const v of cloneFromMatchingMode.selects) {
                $clone.selects.push(v);
            }
            for (const v of cloneFromMatchingMode.groups) {
                $clone.groups.push(v);
            }
            for (const v of cloneFromMatchingMode.havingConditions) {
                $clone.havingConditions.push(v);
            }
            for (const v of cloneFromMatchingMode.orders) {
                $clone.orders.push(v);
            }
            $clone.isOrderUnique = cloneFromMatchingMode.isOrderUnique;
            $clone.firstStepId = cloneFromMatchingMode.firstStepId;
            $clone.lastStepId = cloneFromMatchingMode.lastStepId;
            $clone.fetchOneExtra = cloneFromMatchingMode.fetchOneExtra;
            $clone.offsetStepId = cloneFromMatchingMode.offsetStepId;
            // dependencies were already added, so we can just copy the dependency references
            $clone.beforeStepId = cloneFromMatchingMode.beforeStepId;
            $clone.afterStepId = cloneFromMatchingMode.afterStepId;
            $clone.lowerIndexStepId = cloneFromMatchingMode.lowerIndexStepId;
            $clone.upperIndexStepId = cloneFromMatchingMode.upperIndexStepId;
        }
        return $clone;
    }
    constructor(options) {
        super();
        this.isSyncAndSafe = false;
        /**
         * When SELECTs get merged, symbols also need to be merged. The keys in this
         * map are the symbols of PgSelects that don't exist any more, the values are
         * symbols of the PgSelects that they were replaced with (which might also not
         * exist in future, but we follow the chain so it's fine).
         */
        this._symbolSubstitutes = new Map();
        // JOIN
        this.relationJoins = new Map();
        this.joins = [];
        // WHERE
        this.conditions = [];
        // GROUP BY
        this.groups = [];
        // HAVING
        this.havingConditions = [];
        // ORDER BY
        this.orders = [];
        this.isOrderUnique = false;
        // LIMIT
        this.firstStepId = null;
        this.lastStepId = null;
        this.fetchOneExtra = false;
        /** When using natural pagination, this index is the lower bound (and should be excluded) */
        this.lowerIndexStepId = null;
        /** When using natural pagination, this index is the upper bound (and should be excluded) */
        this.upperIndexStepId = null;
        // OFFSET
        this.offsetStepId = null;
        // CURSORS
        this.beforeStepId = null;
        this.afterStepId = null;
        // Connection
        this.connectionDepId = null;
        this.applyDepIds = [];
        this.placeholders = [];
        this.deferreds = [];
        this.fixedPlaceholderValues = new Map();
        /**
         * If true, we don't need to add any of the security checks from the
         * resource; otherwise we must do so. Default false.
         */
        this.isTrusted = false;
        /**
         * If true, we know at most one result can be matched for each identifier, so
         * it's safe to do a `LEFT JOIN` without risk of returning duplicates. Default false.
         */
        this.isUnique = false;
        /**
         * If true, we will not attempt to inline this into the parent query.
         * Default false.
         */
        this.isInliningForbidden = false;
        /**
         * The list of things we're selecting.
         */
        this.selects = [];
        this.locker = new pgLocker_js_1.PgLocker(this);
        this._meta = Object.create(null);
        this.nullCheckIndex = undefined;
        this.needsGroups = false;
        const { resource, parameters = resource.parameters, identifiers, args: inArgs, from: inFrom = null, hasImplicitOrder: inHasImplicitOrder, name, mode, joinAsLateral: inJoinAsLateral = false, forceIdentity: inForceIdentity = false, context: inContext, 
        // Clone only details
        _internalCloneSymbol, _internalCloneAlias, } = options;
        this.mode = mode ?? "normal";
        this.hasSideEffects = this.mode === "mutation";
        this.resource = resource;
        // Since we're applying this to the original it doesn't make sense to
        // also apply it to the clones.
        if (_internalCloneSymbol === undefined) {
            if (this.mode === "aggregate") {
                this.locker.beforeLock("orderBy", () => this.locker.lockParameter("groupBy"));
            }
        }
        this.contextId = this.addDependency(inContext ?? resource.executor.context());
        this.name = name ?? resource.name;
        this.symbol = _internalCloneSymbol ?? Symbol(this.name);
        this.alias = _internalCloneAlias ?? pg_sql2_1.default.identifier(this.symbol);
        this.hasImplicitOrder = inHasImplicitOrder ?? resource.hasImplicitOrder;
        this.joinAsLateral = inJoinAsLateral ?? !!this.resource.parameters;
        this.forceIdentity = inForceIdentity;
        {
            if (!identifiers) {
                throw new Error("Invalid construction of PgSelectStep");
            }
            identifiers.forEach((identifier) => {
                if (grafast_1.isDev) {
                    assertSensible(identifier.step);
                }
                const { step, matches } = identifier;
                const codec = identifier.codec || identifier.step.pgCodec;
                const expression = matches(this.alias);
                const placeholder = this.placeholder(step, codec);
                this.where((0, pg_sql2_1.default) `${expression} = ${placeholder}`);
            });
            const ourFrom = inFrom ?? resource.from;
            this.from = pgFromExpression(this, ourFrom, parameters, inArgs);
        }
        this.peerKey = this.resource.name;
        debugPlanVerbose(`%s (%s) constructor (%s)`, this, this.name, this.mode);
        return this;
    }
    toStringMeta() {
        return (this.name +
            (this.fetchOneExtra ? "+1" : "") +
            (this.mode === "normal" ? "" : `(${this.mode})`));
    }
    lock() {
        this.locker.lock();
    }
    setInliningForbidden(newInliningForbidden = true) {
        this.isInliningForbidden = newInliningForbidden;
        return this;
    }
    inliningForbidden() {
        return this.isInliningForbidden;
    }
    setTrusted(newIsTrusted = true) {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot toggle trusted once plan is locked`);
        }
        this.isTrusted = newIsTrusted;
        return this;
    }
    trusted() {
        return this.isTrusted;
    }
    /**
     * Set this true ONLY if there can be at most one match for each of the
     * identifiers. If you set this true when this is not the case then you may
     * get unexpected results during inlining; if in doubt leave it at the
     * default.
     */
    setUnique(newUnique = true) {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot toggle unique once plan is locked`);
        }
        this.isUnique = newUnique;
        return this;
    }
    unique() {
        return this.isUnique;
    }
    /**
     * Join to a named relationship and return the alias that can be used in
     * SELECT, WHERE and ORDER BY.
     */
    singleRelation(relationIdentifier) {
        const relation = this.resource.getRelation(relationIdentifier);
        if (!relation) {
            throw new Error(`${this.resource} does not have a relation named '${String(relationIdentifier)}'`);
        }
        if (!relation.isUnique) {
            throw new Error(`${this.resource} relation '${String(relationIdentifier)}' is not unique so cannot be used with singleRelation`);
        }
        const { remoteResource, localAttributes, remoteAttributes } = relation;
        // Join to this relation if we haven't already
        const cachedAlias = this.relationJoins.get(relationIdentifier);
        if (cachedAlias) {
            return cachedAlias;
        }
        const alias = pg_sql2_1.default.identifier(Symbol(relationIdentifier));
        if (typeof remoteResource.from === "function") {
            throw new Error("Callback sources not currently supported via singleRelation");
        }
        this.joins.push({
            type: "left",
            from: remoteResource.from,
            alias,
            conditions: localAttributes.map((col, i) => (0, pg_sql2_1.default) `${this.alias}.${pg_sql2_1.default.identifier(col)} = ${alias}.${pg_sql2_1.default.identifier(remoteAttributes[i])}`),
        });
        this.relationJoins.set(relationIdentifier, alias);
        return alias;
    }
    /**
     * @experimental Please use `singleRelation` or `manyRelation` instead.
     */
    join(spec) {
        this.joins.push(this.scopedSQL(spec));
    }
    getMeta(key) {
        return (0, grafast_1.access)(this, ["m", key]);
    }
    /**
     * Select an SQL fragment, returning the index the result will have.
     *
     * @internal
     */
    selectAndReturnIndex(fragmentOrCb) {
        const fragment = this.scopedSQL(fragmentOrCb);
        if (!this.isArgumentsFinalized) {
            throw new Error("Select added before arguments were finalized");
        }
        // NOTE: it's okay to add selections after the plan is "locked" - lock only
        // applies to which rows are being selected, not what is being queried
        // about the rows.
        // Optimisation: if we're already selecting this fragment, return the existing one.
        const options = {
            symbolSubstitutes: this._symbolSubstitutes,
        };
        // PERF: performance of this sucks at planning time
        const index = this.selects.findIndex((frag) => pg_sql2_1.default.isEquivalent(frag, fragment, options));
        if (index >= 0) {
            return index;
        }
        return this.selects.push(fragment) - 1;
    }
    /** @internal */
    getNullCheckIndex() {
        // PERF: if this isn't coming from a function _and_ it's not being inlined
        // via a left-join or similar then we shouldn't need this and should be
        // able to drop it.
        if (this.nullCheckIndex !== undefined) {
            return this.nullCheckIndex;
        }
        const nullCheckExpression = this.resource.getNullCheckExpression(this.alias);
        if (nullCheckExpression) {
            this.nullCheckIndex = this.selectAndReturnIndex(nullCheckExpression);
        }
        else {
            this.nullCheckIndex = null;
        }
        return this.nullCheckIndex;
    }
    /**
     * Finalizes this instance and returns a mutable clone; useful for
     * connections/etc (e.g. copying `where` conditions but adding more, or
     * pagination, or grouping, aggregates, etc)
     */
    clone(mode) {
        // Prevent any changes to our original to help avoid programming
        // errors.
        this.lock();
        return PgSelectStep.clone(this, mode);
    }
    connectionClone($connection, mode) {
        const $plan = this.clone(mode);
        // In case any errors are raised
        $plan.connectionDepId = $plan.addDependency($connection);
        return $plan;
    }
    where(rawCondition) {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot add conditions once plan is locked ('where')`);
        }
        const condition = this.scopedSQL(rawCondition);
        if (pg_sql2_1.default.isSQL(condition)) {
            this.conditions.push(condition);
        }
        else {
            switch (condition.type) {
                case "attribute": {
                    this.conditions.push(this.scopedSQL((sql) => condition.callback(sql `${this.alias}.${sql.identifier(condition.attribute)}`)));
                    break;
                }
                default: {
                    const never = condition.type;
                    console.error("Unsupported condition: ", never);
                    throw new Error(`Unsupported condition`);
                }
            }
        }
    }
    groupBy(group) {
        this.locker.assertParameterUnlocked("groupBy");
        if (this.mode !== "aggregate") {
            throw new grafast_1.SafeError(`Cannot add groupBy to a non-aggregate query`);
        }
        this.groups.push(this.scopedSQL(group));
    }
    having(rawCondition) {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot add having conditions once plan is locked ('having')`);
        }
        if (this.mode !== "aggregate") {
            throw new grafast_1.SafeError(`Cannot add having to a non-aggregate query`);
        }
        const condition = this.scopedSQL(rawCondition);
        if (pg_sql2_1.default.isSQL(condition)) {
            this.havingConditions.push(condition);
        }
        else {
            const never = condition;
            console.error("Unsupported condition: ", never);
            throw new Error(`Unsupported condition`);
        }
    }
    orderBy(order) {
        this.locker.assertParameterUnlocked("orderBy");
        this.orders.push(this.scopedSQL(order));
    }
    setOrderIsUnique() {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot set order unique once plan is locked`);
        }
        this.isOrderUnique = true;
    }
    apply($step) {
        if ($step instanceof grafast_1.ConstantStep) {
            $step.data(this);
        }
        else {
            this.applyDepIds.push(this.addUnaryDependency($step));
        }
    }
    assertCursorPaginationAllowed() {
        if (this.mode === "aggregate") {
            throw new grafast_1.SafeError("Cannot use cursor pagination on an aggregate PgSelectStep");
        }
    }
    items() {
        return this.operationPlan.cacheStep(this, "items", "" /* Digest of our arguments */, () => new PgSelectRowsStep(this));
    }
    pageInfo($connectionPlan) {
        this.assertCursorPaginationAllowed();
        this.lock();
        return (0, pgPageInfo_js_1.pgPageInfo)($connectionPlan);
    }
    getCursorDetails() {
        this.needsCursor = true;
        return (0, grafast_1.access)(this, "cursorDetails");
    }
    getGroupDetails() {
        this.needsGroups = true;
        return (0, grafast_1.access)(this, "groupDetails");
    }
    /**
     * `execute` will always run as a root-level query. In future we'll implement a
     * `toSQL` method that allows embedding this plan within another SQL plan...
     * But that's a problem for later.
     *
     * This runs the query for every entry in the values, and then returns an
     * array of results where each entry in the results relates to the entry in
     * the incoming values.
     *
     * NOTE: we don't know what the values being fed in are, we must feed them to
     * the plans stored in this.identifiers to get actual values we can use.
     */
    async execute(executionDetails) {
        const { indexMap, count, values, extra: { eventEmitter }, stream, } = executionDetails;
        const { meta, text, rawSqlValues, textForDeclare, rawSqlValuesForDeclare, identifierIndex, name, streamInitialCount, queryValues, shouldReverseOrder, first, last, cursorDetails, groupDetails, } = buildTheQuery({
            executionDetails,
            // Stuff directly referencing dependency IDs
            firstStepId: this.firstStepId,
            lastStepId: this.lastStepId,
            offsetStepId: this.offsetStepId,
            afterStepId: this.afterStepId,
            beforeStepId: this.beforeStepId,
            applyDepIds: this.applyDepIds,
            // Stuff referencing dependency IDs in a nested fashion
            placeholders: this.placeholders,
            deferreds: this.deferreds,
            // Fixed stuff that is local to us (aka "StaticInfo")
            ...PgSelectStep.getStaticInfo(this),
        });
        if (first === 0 || last === 0) {
            return (0, grafast_1.arrayOfLength)(count, NO_ROWS);
        }
        const contextDep = values[this.contextId];
        if (stream == null) {
            const specs = indexMap((i) => {
                const context = contextDep.at(i);
                return {
                    // The context is how we'd handle different connections with different claims
                    context,
                    queryValues: identifierIndex != null
                        ? queryValues.map(({ dependencyIndex, codec }) => {
                            const val = values[dependencyIndex].at(i);
                            return val == null ? null : codec.toPg(val);
                        })
                        : EMPTY_ARRAY,
                };
            });
            const executeMethod = this.operationPlan.operation.operation === "query"
                ? "executeWithCache"
                : "executeWithoutCache";
            const executionResult = await this.resource[executeMethod](specs, {
                text,
                rawSqlValues,
                identifierIndex,
                name,
                eventEmitter,
                useTransaction: this.mode === "mutation",
            });
            // debugExecute("%s; result: %c", this, executionResult);
            return executionResult.values.map((allVals) => {
                if ((0, grafast_1.isPromiseLike)(allVals)) {
                    // Must be an error
                    return allVals;
                }
                return createSelectResult(allVals, {
                    first,
                    last,
                    fetchOneExtra: this.fetchOneExtra,
                    shouldReverseOrder,
                    meta,
                    cursorDetails,
                    groupDetails,
                });
            });
        }
        else {
            if (shouldReverseOrder !== false) {
                throw new Error("shouldReverseOrder must be false for stream");
            }
            if (!rawSqlValuesForDeclare || !textForDeclare) {
                throw new Error("declare query must exist for stream");
            }
            let specs = null;
            if (text) {
                specs = indexMap((i) => {
                    const context = contextDep.at(i);
                    return {
                        // The context is how we'd handle different connections with different claims
                        context,
                        queryValues: identifierIndex != null
                            ? queryValues.map(({ dependencyIndex, codec }) => {
                                const val = values[dependencyIndex].at(i);
                                return val == null ? null : codec.toPg(val);
                            })
                            : EMPTY_ARRAY,
                    };
                });
            }
            const initialFetchResult = specs
                ? (await this.resource.executeWithoutCache(specs, {
                    text,
                    rawSqlValues,
                    identifierIndex,
                    eventEmitter,
                })).values
                : null;
            const streamSpecs = indexMap((i) => {
                const context = contextDep.at(i);
                return {
                    // The context is how we'd handle different connections with different claims
                    context,
                    queryValues: identifierIndex != null
                        ? queryValues.map(({ dependencyIndex, codec }) => {
                            const val = values[dependencyIndex].at(i);
                            return val == null ? val : codec.toPg(val);
                        })
                        : EMPTY_ARRAY,
                };
            });
            const streams = (await this.resource.executeStream(streamSpecs, {
                text: textForDeclare,
                rawSqlValues: rawSqlValuesForDeclare,
                identifierIndex,
                eventEmitter,
            })).streams;
            return streams.map((iterable, idx) => {
                if (!(0, grafast_1.isAsyncIterable)(iterable)) {
                    // Must be an error
                    return iterable;
                }
                if (!initialFetchResult) {
                    return {
                        hasMore: false,
                        items: iterable,
                        cursorDetails,
                        groupDetails,
                        m: meta,
                    };
                }
                // Munge the initialCount records into the streams
                const innerIterator = iterable[Symbol.asyncIterator]();
                let i = 0;
                let done = false;
                const l = initialFetchResult[idx].length;
                const mergedGenerator = {
                    async [Symbol.asyncDispose]() {
                        await this.return(undefined);
                    },
                    next() {
                        if (done) {
                            return Promise.resolve({ value: undefined, done });
                        }
                        else if (i < l) {
                            return Promise.resolve({
                                value: initialFetchResult[idx][i++],
                                done,
                            });
                        }
                        else if (streamInitialCount != null && l < streamInitialCount) {
                            done = true;
                            innerIterator.return?.();
                            return Promise.resolve({ value: undefined, done });
                        }
                        else {
                            return innerIterator.next();
                        }
                    },
                    return(value) {
                        done = true;
                        return (innerIterator.return?.(value) ??
                            Promise.resolve({ value: undefined, done }));
                    },
                    throw(e) {
                        done = true;
                        return (innerIterator.throw?.(e) ??
                            Promise.resolve({ value: undefined, done }));
                    },
                    [Symbol.asyncIterator]() {
                        return this;
                    },
                };
                return {
                    hasMore: false,
                    items: mergedGenerator,
                    cursorDetails,
                    groupDetails,
                    m: meta,
                };
            });
        }
    }
    finalize() {
        // In case we have any lock actions in future:
        this.lock();
        // Now we need to be able to mess with ourself, but be sure to lock again
        // at the end.
        this.locker.locked = false;
        this.locker.locked = true;
        super.finalize();
    }
    deduplicate(peers) {
        if (!this.isTrusted) {
            this.resource.applyAuthorizationChecksToPlan(this);
            this.isTrusted = true;
        }
        this.locker.lockAllParameters();
        return peers.filter(($p) => {
            if ($p === this) {
                return true;
            }
            const p = $p;
            // If SELECT, FROM, JOIN, WHERE, ORDER, GROUP BY, HAVING, LIMIT, OFFSET
            // all match with one of our peers then we can replace ourself with one
            // of our peers. NOTE: we do _not_ merge SELECTs at this stage because
            // that would require mapping, and mapping should not be done during
            // deduplicate because it would interfere with optimize. So, instead,
            // we try to ensure that as few selects as possible exist in the plan
            // at this stage.
            // Check FROM matches
            if (p.resource !== this.resource) {
                return false;
            }
            // Check mode matches
            if (p.mode !== this.mode) {
                return false;
            }
            // Since deduplicate runs before we have children, we do not need to
            // check the symbol or alias matches. We do need to factor the different
            // symbols into SQL equivalency checks though.
            const symbolSubstitutes = new Map();
            const options = { symbolSubstitutes };
            if (typeof this.symbol === "symbol" && typeof p.symbol === "symbol") {
                if (this.symbol !== p.symbol) {
                    symbolSubstitutes.set(this.symbol, p.symbol);
                }
                else {
                    // Fine :)
                }
            }
            else if (this.symbol !== p.symbol) {
                return false;
            }
            // Check PLACEHOLDERS match
            if (!(0, pg_sql2_1.arraysMatch)(this.placeholders, p.placeholders, (a, b) => {
                const equivalent = a.codec === b.codec && a.dependencyIndex === b.dependencyIndex;
                if (equivalent) {
                    if (a.symbol !== b.symbol) {
                        // Make symbols appear equivalent
                        symbolSubstitutes.set(a.symbol, b.symbol);
                    }
                }
                return equivalent;
            })) {
                debugPlanVerbose("Refusing to deduplicate %c with %c because the placeholders don't match", this, p);
                return false;
            }
            // Check DEFERREDs match
            if (!(0, pg_sql2_1.arraysMatch)(this.deferreds, p.deferreds, (a, b) => {
                const equivalent = a.dependencyIndex === b.dependencyIndex;
                if (equivalent) {
                    if (a.symbol !== b.symbol) {
                        // Make symbols appear equivalent
                        symbolSubstitutes.set(a.symbol, b.symbol);
                    }
                }
                return equivalent;
            })) {
                debugPlanVerbose("Refusing to deduplicate %c with %c because the deferreds don't match", this, p);
                return false;
            }
            const sqlIsEquivalent = (a, b) => pg_sql2_1.default.isEquivalent(a, b, options);
            // Check trusted matches
            if (p.trusted !== this.trusted) {
                return false;
            }
            // Check inliningForbidden matches
            if (p.inliningForbidden !== this.inliningForbidden) {
                return false;
            }
            // Check FROM
            if (!sqlIsEquivalent(p.from, this.from)) {
                return false;
            }
            // Check SELECT matches
            if (!(0, pg_sql2_1.arraysMatch)(this.selects, p.selects, sqlIsEquivalent)) {
                return false;
            }
            // Check GROUPs match
            if (!(0, pg_sql2_1.arraysMatch)(this.groups, p.groups, (a, b) => sqlIsEquivalent(a.fragment, b.fragment))) {
                return false;
            }
            // Check HAVINGs match
            if (!(0, pg_sql2_1.arraysMatch)(this.havingConditions, p.havingConditions, sqlIsEquivalent)) {
                return false;
            }
            // Check ORDERs match
            if (!(0, pg_sql2_1.arraysMatch)(this.orders, p.orders, (a, b) => {
                if (a.direction !== b.direction)
                    return false;
                if (a.nulls !== b.nulls)
                    return false;
                if (a.attribute != null) {
                    if (b.attribute !== a.attribute)
                        return false;
                    // ENHANCEMENT: really should compare if the result is equivalent?
                    return a.callback === b.callback;
                }
                else {
                    if (b.attribute != null)
                        return false;
                    return sqlIsEquivalent(a.fragment, b.fragment);
                }
            })) {
                return false;
            }
            const depsMatch = (myDepId, theirDepId) => this.maybeGetDep(myDepId) === p.maybeGetDep(theirDepId);
            // Check LIMIT, OFFSET and CURSOR matches
            if (!depsMatch(this.firstStepId, p.firstStepId) ||
                !depsMatch(this.lastStepId, p.lastStepId) ||
                !depsMatch(this.offsetStepId, p.offsetStepId) ||
                !depsMatch(this.lowerIndexStepId, p.lowerIndexStepId) ||
                !depsMatch(this.upperIndexStepId, p.upperIndexStepId)) {
                return false;
            }
            // Check JOINs match
            if (!(0, pg_sql2_1.arraysMatch)(this.joins, p.joins, (a, b) => joinMatches(a, b, sqlIsEquivalent))) {
                debugPlanVerbose("Refusing to deduplicate %c with %c because the joins don't match", this, p);
                return false;
            }
            // Check WHEREs match
            if (!(0, pg_sql2_1.arraysMatch)(this.conditions, p.conditions, sqlIsEquivalent)) {
                debugPlanVerbose("Refusing to deduplicate %c with %c because the conditions don't match", this, p);
                return false;
            }
            debugPlanVerbose("Found that %c and %c are equivalent!", this, p);
            return true;
        });
    }
    /** @internal */
    deduplicatedWith(replacement) {
        if (typeof this.symbol === "symbol" &&
            typeof replacement.symbol === "symbol") {
            if (this.symbol !== replacement.symbol) {
                replacement._symbolSubstitutes.set(this.symbol, replacement.symbol);
            }
            else {
                // Fine :)
            }
        }
        if (this.fetchOneExtra) {
            replacement.fetchOneExtra = true;
        }
        if (this.needsCursor) {
            replacement.needsCursor = true;
        }
    }
    getParentForInlining() {
        /**
         * These are the dependencies that are not PgClassExpressionSteps, we just
         * need them to be at a higher level than $pgSelect
         */
        const otherDeps = [];
        /**
         * This is the PgSelectStep that we would like to try and inline ourself
         * into. If `undefined`, this hasn't been found yet. If `null`, this has
         * been explicitly forbidden due to a mismatch of some kind.
         */
        let $pgSelect = undefined;
        /**
         * This is the pgSelectSingle representing a single record from $pgSelect,
         * it's used when remapping of keys is required after inlining ourself into
         * $pgSelect.
         */
        let $pgSelectSingle = undefined;
        // Scan through the dependencies to find a suitable ancestor step to merge with
        for (let dependencyIndex = 0, l = this.dependencies.length; dependencyIndex < l; dependencyIndex++) {
            if (dependencyIndex === this.contextId) {
                // We check myContext vs tsContext below; so lets assume it's fine
                // for now.
                continue;
            }
            let $dep = this.getDep(dependencyIndex);
            if ($dep instanceof PgFromExpressionStep) {
                const digest0 = $dep.getDigest(0);
                if (digest0?.step && digest0.step instanceof pgClassExpression_js_1.PgClassExpressionStep) {
                    $dep = digest0.step;
                }
            }
            if ($dep instanceof pgClassExpression_js_1.PgClassExpressionStep) {
                const $depPgSelectSingle = $dep.getParentStep();
                if (!($depPgSelectSingle instanceof pgSelectSingle_js_1.PgSelectSingleStep)) {
                    continue;
                }
                const $depPgSelect = $depPgSelectSingle.getClassStep();
                if ($depPgSelect === this) {
                    throw new Error(`Recursion error - record plan ${$dep} is dependent on ${$depPgSelect}, and ${this} is dependent on ${$dep}`);
                }
                if ($depPgSelect.hasSideEffects) {
                    // It's a mutation; don't merge
                    continue;
                }
                // Don't allow merging across a stream/defer/subscription boundary
                if (!(0, grafast_1.stepsAreInSamePhase)($depPgSelect, this)) {
                    continue;
                }
                // Don't want to make this a join as it can result in the order being
                // messed up
                if ($depPgSelect.hasImplicitOrder &&
                    !this.joinAsLateral &&
                    this.isUnique) {
                    continue;
                }
                /*
                  if (!planGroupsOverlap(this, t2)) {
                    // We're not in the same group (i.e. there's probably a @defer or
                    // @stream between us) - do not merge.
                    continue;
                  }
                  */
                if ($pgSelect === undefined && $pgSelectSingle === undefined) {
                    $pgSelectSingle = $depPgSelectSingle;
                    $pgSelect = $depPgSelect;
                }
                else if ($depPgSelect !== $pgSelect) {
                    debugPlanVerbose("Refusing to optimise %c due to dependency %c depending on different class (%c != %c)", this, $dep, $depPgSelect, $pgSelect);
                    $pgSelect = null;
                    break;
                }
                else if ($depPgSelectSingle !== $pgSelectSingle) {
                    debugPlanVerbose("Refusing to optimise %c due to parent dependency mismatch: %c != %c", this, $depPgSelectSingle, $pgSelectSingle);
                    $pgSelect = null;
                    break;
                }
            }
            else {
                otherDeps.push($dep);
            }
        }
        // Check the contexts are the same
        if ($pgSelect != null && $pgSelectSingle != null) {
            const myContext = this.getDep(this.contextId);
            const tsContext = $pgSelect.getDep($pgSelect.contextId);
            if (myContext !== tsContext) {
                debugPlanVerbose("Refusing to optimise %c due to own context dependency %c differing from tables context dependency %c (%c, %c)", this, myContext, tsContext, $pgSelect.dependencies[$pgSelect.contextId], $pgSelect);
                $pgSelect = null;
            }
        }
        // Check the dependencies can be moved across to `t`
        if ($pgSelect != null && $pgSelectSingle != null) {
            for (const dep of otherDeps) {
                if ($pgSelect.canAddDependency(dep)) {
                    // All good; just move the dependency over
                }
                else {
                    debugPlanVerbose("Refusing to optimise %c due to dependency %c which cannot be added as a dependency of %c", this, dep, $pgSelect);
                    $pgSelect = null;
                    break;
                }
            }
        }
        if ($pgSelect != null && $pgSelectSingle != null) {
            // Looks feasible.
            if ($pgSelect.id === this.id) {
                throw new Error(`Something's gone catastrophically wrong - ${this} is trying to merge with itself!`);
            }
            return { $pgSelect, $pgSelectSingle };
        }
        else {
            return null;
        }
    }
    mergeSelectsWith(otherPlan) {
        const actualKeyByDesiredKey = Object.create(null);
        this.selects.forEach((frag, idx) => {
            actualKeyByDesiredKey[idx] = otherPlan.selectAndReturnIndex(frag);
        });
        return actualKeyByDesiredKey;
    }
    /**
     * - Merge placeholders
     * - Merge fixedPlaceholders
     * - Merge deferreds
     * - Merge _symbolSubstitutes
     */
    mergePlaceholdersInto($target) {
        for (const placeholder of this.placeholders) {
            const { dependencyIndex, symbol, codec, alreadyEncoded } = placeholder;
            const dep = this.getDep(dependencyIndex);
            /*
             * We have dependency `dep`. We're attempting to merge ourself into
             * `otherPlan`. We have two situations we need to handle:
             *
             * 1. `dep` is not dependent on `otherPlan`, in which case we can add
             *    `dep` as a dependency to `otherPlan` without creating a cycle, or
             * 2. `dep` is dependent on `otherPlan` (for example, it might be the
             *    result of selecting an expression in the `otherPlan`), in which
             *    case we should turn it into an SQL expression and inline that.
             */
            // PERF: we know dep can't depend on otherPlan if
            // `isStaticInputStep(dep)` or `dep`'s layerPlan is an ancestor of
            // `otherPlan`'s layerPlan.
            if ((0, grafast_1.stepAMayDependOnStepB)($target, dep)) {
                // Either dep is a static input plan (which isn't dependent on anything
                // else) or otherPlan is deeper than dep; either way we can use the dep
                // directly within otherPlan.
                const newPlanIndex = $target.addDependency(dep);
                $target.placeholders.push({
                    dependencyIndex: newPlanIndex,
                    codec,
                    symbol,
                    alreadyEncoded,
                });
            }
            else if (dep instanceof pgClassExpression_js_1.PgClassExpressionStep) {
                // Replace with a reference.
                $target.fixedPlaceholderValues.set(placeholder.symbol, dep.toSQL());
            }
            else {
                throw new Error(`Could not merge placeholder from unsupported plan type: ${dep}`);
            }
        }
        for (const [sqlPlaceholder, placeholderValue,] of this.fixedPlaceholderValues.entries()) {
            if ($target.fixedPlaceholderValues.has(sqlPlaceholder) &&
                $target.fixedPlaceholderValues.get(sqlPlaceholder) !== placeholderValue) {
                throw new Error(`${$target} already has an identical placeholder with a different value when trying to mergePlaceholdersInto it from ${this}`);
            }
            $target.fixedPlaceholderValues.set(sqlPlaceholder, placeholderValue);
        }
        for (const { symbol, dependencyIndex } of this.deferreds) {
            const dep = this.getDep(dependencyIndex);
            if ((0, grafast_1.stepAMayDependOnStepB)($target, dep)) {
                const newPlanIndex = $target.addDependency(dep);
                $target.deferreds.push({
                    dependencyIndex: newPlanIndex,
                    symbol,
                });
            }
            else if (dep instanceof PgFromExpressionStep) {
                const newDep = $target.withLayerPlan(() => dep.inlineInto($target));
                const newPlanIndex = $target.addDependency(newDep);
                $target.deferreds.push({
                    dependencyIndex: newPlanIndex,
                    symbol,
                });
            }
            else {
                throw new Error(`Could not merge placeholder from unsupported plan type: ${dep}`);
            }
        }
        for (const [a, b] of this._symbolSubstitutes.entries()) {
            if (grafast_1.isDev) {
                if ($target._symbolSubstitutes.has(a) &&
                    $target._symbolSubstitutes.get(a) !== b) {
                    throw new Error(`Conflict when setting a substitute whilst merging ${this} into ${$target}; symbol already has a substitute, and it's different.`);
                }
            }
            $target._symbolSubstitutes.set(a, b);
        }
    }
    optimize({ stream }) {
        // In case we have any lock actions in future:
        this.lock();
        // Inline ourself into our parent if we can.
        let parentDetails;
        if (!this.isInliningForbidden &&
            !this.hasSideEffects &&
            !stream &&
            !this.joins.some((j) => j.type !== "left") &&
            (parentDetails = this.getParentForInlining()) !== null &&
            parentDetails.$pgSelect.mode === "normal") {
            const { $pgSelect, $pgSelectSingle } = parentDetails;
            if (this.mode === "normal" &&
                this.isUnique &&
                this.firstStepId == null &&
                this.lastStepId == null &&
                this.offsetStepId == null &&
                // For uniques these should all pass anyway, but pays to be cautious..
                this.groups.length === 0 &&
                this.havingConditions.length === 0 &&
                this.orders.length === 0 &&
                !this.fetchOneExtra) {
                // Allow, do it via left join
                debugPlanVerbose("Merging %c into %c (via %c)", this, $pgSelect, $pgSelectSingle);
                this.mergePlaceholdersInto($pgSelect);
                const identifier = `joinDetailsFor${this.id}`;
                $pgSelect.withLayerPlan(() => {
                    $pgSelect.apply(new PgSelectInlineApplyStep(identifier, false, {
                        staticInfo: PgSelectStep.getStaticInfo(this),
                        $first: this.maybeGetDep(this.firstStepId),
                        $last: this.maybeGetDep(this.lastStepId),
                        $offset: this.maybeGetDep(this.offsetStepId),
                        $after: this.maybeGetDep(this.afterStepId),
                        $before: this.maybeGetDep(this.beforeStepId),
                        applySteps: this.applyDepIds.map((depId) => this.getDep(depId)),
                    }));
                });
                const $details = $pgSelect.getMeta(identifier);
                return (0, grafast_1.lambda)([$details, $pgSelectSingle], pgInlineViaJoinTransform, true);
            }
            else {
                /*
                // TODO: this isn't really accurate plus it's expensive to calculate; fix it properly!
                // An approximation of "belongs to" is: we're referencing a unique combination of columns on the parent.
                const relationshipIsBelongsTo = $pgSelect.resource.uniques.some((u) =>
                  u.attributes.every((remoteColumn) => {
                    const remoteColumnExpression = sql`${
                      $pgSelect.alias
                    }.${sql.identifier(String(remoteColumn))}`;
                    return identifierMatchesExpressions.some((e) =>
                      sql.isEquivalent(e, remoteColumnExpression),
                    );
                  }),
                );
                */
                const relationshipIsBelongsTo = true;
                const allowed = ALWAYS_ALLOWED ||
                    $pgSelectSingle.getAndFreezeIsUnary() ||
                    (!$pgSelect.isUnique && relationshipIsBelongsTo);
                if (allowed) {
                    // Add a nested select expression
                    const $__item = $pgSelectSingle.getItemStep();
                    this.mergePlaceholdersInto($pgSelect);
                    const identifier = `subqueryDetailsFor${this.id}`;
                    $pgSelect.withLayerPlan(() => {
                        $pgSelect.apply(new PgSelectInlineApplyStep(identifier, true, {
                            staticInfo: PgSelectStep.getStaticInfo(this),
                            $first: this.maybeGetDep(this.firstStepId),
                            $last: this.maybeGetDep(this.lastStepId),
                            $offset: this.maybeGetDep(this.offsetStepId),
                            $after: this.maybeGetDep(this.afterStepId),
                            $before: this.maybeGetDep(this.beforeStepId),
                            applySteps: this.applyDepIds.map((depId) => this.getDep(depId)),
                        }));
                    });
                    const $details = $pgSelect.getMeta(identifier);
                    return (0, grafast_1.lambda)([$details, $__item], pgInlineViaSubqueryTransform, true);
                }
            }
        }
        // PERF: we should serialize our `SELECT` clauses and then if any are
        // identical we should omit the later copies and have them link back to the
        // earliest version (resolve this in `execute` via mapping).
        // TODO: have connection validate cursor
        /*
        if (this.connectionDepId === null) {
          const $validate = pgValidateParsedCursor(
            $parsedCursorPlan,
            digest,
            orderCount,
            beforeOrAfter,
          );
          this.addDependency($validate);
        } else {
          // To make the error be thrown in the right place, we should also add this error to our parent connection
          const $connection = this.getDep<ConnectionStep<any, any, any>>(
            this.connectionDepId,
          );
          $connection.addValidation(() => {
            return pgValidateParsedCursor(
              $parsedCursorPlan,
              digest,
              orderCount,
              beforeOrAfter,
            );
          });
        }
        */
        return this;
    }
    /**
     * Most likely you want `.single()` instead of this method.
     *
     * If this plan may only return one record, you can use `.singleAsRecord()`
     * to return a plan that resolves to that record (rather than a list of
     * records as it does currently).
     *
     * The main reason to use this instead of `.single()` is if you are
     * paginating over a scalar and you truly need a PgSelectSingleStep interface
     * e.g. so you can get the `count(*)` aggregate.
     *
     * Beware: if you call this and the database might actually return more than
     * one record then you're potentially in for a Bad Time.
     */
    singleAsRecord(options) {
        this.setUnique(true);
        return new pgSelectSingle_js_1.PgSelectSingleStep(this, (0, grafast_1.first)(this), options);
    }
    /**
     * If this plan may only return one record, you can use `.single()` to return
     * a plan that resolves to either that record (in the case of composite
     * types) or the underlying scalar (in the case of a resource whose codec has
     * no attributes).
     *
     * Beware: if you call this and the database might actually return more than
     * one record then you're potentially in for a Bad Time.
     */
    single(options) {
        const $single = this.singleAsRecord(options);
        const isScalar = !this.resource.codec.attributes;
        return (isScalar ? $single.getSelfNamed() : $single);
    }
    row($row, options) {
        return new pgSelectSingle_js_1.PgSelectSingleStep(this, $row, options);
    }
    /**
     * When you return a plan in a situation where GraphQL is expecting a
     * GraphQLList, it must implement the `.listItem()` method to return a plan
     * for an individual item within this list. Grafast will automatically call
     * this (possibly recursively) to pass to the plan resolvers on the children
     * of this field.
     *
     * NOTE: Grafast handles the list indexes for you, so your list item plan
     * should process just the single input list item.
     *
     * IMPORTANT: do not call `.listItem` from user code; it's only intended to
     * be called by Grafast.
     */
    listItem(itemPlan) {
        const $single = new pgSelectSingle_js_1.PgSelectSingleStep(this, itemPlan);
        const isScalar = !this.resource.codec.attributes;
        return (isScalar ? $single.getSelfNamed() : $single);
    }
    [pg_sql2_1.$$toSQL]() {
        return this.alias;
    }
    whereBuilder() {
        return new pgCondition_js_1.PgCondition(this);
    }
    havingBuilder() {
        return new pgCondition_js_1.PgCondition(this, true);
    }
    setMeta(key, value) {
        this._meta[key] = value;
    }
    getMetaRaw(key) {
        return this._meta[key];
    }
    static getStaticInfo($source) {
        return {
            forceIdentity: $source.forceIdentity,
            havingConditions: $source.havingConditions,
            mode: $source.mode,
            hasSideEffects: $source.hasSideEffects,
            name: $source.name,
            alias: $source.alias,
            symbol: $source.symbol,
            resource: $source.resource,
            groups: $source.groups,
            orders: $source.orders,
            selects: $source.selects,
            fetchOneExtra: $source.fetchOneExtra,
            isOrderUnique: $source.isOrderUnique,
            isUnique: $source.isUnique,
            conditions: $source.conditions,
            from: $source.from,
            joins: $source.joins,
            needsCursor: $source.needsCursor,
            needsGroups: $source.needsGroups,
            relationJoins: $source.relationJoins,
            meta: $source._meta,
            placeholderSymbols: $source.placeholders.map((p) => p.symbol),
            deferredSymbols: $source.deferreds.map((p) => p.symbol),
            fixedPlaceholderValues: $source.fixedPlaceholderValues,
            _symbolSubstitutes: $source._symbolSubstitutes,
            joinAsLateral: $source.joinAsLateral,
        };
    }
}
exports.PgSelectStep = PgSelectStep;
class PgSelectRowsStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgSelectRowsStep",
    }; }
    constructor($pgSelect) {
        super();
        this.isSyncAndSafe = false;
        this.addDependency($pgSelect);
    }
    getClassStep() {
        return this.getDepOptions(0).step;
    }
    listItem(itemPlan) {
        return this.getClassStep().listItem(itemPlan);
    }
    deduplicate(_peers) {
        // We don't have any properties, and dependencies is already checked, so we're the same as our kin.
        return _peers;
    }
    // optimize() {
    //   const $access = access(this.getClassStep(), "items");
    //   $access.isSyncAndSafe = false;
    //   return $access;
    // }
    execute(executionDetails) {
        const pgSelect = executionDetails.values[0];
        return executionDetails.indexMap((i) => pgSelect.at(i).items);
    }
}
exports.PgSelectRowsStep = PgSelectRowsStep;
function joinMatches(j1, j2, sqlIsEquivalent) {
    if (j1.type === "cross") {
        if (j2.type !== j1.type) {
            return false;
        }
        if (!sqlIsEquivalent(j1.from, j2.from)) {
            return false;
        }
        if (!sqlIsEquivalent(j1.alias, j2.alias)) {
            return false;
        }
        return true;
    }
    else {
        if (j2.type !== j1.type) {
            return false;
        }
        if (!sqlIsEquivalent(j1.from, j2.from)) {
            return false;
        }
        if (!sqlIsEquivalent(j1.alias, j2.alias)) {
            return false;
        }
        if (!(0, pg_sql2_1.arraysMatch)(j1.conditions, j2.conditions, sqlIsEquivalent)) {
            return false;
        }
        return true;
    }
}
/**
 * Apply a default order in case our default is not unique.
 */
function makeOrderUniqueIfPossible(info) {
    // Never re-order aggregates
    if (info.mode === "aggregate")
        return;
    // If we're already uniquely ordered, no need to order
    if (info.isOrderUnique)
        return;
    // No need to order a unique record
    if (info.isUnique)
        return;
    const { alias, resource: { uniques, codec: { attributes }, }, } = info;
    const unique = uniques[0];
    // Nothing unique to order by
    if (unique == null)
        return;
    for (const c of unique.attributes) {
        info.orders.push({
            fragment: (0, pg_sql2_1.default) `${alias}.${pg_sql2_1.default.identifier(c)}`,
            codec: attributes[c].codec,
            direction: "ASC",
        });
    }
    info.isOrderUnique = true;
}
function pgSelect(options) {
    return new PgSelectStep(options);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgSelect, "pgSelect");
/**
 * Turns a list of records (e.g. from PgSelectSingleStep.record()) back into a PgSelect.
 */
function pgSelectFromRecords(resource, records) {
    return new PgSelectStep({
        resource,
        identifiers: [],
        from: (records) => (0, pg_sql2_1.default) `unnest(${records.placeholder})`,
        args: [{ step: records, pgCodec: (0, codecs_js_1.listOfCodec)(resource.codec) }],
    });
}
(0, grafast_1.exportAs)("@dataplan/pg", pgSelectFromRecords, "pgSelectFromRecords");
function sqlFromArgDigests(digests) {
    const args = digests.map((digest) => {
        if (digest.name) {
            return (0, pg_sql2_1.default) `${pg_sql2_1.default.identifier(digest.name)} := ${digest.placeholder}`;
        }
        else {
            return digest.placeholder;
        }
    });
    return digests.length > 1
        ? pg_sql2_1.default.indent(pg_sql2_1.default.join(args, ",\n"))
        : pg_sql2_1.default.join(args, ", ");
}
(0, grafast_1.exportAs)("@dataplan/pg", sqlFromArgDigests, "sqlFromArgDigests");
// Previously: digestsFromArgumentSpecs; now combined
function pgFromExpression($target, baseFrom, inParameters = undefined, specs = []) {
    if (typeof baseFrom !== "function") {
        return baseFrom;
    }
    if (specs.length === 0) {
        return baseFrom();
    }
    if (specs.every((spec) => "placeholder" in spec && spec.placeholder != null)) {
        return baseFrom(...specs);
    }
    const $placeholderable = $target.getPgRoot();
    let parameters;
    if (!inParameters) {
        const params = [];
        for (const spec of specs) {
            if (spec.step) {
                if (spec.pgCodec) {
                    params.push({
                        name: spec.name ?? null,
                        codec: spec.pgCodec,
                        required: false,
                    });
                }
                else {
                    params.push({
                        name: spec.name ?? null,
                        codec: spec.step.pgCodec,
                        required: false,
                    });
                }
            }
            else {
                throw new Error(`Cannot use placeholder steps without passing accurate placeholders`);
            }
        }
        parameters = params;
    }
    else {
        parameters = inParameters;
    }
    if (specs.length > parameters.length) {
        throw new Error(`Attempted to build function-like from expression for ${$placeholderable}, but insufficient parameter definitions (${parameters.length}) were provided for the arguments passed (${specs.length}).`);
    }
    const digests = [];
    for (const spec of specs) {
        if (spec.step) {
            if (grafast_1.isDev) {
                assertSensible(spec.step);
            }
            const { step, name } = spec;
            const codec = "pgCodec" in spec ? spec.pgCodec : spec.step.pgCodec;
            if (step.getAndFreezeIsUnary()) {
                // It's a unary step; depend on it directly because it allows us to do
                // things like not passing parameters to PostgreSQL functions where
                // those parameters are optional. (Without this, we'd supply `null`
                // to these parameters, which would result in a different behavior.)
                digests.push({
                    name,
                    step,
                });
            }
            else {
                const placeholder = $placeholderable.placeholder(step, codec);
                digests.push({
                    name,
                    placeholder,
                });
            }
        }
        else {
            digests.push(spec);
        }
    }
    return $placeholderable.withLayerPlan(() => $placeholderable.deferredSQL(new PgFromExpressionStep(baseFrom, parameters, digests)));
}
/** @internal */
class PgFromExpressionStep extends grafast_1.UnbatchedStep {
    constructor(from, parameters, digests) {
        super();
        this.from = from;
        this.parameters = parameters;
        this.isSyncAndSafe = true;
        if (this.getAndFreezeIsUnary() !== true) {
            throw new Error(`PgFromExpressionStep must be unary`);
        }
        this.parameterAnalysis = generatePgParameterAnalysis(this.parameters);
        this.digests = digests.map((digest) => {
            if (digest.step) {
                const { step, ...rest } = digest;
                const depId = this.addDependency(digest.step);
                return { ...rest, depId };
            }
            else {
                return digest;
            }
        });
    }
    /** @internal */
    getDigest(index) {
        const digest = this.digests[index];
        if (!digest)
            return null;
        if (digest.depId != null) {
            const { depId, ...rest } = digest;
            return {
                ...rest,
                step: this.getDepOptions(depId).step,
            };
        }
        else {
            return digest;
        }
    }
    /** @internal */
    inlineInto($target) {
        return new PgFromExpressionStep(this.from, this.parameters, this.digests.map((d) => {
            if (d.depId != null) {
                const { depId, ...rest } = d;
                const step = this.getDep(depId);
                if (step instanceof pgClassExpression_js_1.PgClassExpressionStep) {
                    const $parent = step.getParentStep();
                    if ($parent instanceof pgSelectSingle_js_1.PgSelectSingleStep) {
                        const $pgSelect = $parent.getClassStep();
                        if ($pgSelect === $target) {
                            const { position, name } = rest;
                            return {
                                position,
                                name,
                                placeholder: step.expression,
                            };
                        }
                    }
                }
                return {
                    ...rest,
                    step,
                };
            }
            else {
                return d;
            }
        }));
    }
    deduplicate(peers) {
        return peers.filter((p) => {
            if (p.from !== this.from) {
                return false;
            }
            if (!(0, pg_sql2_1.arraysMatch)(p.parameters, this.parameters, (a, b) => a.name === b.name &&
                a.codec === b.codec &&
                a.notNull === b.notNull &&
                a.required === b.required &&
                a.extensions === b.extensions)) {
                return false;
            }
            if (!(0, pg_sql2_1.arraysMatch)(p.digests, this.digests, (a, b) => {
                return (a.name === b.name &&
                    a.position === b.position &&
                    a.depId === b.depId &&
                    a.placeholder === b.placeholder);
            })) {
                return false;
            }
            return true;
        });
    }
    unbatchedExecute(_extra, ...deps) {
        const digests = this.digests.map((d) => d.depId != null ? { ...d, value: deps[d.depId] } : d);
        return pgFromExpressionRuntime(this.from, this.parameters, digests, this.parameterAnalysis);
    }
}
const $$generationCheck = Symbol("Used parameterAnalysis()");
function generatePgParameterAnalysis(parameters) {
    const parameterByName = Object.create(null);
    let indexAfterWhichAllArgsAreNamed = 0;
    for (let i = 0, l = parameters.length; i < l; i++) {
        const param = parameters[i];
        if (param.name != null) {
            parameterByName[param.name] = param;
        }
        // Note that `name = ''` counts as having no name.
        if (!param.name) {
            indexAfterWhichAllArgsAreNamed = i + 1;
        }
    }
    return {
        /** DO NOT GENERATE THIS OBJECT YOURSELF! Use generateParameterAnalysis(parameters) */
        [$$generationCheck]: parameters,
        parameterByName,
        indexAfterWhichAllArgsAreNamed,
    };
}
function pgFromExpressionRuntime(from, parameters, digests, parameterAnalysis = generatePgParameterAnalysis(parameters)) {
    if (!parameterAnalysis[$$generationCheck]) {
        throw new Error(`You must not generate the parameter analysis yourself; use generateParameterAnalysis(parameters)`);
    }
    if (parameterAnalysis[$$generationCheck] !== parameters) {
        throw new Error(`This parameter analysis was produced for a different set of parameters; perhaps you sliced the array?`);
    }
    const { parameterByName, indexAfterWhichAllArgsAreNamed } = parameterAnalysis;
    /**
     * If true, we can only use named parameters now. Set this if we skip an
     * entry, or if the input has a name that doesn't match the parameter name.
     */
    let namedOnly = false;
    let argIndex = 0;
    const args = [];
    for (let digestIndex = 0, digestsCount = digests.length; digestIndex < digestsCount; digestIndex++) {
        const digest = digests[digestIndex];
        if (!namedOnly &&
            // Note that name can be the empty string, we treat that as "no name"
            digest.name &&
            parameters[digestIndex].name !== digest.name) {
            namedOnly = true;
        }
        if (namedOnly && !digest.name) {
            throw new Error(`Cannot have unnamed argument after named arguments at index ${digestIndex}`);
        }
        const parameter = namedOnly
            ? parameterByName[digest.name]
            : parameters[digestIndex];
        if (!parameter) {
            throw new Error(`Could not determine parameter for argument at index ${digestIndex}${digest.name ? ` (${digest.name})` : ""}`);
        }
        let sqlValue;
        if (digest.placeholder) {
            // It's a placeholder, always use it
            sqlValue = digest.placeholder;
        }
        else {
            const dep = digest.value;
            if (dep === undefined &&
                (namedOnly ||
                    (!parameter.required &&
                        digestIndex >= indexAfterWhichAllArgsAreNamed - 1))) {
                namedOnly = true;
                continue;
            }
            sqlValue = (0, codecs_js_1.sqlValueWithCodec)(dep ?? null, parameter.codec);
        }
        if (namedOnly) {
            args.push({
                placeholder: sqlValue,
                name: parameter.name,
            });
        }
        else {
            args.push({
                placeholder: sqlValue,
                position: argIndex++,
            });
        }
    }
    return from(...args);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgFromExpression, "pgFromExpression");
function getFragmentAndCodecFromOrder(alias, order, codecOrCodecs) {
    if (order.attribute != null) {
        const colFrag = (0, pg_sql2_1.default) `${alias}.${pg_sql2_1.default.identifier(order.attribute)}`;
        const isArray = Array.isArray(codecOrCodecs);
        const col = (isArray ? codecOrCodecs[0] : codecOrCodecs).attributes[order.attribute];
        const colCodec = col.codec;
        if (isArray) {
            for (const codec of codecOrCodecs) {
                if (codec.attributes[order.attribute].codec !== colCodec) {
                    throw new Error(`Order by attribute '${order.attribute}' not allowed - this attribute has different codecs (${codec.attributes[order.attribute].codec.name} != ${colCodec.name}) in different parents (${codecOrCodecs[0].name} vs ${codec.name})`);
                }
            }
        }
        const isNullable = !col.notNull && !colCodec.notNull;
        return order.callback
            ? order.callback(colFrag, colCodec, isNullable)
            : [colFrag, colCodec, isNullable];
    }
    else {
        return [order.fragment, order.codec, order.nullable];
    }
}
function calculateOrderBySQL(params) {
    const { reverse, orders: rawOrders, alias, codec } = params;
    const orders = reverse
        ? rawOrders.map((o) => ({
            ...o,
            direction: o.direction === "ASC" ? "DESC" : "ASC",
            nulls: o.nulls === "LAST"
                ? "FIRST"
                : o.nulls === "FIRST"
                    ? "LAST"
                    : o.nulls,
        }))
        : rawOrders;
    return orders.length > 0
        ? (0, pg_sql2_1.default) `\norder by ${pg_sql2_1.default.join(orders.map((o) => {
            const [frag] = getFragmentAndCodecFromOrder(alias, o, codec);
            return (0, pg_sql2_1.default) `${frag} ${o.direction === "ASC" ? (0, pg_sql2_1.default) `asc` : (0, pg_sql2_1.default) `desc`}${o.nulls === "LAST"
                ? (0, pg_sql2_1.default) ` nulls last`
                : o.nulls === "FIRST"
                    ? (0, pg_sql2_1.default) ` nulls first`
                    : pg_sql2_1.default.blank}`;
        }), ", ")}`
        : pg_sql2_1.default.blank;
}
function buildTheQueryCore(rawInfo) {
    const info = {
        ...rawInfo,
        // Make mutable:
        selects: [...rawInfo.selects],
        conditions: [...rawInfo.conditions],
        orders: [...rawInfo.orders],
        groups: [...rawInfo.groups],
        havingConditions: [...rawInfo.havingConditions],
        relationJoins: new Map(rawInfo.relationJoins),
        joins: [...rawInfo.joins],
        meta: { __proto__: null, ...rawInfo.meta },
        // Will be populated by applyConditionFromCursor
        cursorLower: null,
        cursorUpper: null,
        cursorDigest: null,
        cursorIndicies: rawInfo.needsCursor ? [] : null,
        groupIndicies: rawInfo.needsGroups ? [] : null,
        // Will be populated by applyCommonPaginationStuff
        first: null,
        last: null,
        offset: null,
        shouldReverseOrder: false,
    };
    function selectAndReturnIndex(expression) {
        const existingIndex = info.selects.findIndex((s) => pg_sql2_1.default.isEquivalent(s, expression));
        if (existingIndex >= 0)
            return existingIndex;
        return info.selects.push(expression) - 1;
    }
    const meta = info.meta;
    const queryBuilder = {
        alias: info.alias,
        [pg_sql2_1.$$toSQL]() {
            return info.alias;
        },
        selectAndReturnIndex,
        join(spec) {
            info.joins.push(spec);
        },
        setMeta(key, value) {
            meta[key] = value;
        },
        getMetaRaw(key) {
            return meta[key];
        },
        orderBy(spec) {
            if (info.mode !== "aggregate") {
                info.orders.push(spec);
            }
            else {
                // Throw it away?
                // Maybe later we can use it in the aggregates themself - e.g. `array_agg(... order by <blah>)`
            }
        },
        setOrderIsUnique() {
            info.isOrderUnique = true;
        },
        singleRelation(relationIdentifier) {
            // NOTE: this is almost an exact copy of the same method on PgSelectStep,
            // except using `info`... We should harmonize them.
            const relation = info.resource.getRelation(relationIdentifier);
            if (!relation) {
                throw new Error(`${info.resource} does not have a relation named '${String(relationIdentifier)}'`);
            }
            if (!relation.isUnique) {
                throw new Error(`${info.resource} relation '${String(relationIdentifier)}' is not unique so cannot be used with singleRelation`);
            }
            const { remoteResource, localAttributes, remoteAttributes } = relation;
            // Join to this relation if we haven't already
            const cachedAlias = info.relationJoins.get(relationIdentifier);
            if (cachedAlias) {
                return cachedAlias;
            }
            const alias = pg_sql2_1.default.identifier(Symbol(relationIdentifier));
            if (typeof remoteResource.from === "function") {
                throw new Error("Callback sources not currently supported via singleRelation");
            }
            info.joins.push({
                type: "left",
                from: remoteResource.from,
                alias,
                conditions: localAttributes.map((col, i) => (0, pg_sql2_1.default) `${info.alias}.${pg_sql2_1.default.identifier(col)} = ${alias}.${pg_sql2_1.default.identifier(remoteAttributes[i])}`),
            });
            info.relationJoins.set(relationIdentifier, alias);
            return alias;
        },
        where(condition) {
            if (pg_sql2_1.default.isSQL(condition)) {
                info.conditions.push(condition);
            }
            else {
                switch (condition.type) {
                    case "attribute": {
                        info.conditions.push(condition.callback((0, pg_sql2_1.default) `${info.alias}.${pg_sql2_1.default.identifier(condition.attribute)}`));
                        break;
                    }
                    default: {
                        const never = condition.type;
                        console.error("Unsupported condition: ", never);
                        throw new Error(`Unsupported condition`);
                    }
                }
            }
        },
        groupBy(spec) {
            info.groups.push(spec);
        },
        having(condition) {
            if (info.mode !== "aggregate") {
                throw new grafast_1.SafeError(`Cannot add having to a non-aggregate query`);
            }
            if (pg_sql2_1.default.isSQL(condition)) {
                info.havingConditions.push(condition);
            }
            else {
                const never = condition;
                console.error("Unsupported condition: ", never);
                throw new Error(`Unsupported condition`);
            }
        },
        whereBuilder() {
            return new pgCondition_js_1.PgCondition(this);
        },
        havingBuilder() {
            return new pgCondition_js_1.PgCondition(this, true);
        },
    };
    const { count, stream, values } = info.executionDetails;
    for (const applyDepId of info.applyDepIds) {
        const val = values[applyDepId].unaryValue();
        if (Array.isArray(val)) {
            val.forEach((v) => v?.(queryBuilder));
        }
        else {
            val?.(queryBuilder);
        }
    }
    // beforeLock("orderBy"): Now the runtime orders/etc have been added, mutate `orders` to be unique
    makeOrderUniqueIfPossible(info);
    // afterLock("orderBy"): Now the runtime orders/etc have been performed,
    const after = (0, pgStmt_js_1.getUnary)(values, info.afterStepId);
    const before = (0, pgStmt_js_1.getUnary)(values, info.beforeStepId);
    if (info.needsCursor || after != null || before != null) {
        info.cursorDigest = getOrderByDigest(info);
    }
    // PERF: only calculate this if needed
    const { sql: trueOrderBySQL } = buildOrderBy(info, false);
    if (info.cursorIndicies) {
        // PERF: calculate cursorDigest here instead?
        if (info.orders.length > 0) {
            for (const o of info.orders) {
                const [frag, codec] = getFragmentAndCodecFromOrder(info.alias, o, info.resource.codec);
                info.cursorIndicies.push({
                    index: selectAndReturnIndex(codec.castFromPg
                        ? codec.castFromPg(frag, o.nullable === false)
                        : (0, pg_sql2_1.default) `${frag}::text`),
                    codec,
                });
            }
        }
        else {
            // No ordering; so use row number
            info.cursorIndicies.push({
                index: selectAndReturnIndex((0, pg_sql2_1.default) `(row_number() over (partition by 1))::text`),
                codec: codecs_js_1.TYPES.int,
            });
        }
    }
    if (info.groupIndicies) {
        if (info.groups.length > 0) {
            for (const o of info.groups) {
                const { codec, fragment, guaranteedNotNull = false } = o;
                info.groupIndicies.push({
                    index: selectAndReturnIndex(codec.castFromPg
                        ? codec.castFromPg(fragment, guaranteedNotNull)
                        : (0, pg_sql2_1.default) `${fragment}::text`),
                    codec,
                });
            }
        }
        else {
            // No grouping
        }
    }
    // apply conditions from the cursor
    applyConditionFromCursor(info, "after", after);
    applyConditionFromCursor(info, "before", before);
    (0, pgStmt_js_1.applyCommonPaginationStuff)(info);
    /****************************************
     *                                      *
     *      ALL MUTATION NOW COMPLETE       *
     *                                      *
     ****************************************/
    return {
        count,
        trueOrderBySQL,
        info,
        stream,
        meta,
    };
}
function buildTheQuery(rawInfo) {
    const { placeholders, deferreds, fixedPlaceholderValues, _symbolSubstitutes, } = rawInfo;
    const { count, trueOrderBySQL, info, stream, meta } = buildTheQueryCore(rawInfo);
    const { name, hasSideEffects, forceIdentity, first, last, shouldReverseOrder, cursorDigest, cursorIndicies, groupIndicies, } = info;
    const combinedInfo = {
        ...info,
        // Merge things necessary only for query building back in
        placeholders,
        deferreds,
        fixedPlaceholderValues,
        _symbolSubstitutes,
    };
    const { queryValues, placeholderValues, identifiersSymbol, identifiersAlias, } = (0, pgStmt_js_1.makeValues)(combinedInfo, name);
    // Handle fixed placeholder values
    for (const [key, value] of fixedPlaceholderValues) {
        placeholderValues.set(key, value);
    }
    const forceOrder = (stream && info.shouldReverseOrder) || false;
    const makeQuery = ({ limit, offset, options, } = {}) => {
        if (queryValues.length > 0 ||
            (count !== 1 && (forceIdentity || hasSideEffects))) {
            const extraSelects = [];
            const identifierIndexOffset = extraSelects.push((0, pg_sql2_1.default) `${identifiersAlias}.idx`) - 1;
            // PERF: try and re-use existing trueOrderBySQL selection?
            const rowNumberIndexOffset = forceOrder || limit != null || offset != null
                ? extraSelects.push((0, pg_sql2_1.default) `row_number() over (${pg_sql2_1.default.indent(trueOrderBySQL)})`) - 1
                : -1;
            const { sql: baseQuery, extraSelectIndexes } = buildQuery(info, {
                extraSelects,
                forceOrder,
            });
            const identifierIndex = extraSelectIndexes[identifierIndexOffset];
            const rowNumberIndex = rowNumberIndexOffset >= 0
                ? extraSelectIndexes[rowNumberIndexOffset]
                : null;
            const innerWrapper = pg_sql2_1.default.identifier(Symbol("stream_wrapped"));
            /*
             * This wrapper around the inner query is for @stream:
             *
             * - stream must be in the correct order, so if we have
             *   `shouldReverseOrder` then we must reverse the order
             *   ourselves here;
             * - stream can have an `initialCount` - we want to satisfy all
             *   `initialCount` records from _each identifier group_ before we then
             *   resolve the remaining records.
             *
             * NOTE: if neither of the above cases apply then we can skip this,
             * even for @stream.
             */
            const wrappedInnerQuery = rowNumberIndex != null ||
                limit != null ||
                (offset != null && offset > 0)
                ? (0, pg_sql2_1.default) `select *\nfrom (${pg_sql2_1.default.indent(baseQuery)}) ${innerWrapper}\norder by ${innerWrapper}.${pg_sql2_1.default.identifier(String(rowNumberIndex))}${limit != null ? (0, pg_sql2_1.default) `\nlimit ${pg_sql2_1.default.literal(limit)}` : pg_sql2_1.default.blank}${offset != null && offset > 0
                    ? (0, pg_sql2_1.default) `\noffset ${pg_sql2_1.default.literal(offset)}`
                    : pg_sql2_1.default.blank}`
                : baseQuery;
            // PERF: if the query does not have a limit/offset; should we use an
            // `inner join` in a flattened query instead of a wrapped query with
            // `lateral`?
            const wrapperSymbol = Symbol(name + "_result");
            const wrapperAlias = pg_sql2_1.default.identifier(wrapperSymbol);
            const { text: lateralText, values: rawSqlValues, [pg_sql2_1.$$symbolToIdentifier]: symbolToIdentifier, } = pg_sql2_1.default.compile((0, pg_sql2_1.default) `lateral (${pg_sql2_1.default.indent(wrappedInnerQuery)}) as ${wrapperAlias}`, options);
            const identifiersAliasText = symbolToIdentifier.get(identifiersSymbol);
            const wrapperAliasText = symbolToIdentifier.get(wrapperSymbol);
            /*
             * IMPORTANT: these wrapper queries are necessary so that queries
             * that have a limit/offset get the limit/offset applied _per
             * identifier group_; that's why this cannot just be another "from"
             * clause.
             */
            const text = `\
select ${wrapperAliasText}.*
from (select ids.ordinality - 1 as idx${queryValues.length > 0
                ? `, ${queryValues
                    .map(({ codec }, idx) => {
                    return `(ids.value->>${idx})::${pg_sql2_1.default.compile(codec.sqlType).text} as "id${idx}"`;
                })
                    .join(", ")}`
                : ""} from json_array_elements($${rawSqlValues.length + 1}::json) with ordinality as ids) as ${identifiersAliasText},
${lateralText};`;
            return { text, rawSqlValues, identifierIndex };
        }
        else if ((limit != null && limit >= 0) ||
            (offset != null && offset > 0)) {
            // ENHANCEMENT: make this nicer; combine with the `if` branch above?
            const extraSelects = [];
            const rowNumberIndexOffset = forceOrder || limit != null || offset != null
                ? extraSelects.push((0, pg_sql2_1.default) `row_number() over (${pg_sql2_1.default.indent(trueOrderBySQL)})`) - 1
                : -1;
            const { sql: baseQuery, extraSelectIndexes } = buildQuery(info, {
                extraSelects,
            });
            const rowNumberIndex = rowNumberIndexOffset >= 0
                ? extraSelectIndexes[rowNumberIndexOffset]
                : null;
            const innerWrapper = pg_sql2_1.default.identifier(Symbol("stream_wrapped"));
            /*
             * This wrapper around the inner query is for @stream:
             *
             * - stream must be in the correct order, so if we have
             *   `shouldReverseOrder` then we must reverse the order
             *   ourselves here;
             * - stream can have an `initialCount` - we want to satisfy all
             *   `initialCount` records from _each identifier group_ before we then
             *   resolve the remaining records.
             *
             * NOTE: if neither of the above cases apply then we can skip this,
             * even for @stream.
             */
            const wrappedInnerQuery = rowNumberIndex != null ||
                limit != null ||
                (offset != null && offset > 0)
                ? (0, pg_sql2_1.default) `select *\nfrom (${pg_sql2_1.default.indent(baseQuery)}) ${innerWrapper}\norder by ${innerWrapper}.${pg_sql2_1.default.identifier(String(rowNumberIndex))}${limit != null ? (0, pg_sql2_1.default) `\nlimit ${pg_sql2_1.default.literal(limit)}` : pg_sql2_1.default.blank}${offset != null && offset > 0
                    ? (0, pg_sql2_1.default) `\noffset ${pg_sql2_1.default.literal(offset)}`
                    : pg_sql2_1.default.blank};`
                : (0, pg_sql2_1.default) `${baseQuery};`;
            const { text, values: rawSqlValues } = pg_sql2_1.default.compile(wrappedInnerQuery, options);
            return { text, rawSqlValues, identifierIndex: null };
        }
        else {
            const { sql: query } = buildQuery(info, {});
            const { text, values: rawSqlValues } = pg_sql2_1.default.compile((0, pg_sql2_1.default) `${query};`, options);
            return { text, rawSqlValues, identifierIndex: null };
        }
    };
    const cursorDetails = cursorDigest != null && cursorIndicies != null
        ? { digest: cursorDigest, indicies: cursorIndicies }
        : undefined;
    const groupDetails = groupIndicies
        ? { indicies: groupIndicies }
        : undefined;
    if (stream) {
        // PERF: should use the queryForSingle optimization in here too
        // When streaming we can't reverse order in JS - we must do it in the DB.
        if (stream.initialCount > 0) {
            /*
             * Here our stream is constructed of two parts - an
             * `initialFetchQuery` to satisfy the `initialCount` and then a
             * `streamQuery` to build the PostgreSQL cursor for fetching the
             * remaining results across all groups.
             */
            const { text, rawSqlValues, identifierIndex: initialFetchIdentifierIndex, } = makeQuery({
                limit: stream.initialCount,
                options: { placeholderValues },
            });
            const { text: textForDeclare, rawSqlValues: rawSqlValuesForDeclare, identifierIndex: streamIdentifierIndex, } = makeQuery({
                offset: stream.initialCount,
                options: { placeholderValues },
            });
            if (initialFetchIdentifierIndex !== streamIdentifierIndex) {
                throw new Error(`GrafastInternalError<3760b02e-dfd0-4924-bf62-2e0ef9399605>: expected identifier indexes to match`);
            }
            const identifierIndex = initialFetchIdentifierIndex;
            return {
                meta,
                text,
                rawSqlValues,
                textForDeclare,
                rawSqlValuesForDeclare,
                identifierIndex,
                shouldReverseOrder: false,
                streamInitialCount: stream.initialCount,
                queryValues,
                first,
                last,
                cursorDetails,
                groupDetails,
            };
        }
        else {
            /*
             * Unlike the above case, here we have an `initialCount` of zero so
             * we can skip the `initialFetchQuery` and jump straight to the
             * `streamQuery`.
             */
            const { text: textForDeclare, rawSqlValues: rawSqlValuesForDeclare, identifierIndex: streamIdentifierIndex, } = makeQuery({
                offset: 0,
                options: {
                    placeholderValues,
                },
            });
            return {
                meta,
                // This is a hack since this is the _only_ place we don't want
                // `text`; loosening the types would risk us forgetting in more
                // places (and cause us to do excessive type safety checks) so we
                // use an explicit empty string to mark this.
                text: "",
                rawSqlValues: [],
                textForDeclare,
                rawSqlValuesForDeclare,
                identifierIndex: streamIdentifierIndex,
                shouldReverseOrder: false,
                streamInitialCount: 0,
                queryValues,
                first,
                last,
                cursorDetails,
                groupDetails,
            };
        }
    }
    else {
        const { text, rawSqlValues, identifierIndex } = makeQuery({
            options: {
                placeholderValues,
            },
        });
        return {
            meta,
            text,
            rawSqlValues,
            identifierIndex,
            shouldReverseOrder,
            name: hash(text),
            queryValues,
            first,
            last,
            cursorDetails,
            groupDetails,
        };
    }
}
class PgSelectInlineApplyStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgSelectInlineApplyStep",
    }; }
    constructor(identifier, viaSubquery, details) {
        super();
        this.identifier = identifier;
        this.viaSubquery = viaSubquery;
        this.isSyncAndSafe = true;
        const { staticInfo, $first, $last, $offset, $after, $before, applySteps } = details;
        this.staticInfo = staticInfo;
        this.firstStepId = $first ? this.addUnaryDependency($first) : null;
        this.lastStepId = $last ? this.addUnaryDependency($last) : null;
        this.offsetStepId = $offset ? this.addUnaryDependency($offset) : null;
        this.afterStepId = $after ? this.addUnaryDependency($after) : null;
        this.beforeStepId = $before ? this.addUnaryDependency($before) : null;
        this.applyDepIds = applySteps.map(($apply) => this.addUnaryDependency($apply));
    }
    execute(executionDetails) {
        if (executionDetails.count !== 1) {
            throw new Error(`PgSelectInlineApplyStep must be unary!`);
        }
        return [
            (queryBuilder) => {
                const { parts, info, meta } = buildPartsForInlining({
                    executionDetails,
                    // My own dependencies
                    firstStepId: this.firstStepId,
                    lastStepId: this.lastStepId,
                    offsetStepId: this.offsetStepId,
                    afterStepId: this.afterStepId,
                    beforeStepId: this.beforeStepId,
                    applyDepIds: this.applyDepIds,
                    // Data that's independent of dependencies
                    ...this.staticInfo,
                });
                const { cursorDigest, cursorIndicies, groupIndicies } = info;
                const cursorDetails = cursorDigest != null && cursorIndicies != null
                    ? { digest: cursorDigest, indicies: cursorIndicies }
                    : undefined;
                const groupDetails = groupIndicies != null ? { indicies: groupIndicies } : undefined;
                if (this.viaSubquery) {
                    const { first, last, fetchOneExtra, meta, shouldReverseOrder } = info;
                    const { sql: baseQuery } = buildQueryFromParts(parts, {
                        asArray: true,
                    });
                    const selectIndex = queryBuilder.selectAndReturnIndex(
                    // 's' for 'subquery'
                    (0, pg_sql2_1.default) `array(${pg_sql2_1.default.indent(baseQuery)})::text`);
                    const details = {
                        cursorDetails,
                        groupDetails,
                        shouldReverseOrder,
                        fetchOneExtra,
                        selectIndex,
                        first,
                        last,
                        meta,
                    };
                    queryBuilder.setMeta(this.identifier, details);
                }
                else {
                    const { whereConditions, joins, selects } = parts;
                    const { from, alias, resource, joinAsLateral } = this.staticInfo;
                    const where = buildWhereOrHaving((0, pg_sql2_1.default) `/* WHERE becoming ON */`, whereConditions);
                    queryBuilder.join({
                        type: "left",
                        from,
                        alias,
                        attributeNames: resource.codec.attributes ? pg_sql2_1.default.blank : (0, pg_sql2_1.default) `(v)`,
                        // Note the WHERE is now part of the JOIN condition (since
                        // it's a LEFT JOIN).
                        conditions: where !== pg_sql2_1.default.blank ? [where] : [],
                        lateral: joinAsLateral,
                    });
                    for (const join of joins) {
                        queryBuilder.join(join);
                    }
                    const selectIndexes = selects.map((s) => queryBuilder.selectAndReturnIndex(s));
                    const details = {
                        selectIndexes,
                        cursorDetails,
                        groupDetails,
                        meta,
                    };
                    queryBuilder.setMeta(this.identifier, details);
                }
            },
        ];
    }
}
function buildPartsForInlining(rawInfo) {
    const coreResult = buildTheQueryCore(rawInfo);
    return {
        ...coreResult,
        parts: buildQueryParts(coreResult.info, {}),
    };
}
function applyConditionFromCursor(info, beforeOrAfter, parsedCursor) {
    if (parsedCursor == null)
        return;
    const { orders, isOrderUnique, alias, resource, cursorDigest } = info;
    if (cursorDigest == null) {
        throw new Error(`Cursor passed, but could not determine order digest.`);
    }
    const orderCount = orders.length;
    // Cursor validity check
    (0, pgValidateParsedCursor_js_1.validateParsedCursor)(parsedCursor, cursorDigest, orderCount, beforeOrAfter);
    if (orderCount === 0) {
        // Natural pagination `['natural', N]`
        const n = parsedCursor[1];
        if (beforeOrAfter === "after") {
            info.cursorLower = n;
        }
        else {
            info.cursorUpper = n;
        }
        return;
    }
    if (!isOrderUnique) {
        // ENHANCEMENT: make this smarter
        throw new grafast_1.SafeError(`Can only use '${beforeOrAfter}' cursor when there is a unique defined order.`);
    }
    const condition = (i = 0) => {
        const order = orders[i];
        const [orderFragment, orderCodec, nullable] = getFragmentAndCodecFromOrder(alias, order, resource.codec);
        const { nulls, direction } = order;
        const sqlValue = (0, pg_sql2_1.default) `${pg_sql2_1.default.value(parsedCursor[i + 1])}::${orderCodec.sqlType}`;
        // For the truth-table of this code, have a look at this spreadsheet:
        // https://docs.google.com/spreadsheets/d/1m5H-4IRAjhx_Z8v7nd2wMTbmx1dOBof9IroW3WUYE7s/edit?usp=sharing
        const gt = (direction === "ASC" && beforeOrAfter === "after") ||
            (direction === "DESC" && beforeOrAfter === "before");
        const nullsFirst = nulls === "FIRST"
            ? true
            : nulls === "LAST"
                ? false
                : // NOTE: PostgreSQL states that by default DESC = NULLS FIRST,
                    // ASC = NULLS LAST
                    direction === "DESC";
        // Simple less than or greater than
        let fragment = (0, pg_sql2_1.default) `${orderFragment} ${gt ? (0, pg_sql2_1.default) `>` : (0, pg_sql2_1.default) `<`} ${sqlValue}`;
        // Nullable, so now handle if one is null but the other isn't
        if (nullable) {
            const useAIsNullAndBIsNotNull = (nullsFirst && beforeOrAfter === "after") ||
                (!nullsFirst && beforeOrAfter === "before");
            const oneIsNull = useAIsNullAndBIsNotNull
                ? (0, pg_sql2_1.default) `${orderFragment} is null and ${sqlValue} is not null`
                : (0, pg_sql2_1.default) `${orderFragment} is not null and ${sqlValue} is null`;
            fragment = (0, pg_sql2_1.default) `((${fragment}) or (${oneIsNull}))`;
        }
        // Finally handle if they're equal - recurse
        if (i < orderCount - 1) {
            const equals = nullable ? (0, pg_sql2_1.default) `is not distinct from` : (0, pg_sql2_1.default) `=`;
            const aEqualsB = (0, pg_sql2_1.default) `${orderFragment} ${equals} ${sqlValue}`;
            fragment = (0, pg_sql2_1.default) `(${fragment})
or (
${pg_sql2_1.default.indent `${aEqualsB}
and ${pg_sql2_1.default.indent(pg_sql2_1.default.parens(condition(i + 1)))}`}
)`;
        }
        return fragment;
    };
    /*
       * We used to allow the cursor to be null or string; but we now _only_ run
       * this code when the `evalIs(null) || evalIs(undefined)` returns false. So
       * we know that the cursor must exist, so therefore we don't need to add
       * this extra condition.
      // If the cursor is null then no condition is needed
      const cursorIsNullPlaceholder = this.placeholder(
        lambda($parsedCursorPlan, (cursor) => cursor == null),
        TYPES.boolean
      );
      const finalCondition = sql`(${condition()}) or (${cursorIsNullPlaceholder} is true)`;
      */
    const finalCondition = condition();
    info.conditions.push(finalCondition);
}
/**
 * So we can quickly detect if cursors are invalid we use this digest,
 * passing this check does not mean that the cursor is valid but it at least
 * catches common user errors.
 */
function getOrderByDigest(info) {
    const { placeholderSymbols, deferredSymbols, alias, resource, fixedPlaceholderValues, orders, } = info;
    if (orders.length === 0) {
        return "natural";
    }
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = (0, crypto_1.createHash)("sha256");
    hash.update(JSON.stringify(orders.map((o) => {
        const [frag] = getFragmentAndCodecFromOrder(alias, o, resource.codec);
        const placeholderValues = new Map(fixedPlaceholderValues);
        for (let i = 0; i < placeholderSymbols.length; i++) {
            const symbol = placeholderSymbols[i];
            placeholderValues.set(symbol, pg_sql2_1.default.identifier(`PLACEHOLDER_${i}`));
        }
        for (let i = 0; i < deferredSymbols.length; i++) {
            const symbol = deferredSymbols[i];
            placeholderValues.set(symbol, pg_sql2_1.default.identifier(`DEFERRED_${i}`));
        }
        return pg_sql2_1.default.compile(frag, { placeholderValues }).text;
    })));
    const digest = hash.digest("hex").slice(0, 10);
    return digest;
}
function buildQueryParts(info, options = Object.create(null)) {
    const { alias, resource, selects: baseSelects, _symbolSubstitutes } = info;
    function buildFrom() {
        return {
            sql: (0, pg_sql2_1.default) `\nfrom ${info.from} as ${alias}${resource.codec.attributes ? pg_sql2_1.default.blank : (0, pg_sql2_1.default) `(v)`}`,
        };
    }
    function buildGroupBy() {
        const groups = info.groups;
        return {
            sql: groups.length > 0
                ? (0, pg_sql2_1.default) `\ngroup by ${pg_sql2_1.default.join(groups.map((o) => o.fragment), ", ")}`
                : pg_sql2_1.default.blank,
        };
    }
    // NOTE: according to the EdgesToReturn algorithm in the GraphQL Cursor
    // Connections Specification first is applied first, then last is applied.
    // For us this means that if first is present we set the limit to this and
    // then we do the last artificially later.
    // https://relay.dev/graphql/connections.htm#EdgesToReturn()
    const [limitAndOffsetSQL] = (0, pgStmt_js_1.calculateLimitAndOffsetSQLFromInfo)(info);
    function buildLimitAndOffset() {
        return {
            sql: limitAndOffsetSQL,
        };
    }
    const { sql: from } = buildFrom();
    const { sql: groupBy } = buildGroupBy();
    const { sql: orderBy } = buildOrderBy(info, options.forceOrder ? false : info.shouldReverseOrder);
    const { sql: limitAndOffset } = buildLimitAndOffset();
    const { extraSelects = EMPTY_ARRAY } = options;
    const selects = [...baseSelects, ...extraSelects];
    const l = baseSelects.length;
    const extraSelectIndexes = extraSelects.map((_, i) => i + l);
    return {
        selects,
        from,
        joins: info.joins,
        whereConditions: info.conditions,
        groupBy,
        havingConditions: info.havingConditions,
        orderBy,
        limitAndOffset,
        extraSelectIndexes,
        _symbolSubstitutes,
    };
}
function buildQuery(info, options = Object.create(null)) {
    return buildQueryFromParts(buildQueryParts(info, options));
}
function buildQueryFromParts(parts, options = {}) {
    const { selects, from, joins, whereConditions, groupBy, havingConditions, orderBy, limitAndOffset, extraSelectIndexes, } = parts;
    const select = buildSelect(selects, options.asArray);
    const aliases = buildAliases(parts._symbolSubstitutes);
    const join = buildJoin(joins);
    const where = buildWhereOrHaving((0, pg_sql2_1.default) `where`, whereConditions);
    const having = buildWhereOrHaving((0, pg_sql2_1.default) `having`, havingConditions);
    const baseQuery = (0, pg_sql2_1.default) `${aliases}${select}${from}${join}${where}${groupBy}${having}${orderBy}${limitAndOffset}`;
    return { sql: baseQuery, extraSelectIndexes };
}
function buildOrderBy(info, reverse) {
    const { orders, alias, resource: { codec }, } = info;
    return {
        sql: calculateOrderBySQL({
            reverse,
            orders,
            alias,
            codec,
        }),
    };
}
function buildWhereOrHaving(whereOrHaving, baseConditions) {
    const allConditions = baseConditions;
    const sqlConditions = pg_sql2_1.default.join(allConditions.map((c) => pg_sql2_1.default.parens(pg_sql2_1.default.indent(c))), " and ");
    return allConditions.length === 0
        ? pg_sql2_1.default.blank
        : allConditions.length === 1
            ? (0, pg_sql2_1.default) `\n${whereOrHaving} ${sqlConditions}`
            : (0, pg_sql2_1.default) `\n${whereOrHaving}\n${pg_sql2_1.default.indent(sqlConditions)}`;
}
function buildJoin(inJoins) {
    const joins = inJoins.map((j) => {
        const conditions = j.type === "cross"
            ? pg_sql2_1.default.blank
            : j.conditions.length === 0
                ? pg_sql2_1.default.true
                : j.conditions.length === 1
                    ? j.conditions[0]
                    : pg_sql2_1.default.join(j.conditions.map((c) => pg_sql2_1.default.parens(pg_sql2_1.default.indent(c))), " and ");
        const joinCondition = j.type !== "cross"
            ? (0, pg_sql2_1.default) `\non ${pg_sql2_1.default.parens(pg_sql2_1.default.indentIf(j.conditions.length > 1, conditions))}`
            : pg_sql2_1.default.blank;
        const join = j.type === "inner"
            ? (0, pg_sql2_1.default) `inner join`
            : j.type === "left"
                ? (0, pg_sql2_1.default) `left outer join`
                : j.type === "right"
                    ? (0, pg_sql2_1.default) `right outer join`
                    : j.type === "full"
                        ? (0, pg_sql2_1.default) `full outer join`
                        : j.type === "cross"
                            ? (0, pg_sql2_1.default) `cross join`
                            : pg_sql2_1.default.blank;
        return (0, pg_sql2_1.default) `${join}${j.lateral ? (0, pg_sql2_1.default) ` lateral` : pg_sql2_1.default.blank} ${j.from} as ${j.alias}${j.attributeNames ?? pg_sql2_1.default.blank}${joinCondition}`;
    });
    return joins.length ? (0, pg_sql2_1.default) `\n${pg_sql2_1.default.join(joins, "\n")}` : pg_sql2_1.default.blank;
}
function buildSelect(selects, asArray = false) {
    if (asArray) {
        if (selects.length < 1) {
            // Cannot accumulate empty arrays
            return (0, pg_sql2_1.default) `select array[null]::text[]`;
        }
        else {
            return (0, pg_sql2_1.default) `select array[\n${pg_sql2_1.default.indent(pg_sql2_1.default.join(selects, ",\n"))}\n]::text[]`;
        }
    }
    const fragmentsWithAliases = selects.map((frag, idx) => (0, pg_sql2_1.default) `${frag} as ${pg_sql2_1.default.identifier(String(idx))}`);
    const selection = fragmentsWithAliases.length > 0
        ? (0, pg_sql2_1.default) `\n${pg_sql2_1.default.indent(pg_sql2_1.default.join(fragmentsWithAliases, ",\n"))}`
        : (0, pg_sql2_1.default) ` /* NOTHING?! */`;
    return (0, pg_sql2_1.default) `select${selection}`;
}
function buildAliases(_symbolSubstitutes) {
    const sqlAliases = [];
    for (const [a, b] of _symbolSubstitutes.entries()) {
        sqlAliases.push(pg_sql2_1.default.symbolAlias(a, b));
    }
    return pg_sql2_1.default.join(sqlAliases, "");
}
function createSelectResult(allVals, { first, last, fetchOneExtra, shouldReverseOrder, meta, cursorDetails, groupDetails, }) {
    if (allVals == null) {
        return allVals;
    }
    const limit = first ?? last;
    const firstAndLast = first != null && last != null && last < first;
    const hasMore = fetchOneExtra && limit != null && allVals.length > limit;
    const trimFromStart = !shouldReverseOrder && last != null && first == null;
    const limitedRows = hasMore
        ? trimFromStart
            ? allVals.slice(Math.max(0, allVals.length - limit))
            : allVals.slice(0, limit)
        : allVals;
    const slicedRows = firstAndLast && limitedRows.length > last
        ? limitedRows.slice(-last)
        : limitedRows;
    const orderedRows = shouldReverseOrder
        ? (0, grafast_1.reverseArray)(slicedRows)
        : slicedRows;
    return {
        hasMore,
        items: orderedRows,
        cursorDetails,
        groupDetails,
        m: meta,
    };
}
function pgInlineViaJoinTransform([details, item]) {
    const { meta, selectIndexes, cursorDetails, groupDetails } = details;
    const items = [];
    if (item != null) {
        const newItem = [];
        for (let i = 0, l = selectIndexes.length; i < l; i++) {
            newItem[i] = item[selectIndexes[i]];
        }
        items.push(newItem);
    }
    return {
        hasMore: false,
        // We return a list here because our children are going to use a
        // `first` plan on us.
        // NOTE: we don't need to reverse the list for relay pagination
        // because it only contains one entry.
        items,
        cursorDetails,
        groupDetails,
        m: meta,
    };
}
function pgInlineViaSubqueryTransform([details, item]) {
    const allVals = (0, parseArray_js_1.parseArray)(item[details.selectIndex]);
    return createSelectResult(allVals, details);
}
//# sourceMappingURL=pgSelect.js.map