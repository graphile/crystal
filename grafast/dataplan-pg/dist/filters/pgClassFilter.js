"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgClassFilter = void 0;
const grafast_1 = require("grafast");
const pg_sql2_1 = require("pg-sql2");
class PgClassFilter extends grafast_1.Modifier {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgClassFilter",
    }; }
    constructor(parent, alias) {
        super(parent);
        this.alias = alias;
        this.conditions = [];
        this.havingConditions = [];
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
exports.PgClassFilter = PgClassFilter;
//# sourceMappingURL=pgClassFilter.js.map