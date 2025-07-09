"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSQLForDebugging = formatSQLForDebugging;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
/**
 * `@dataplan/pg` builds SQL queries in a particular format, this function will
 * tweak the queries to add some syntax highlighting to make the queries easier
 * to read.
 *
 * Further, if this is passed with a Postgres error, we'll try and add a
 * pointer that points to the relevant part of the query where the error
 * occurred.
 */
function formatSQLForDebugging(sql, error) {
    const pos = error?.position != null ? parseInt(String(error.position), 10) : null;
    let colourIndex = 0;
    const allowedColours = [
        chalk_1.default.red,
        chalk_1.default.green,
        chalk_1.default.yellow,
        chalk_1.default.blue,
        chalk_1.default.magenta,
        chalk_1.default.cyan,
        chalk_1.default.white,
        chalk_1.default.black,
    ];
    function nextColor() {
        colourIndex = (colourIndex + 1) % allowedColours.length;
        return allowedColours[colourIndex];
    }
    const colours = Object.create(null);
    /* Yep - that's `colour` from English and `ize` from American */
    function colourize(str) {
        if (!colours[str]) {
            colours[str] = nextColor();
        }
        return colours[str].bold.call(null, str);
    }
    function comment(str) {
        return chalk_1.default.inverse(str);
    }
    const lines = sql.split("\n");
    let start = 0;
    const output = [];
    for (const line of lines) {
        const end = start + line.length + 1;
        const colouredSql = line
            .replace(/__[a-z0-9_]+(?:_[0-9]+|__)/g, colourize)
            .replace(/(\/\*.*\*\/|--.*$)/g, comment);
        output.push(colouredSql);
        if (pos != null && pos >= start && pos < end) {
            output.push(chalk_1.default.red("-".repeat(pos - start - 1) + "^ " + error?.message));
        }
        start = end;
    }
    return output.join("\n");
}
//# sourceMappingURL=formatSQLForDebugging.js.map