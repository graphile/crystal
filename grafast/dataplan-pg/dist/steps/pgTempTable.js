"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgTempTable = void 0;
const pg_sql2_1 = require("pg-sql2");
const pgCondition_js_1 = require("./pgCondition.js");
class PgTempTable {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgTempTable",
    }; }
    constructor(parent, resource) {
        this.parent = parent;
        this.resource = resource;
        this.conditions = [];
        this.alias = pg_sql2_1.sql.identifier(Symbol(`${resource.name}_filter`));
    }
    where(condition) {
        this.conditions.push(condition);
    }
    wherePlan() {
        return new pgCondition_js_1.PgCondition(this);
    }
    fromExpression() {
        const from = this.resource.from;
        if (typeof from === "function") {
            throw new Error("PgTempTable doesn't support function sources yet.");
        }
        else {
            return from;
        }
    }
}
exports.PgTempTable = PgTempTable;
//# sourceMappingURL=pgTempTable.js.map