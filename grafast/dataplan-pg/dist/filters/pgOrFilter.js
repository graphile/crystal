"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgOrFilter = void 0;
const grafast_1 = require("grafast");
const pg_sql2_1 = require("pg-sql2");
class PgOrFilter extends grafast_1.Modifier {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgOrFilter",
    }; }
    constructor($classFilterPlan) {
        super($classFilterPlan);
        this.conditions = [];
        this.havingConditions = [];
        this.alias = $classFilterPlan.alias;
    }
    where(condition) {
        this.conditions.push(condition);
    }
    having(condition) {
        this.havingConditions.push(condition);
    }
    apply() {
        if (this.conditions.length > 0) {
            this.parent.where((0, pg_sql2_1.sql) `(${pg_sql2_1.sql.join(this.conditions.map((frag) => pg_sql2_1.sql.indent(pg_sql2_1.sql.parens(frag))), "\nOR\n")})`);
        }
        if (this.havingConditions.length > 0) {
            this.parent.having((0, pg_sql2_1.sql) `(${pg_sql2_1.sql.join(this.havingConditions.map((frag) => pg_sql2_1.sql.indent(pg_sql2_1.sql.parens(frag))), "\nOR\n")})`);
        }
    }
    [pg_sql2_1.$$toSQL]() {
        return this.alias;
    }
}
exports.PgOrFilter = PgOrFilter;
//# sourceMappingURL=pgOrFilter.js.map