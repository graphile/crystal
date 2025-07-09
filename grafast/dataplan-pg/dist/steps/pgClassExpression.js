"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgClassExpressionStep = void 0;
exports.pgClassExpression = pgClassExpression;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importStar(require("pg-sql2"));
const pgDeleteSingle_js_1 = require("./pgDeleteSingle.js");
const pgInsertSingle_js_1 = require("./pgInsertSingle.js");
const pgSelectSingle_js_1 = require("./pgSelectSingle.js");
const pgUnionAll_js_1 = require("./pgUnionAll.js");
const pgUpdateSingle_js_1 = require("./pgUpdateSingle.js");
// const debugPlan = debugFactory("@dataplan/pg:PgClassExpressionStep:plan");
// const debugExecute = debugFactory( "@dataplan/pg:PgClassExpressionStep:execute",);
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");
/**
 * A plan for selecting a attribute or attribute-like expression. Keep in mind that
 * a attribute might not be a scalar (could be a list, compound type, JSON,
 * geometry, etc), so this might not be a "leaf". The result of this might be used as the input
 * of another layer of plan.
 */
class PgClassExpressionStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgClassExpressionStep",
    }; }
    constructor($table, pgCodec, strings, dependencies = [], guaranteedNotNull) {
        super();
        this.pgCodec = pgCodec;
        this.guaranteedNotNull = guaranteedNotNull;
        this.isSyncAndSafe = true;
        /**
         * This is the numeric index of this expression within the grandparent
         * PgSelectStep's selection.
         */
        this.attrIndex = null;
        this.needsPolymorphicUnwrap =
            $table instanceof pgUnionAll_js_1.PgUnionAllSingleStep &&
                $table.getClassStep().mode === "normal";
        this.needsTupleAccess =
            $table instanceof pgInsertSingle_js_1.PgInsertSingleStep ||
                $table instanceof pgUpdateSingle_js_1.PgUpdateSingleStep ||
                $table instanceof pgDeleteSingle_js_1.PgDeleteSingleStep;
        const $row = this.needsTupleAccess ? (0, grafast_1.access)($table, "t") : $table;
        this.rowDependencyId = this.addDependency($row);
        if (strings.length !== dependencies.length + 1) {
            throw new Error(`Invalid call to PgClassExpressionStep; should have exactly one more string (found ${strings.length}) than dependency (found ${dependencies.length}). Recommend using the tagged template literal helper pgClassExpression.`);
        }
        const badStringIndex = strings.findIndex((s) => typeof s !== "string");
        if (badStringIndex >= 0) {
            throw new Error(`Received a non-string at index ${badStringIndex} to strings argument of ${this}.`);
        }
        const fragments = dependencies.map((stepOrSql, i) => {
            if (!stepOrSql) {
                throw new Error(`Invalid stepOrSql at index ${i}`);
            }
            if (pg_sql2_1.default.isSQL(stepOrSql)) {
                return stepOrSql;
            }
            else if (stepOrSql instanceof PgClassExpressionStep &&
                stepOrSql.getParentStep() === $table) {
                // TODO: when we defer placeholders until finalize we'll need to copy
                // deps/etc
                return stepOrSql.expression;
            }
            else if ($table instanceof pgSelectSingle_js_1.PgSelectSingleStep) {
                // TODO: when we defer placeholders until finalize we'll need to store
                // deps/etc
                const placeholder = $table.placeholder(stepOrSql);
                return placeholder;
            }
            else {
                throw new Error(`Cannot use placeholders when parent plan is ${$table}`);
            }
        });
        // We're pretending we called `sql` directly by passing the template
        // strings array.
        this.expression = (0, pg_sql2_1.default)(strings, ...fragments);
    }
    toStringMeta() {
        if (!this.expression) {
            return "???";
        }
        const expr = pg_sql2_1.default.compile(this.expression);
        if (expr.text.length > 23) {
            return (expr.text.slice(0, 10) + "..." + expr.text.slice(expr.text.length - 10));
        }
        else {
            return expr.text;
        }
    }
    /* Here's the proper type of this function, but that makes using it painful.
      ```ts
      public get<
        TAttr extends TExpressionCodec extends PgCodec<
          any,
          undefined,
          infer U,
          any,
          any,
          any,
          any
        >
          ? keyof U
          : keyof GetPgCodecAttributes<TExpressionCodec>,
      >(
        attributeName: TAttr,
      ): TExpressionCodec extends PgCodec<
        any,
        undefined,
        infer U,
        any,
        any,
        any,
        any
      >
        ? AccessStep<U>
        : PgClassExpressionStep<
            GetPgCodecAttributes<TExpressionCodec>[TAttr]["codec"],
            TResource
          > {
      ```
  
      Instead, we'll lie and ignore the `AccessStep` case
    */
    get(attributeName) {
        return this.cacheStep("get", attributeName, () => this._getInternal(attributeName));
    }
    _getInternal(attributeName) {
        const attributes = this.pgCodec.attributes;
        if (attributes === undefined) {
            // Fall back to access, since this could be a 'point' or similar type that doesn't have attributes in Postgres but does in JS.
            return (0, grafast_1.access)(this, attributeName);
        }
        const attribute = attributes[attributeName];
        if (!attribute) {
            throw new Error(`Cannot call ${this}.get('${String(attributeName)}') because this does not have that attribute; supported attributes: '${Object.keys(attributes).join("', '")}'.`);
        }
        if (attribute.via) {
            throw new Error(`Cannot call ${this}.get('${String(attributeName)}') because 'via' is not yet supported here - please raise an issue (or, even better, a pull request!).`);
        }
        if (attribute.expression) {
            throw new Error(`Cannot call ${this}.get('${String(attributeName)}') because 'expression' is not yet supported here - please raise an issue (or, even better, a pull request!).`);
        }
        const sqlExpr = pgClassExpression(this.getParentStep(), attribute.codec, attribute.notNull);
        return sqlExpr `${pg_sql2_1.default.parens(this.expression, true)}.${pg_sql2_1.default.identifier(attributeName)}`;
    }
    getParentStep() {
        const $row = this.getDep(this.rowDependencyId);
        const step = this.needsTupleAccess
            ? $row.getParentStep()
            : $row;
        if (!(step instanceof pgSelectSingle_js_1.PgSelectSingleStep) &&
            !(step instanceof pgInsertSingle_js_1.PgInsertSingleStep) &&
            !(step instanceof pgUpdateSingle_js_1.PgUpdateSingleStep) &&
            !(step instanceof pgDeleteSingle_js_1.PgDeleteSingleStep) &&
            !(step instanceof pgUnionAll_js_1.PgUnionAllSingleStep)) {
            throw new Error(`Expected ${step} to be a PgSelectSingleStep | PgInsertSingleStep | PgUpdateSingleStep | PgDeleteSingleStep | PgUnionAllSingleStep`);
        }
        return step;
    }
    getMeta(key) {
        return this.getParentStep().getMeta(key);
    }
    optimize() {
        this.attrIndex = this.getParentStep().selectAndReturnIndex(this.pgCodec.castFromPg
            ? this.pgCodec.castFromPg(this.expression, this.guaranteedNotNull)
            : (0, pg_sql2_1.default) `${pg_sql2_1.default.parens(this.expression)}::text`);
        return this;
    }
    unbatchedExecute(_extra, v) {
        if (v == null) {
            return null;
        }
        const rawValue = v[this.attrIndex];
        if (rawValue == null) {
            return null;
        }
        else {
            return this.pgCodec.fromPg(rawValue);
        }
    }
    deduplicate(peers) {
        const parentPlan = this.getParentStep();
        const classPlan = parentPlan instanceof pgSelectSingle_js_1.PgSelectSingleStep
            ? parentPlan.getClassStep()
            : null;
        const symbolSubstitutes = classPlan?._symbolSubstitutes;
        const options = symbolSubstitutes ? { symbolSubstitutes } : undefined;
        return peers.filter((p) => pg_sql2_1.default.isEquivalent(this.expression, p.expression, options));
    }
    [pg_sql2_1.$$toSQL]() {
        return this.expression;
    }
    toSQL() {
        return this.expression;
    }
}
exports.PgClassExpressionStep = PgClassExpressionStep;
/**
 * This higher order function takes a table and codec as input and returns a
 * tagged template literal function that you can use to build an SQL expression
 * that will be selected.
 */
function pgClassExpression(table, codec, guaranteedNotNull) {
    return (strings, ...dependencies) => {
        return new PgClassExpressionStep(table, codec, strings, dependencies, codec.notNull || guaranteedNotNull);
    };
}
(0, grafast_1.exportAs)("@dataplan/pg", pgClassExpression, "pgClassExpression");
//# sourceMappingURL=pgClassExpression.js.map