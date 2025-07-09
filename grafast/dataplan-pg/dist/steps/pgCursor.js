"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgCursorStep = void 0;
const grafast_1 = require("grafast");
/**
 * Given a PgSelectSingleStep, this will build a cursor by looking at all the
 * orders applied and then fetching them and building a cursor string from
 * them.
 */
class PgCursorStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgCursorStep",
    }; }
    constructor($item, $cursorDetails) {
        super();
        this.isSyncAndSafe = true;
        this.itemDepId = this.addDependency($item);
        this.cursorDetailsDepId = this.addDependency($cursorDetails);
    }
    unbatchedExecute(_extra, itemTuple, cursorDetails) {
        if (itemTuple == null || cursorDetails == null)
            return null;
        const { digest, indicies } = cursorDetails;
        const cursorTuple = [digest];
        let hasNonNull = false;
        for (let i = 0, l = indicies.length; i < l; i++) {
            const { index, codec } = indicies[i];
            const orderVal = itemTuple[index];
            if (!hasNonNull && orderVal != null) {
                hasNonNull = true;
            }
            cursorTuple.push(codec.fromPg(orderVal));
        }
        if (!hasNonNull)
            return null;
        return Buffer.from(JSON.stringify(cursorTuple), "utf8").toString("base64");
    }
}
exports.PgCursorStep = PgCursorStep;
//# sourceMappingURL=pgCursor.js.map