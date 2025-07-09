"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgDeleteSingleStep = void 0;
exports.pgDeleteSingle = pgDeleteSingle;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importStar(require("pg-sql2"));
const inspect_js_1 = require("../inspect.js");
const pgClassExpression_js_1 = require("./pgClassExpression.js");
/**
 * Deletes a row in the database, can return columns from the deleted row.
 */
class PgDeleteSingleStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgDeleteSingleStep",
    }; }
    constructor(resource, getBy) {
        super();
        this.isSyncAndSafe = false;
        /**
         * The attributes and their dependency ids for us to find the record by.
         */
        this.getBys = [];
        /**
         * When locked, no more selects can be added
         */
        this.locked = false;
        /**
         * When finalized, we build the SQL query, queryValues, and note where to feed in
         * the relevant queryValues. This saves repeating this work at execution time.
         *
         * @internal
         */
        this.finalizeResults = null;
        /**
         * The list of things we're selecting.
         */
        this.selects = [];
        this.applyDepIds = [];
        this.hasSideEffects = true;
        this.resource = resource;
        this.name = resource.name;
        this.symbol = Symbol(this.name);
        this.alias = pg_sql2_1.default.identifier(this.symbol);
        this.contextId = this.addDependency(this.resource.executor.context());
        const keys = getBy
            ? Object.keys(getBy)
            : [];
        if (!this.resource.uniques.some((uniq) => uniq.attributes.every((key) => keys.includes(key)))) {
            throw new Error(`Attempted to build 'PgDeleteSingleStep' with a non-unique getBy keys ('${keys.join("', '")}') - please ensure your 'getBy' spec uniquely identifiers a row (resource = ${this.resource}; supported uniques = ${(0, inspect_js_1.inspect)(this.resource.uniques)}).`);
        }
        keys.forEach((name) => {
            if (grafast_1.isDev) {
                if (this.getBys.some((col) => col.name === name)) {
                    throw new Error(`Attribute '${String(name)}' was specified more than once in ${this}'s getBy spec`);
                }
            }
            const value = getBy[name];
            const depId = this.addDependency(value);
            const attribute = this.resource.codec.attributes[name];
            const pgCodec = attribute.codec;
            this.getBys.push({ name, depId, pgCodec });
        });
    }
    toStringMeta() {
        return `${this.resource.name}(${this.getBys.map((g) => g.name)})`;
    }
    /**
     * Returns a plan representing a named attribute (e.g. column) from the newly
     * deleteed row.
     */
    get(attr) {
        const resourceAttribute = this.resource.codec.attributes[attr];
        if (!resourceAttribute) {
            throw new Error(`${this.resource} does not define an attribute named '${String(attr)}'`);
        }
        if (resourceAttribute?.via) {
            throw new Error(`Cannot select a 'via' attribute from PgDeleteSingleStep`);
        }
        /*
         * Only cast to `::text` during select; we want to use it uncasted in
         * conditions/etc. The reasons we cast to ::text include:
         *
         * - to make return values consistent whether they're direct or in nested
         *   arrays
         * - to make sure that that various PostgreSQL clients we support do not
         *   mangle the data in unexpected ways - we take responsibility for
         *   decoding these string values.
         */
        const sqlExpr = (0, pgClassExpression_js_1.pgClassExpression)(this, resourceAttribute.codec, resourceAttribute.notNull);
        const colPlan = resourceAttribute.expression
            ? sqlExpr `${pg_sql2_1.default.parens(resourceAttribute.expression(this.alias))}`
            : sqlExpr `${this.alias}.${pg_sql2_1.default.identifier(String(attr))}`;
        return colPlan;
    }
    getMeta(key) {
        return (0, grafast_1.access)(this, ["m", key]);
    }
    record() {
        return (0, pgClassExpression_js_1.pgClassExpression)(this, this.resource.codec, false) `${this.alias}`;
    }
    /**
     * Advanced method; rather than returning a plan it returns an index.
     * Generally useful for PgClassExpressionStep.
     *
     * @internal
     */
    selectAndReturnIndex(fragment) {
        if (this.locked) {
            throw new Error("Step is finalized, no more selects may be added");
        }
        // Optimisation: if we're already selecting this fragment, return the existing one.
        const index = this.selects.findIndex((frag) => pg_sql2_1.default.isEquivalent(frag, fragment));
        if (index >= 0) {
            return index;
        }
        return this.selects.push(fragment) - 1;
    }
    apply($step) {
        this.applyDepIds.push(this.addUnaryDependency($step));
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
    async execute({ indexMap, values, }) {
        const { alias, contextId, finalizeResults } = this;
        if (!finalizeResults) {
            throw new Error("Cannot execute PgSelectStep before finalizing it.");
        }
        const { text, rawSqlValues, queryValueDetailsBySymbol } = finalizeResults;
        // We must execute each mutation on its own, but we can at least do so in
        // parallel. Note we return a list of promises, each may reject or resolve
        // without causing the others to reject.
        const contextDep = values[contextId];
        return indexMap(async (i) => {
            const context = contextDep.at(i);
            const meta = Object.create(null);
            const queryBuilder = {
                alias,
                [pg_sql2_1.$$toSQL]() {
                    return alias;
                },
                setMeta(key, value) {
                    meta[key] = value;
                },
                getMetaRaw(key) {
                    return meta[key];
                },
            };
            for (const applyDepId of this.applyDepIds) {
                const val = values[applyDepId].unaryValue();
                if (Array.isArray(val)) {
                    val.forEach((v) => v?.(queryBuilder));
                }
                else {
                    val?.(queryBuilder);
                }
            }
            const sqlValues = queryValueDetailsBySymbol.size
                ? rawSqlValues.map((v) => {
                    if (typeof v === "symbol") {
                        const details = queryValueDetailsBySymbol.get(v);
                        if (!details) {
                            throw new Error(`Saw unexpected symbol '${(0, inspect_js_1.inspect)(v)}'`);
                        }
                        const val = values[details.depId].at(i);
                        return val == null ? null : details.processor(val);
                    }
                    else {
                        return v;
                    }
                })
                : rawSqlValues;
            const { rows, rowCount } = await this.resource.executeMutation({
                context,
                text,
                values: sqlValues,
            });
            if (rowCount === 0) {
                return Promise.reject(new Error(`No values were deleted in collection '${this.resource.name}' because no values you can delete were found matching these criteria.`));
            }
            return { __proto__: null, m: meta, t: rows[0] ?? [] };
        });
    }
    finalize() {
        if (!this.isFinalized) {
            this.locked = true;
            const resourceSource = this.resource.from;
            if (!pg_sql2_1.default.isSQL(resourceSource)) {
                throw new Error(`Error in ${this}: can only delete into resources defined as SQL, however ${this.resource} has ${(0, inspect_js_1.inspect)(this.resource.from)}`);
            }
            const table = (0, pg_sql2_1.default) `${resourceSource} as ${this.alias}`;
            const fragmentsWithAliases = this.selects.map((frag, idx) => (0, pg_sql2_1.default) `${frag} as ${pg_sql2_1.default.identifier(String(idx))}`);
            const returning = fragmentsWithAliases.length > 0
                ? (0, pg_sql2_1.default) ` returning\n${pg_sql2_1.default.indent(pg_sql2_1.default.join(fragmentsWithAliases, ",\n"))}`
                : pg_sql2_1.default.blank;
            /*
             * NOTE: Though we'd like to do bulk deletes, it's challenging to link it
             * back together again.
             *
             * Currently it seems that the order returned from `delete ...
             * using (select ... order by ...) returning ...` is the same order as the
             * `order by` was, however this is not guaranteed in the documentation
             * and as such cannot be relied upon. Further the pgsql-hackers list
             * explicitly declined guaranteeing this behavior:
             *
             * https://www.postgresql.org/message-id/CAKFQuwbgdJ_xNn0YHWGR0D%2Bv%2B3mHGVqJpG_Ejt96KHoJjs6DkA%40mail.gmail.com
             *
             * So we have to make do with single deletes, alas.
             */
            const getByAttributesCount = this.getBys.length;
            if (getByAttributesCount === 0) {
                // No attributes specified to find the row?! This is forbidden.
                throw new grafast_1.SafeError("Attempted to delete a record, but no information on uniquely determining the record was specified.");
            }
            else {
                // This is our common path
                const sqlWhereClauses = [];
                const queryValueDetailsBySymbol = new Map();
                for (let i = 0; i < getByAttributesCount; i++) {
                    const { name, depId, pgCodec } = this.getBys[i];
                    const symbol = Symbol(name);
                    sqlWhereClauses[i] = pg_sql2_1.default.parens((0, pg_sql2_1.default) `${pg_sql2_1.default.identifier(this.symbol, name)} = ${pg_sql2_1.default.value(
                    // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
                    // a value before executing the query.
                    symbol)}::${pgCodec.sqlType}`);
                    queryValueDetailsBySymbol.set(symbol, {
                        depId,
                        processor: pgCodec.toPg,
                    });
                }
                const where = (0, pg_sql2_1.default) ` where ${pg_sql2_1.default.parens(pg_sql2_1.default.join(sqlWhereClauses, " and "))}`;
                const query = (0, pg_sql2_1.default) `delete from ${table}${where}${returning};`;
                const { text, values: rawSqlValues } = pg_sql2_1.default.compile(query);
                this.finalizeResults = {
                    text,
                    rawSqlValues,
                    queryValueDetailsBySymbol,
                };
            }
        }
        super.finalize();
    }
}
exports.PgDeleteSingleStep = PgDeleteSingleStep;
/**
 * Delete a row in `resource` identified by the `getBy` unique condition.
 */
function pgDeleteSingle(resource, getBy) {
    return new PgDeleteSingleStep(resource, getBy);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgDeleteSingle, "pgDeleteSingle");
//# sourceMappingURL=pgDeleteSingle.js.map