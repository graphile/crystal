"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPgClassSingleStep = assertPgClassSingleStep;
exports.makeScopedSQL = makeScopedSQL;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importDefault(require("pg-sql2"));
const pgDeleteSingle_js_1 = require("./steps/pgDeleteSingle.js");
const pgInsertSingle_js_1 = require("./steps/pgInsertSingle.js");
const pgSelectSingle_js_1 = require("./steps/pgSelectSingle.js");
const pgUpdateSingle_js_1 = require("./steps/pgUpdateSingle.js");
function assertPgClassSingleStep(step) {
    if (!(step instanceof pgSelectSingle_js_1.PgSelectSingleStep ||
        step instanceof pgInsertSingle_js_1.PgInsertSingleStep ||
        step instanceof pgUpdateSingle_js_1.PgUpdateSingleStep ||
        step instanceof pgDeleteSingle_js_1.PgDeleteSingleStep)) {
        throw new Error(`Expected a PgSelectSingleStep, PgInsertSingleStep, PgUpdateSingleStep or PgDeleteSingleStep, however we received '${step}'.`);
    }
}
function makeScopedSQL(that) {
    const sqlTransformer = (sql, value) => {
        if (value instanceof grafast_1.ExecutableStep && "pgCodec" in value) {
            if (value.pgCodec) {
                return that.placeholder(value);
            }
            else {
                throw new Error(`${value} has invalid value for pgCodec`);
            }
        }
        else {
            return value;
        }
    };
    return (cb) => typeof cb === "function"
        ? pg_sql2_1.default.withTransformer(sqlTransformer, cb)
        : cb;
}
//# sourceMappingURL=utils.js.map