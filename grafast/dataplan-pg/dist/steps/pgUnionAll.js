"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgUnionAllRowsStep = exports.PgUnionAllStep = exports.PgUnionAllSingleStep = void 0;
exports.pgUnionAll = pgUnionAll;
const json_1 = require("@dataplan/json");
const crypto_1 = require("crypto");
const grafast_1 = require("grafast");
const pg_sql2_1 = require("pg-sql2");
const codecs_js_1 = require("../codecs.js");
const pgLocker_js_1 = require("../pgLocker.js");
const utils_js_1 = require("../utils.js");
const pgClassExpression_js_1 = require("./pgClassExpression.js");
const pgCondition_js_1 = require("./pgCondition.js");
const pgCursor_js_1 = require("./pgCursor.js");
const pgPageInfo_js_1 = require("./pgPageInfo.js");
const pgSelect_js_1 = require("./pgSelect.js");
const pgStmt_js_1 = require("./pgStmt.js");
const pgValidateParsedCursor_js_1 = require("./pgValidateParsedCursor.js");
function isNotNullish(v) {
    return v != null;
}
const rowNumberAlias = "n";
const rowNumberIdent = pg_sql2_1.sql.identifier(rowNumberAlias);
// In future we'll allow mapping columns to different attributes/types
const digestSpecificExpressionFromAttributeName = (digest, name) => {
    return pg_sql2_1.sql.identifier(name);
};
const EMPTY_ARRAY = Object.freeze([]);
const NO_ROWS = Object.freeze({
    m: Object.create(null),
    hasMore: false,
    items: [],
});
const hash = (text) => (0, crypto_1.createHash)("sha256").update(text).digest("hex").slice(0, 63);
function add([a, b]) {
    return a + b;
}
add.isSyncAndSafe = true;
class PgUnionAllSingleStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgUnionAllSingleStep",
    }; }
    constructor($parent, $item) {
        super();
        this.isSyncAndSafe = true;
        this.scopedSQL = (0, utils_js_1.makeScopedSQL)(this);
        this.addDependency($item);
        this.spec = $parent.spec;
        if ($parent.mode === "normal") {
            this.typeKey = $parent.selectType();
            this.pkKey = $parent.selectPk();
        }
        else {
            this.typeKey = null;
            this.pkKey = null;
        }
    }
    planForType(objectType) {
        if (this.pkKey === null || this.typeKey === null) {
            throw new Error(`${this} not polymorphic because parent isn't in normal mode`);
        }
        const resource = this.spec.resourceByTypeName[objectType.name];
        if (!resource) {
            // This type isn't handled; so it should never occur
            return (0, grafast_1.constant)(null);
        }
        const pk = resource.uniques?.find((u) => u.isPrimary === true);
        if (!pk) {
            throw new Error(`No PK found for ${objectType.name}; this should have been caught earlier?!`);
        }
        const spec = Object.create(null);
        const $parsed = (0, json_1.jsonParse)((0, grafast_1.access)(this, [this.pkKey]));
        for (let i = 0, l = pk.attributes.length; i < l; i++) {
            const col = pk.attributes[i];
            spec[col] = (0, grafast_1.access)($parsed, [i]);
        }
        return resource.get(spec);
    }
    /**
     * When selecting a connection we need to be able to get the cursor. The
     * cursor is built from the values of the `ORDER BY` clause so that we can
     * find nodes before/after it.
     */
    cursor() {
        const cursorPlan = new pgCursor_js_1.PgCursorStep(this, this.getClassStep().getCursorDetails());
        return cursorPlan;
    }
    getClassStep() {
        // TODO: we should add validation of this!
        const $item = this.getDep(0);
        const $rows = $item.getDep(0);
        const $pgUnionAll = $rows.getDep(0);
        return $pgUnionAll;
    }
    getMeta(key) {
        return this.getClassStep().getMeta(key);
    }
    node() {
        return this;
    }
    placeholder($step, overrideCodec) {
        return overrideCodec
            ? this.getClassStep().placeholder($step, overrideCodec)
            : this.getClassStep().placeholder($step);
    }
    /**
     * Returns a plan representing the result of an expression.
     */
    expression(expression, codec, guaranteedNotNull) {
        return this.select(expression, codec, guaranteedNotNull);
    }
    /**
     * Advanced method; rather than returning a plan it returns an index.
     * Generally useful for PgClassExpressionStep.
     *
     * @internal
     */
    selectAndReturnIndex(fragment) {
        return this.getClassStep().selectAndReturnIndex(fragment);
    }
    select(fragment, codec, guaranteedNotNull) {
        const sqlExpr = (0, pgClassExpression_js_1.pgClassExpression)(this, codec, codec.notNull || guaranteedNotNull);
        return sqlExpr `${this.scopedSQL(fragment)}`;
    }
    execute({ count, values: [values0], }) {
        if (this.typeKey !== null) {
            const typeKey = this.typeKey;
            return values0.isBatch
                ? values0.entries.map((v) => {
                    if (v == null)
                        return null;
                    const type = v[typeKey];
                    return (0, grafast_1.polymorphicWrap)(type, v);
                })
                : (0, grafast_1.arrayOfLength)(count, values0.value == null
                    ? null
                    : (0, grafast_1.polymorphicWrap)(values0.value[typeKey], values0.value));
        }
        else {
            return values0.isBatch
                ? values0.entries
                : (0, grafast_1.arrayOfLength)(count, values0.value);
        }
    }
}
exports.PgUnionAllSingleStep = PgUnionAllSingleStep;
/**
 * Represents a `UNION ALL` statement, which can have multiple table-like
 * resources, but must return a consistent data shape.
 */
class PgUnionAllStep extends pgStmt_js_1.PgStmtBaseStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgUnionAllStep",
    }; }
    static clone(cloneFrom, mode = cloneFrom.mode) {
        const cloneFromMatchingMode = cloneFrom?.mode === mode ? cloneFrom : null;
        const $clone = new PgUnionAllStep({
            ...cloneFrom.spec,
            mode,
            members: [], // This will be overwritten later
            forceIdentity: cloneFrom.forceIdentity,
            _internalCloneSymbol: cloneFrom.symbol,
            _internalCloneAlias: cloneFrom.alias,
        });
        if ($clone.dependencies.length !== 0) {
            throw new Error(`Should not have any dependencies yet: ${$clone.dependencies}`);
        }
        cloneFrom.dependencies.forEach((planId, idx) => {
            const myIdx = $clone.addDependency({
                ...cloneFrom.getDepOptions(idx),
                skipDeduplication: true,
            });
            if (myIdx !== idx) {
                throw new Error(`Failed to clone ${cloneFrom}; dependency indexes did not match: ${myIdx} !== ${idx}`);
            }
        });
        $clone.applyDepIds = [...cloneFrom.applyDepIds];
        $clone.contextId = cloneFrom.contextId;
        $clone.memberDigests = cloneFrom.memberDigests.map(cloneMemberDigest);
        if (cloneFrom._limitToTypes) {
            $clone._limitToTypes = [...cloneFrom._limitToTypes];
        }
        $clone.placeholders = [...cloneFrom.placeholders];
        $clone.deferreds = [...cloneFrom.deferreds];
        $clone.executor = cloneFrom.executor;
        $clone.isSyncAndSafe = cloneFrom.isSyncAndSafe;
        $clone.alias = cloneFrom.alias;
        if (cloneFromMatchingMode) {
            $clone.selects = [...cloneFromMatchingMode.selects];
            $clone.groups = [...cloneFromMatchingMode.groups];
            $clone.havingConditions = [...cloneFromMatchingMode.havingConditions];
            $clone.orderSpecs = [...cloneFromMatchingMode.orderSpecs];
            $clone.firstStepId = cloneFromMatchingMode.firstStepId;
            $clone.lastStepId = cloneFromMatchingMode.lastStepId;
            $clone.fetchOneExtra = cloneFromMatchingMode.fetchOneExtra;
            $clone.offsetStepId = cloneFromMatchingMode.offsetStepId;
            $clone.beforeStepId = cloneFromMatchingMode.beforeStepId;
            $clone.afterStepId = cloneFromMatchingMode.afterStepId;
            $clone.lowerIndexStepId = cloneFromMatchingMode.lowerIndexStepId;
            $clone.upperIndexStepId = cloneFromMatchingMode.upperIndexStepId;
            $clone.limitAndOffsetId = cloneFromMatchingMode.limitAndOffsetId;
        }
        return $clone;
    }
    constructor(spec) {
        super();
        this.isSyncAndSafe = false;
        this.selects = [];
        /** @internal */
        this.orderSpecs = [];
        /**
         * Values used in this plan.
         */
        this.placeholders = [];
        this.deferreds = [];
        // GROUP BY
        this.groups = [];
        // HAVING
        this.havingConditions = [];
        // LIMIT
        this.firstStepId = null;
        this.lastStepId = null;
        this.fetchOneExtra = false;
        /** When using natural pagination, this index is the lower bound (and should be excluded) */
        this.lowerIndexStepId = null;
        /** When using natural pagination, this index is the upper bound (and should be excluded) */
        this.upperIndexStepId = null;
        /** When we calculate the limit/offset, we may be able to determine there cannot be a next page */
        this.limitAndOffsetId = null;
        // OFFSET
        this.offsetStepId = null;
        // CURSORS
        this.beforeStepId = null;
        this.afterStepId = null;
        // Connection
        this.connectionDepId = null;
        this.locker = new pgLocker_js_1.PgLocker(this);
        this.memberDigests = [];
        this.applyDepIds = [];
        /**
         * Set this true if your query includes any `VOLATILE` function (including
         * seemingly innocuous things such as `random()`) otherwise we might only
         * call the relevant function once and re-use the result.
         */
        this.forceIdentity = false;
        this.typeIdx = null;
        // TODO: Delete these both from here and from pgStmt
        this.shouldReverseOrderId = null;
        this.limitAndOffsetSQL = null;
        {
            this.mode = spec.mode ?? "normal";
            if (this.mode === "aggregate") {
                this.locker.beforeLock("orderBy", () => this.locker.lockParameter("groupBy"));
            }
            this.spec = spec;
            // If the user doesn't specify members, we'll just build membership based
            // on the provided resources.
            const members = spec.members ??
                Object.entries(spec.resourceByTypeName).map(([typeName, resource]) => ({
                    typeName,
                    resource,
                }));
            this.symbol = Symbol(spec.name ?? "union");
            this.alias = pg_sql2_1.sql.identifier(this.symbol);
            for (const member of members) {
                if (!this.executor) {
                    this.executor = member.resource.executor;
                    this.contextId = this.addDependency(this.executor.context());
                }
                const { path = [] } = member;
                const conditions = [];
                let currentResource = member.resource;
                let currentSymbol = Symbol(currentResource.name);
                let currentAlias = pg_sql2_1.sql.identifier(currentSymbol);
                if (this.executor !== currentResource.executor) {
                    throw new Error(`${this}: all resources must currently come from same executor`);
                }
                if (!pg_sql2_1.sql.isSQL(currentResource.from)) {
                    throw new Error(`${this}: parameterized resources not yet supported`);
                }
                if (member.match) {
                    for (const [attributeName, match] of Object.entries(member.match)) {
                        conditions.push((0, pg_sql2_1.sql) `${currentAlias}.${pg_sql2_1.sql.identifier(attributeName)} = ${match.codec
                            ? this.placeholder(match.step, match.codec)
                            : this.placeholder(match.step)}`);
                    }
                }
                let sqlSource = (0, pg_sql2_1.sql) `${currentResource.from} as ${currentAlias}`;
                for (const pathEntry of path) {
                    const relation = currentResource.getRelation(pathEntry.relationName);
                    const nextResource = relation.remoteResource;
                    const nextSymbol = Symbol(nextResource.name);
                    const nextAlias = pg_sql2_1.sql.identifier(nextSymbol);
                    if (this.executor !== nextResource.executor) {
                        throw new Error(`${this}: all resources must currently come from same executor`);
                    }
                    if (!pg_sql2_1.sql.isSQL(nextResource.from)) {
                        throw new Error(`${this}: parameterized resources not yet supported`);
                    }
                    const nextSqlFrom = nextResource.from;
                    sqlSource = (0, pg_sql2_1.sql) `${sqlSource}
inner join ${nextSqlFrom} as ${nextAlias}
on (${pg_sql2_1.sql.indent(pg_sql2_1.sql.join(relation.localAttributes.map((localAttribute, i) => (0, pg_sql2_1.sql) `${nextAlias}.${pg_sql2_1.sql.identifier(String(relation.remoteAttributes[i]))} = ${currentAlias}.${pg_sql2_1.sql.identifier(String(localAttribute))}`), "\nand "))})`;
                    currentResource = nextResource;
                    currentSymbol = nextSymbol;
                    currentAlias = nextAlias;
                }
                this.memberDigests.push({
                    member,
                    finalResource: currentResource,
                    symbol: currentSymbol,
                    alias: currentAlias,
                    conditions,
                    orders: [],
                    sqlSource,
                });
            }
        }
    }
    connectionClone($connection, mode) {
        const $plan = PgUnionAllStep.clone(this, mode);
        // In case any errors are raised
        $plan.connectionDepId = $plan.addDependency($connection);
        return $plan;
    }
    select(key) {
        if (!this.spec.attributes ||
            !Object.prototype.hasOwnProperty.call(this.spec.attributes, key)) {
            throw new Error(`Attribute '${key}' unknown`);
        }
        const existingIndex = this.selects.findIndex((s) => s.type === "attribute" && s.attribute === key);
        if (existingIndex >= 0) {
            return existingIndex;
        }
        const index = this.selects.push({
            type: "attribute",
            attribute: key,
        }) - 1;
        return index;
    }
    selectAndReturnIndex(rawFragment) {
        const fragment = this.scopedSQL(rawFragment);
        const existingIndex = this.selects.findIndex((s) => s.type === "outerExpression" &&
            pg_sql2_1.sql.isEquivalent(s.expression, fragment));
        if (existingIndex >= 0) {
            return existingIndex;
        }
        const index = this.selects.push({
            type: "outerExpression",
            expression: fragment,
        }) - 1;
        return index;
    }
    selectPk() {
        const existingIndex = this.selects.findIndex((s) => s.type === "pk");
        if (existingIndex >= 0) {
            return existingIndex;
        }
        const index = this.selects.push({ type: "pk" }) - 1;
        return index;
    }
    selectExpression(rawExpression, codec) {
        const expression = this.scopedSQL(rawExpression);
        const existingIndex = this.selects.findIndex((s) => s.type === "expression" && pg_sql2_1.sql.isEquivalent(s.expression, expression));
        if (existingIndex >= 0) {
            return existingIndex;
        }
        const index = this.selects.push({ type: "expression", expression, codec }) - 1;
        return index;
    }
    selectType() {
        const existingIndex = this.selects.findIndex((s) => s.type === "type");
        if (existingIndex >= 0) {
            return existingIndex;
        }
        const index = this.selects.push({ type: "type" }) - 1;
        return index;
    }
    getMeta(key) {
        return (0, grafast_1.access)(this, ["m", key]);
    }
    /**
     * If this plan may only return one record, you can use `.singleAsRecord()`
     * to return a plan that resolves to that record (rather than a list of
     * records as it does currently).
     *
     * Beware: if you call this and the database might actually return more than
     * one record then you're potentially in for a Bad Time.
     */
    singleAsRecord() {
        // this.setUnique(true);
        return new PgUnionAllSingleStep(this, (0, grafast_1.first)(this));
    }
    single() {
        return this.singleAsRecord();
    }
    row($row) {
        return new PgUnionAllSingleStep(this, $row);
    }
    apply($step) {
        this.applyDepIds.push(this.addUnaryDependency($step));
    }
    items() {
        return this.operationPlan.cacheStep(this, "items", "" /* Digest of our arguments */, () => new PgUnionAllRowsStep(this));
    }
    listItem(itemPlan) {
        const $single = new PgUnionAllSingleStep(this, itemPlan);
        return $single;
    }
    pageInfo($connectionPlan) {
        return (0, pgPageInfo_js_1.pgPageInfo)($connectionPlan);
    }
    where(rawWhereSpec) {
        if (this.locker.locked) {
            throw new Error(`${this}: cannot add conditions once plan is locked ('where')`);
        }
        const whereSpec = this.scopedSQL(rawWhereSpec);
        for (const digest of this.memberDigests) {
            const { alias: tableAlias, symbol } = digest;
            if (pg_sql2_1.sql.isSQL(whereSpec)) {
                // Merge the global where into this sub-where.
                digest.conditions.push(pg_sql2_1.sql.replaceSymbol(whereSpec, this.symbol, symbol));
            }
            else {
                const ident = (0, pg_sql2_1.sql) `${tableAlias}.${digestSpecificExpressionFromAttributeName(digest, whereSpec.attribute)}`;
                digest.conditions.push(whereSpec.callback(ident));
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
        if (pg_sql2_1.sql.isSQL(condition)) {
            this.havingConditions.push(condition);
        }
        else {
            const never = condition;
            console.error("Unsupported condition: ", never);
            throw new Error(`Unsupported condition`);
        }
    }
    orderBy(orderSpec) {
        if (this.mode === "aggregate") {
            throw new Error(`${this}: orderBy forbidden in aggregate mode`);
        }
        if (!this.spec.attributes) {
            throw new Error(`${this}: cannot order when there's no shared attributes`);
        }
        this.locker.assertParameterUnlocked("orderBy");
        this.orderSpecs.push(orderSpec);
    }
    setOrderIsUnique() {
        // TODO: should we do something here to match pgSelect?
    }
    assertCursorPaginationAllowed() {
        if (this.mode === "aggregate") {
            throw new Error("Cannot use cursor pagination on an aggregate PgSelectStep");
        }
    }
    /** @experimental */
    limitToTypes(types) {
        if (!this._limitToTypes) {
            this._limitToTypes = [...types];
        }
        else {
            this._limitToTypes = this._limitToTypes.filter((t) => types.includes(t));
        }
    }
    optimize() {
        // TODO: validate the parsed cursor and throw error in connection if it
        // fails. I'm not sure, but perhaps we can add this step itself (or a
        // derivative thereof) as a dependency of the connection - that way, if
        // this step throws (e.g. due to invalid cursor) then so does the
        // connection.
        /*
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
          */
        // We must lock here otherwise we might try and create cursor validation
        // plans during `finalize`
        this.locker.lock();
        return this;
    }
    getCursorDetails() {
        this.needsCursor = true;
        return (0, grafast_1.access)(this, "cursorDetails");
    }
    // private reverse: boolean | null = null;
    finalize() {
        // this.locker.lock();
        const normalMode = this.mode === "normal";
        this.typeIdx = normalMode ? this.selectType() : null;
        // this.reverse = normalMode ? this.shouldReverseOrder() : null;
        super.finalize();
    }
    // Be careful if we add streaming - ensure `shouldReverseOrder` is fine.
    async execute(executionDetails) {
        const { indexMap, values, extra: { eventEmitter }, } = executionDetails;
        const { fetchOneExtra } = this;
        const { meta, text, rawSqlValues, identifierIndex, shouldReverseOrder, name, queryValues, first, last, cursorDetails, } = buildTheQuery({
            executionDetails,
            placeholders: this.placeholders,
            placeholderSymbols: this.placeholders.map((p) => p.symbol),
            deferreds: this.deferreds,
            deferredSymbols: this.deferreds.map((d) => d.symbol),
            firstStepId: this.firstStepId,
            lastStepId: this.lastStepId,
            offsetStepId: this.offsetStepId,
            afterStepId: this.afterStepId,
            beforeStepId: this.beforeStepId,
            forceIdentity: this.forceIdentity,
            havingConditions: this.havingConditions,
            mode: this.mode,
            alias: this.alias,
            symbol: this.symbol,
            hasSideEffects: this.hasSideEffects,
            groups: this.groups,
            orderSpecs: this.orderSpecs,
            selects: this.selects,
            typeIdx: this.typeIdx,
            attributes: this.spec.attributes,
            memberDigests: this.memberDigests,
            limitToTypes: this._limitToTypes,
            fetchOneExtra,
            needsCursor: this.needsCursor,
            applyDepIds: this.applyDepIds,
        });
        if (first === 0 || last === 0) {
            return indexMap(() => NO_ROWS);
        }
        const contextDep = values[this.contextId];
        if (contextDep === undefined) {
            throw new Error("We have no context dependency?");
        }
        const specs = indexMap((i) => {
            const context = contextDep.at(i);
            return {
                // The context is how we'd handle different connections with different claims
                context,
                queryValues: identifierIndex != null
                    ? queryValues.map(({ dependencyIndex, codec, alreadyEncoded }) => {
                        const val = values[dependencyIndex].at(i);
                        return val == null
                            ? null
                            : alreadyEncoded
                                ? val
                                : codec.toPg(val);
                    })
                    : EMPTY_ARRAY,
            };
        });
        const executeMethod = this.operationPlan.operation.operation === "query"
            ? "executeWithCache"
            : "executeWithoutCache";
        const executionResult = await this.executor[executeMethod](specs, {
            text,
            rawSqlValues,
            identifierIndex,
            name,
            eventEmitter,
            useTransaction: false,
        });
        // debugExecute("%s; result: %c", this, executionResult);
        return executionResult.values.map((allVals) => {
            if ((0, grafast_1.isPromiseLike)(allVals)) {
                // Must be an error!
                return allVals;
            }
            else if (allVals == null) {
                return NO_ROWS;
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
            const slicedRows = firstAndLast && last != null ? limitedRows.slice(-last) : limitedRows;
            const orderedRows = shouldReverseOrder
                ? (0, grafast_1.reverseArray)(slicedRows)
                : slicedRows;
            return {
                m: meta,
                hasMore,
                items: orderedRows,
                cursorDetails,
            };
        });
    }
    [pg_sql2_1.$$toSQL]() {
        return this.alias;
    }
}
exports.PgUnionAllStep = PgUnionAllStep;
class PgUnionAllRowsStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgUnionAllRowsStep",
    }; }
    constructor($pgUnionAll) {
        super();
        this.addDependency($pgUnionAll);
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
    optimize() {
        return (0, grafast_1.access)(this.getClassStep(), "items");
    }
    execute(executionDetails) {
        const value = executionDetails.values[0];
        return executionDetails.indexMap((i) => value.at(i).items);
    }
}
exports.PgUnionAllRowsStep = PgUnionAllRowsStep;
function pgUnionAll(spec) {
    return new PgUnionAllStep(spec);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgUnionAll, "pgUnionAll");
function buildTheQuery(rawInfo) {
    const info = {
        ...rawInfo,
        // Copy and make mutable
        selects: [...rawInfo.selects],
        orderSpecs: [...rawInfo.orderSpecs],
        orders: [],
        isOrderUnique: false,
        groups: [...rawInfo.groups],
        havingConditions: [...rawInfo.havingConditions],
        memberDigests: rawInfo.memberDigests.map(cloneMemberDigest),
        limitToTypes: rawInfo.limitToTypes?.slice(),
        // Will be populated below
        ordersForCursor: undefined,
        cursorDigest: null,
        cursorIndicies: rawInfo.needsCursor ? [] : null,
        // Will be populated by applyConditionFromCursor
        cursorLower: null,
        cursorUpper: null,
        // Will be populated by applyCommonPaginationStuff
        first: null,
        last: null,
        offset: null,
        shouldReverseOrder: false,
    };
    const { values, count } = info.executionDetails;
    function selectAndReturnIndex(expression) {
        const existingIndex = info.selects.findIndex((s) => s.type === "outerExpression" &&
            pg_sql2_1.sql.isEquivalent(s.expression, expression));
        if (existingIndex >= 0)
            return existingIndex;
        return info.selects.push({ type: "outerExpression", expression }) - 1;
    }
    function selectAttribute(key) {
        const existingIndex = info.selects.findIndex((s) => s.type === "attribute" && s.attribute === key);
        if (existingIndex >= 0) {
            return existingIndex;
        }
        const index = info.selects.push({
            type: "attribute",
            attribute: key,
        }) - 1;
        return index;
    }
    function selectType() {
        if (info.typeIdx != null)
            return info.typeIdx;
        const existingIndex = info.selects.findIndex((s) => s.type === "type");
        if (existingIndex >= 0)
            return existingIndex;
        info.typeIdx = info.selects.push({ type: "type" }) - 1;
        return info.typeIdx;
    }
    function selectPk() {
        const existingIndex = info.selects.findIndex((s) => s.type === "pk");
        if (existingIndex >= 0)
            return existingIndex;
        return info.selects.push({ type: "pk" }) - 1;
    }
    const meta = Object.create(null);
    const queryBuilder = {
        alias: info.alias,
        [pg_sql2_1.$$toSQL]() {
            return info.alias;
        },
        setMeta(key, value) {
            meta[key] = value;
        },
        getMetaRaw(key) {
            return meta[key];
        },
        orderBy(spec) {
            if (info.mode !== "aggregate") {
                info.orderSpecs.push(spec);
            }
        },
        setOrderIsUnique() {
            info.isOrderUnique = true;
        },
        where(whereSpec) {
            for (const digest of info.memberDigests) {
                const { alias: tableAlias, symbol } = digest;
                if (pg_sql2_1.sql.isSQL(whereSpec)) {
                    // Merge the global where into this sub-where.
                    digest.conditions.push(
                    // TODO: do we require that info.symbol is a symbol?
                    typeof info.symbol === "symbol"
                        ? pg_sql2_1.sql.replaceSymbol(whereSpec, info.symbol, symbol)
                        : whereSpec);
                }
                else {
                    const ident = (0, pg_sql2_1.sql) `${tableAlias}.${digestSpecificExpressionFromAttributeName(digest, whereSpec.attribute)}`;
                    digest.conditions.push(whereSpec.callback(ident));
                }
            }
        },
        having(condition) {
            if (info.mode !== "aggregate") {
                throw new grafast_1.SafeError(`Cannot add having to a non-aggregate query`);
            }
            if (pg_sql2_1.sql.isSQL(condition)) {
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
        limitToTypes(types) {
            if (!info.limitToTypes) {
                info.limitToTypes = [...types];
            }
            else {
                info.limitToTypes = info.limitToTypes.filter((t) => types.includes(t));
            }
        },
    };
    for (const applyDepId of info.applyDepIds) {
        const val = values[applyDepId].unaryValue();
        if (Array.isArray(val)) {
            val.forEach((v) => v?.(queryBuilder));
        }
        else {
            val?.(queryBuilder);
        }
    }
    // Apply type limits
    if (info.limitToTypes) {
        info.memberDigests = info.memberDigests.filter((d) => info.limitToTypes.includes(d.member.typeName));
    }
    // Now turn order specs into orders
    if (info.memberDigests.length === 0) {
        // We have no implementations, we'll never return anything
        return {
            meta,
            text: `select null;`,
            rawSqlValues: [],
            identifierIndex: null,
            first: 0,
            last: 0,
            queryValues: [],
            cursorDetails: undefined,
            shouldReverseOrder: false,
        };
    }
    for (const orderSpec of info.orderSpecs) {
        if (!info.attributes) {
            throw new Error(`Cannot order without attributes`);
        }
        for (const digest of info.memberDigests) {
            const { alias: tableAlias } = digest;
            const ident = (0, pg_sql2_1.sql) `${tableAlias}.${digestSpecificExpressionFromAttributeName(digest, orderSpec.attribute)}`;
            digest.orders.push({
                fragment: ident,
                direction: orderSpec.direction,
                codec: info.attributes[orderSpec.attribute].codec,
            });
        }
        const selectedIndex = selectAttribute(orderSpec.attribute);
        info.orders.push({
            fragment: pg_sql2_1.sql.identifier(String(selectedIndex)),
            direction: orderSpec.direction,
            codec: info.attributes[orderSpec.attribute].codec,
        });
        if (info.cursorIndicies != null) {
            info.cursorIndicies.push({
                index: selectedIndex,
                codec: codecs_js_1.TYPES.text,
            });
        }
    }
    if (info.cursorIndicies != null) {
        info.cursorIndicies.push({
            index: selectType(),
            codec: codecs_js_1.TYPES.text,
        });
        info.cursorIndicies.push({
            index: selectPk(),
            codec: codecs_js_1.TYPES.text,
        });
    }
    if (grafast_1.isDev)
        Object.freeze(info.orders);
    info.ordersForCursor = [
        ...info.orders,
        {
            fragment: (0, pg_sql2_1.sql) `${info.alias}.${pg_sql2_1.sql.identifier(String(selectType()))}`,
            codec: codecs_js_1.TYPES.text,
            direction: "ASC",
        },
        {
            fragment: (0, pg_sql2_1.sql) `${info.alias}.${pg_sql2_1.sql.identifier(String(selectPk()))}`,
            codec: codecs_js_1.TYPES.json,
            direction: "ASC",
        },
    ];
    if (grafast_1.isDev)
        Object.freeze(info.ordersForCursor);
    // afterLock("orderBy"): Now the runtime orders/etc have been performed,
    const after = (0, pgStmt_js_1.getUnary)(values, info.afterStepId);
    const before = (0, pgStmt_js_1.getUnary)(values, info.beforeStepId);
    if (info.needsCursor || after != null || before != null) {
        info.cursorDigest = getOrderByDigest(info);
    }
    // apply conditions from the cursor
    applyConditionFromCursor(info, "after", after);
    applyConditionFromCursor(info, "before", before);
    (0, pgStmt_js_1.applyCommonPaginationStuff)(info);
    if (grafast_1.isDev) {
        info.memberDigests.forEach((d) => {
            Object.freeze(d.conditions);
            Object.freeze(d.orders);
            Object.freeze(d);
        });
        Object.freeze(info.memberDigests);
        // Object.freeze(info.selects);
        Object.freeze(info.groups);
        Object.freeze(info.havingConditions);
    }
    /****************************************
     *                                      *
     *      ALL MUTATION NOW COMPLETE       *
     *                                      *
     ****************************************/
    // Except we still do selectAndReturnIndex() below, and maybe some other stuff?
    const { mode, typeIdx, alias, attributes, forceIdentity, memberDigests, selects, orders, groups, havingConditions, hasSideEffects, ordersForCursor, shouldReverseOrder, cursorDigest, cursorIndicies, } = info;
    const reverse = mode === "normal" ? shouldReverseOrder : null;
    const memberCodecs = memberDigests.map((digest) => digest.finalResource.codec);
    const makeQuery = () => {
        const tables = [];
        const [limitAndOffsetSQL, innerLimitSQL] = (0, pgStmt_js_1.calculateLimitAndOffsetSQLFromInfo)(info);
        for (const memberDigest of memberDigests) {
            const { sqlSource, alias: tableAlias, conditions, orders, finalResource, } = memberDigest;
            const pk = finalResource.uniques?.find((u) => u.isPrimary === true);
            if (!pk) {
                throw new Error(`No PK for ${memberDigest.member.typeName} resource`);
            }
            const midSelects = [];
            const innerSelects = selects
                .map((s, selectIndex) => {
                const r = (() => {
                    switch (s.type) {
                        case "attribute": {
                            if (!attributes) {
                                throw new Error(`Cannot select an attribute when there's no shared attributes`);
                            }
                            const attr = attributes[s.attribute];
                            return [
                                (0, pg_sql2_1.sql) `${tableAlias}.${digestSpecificExpressionFromAttributeName(memberDigest, s.attribute)}`,
                                attr.codec,
                            ];
                        }
                        case "type": {
                            return [pg_sql2_1.sql.literal(memberDigest.member.typeName), codecs_js_1.TYPES.text];
                        }
                        case "pk": {
                            return [
                                (0, pg_sql2_1.sql) `json_build_array(${pg_sql2_1.sql.join(pk.attributes.map((c) => (0, pg_sql2_1.sql) `(${tableAlias}.${pg_sql2_1.sql.identifier(c)})::text`), ",")})`,
                                codecs_js_1.TYPES.json,
                            ];
                        }
                        case "expression": {
                            return [s.expression, s.codec];
                        }
                        case "outerExpression": {
                            // Only applies on outside
                            return null;
                        }
                        case "order": {
                            const orderSpec = orders[s.orderIndex];
                            const [frag, codec] = (0, pgSelect_js_1.getFragmentAndCodecFromOrder)(alias, orderSpec, memberDigest.finalResource.codec);
                            return [frag, codec];
                        }
                        default: {
                            const never = s;
                            throw new Error(`Couldn't match ${never.type}`);
                        }
                    }
                })();
                if (!r) {
                    return r;
                }
                const [frag, _codec] = r;
                const identAlias = String(selectIndex);
                const ident = pg_sql2_1.sql.identifier(identAlias);
                const fullIdent = (0, pg_sql2_1.sql) `${tableAlias}.${ident}`;
                midSelects.push(fullIdent);
                return (0, pg_sql2_1.sql) `${frag} as ${ident}`;
            })
                .filter(isNotNullish);
            midSelects.push(rowNumberIdent);
            const ascOrDesc = reverse ? (0, pg_sql2_1.sql) `desc` : (0, pg_sql2_1.sql) `asc`;
            const pkOrder = pg_sql2_1.sql.join(pk.attributes.map((c) => (0, pg_sql2_1.sql) `${tableAlias}.${pg_sql2_1.sql.identifier(c)} ${ascOrDesc}`), ",\n");
            const orderBy = (0, pg_sql2_1.sql) `order by
${pg_sql2_1.sql.indent `${orders.length > 0
                ? (0, pg_sql2_1.sql) `${pg_sql2_1.sql.join(orders.map((orderSpec) => {
                    const [frag] = (0, pgSelect_js_1.getFragmentAndCodecFromOrder)(tableAlias, orderSpec, finalResource.codec);
                    return (0, pg_sql2_1.sql) `${frag} ${Number(orderSpec.direction === "DESC") ^ Number(reverse)
                        ? (0, pg_sql2_1.sql) `desc`
                        : (0, pg_sql2_1.sql) `asc`}`;
                }), `,\n`)},\n`
                : pg_sql2_1.sql.blank}${pkOrder}`}`;
            innerSelects.push((0, pg_sql2_1.sql) `row_number() over (${pg_sql2_1.sql.indent(orderBy)}) as ${rowNumberIdent}`);
            // Can't order individual selects in a `union all` so we're using
            // subqueries to do so.
            const innerQuery = pg_sql2_1.sql.indent `
select
${pg_sql2_1.sql.indent(pg_sql2_1.sql.join(innerSelects, ",\n"))}
from ${sqlSource}
${conditions.length > 0
                ? (0, pg_sql2_1.sql) `where ${pg_sql2_1.sql.join(conditions, `\nand `)}\n`
                : pg_sql2_1.sql.blank}\
${orderBy}\
${innerLimitSQL}
`;
            // Relies on Postgres maintaining the order of the subquery
            const query = pg_sql2_1.sql.indent `\
select
${pg_sql2_1.sql.indent(pg_sql2_1.sql.join(midSelects, ",\n"))}
from (${innerQuery}) as ${tableAlias}\
`;
            tables.push(query);
        }
        const outerSelects = selects.map((select, i) => {
            if (select.type === "outerExpression") {
                return (0, pg_sql2_1.sql) `${select.expression} as ${pg_sql2_1.sql.identifier(String(i))}`;
            }
            else if (mode === "normal") {
                const sqlSrc = (0, pg_sql2_1.sql) `${alias}.${pg_sql2_1.sql.identifier(String(i))}`;
                let codec;
                let guaranteedNotNull;
                switch (select.type) {
                    case "type": {
                        codec = codecs_js_1.TYPES.text;
                        break;
                    }
                    case "pk": {
                        codec = codecs_js_1.TYPES.json;
                        guaranteedNotNull = true;
                        break;
                    }
                    case "order": {
                        const order = ordersForCursor[select.orderIndex];
                        codec = (0, pgSelect_js_1.getFragmentAndCodecFromOrder)(alias, order, memberCodecs)[1];
                        guaranteedNotNull = order.nullable === false;
                        break;
                    }
                    case "attribute": {
                        const attr = attributes[select.attribute];
                        codec = attr.codec;
                        guaranteedNotNull = attr.notNull;
                        break;
                    }
                    default: {
                        codec = select.codec;
                    }
                }
                return (0, pg_sql2_1.sql) `${codec.castFromPg?.(sqlSrc, guaranteedNotNull || codec.notNull) ??
                    (0, pg_sql2_1.sql) `${sqlSrc}::text`} as ${pg_sql2_1.sql.identifier(String(i))}`;
            }
            else {
                // PERF: eradicate this (aggregate mode) without breaking arrayMode
                // tuple numbering
                return (0, pg_sql2_1.sql) `null as ${pg_sql2_1.sql.identifier(String(i))}`;
            }
        });
        const unionGroupBy = mode === "aggregate" && groups.length > 0
            ? (0, pg_sql2_1.sql) `group by
${pg_sql2_1.sql.indent(pg_sql2_1.sql.join(groups.map((g) => g.fragment), ",\n"))}
`
            : pg_sql2_1.sql.blank;
        const unionHaving = mode === "aggregate" && havingConditions.length > 0
            ? (0, pg_sql2_1.sql) `having
${pg_sql2_1.sql.indent(pg_sql2_1.sql.join(havingConditions, ",\n"))}
`
            : pg_sql2_1.sql.blank;
        const unionOrderBy = mode === "aggregate"
            ? pg_sql2_1.sql.blank
            : (0, pg_sql2_1.sql) `\
order by${pg_sql2_1.sql.indent `
${orders.length
                ? (0, pg_sql2_1.sql) `${pg_sql2_1.sql.join(orders.map((o) => {
                    return (0, pg_sql2_1.sql) `${o.fragment} ${Number(o.direction === "DESC") ^ Number(reverse)
                        ? (0, pg_sql2_1.sql) `desc`
                        : (0, pg_sql2_1.sql) `asc`}`;
                }), ",\n")},\n`
                : pg_sql2_1.sql.blank}\
${pg_sql2_1.sql.identifier(String(typeIdx))} ${reverse ? (0, pg_sql2_1.sql) `desc` : (0, pg_sql2_1.sql) `asc`},
${rowNumberIdent} asc\
`}
`;
        // Union must be ordered _before_ applying `::text`/etc transforms to
        // select, so we wrap this with another select.
        const unionQuery = pg_sql2_1.sql.indent `
${pg_sql2_1.sql.join(tables, `
union all
`)}
${unionOrderBy}\
${limitAndOffsetSQL}
`;
        // Adds all the `::text`/etc casting
        const innerQuery = (0, pg_sql2_1.sql) `\
select
${pg_sql2_1.sql.indent(pg_sql2_1.sql.join(outerSelects, ",\n"))}
from (${unionQuery}) ${alias}
${unionGroupBy}\
${unionHaving}\
`;
        return innerQuery;
    };
    const { text, rawSqlValues, identifierIndex, queryValues } = (() => {
        const wrapperSymbol = Symbol("union_result");
        const wrapperAlias = pg_sql2_1.sql.identifier(wrapperSymbol);
        const { queryValues, placeholderValues, identifiersAlias, identifiersSymbol, } = (0, pgStmt_js_1.makeValues)(info, "union");
        if (queryValues.length > 0 ||
            (count !== 1 && (forceIdentity || hasSideEffects))) {
            const identifierIndex = selectAndReturnIndex((0, pg_sql2_1.sql) `${identifiersAlias}.idx`);
            // IMPORTANT: this must come after the `selectExpression` call above.
            const innerQuery = makeQuery();
            const { text: lateralText, values: rawSqlValues, [pg_sql2_1.$$symbolToIdentifier]: symbolToIdentifier, } = pg_sql2_1.sql.compile((0, pg_sql2_1.sql) `lateral (${pg_sql2_1.sql.indent(innerQuery)}) as ${wrapperAlias}`, { placeholderValues });
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
                    return `(ids.value->>${idx})::${pg_sql2_1.sql.compile(codec.sqlType).text} as "id${idx}"`;
                })
                    .join(", ")}`
                : ""} from json_array_elements($${rawSqlValues.length + 1}::json) with ordinality as ids) as ${identifiersAliasText},
${lateralText};`;
            return {
                text,
                rawSqlValues,
                identifierIndex,
                queryValues,
            };
        }
        else {
            const query = makeQuery();
            const { text, values: rawSqlValues } = pg_sql2_1.sql.compile(query, {
                placeholderValues,
            });
            return { text, rawSqlValues, identifierIndex: null, queryValues };
        }
    })();
    // const shouldReverseOrder = this.shouldReverseOrder();
    // **IMPORTANT**: if streaming we must not reverse order (`shouldReverseOrder` must be `false`)
    const cursorDetails = cursorDigest != null && cursorIndicies != null
        ? {
            digest: cursorDigest,
            indicies: cursorIndicies,
        }
        : undefined;
    return {
        meta,
        text,
        rawSqlValues,
        identifierIndex,
        shouldReverseOrder: info.shouldReverseOrder,
        name: hash(text),
        queryValues,
        first: info.first,
        last: info.last,
        cursorDetails,
    };
}
function applyConditionFromCursor(info, beforeOrAfter, parsedCursor) {
    if (parsedCursor == null)
        return;
    const { alias, orders, ordersForCursor, memberDigests, cursorDigest } = info;
    if (cursorDigest == null) {
        throw new Error(`Cursor passed, but could not determine order digest.`);
    }
    const orderCount = ordersForCursor.length;
    // Cursor validity check
    (0, pgValidateParsedCursor_js_1.validateParsedCursor)(parsedCursor, cursorDigest, orderCount, beforeOrAfter);
    if (orderCount === 0) {
        // Natural pagination `['natural', N]`
        // This will be used in upperIndex(before)/lowerIndex(after)
        const n = parsedCursor[1];
        if (beforeOrAfter === "after") {
            info.cursorLower = n;
        }
        else {
            info.cursorUpper = n;
        }
        return;
    }
    const identifierPlaceholders = [];
    for (let i = 0; i < orderCount; i++) {
        const order = orders[i];
        if (i === orderCount - 1) {
            // PK (within that polymorphic type)
            // TODO: rather than using JSON here and since we now run this at runtime
            // rather than plan time, lets expand this to be each individual PK
            // column rather than one JSON encoding of the same.
            // NOTE: this is a JSON-encoded string containing all the PK values. We
            // don't want to parse it and then re-stringify it, so we'll just feed
            // it in as text and tell the system it has already been encoded:
            identifierPlaceholders[i] = (0, pg_sql2_1.sql) `${pg_sql2_1.sql.value(parsedCursor[i + 1])}::"json"`;
        }
        else if (i === orderCount - 2) {
            // Polymorphic type
            identifierPlaceholders[i] = (0, pg_sql2_1.sql) `${pg_sql2_1.sql.value(parsedCursor[i + 1])}::"text"`;
        }
        else if (memberDigests.length > 0) {
            const memberCodecs = memberDigests.map((d) => d.finalResource.codec);
            const [, codec] = (0, pgSelect_js_1.getFragmentAndCodecFromOrder)(alias, order, memberCodecs);
            identifierPlaceholders[i] = (0, pg_sql2_1.sql) `${pg_sql2_1.sql.value(codec.toPg(parsedCursor[i + 1]))}::${codec.sqlType}`;
        }
        else {
            // No implementations?!
        }
    }
    for (const mutableMemberDigest of memberDigests) {
        const { finalResource } = mutableMemberDigest;
        const pk = finalResource.uniques?.find((u) => u.isPrimary === true);
        if (!pk) {
            throw new Error("No primary key; this should have been caught earlier");
        }
        const max = orderCount - 1 + pk.attributes.length;
        const pkPlaceholder = identifierPlaceholders[orderCount - 1];
        const pkAttributes = finalResource.codec.attributes;
        const condition = (i = 0) => {
            const order = mutableMemberDigest.orders[i];
            const [orderFragment, sqlValue, direction, nullable = false, nulls = null,] = (() => {
                if (i >= orderCount - 1) {
                    // PK
                    const pkIndex = i - (orderCount - 1);
                    const pkCol = pk.attributes[pkIndex];
                    return [
                        (0, pg_sql2_1.sql) `${mutableMemberDigest.alias}.${pg_sql2_1.sql.identifier(pkCol)}`,
                        (0, pg_sql2_1.sql) `(${pkPlaceholder}->>${pg_sql2_1.sql.literal(pkIndex)})::${pkAttributes[pkCol].codec.sqlType}`,
                        "ASC",
                        false,
                    ];
                }
                else if (i === orderCount - 2) {
                    // Type
                    return [
                        pg_sql2_1.sql.literal(mutableMemberDigest.member.typeName),
                        identifierPlaceholders[i],
                        "ASC",
                        false,
                    ];
                }
                else {
                    const [frag, _codec, isNullable] = (0, pgSelect_js_1.getFragmentAndCodecFromOrder)(alias, order, mutableMemberDigest.finalResource.codec);
                    return [
                        frag,
                        identifierPlaceholders[i],
                        order.direction,
                        isNullable,
                        order.nulls,
                    ];
                }
            })();
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
            let fragment = (0, pg_sql2_1.sql) `${orderFragment} ${gt ? (0, pg_sql2_1.sql) `>` : (0, pg_sql2_1.sql) `<`} ${sqlValue}`;
            // Nullable, so now handle if one is null but the other isn't
            if (nullable) {
                const useAIsNullAndBIsNotNull = (nullsFirst && beforeOrAfter === "after") ||
                    (!nullsFirst && beforeOrAfter === "before");
                const oneIsNull = useAIsNullAndBIsNotNull
                    ? (0, pg_sql2_1.sql) `${orderFragment} is null and ${sqlValue} is not null`
                    : (0, pg_sql2_1.sql) `${orderFragment} is not null and ${sqlValue} is null`;
                fragment = (0, pg_sql2_1.sql) `((${fragment}) or (${oneIsNull}))`;
            }
            // Finally handle if they're equal - recurse
            if (i < max - 1) {
                const equals = nullable ? (0, pg_sql2_1.sql) `is not distinct from` : (0, pg_sql2_1.sql) `=`;
                const aEqualsB = (0, pg_sql2_1.sql) `${orderFragment} ${equals} ${sqlValue}`;
                fragment = (0, pg_sql2_1.sql) `(${fragment})
or (
${pg_sql2_1.sql.indent `${aEqualsB}
and ${condition(i + 1)}`}
)`;
            }
            return pg_sql2_1.sql.parens(pg_sql2_1.sql.indent(fragment));
        };
        const finalCondition = condition();
        mutableMemberDigest.conditions.push(finalCondition);
    }
}
function getOrderByDigest(info) {
    const { memberDigests, orderSpecs, alias, 
    // TODO: satisfy placeholders and deferreds before we get this far!
    placeholders, deferreds, } = info;
    if (memberDigests.length === 0) {
        return "natural";
    }
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = (0, crypto_1.createHash)("sha256");
    const memberCodecs = memberDigests.map((digest) => digest.finalResource.codec);
    const tuple = [
        ...orderSpecs.map((o) => {
            const [frag] = (0, pgSelect_js_1.getFragmentAndCodecFromOrder)(alias, o, memberCodecs);
            const placeholderValues = new Map();
            for (let i = 0; i < placeholders.length; i++) {
                const { symbol } = placeholders[i];
                placeholderValues.set(symbol, pg_sql2_1.sql.identifier(`PLACEHOLDER_${i}`));
            }
            for (let i = 0; i < deferreds.length; i++) {
                const { symbol } = deferreds[i];
                placeholderValues.set(symbol, pg_sql2_1.sql.identifier(`DEFERRED_${i}`));
            }
            return pg_sql2_1.sql.compile(frag, { placeholderValues }).text;
        }),
        "type",
        "pk",
    ];
    const d = JSON.stringify(tuple);
    hash.update(d);
    const digest = hash.digest("hex").slice(0, 10);
    return digest;
}
function cloneMemberDigest(memberDigest) {
    return {
        // Unchanging parts
        symbol: memberDigest.symbol,
        alias: memberDigest.alias,
        member: memberDigest.member,
        sqlSource: memberDigest.sqlSource,
        finalResource: memberDigest.finalResource,
        // Mutable parts
        orders: [...memberDigest.orders],
        conditions: [...memberDigest.conditions],
    };
}
//# sourceMappingURL=pgUnionAll.js.map