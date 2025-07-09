"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgBooleanFilter = void 0;
const grafast_1 = require("grafast");
const pg_sql2_1 = require("pg-sql2");
class PgBooleanFilter extends grafast_1.Modifier {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgBooleanFilter",
    }; }
    constructor(classFilter, expression) {
        super(classFilter);
        this.expression = expression;
        this.conditions = [];
        this.havingConditions = [];
        this.alias = classFilter.alias;
    }
    where(condition) {
        this.conditions.push(condition);
    }
    having(condition) {
        this.havingConditions.push(condition);
    }
    apply() {
        this.conditions.forEach((condition) => this.parent.where(condition));
        this.havingConditions.forEach((condition) => this.parent.having(condition));
    }
    [pg_sql2_1.$$toSQL]() {
        return this.alias;
    }
}
exports.PgBooleanFilter = PgBooleanFilter;
//# sourceMappingURL=pgBooleanFilter.js.map