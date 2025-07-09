"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgManyFilter = void 0;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importDefault(require("pg-sql2"));
const pgTempTable_js_1 = require("../steps/pgTempTable.js");
const pgClassFilter_js_1 = require("./pgClassFilter.js");
class PgManyFilter extends grafast_1.Modifier {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgManyFilter",
    }; }
    constructor($parentFilterPlan, childDataSource, myAttrs, theirAttrs) {
        super($parentFilterPlan);
        this.childDataSource = childDataSource;
        this.myAttrs = myAttrs;
        this.theirAttrs = theirAttrs;
        this.someTemp = null;
        if (myAttrs.length !== theirAttrs.length) {
            throw new Error("Expected the local and remote attributes to have the same number of entries.");
        }
    }
    some() {
        const tempTable = new pgTempTable_js_1.PgTempTable(this.parent, this.childDataSource);
        // Implement the relationship
        this.myAttrs.forEach((attr, i) => {
            tempTable.where((0, pg_sql2_1.default) `${this.parent.alias}.${pg_sql2_1.default.identifier(attr)} = ${tempTable.alias}.${pg_sql2_1.default.identifier(this.theirAttrs[i])}`);
        });
        const $filter = new pgClassFilter_js_1.PgClassFilter(tempTable.wherePlan(), tempTable.alias);
        this.someTemp = tempTable;
        return $filter;
    }
    apply() {
        if (this.someTemp) {
            const conditions = this.someTemp.conditions;
            const from = (0, pg_sql2_1.default) `\nfrom ${this.someTemp.fromExpression()} as ${this.someTemp.alias}`;
            const sqlConditions = pg_sql2_1.default.join(conditions.map((c) => pg_sql2_1.default.parens(pg_sql2_1.default.indent(c))), " and ");
            const where = conditions.length === 0
                ? pg_sql2_1.default.blank
                : conditions.length === 1
                    ? (0, pg_sql2_1.default) `\nwhere ${sqlConditions}`
                    : (0, pg_sql2_1.default) `\nwhere\n${pg_sql2_1.default.indent(sqlConditions)}`;
            this.parent.where((0, pg_sql2_1.default) `exists(${pg_sql2_1.default.indent((0, pg_sql2_1.default) `select 1${from}${where}`)})`);
        }
    }
}
exports.PgManyFilter = PgManyFilter;
//# sourceMappingURL=pgManyFilter.js.map