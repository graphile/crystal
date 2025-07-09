"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgInsertSingleStep = void 0;
exports.pgInsertSingle = pgInsertSingle;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importStar(require("pg-sql2"));
const codecs_js_1 = require("../codecs.js");
const inspect_js_1 = require("../inspect.js");
const pgClassExpression_js_1 = require("./pgClassExpression.js");
/**
 * Inserts a row into resource with the given specified attribute values.
 */
class PgInsertSingleStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgInsertSingleStep",
    }; }
    constructor(resource, attributes) {
        super();
        this.isSyncAndSafe = false;
        /**
         * The attributes and their dependency ids for us to insert.
         */
        this.attributes = [];
        /**
         * When locked, no more values can be set, no more selects can be added
         */
        this.locked = false;
        /**
         * When finalized, we build the SQL query, queryValues, and note where to feed in
         * the relevant queryValues. This saves repeating this work at execution time.
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
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                if (value) {
                    this.set(key, value);
                }
            });
        }
    }
    toStringMeta() {
        return `${this.resource.name}(${this.attributes.map((a) => a.name)})`;
    }
    set(name, value) {
        if (this.locked) {
            throw new Error("Cannot set after plan is locked.");
        }
        if (grafast_1.isDev) {
            if (this.attributes.some((col) => col.name === name)) {
                throw new Error(`Attribute '${String(name)}' was specified more than once in ${this}`);
            }
        }
        const attribute = this.resource.codec.attributes?.[name];
        if (!attribute) {
            throw new Error(`Attribute ${String(name)} not found in ${this.resource.codec}`);
        }
        const { codec: pgCodec } = attribute;
        const depId = this.addDependency(value);
        this.attributes.push({ name, depId, pgCodec });
    }
    /**
     * Returns a plan representing a named attribute (e.g. column) from the newly
     * inserted row.
     */
    get(attr) {
        if (!this.resource.codec.attributes) {
            throw new Error(`Cannot call .get() when there's no attributes.`);
        }
        const resourceAttribute = this.resource.codec.attributes[attr];
        if (!resourceAttribute) {
            throw new Error(`${this.resource} does not define an attribute named '${String(attr)}'`);
        }
        if (resourceAttribute?.via) {
            throw new Error(`Cannot select a 'via' attribute from PgInsertSingleStep`);
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
        // NOTE: it's okay to add selections after the plan is "locked" - lock only
        // applies to which rows are being selected, not what is being queried
        // about the rows.
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
        const { resource, contextId, finalizeResults, alias } = this;
        if (!finalizeResults) {
            throw new Error("Cannot execute PgSelectStep before finalizing it.");
        }
        const { table, returning } = finalizeResults;
        const contextDep = values[contextId];
        /*
         * NOTE: Though we'd like to do bulk inserts, there's no way of us
         * reliably linking the data back up again given users might:
         *
         * - rely on auto-generated primary keys
         * - have triggers manipulating the data so we can't match it back up
         *
         * Currently it seems that the order returned from `insert into ...
         * select ... order by ... returning ...` is the same order as the
         * `order by` was, however this is not guaranteed in the documentation
         * and as such cannot be relied upon. Further the pgsql-hackers list
         * explicitly declined guaranteeing this behavior:
         *
         * https://www.postgresql.org/message-id/CAKFQuwbgdJ_xNn0YHWGR0D%2Bv%2B3mHGVqJpG_Ejt96KHoJjs6DkA%40mail.gmail.com
         *
         * So we have to make do with single inserts, alas.
         */
        // We must execute each mutation on its own, but we can at least do so in
        // parallel. Note we return a list of promises, each may reject or resolve
        // without causing the others to reject.
        return indexMap(async (i) => {
            const context = contextDep.at(i);
            const sqlAttributes = [];
            const sqlValues = [];
            for (const { depId, name, pgCodec } of this.attributes) {
                const attVal = values[depId].at(i);
                // `null` is kept, `undefined` is skipped
                if (attVal !== undefined) {
                    const sqlIdent = pg_sql2_1.default.identifier(name);
                    const sqlVal = (0, codecs_js_1.sqlValueWithCodec)(attVal, pgCodec);
                    sqlAttributes.push(sqlIdent);
                    sqlValues.push(sqlVal);
                }
            }
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
                set(name, attVal) {
                    const pgCodec = resource.codec.attributes[name]?.codec;
                    if (!pgCodec) {
                        throw new Error(`Attribute ${name} not recognized on ${resource}`);
                    }
                    const sqlIdent = pg_sql2_1.default.identifier(name);
                    const sqlVal = (0, codecs_js_1.sqlValueWithCodec)(attVal, pgCodec);
                    sqlAttributes.push(sqlIdent);
                    sqlValues.push(sqlVal);
                },
                setBuilder() {
                    return (0, grafast_1.setter)(this);
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
            let compileResult;
            if (sqlAttributes.length > 0) {
                // This is our common path
                const attributes = pg_sql2_1.default.join(sqlAttributes, ", ");
                const values = pg_sql2_1.default.join(sqlValues, ", ");
                const query = (0, pg_sql2_1.default) `insert into ${table} (${attributes}) values (${values})${returning};`;
                compileResult = pg_sql2_1.default.compile(query);
            }
            else {
                // No columns to insert?! Odd... but okay.
                const query = (0, pg_sql2_1.default) `insert into ${table} default values${returning};`;
                compileResult = pg_sql2_1.default.compile(query);
            }
            const { text, values: stmtValues } = compileResult;
            const { rows } = await this.resource.executeMutation({
                context,
                text,
                values: stmtValues,
            });
            return { __proto__: null, m: meta, t: rows[0] ?? [] };
        });
    }
    finalize() {
        if (!this.isFinalized) {
            this.locked = true;
            const resourceSource = this.resource.from;
            if (!pg_sql2_1.default.isSQL(resourceSource)) {
                throw new Error(`Error in ${this}: can only insert into sources defined as SQL, however ${this.resource} has ${(0, inspect_js_1.inspect)(this.resource.from)}`);
            }
            const table = (0, pg_sql2_1.default) `${resourceSource} as ${this.alias}`;
            const fragmentsWithAliases = this.selects.map((frag, idx) => (0, pg_sql2_1.default) `${frag} as ${pg_sql2_1.default.identifier(String(idx))}`);
            const returning = fragmentsWithAliases.length > 0
                ? (0, pg_sql2_1.default) ` returning\n${pg_sql2_1.default.indent(pg_sql2_1.default.join(fragmentsWithAliases, ",\n"))}`
                : pg_sql2_1.default.blank;
            this.finalizeResults = {
                table,
                returning,
            };
        }
        super.finalize();
    }
    [pg_sql2_1.$$toSQL]() {
        return this.alias;
    }
}
exports.PgInsertSingleStep = PgInsertSingleStep;
/**
 * Inserts a row into resource with the given specified attribute values.
 */
function pgInsertSingle(resource, attributes) {
    return new PgInsertSingleStep(resource, attributes);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgInsertSingle, "pgInsertSingle");
//# sourceMappingURL=pgInsertSingle.js.map