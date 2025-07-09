"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSelectSingleStep = void 0;
exports.pgSelectFromRecord = pgSelectFromRecord;
exports.pgSelectSingleFromRecord = pgSelectSingleFromRecord;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importStar(require("pg-sql2"));
const codecs_js_1 = require("../codecs.js");
const utils_js_1 = require("../utils.js");
const pgClassExpression_js_1 = require("./pgClassExpression.js");
const pgCursor_js_1 = require("./pgCursor.js");
const pgSelect_js_1 = require("./pgSelect.js");
const EMPTY_TUPLE = Object.freeze([]);
// Types that only take a few bytes so adding them to the selection would be
// cheap to do.
const CHEAP_ATTRIBUTE_TYPES = new Set([
    codecs_js_1.TYPES.int2,
    codecs_js_1.TYPES.int,
    codecs_js_1.TYPES.bigint,
    codecs_js_1.TYPES.float,
    codecs_js_1.TYPES.float4,
    codecs_js_1.TYPES.uuid,
    codecs_js_1.TYPES.boolean,
    codecs_js_1.TYPES.date,
    codecs_js_1.TYPES.timestamp,
    codecs_js_1.TYPES.timestamptz,
]);
/**
 * Represents the single result of a unique PgSelectStep. This might be
 * retrieved explicitly by PgSelectStep.single(), or implicitly (via Grafast)
 * by PgSelectStep.item(). Since this is the result of a fetch it does not make
 * sense to support changing `.where` or similar; however we now add methods
 * such as `.get` and `.cursor` which can receive specific properties by
 * telling the PgSelectStep to select the relevant expressions.
 */
class PgSelectSingleStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgSelectSingleStep",
    }; }
    constructor($class, $item, options = Object.create(null)) {
        super();
        this.options = options;
        this.isSyncAndSafe = true;
        this.nullCheckId = null;
        this._coalesceToEmptyObject = false;
        this.typeStepIndexList = null;
        this.scopedSQL = (0, utils_js_1.makeScopedSQL)(this);
        this.nonNullAttribute = null;
        this.nullCheckAttributeIndex = null;
        this.itemStepId = this.addDependency($item);
        this.resource = $class.resource;
        this.pgCodec = this.resource.codec;
        this.mode = $class.mode;
        this.classStepId = $class.id;
        this.peerKey = this.resource.name;
    }
    coalesceToEmptyObject() {
        this._coalesceToEmptyObject = true;
    }
    toStringMeta() {
        return this.resource.name;
    }
    getClassStep() {
        if (this.isOptimized) {
            throw new Error(`Cannot ${this}.getClassStep() after we're optimized.`);
        }
        const plan = this.getStep(this.classStepId);
        if (!(plan instanceof pgSelect_js_1.PgSelectStep)) {
            throw new Error(`Expected ${this.classStepId} (${plan}) to be a PgSelectStep`);
        }
        return plan;
    }
    /** @internal */
    getItemStep() {
        const plan = this.getDep(this.itemStepId);
        return plan;
    }
    /**
     * Do not rely on this, we're going to refactor it to work a different way at some point.
     *
     * @internal
     */
    getSelfNamed() {
        if (this.mode === "aggregate") {
            throw new Error("Invalid call to getSelfNamed on aggregate plan");
        }
        // Hack because I don't want to duplicate the code.
        return this.get("");
    }
    /**
     * Returns a plan representing a named attribute (e.g. column) from the class
     * (e.g. table).
     */
    get(attr) {
        return this.cacheStep("get", attr, () => this._getInternal(attr));
    }
    _getInternal(attr) {
        if (this.mode === "aggregate") {
            throw new Error("Invalid call to .get() on aggregate plan");
        }
        if (!this.resource.codec.attributes && attr !== "") {
            throw new Error(`Cannot call ${this}.get() when the resource codec (${this.resource.codec.name}) has no attributes to get.`);
        }
        const classPlan = this.getClassStep();
        const resourceAttribute = this.resource.codec.attributes?.[attr];
        if (!resourceAttribute && attr !== "") {
            throw new Error(`${this.resource} does not define an attribute named '${String(attr)}'`);
        }
        if (resourceAttribute?.via) {
            const { relation, attribute } = this.resource.resolveVia(resourceAttribute.via, attr);
            return this.singleRelation(relation).get(attribute);
        }
        if (resourceAttribute?.identicalVia) {
            const { relation, attribute } = this.resource.resolveVia(resourceAttribute.identicalVia, attr);
            const $existingPlan = this.existingSingleRelation(relation);
            if ($existingPlan) {
                // Relation exists already; load it from there for efficiency
                return $existingPlan.get(attribute);
            }
            else {
                // Load it from ourself instead
            }
        }
        if (this.options.fromRelation) {
            const [$fromPlan, fromRelationName] = this.options.fromRelation;
            const matchingAttribute = Object.entries($fromPlan.resource.codec.attributes).find(([name, col]) => {
                if (col.identicalVia) {
                    const { relation, attribute } = $fromPlan.resource.resolveVia(col.identicalVia, name);
                    if (attribute === attr && relation === fromRelationName) {
                        return true;
                    }
                }
                return false;
            });
            if (matchingAttribute) {
                return $fromPlan.get(matchingAttribute[0]);
            }
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
        const sqlExpr = (0, pgClassExpression_js_1.pgClassExpression)(this, attr === ""
            ? this.resource.codec
            : this.resource.codec.attributes[attr].codec, resourceAttribute?.notNull);
        const colPlan = resourceAttribute
            ? resourceAttribute.expression
                ? sqlExpr `${pg_sql2_1.default.parens(resourceAttribute.expression(classPlan.alias))}`
                : sqlExpr `${classPlan.alias}.${pg_sql2_1.default.identifier(String(attr))}`
            : sqlExpr `${classPlan.alias}.v`; /* single attribute */
        if (this.nonNullAttribute == null &&
            typeof attr === "string" &&
            attr.length > 0 &&
            resourceAttribute &&
            !resourceAttribute.expression &&
            resourceAttribute.notNull) {
            // We know the row is null iff this attribute is null
            this.nonNullAttribute = { attribute: resourceAttribute, attr };
        }
        return colPlan;
    }
    getMeta(key) {
        return this.getClassStep().getMeta(key);
    }
    /**
     * Returns a plan representing the result of an expression.
     */
    select(fragment, codec, guaranteedNotNull) {
        const sqlExpr = (0, pgClassExpression_js_1.pgClassExpression)(this, codec, guaranteedNotNull);
        return sqlExpr `${this.scopedSQL(fragment)}`;
    }
    /**
     * Advanced method; rather than returning a plan it returns an index.
     * Generally useful for PgClassExpressionStep.
     *
     * @internal
     */
    selectAndReturnIndex(fragment) {
        return this.getClassStep().selectAndReturnIndex(this.scopedSQL(fragment));
    }
    getPgRoot() {
        return this.getClassStep();
    }
    placeholder($step, overrideCodec) {
        return overrideCodec
            ? this.getClassStep().placeholder($step, overrideCodec)
            : this.getClassStep().placeholder($step);
    }
    deferredSQL($step) {
        return this.getClassStep().deferredSQL($step);
    }
    existingSingleRelation(relationIdentifier) {
        if (this.options.fromRelation) {
            const [$fromPlan, fromRelationName] = this.options.fromRelation;
            // check to see if we already came via this relationship
            const reciprocal = this.resource.getReciprocal($fromPlan.resource.codec, fromRelationName);
            if (reciprocal) {
                const reciprocalRelationName = reciprocal[0];
                if (reciprocalRelationName === relationIdentifier) {
                    const reciprocalRelation = reciprocal[1];
                    if (reciprocalRelation.isUnique) {
                        return $fromPlan;
                    }
                }
            }
        }
        return null;
    }
    singleRelation(relationIdentifier) {
        const $existingPlan = this.existingSingleRelation(relationIdentifier);
        if ($existingPlan) {
            return $existingPlan;
        }
        const relation = this.resource.getRelation(relationIdentifier);
        if (!relation || !relation.isUnique) {
            throw new Error(`${String(relationIdentifier)} is not a unique relation on ${this.resource}`);
        }
        const { remoteResource, remoteAttributes, localAttributes } = relation;
        const options = {
            fromRelation: [
                this,
                relationIdentifier,
            ],
        };
        return remoteResource.get(remoteAttributes.reduce((memo, remoteAttribute, attributeIndex) => {
            memo[remoteAttribute] = this.get(localAttributes[attributeIndex]);
            return memo;
        }, Object.create(null)), options);
    }
    manyRelation(relationIdentifier) {
        const relation = this.resource.getRelation(relationIdentifier);
        if (!relation) {
            throw new Error(`${String(relationIdentifier)} is not a relation on ${this.resource}`);
        }
        const { remoteResource, remoteAttributes, localAttributes } = relation;
        return remoteResource.find(remoteAttributes.reduce((memo, remoteAttribute, attributeIndex) => {
            memo[remoteAttribute] = this.get(localAttributes[attributeIndex]);
            return memo;
        }, Object.create(null)));
    }
    record() {
        return (0, pgClassExpression_js_1.pgClassExpression)(this, this.resource.codec, undefined) `${this.getClassStep().alias}`;
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
    /**
     * For compatibility with EdgeCapableStep.
     */
    node() {
        return this;
    }
    deduplicate(peers) {
        // We've been careful to not store anything locally so we shouldn't
        // need to move anything across to the peer.
        return peers.filter((peer) => {
            if (peer.resource !== this.resource) {
                return false;
            }
            if (peer.getClassStep() !== this.getClassStep()) {
                return false;
            }
            if (peer.getItemStep() !== this.getItemStep()) {
                return false;
            }
            return true;
        });
    }
    planForType(type) {
        const poly = this.resource.codec.polymorphism;
        if (poly?.mode === "single") {
            return this;
        }
        else if (poly?.mode === "relational") {
            for (const spec of Object.values(poly.types)) {
                if (spec.name === type.name) {
                    return this.singleRelation(spec.relationName);
                }
            }
            throw new Error(`${this} Could not find matching name for relational polymorphic '${type.name}'`);
        }
        else {
            throw new Error(`${this}: Don't know how to plan this as polymorphic for ${type}`);
        }
    }
    /**
     * The polymorphism if this is a "regular" (non-aggregate) request over a
     * single/relational polymorphic codec; otherwise null.
     */
    singleOrRelationalPolyIfRegular() {
        const poly = this.resource.codec.polymorphism;
        if (this.mode !== "aggregate" &&
            (poly?.mode === "single" || poly?.mode === "relational")) {
            return poly;
        }
        else {
            return null;
        }
    }
    optimize() {
        const poly = this.singleOrRelationalPolyIfRegular();
        if (poly) {
            const $class = this.getClassStep();
            this.typeStepIndexList = poly.typeAttributes.map((col) => {
                const attr = this.resource.codec.attributes[col];
                const expr = (0, pg_sql2_1.default) `${$class.alias}.${pg_sql2_1.default.identifier(String(col))}`;
                return $class.selectAndReturnIndex(attr.codec.castFromPg
                    ? attr.codec.castFromPg(expr)
                    : (0, pg_sql2_1.default) `${expr}::text`);
            });
        }
        else {
            this.typeStepIndexList = null;
        }
        const attributes = this.resource.codec.attributes;
        if (attributes && this.getClassStep().mode !== "aggregate") {
            // We need to see if this row is null. The cheapest way is to select a
            // non-null column, but failing that we invoke the codec's
            // nonNullExpression (indirectly).
            const getSuitableAttribute = () => {
                // We want to find a _cheap_ not-null attribute to select to prove that
                // the row is not null. Critically this must be an attribute that we can
                // always select (i.e. is not prevented by any column-level select
                // privileges).
                for (const attr of Object.keys(attributes)) {
                    const attribute = attributes[attr];
                    if (attribute.notNull &&
                        CHEAP_ATTRIBUTE_TYPES.has(attribute.codec) &&
                        !attribute.restrictedAccess) {
                        return {
                            attribute,
                            attr,
                        };
                    }
                }
                return null;
            };
            const nonNullAttribute = this.nonNullAttribute ?? getSuitableAttribute();
            if (nonNullAttribute != null) {
                const { attribute: { codec }, attr, } = nonNullAttribute;
                const expression = (0, pg_sql2_1.default) `${this}.${pg_sql2_1.default.identifier(attr)}`;
                this.nullCheckAttributeIndex = this.getClassStep().selectAndReturnIndex(codec.castFromPg
                    ? codec.castFromPg(expression)
                    : (0, pg_sql2_1.default) `${pg_sql2_1.default.parens(expression)}::text`);
            }
            else {
                this.nullCheckId = this.getClassStep().getNullCheckIndex();
            }
        }
        return this;
    }
    finalize() {
        const poly = this.singleOrRelationalPolyIfRegular();
        if (poly) {
            this.handlePolymorphism = (val) => {
                if (val == null)
                    return val;
                const typeList = this.typeStepIndexList.map((i) => val[i]);
                const key = String(typeList);
                const entry = poly.types[key];
                if (entry) {
                    return (0, grafast_1.polymorphicWrap)(entry.name, val);
                }
                return null;
            };
        }
        return super.finalize();
    }
    unbatchedExecute(_extra, result) {
        if (result == null) {
            return this._coalesceToEmptyObject ? EMPTY_TUPLE : null;
        }
        else if (this.nullCheckAttributeIndex != null) {
            const nullIfAttributeNull = result[this.nullCheckAttributeIndex];
            if (nullIfAttributeNull == null) {
                return this._coalesceToEmptyObject ? EMPTY_TUPLE : null;
            }
        }
        else if (this.nullCheckId != null) {
            const nullIfExpressionNotTrue = result[this.nullCheckId];
            if (nullIfExpressionNotTrue == null ||
                codecs_js_1.TYPES.boolean.fromPg(nullIfExpressionNotTrue) != true) {
                return this._coalesceToEmptyObject ? EMPTY_TUPLE : null;
            }
        }
        return this.handlePolymorphism ? this.handlePolymorphism(result) : result;
    }
    [pg_sql2_1.$$toSQL]() {
        return this.getClassStep().alias;
    }
}
exports.PgSelectSingleStep = PgSelectSingleStep;
function fromRecord(record) {
    return (0, pg_sql2_1.default) `(select (${record.placeholder}).*)`;
}
/**
 * Given a plan that represents a single record (via
 * PgSelectSingleStep.record()) this turns it back into a PgSelectSingleStep
 */
function pgSelectFromRecord(resource, $record) {
    return new pgSelect_js_1.PgSelectStep({
        resource: resource,
        identifiers: [],
        from: fromRecord,
        args: [{ step: $record, pgCodec: resource.codec }],
        joinAsLateral: true,
    });
}
/**
 * Given a plan that represents a single record (via
 * PgSelectSingleStep.record()) this turns it back into a PgSelectSingleStep
 */
function pgSelectSingleFromRecord(resource, $record) {
    // OPTIMIZE: we should be able to optimise this so that `plan.record()` returns the original record again.
    return pgSelectFromRecord(resource, $record).single();
}
(0, grafast_1.exportAs)("@dataplan/pg", pgSelectFromRecord, "pgSelectFromRecord");
(0, grafast_1.exportAs)("@dataplan/pg", pgSelectSingleFromRecord, "pgSelectSingleFromRecord");
//# sourceMappingURL=pgSelectSingle.js.map