"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSingleTablePolymorphicStep = void 0;
exports.pgSingleTablePolymorphic = pgSingleTablePolymorphic;
const grafast_1 = require("grafast");
/**
 * This polymorphic plan is to support polymorphism from a single PostgreSQL
 * table, typically these tables will have a "type" (or similar) attribute that
 * details the type of the data in the row. This class accepts a plan that
 * resolves to the GraphQLObjectType type name (a string), and a second plan
 * that represents a row from this table.
 */
class PgSingleTablePolymorphicStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgSingleTablePolymorphicStep",
    }; }
    constructor($typeName, $row) {
        super();
        this.isSyncAndSafe = true;
        this.typeStepId = this.addDependency($typeName);
        this.rowStepId = this.addDependency($row);
    }
    rowPlan() {
        return this.getDep(this.rowStepId);
    }
    deduplicate(peers) {
        return peers;
    }
    planForType(_type) {
        return this.rowPlan();
    }
    execute({ indexMap, values, }) {
        const valuesDep = values[this.typeStepId];
        return indexMap((i) => {
            const v = valuesDep.at(i);
            return v ? (0, grafast_1.polymorphicWrap)(v) : null;
        });
    }
}
exports.PgSingleTablePolymorphicStep = PgSingleTablePolymorphicStep;
function pgSingleTablePolymorphic($typeName, $row) {
    return new PgSingleTablePolymorphicStep($typeName, $row);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgSingleTablePolymorphic, "pgSingleTablePolymorphic");
//# sourceMappingURL=pgSingleTablePolymorphic.js.map