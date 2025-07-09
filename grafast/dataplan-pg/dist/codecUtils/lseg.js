"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLseg = parseLseg;
exports.stringifyLseg = stringifyLseg;
const grafast_1 = require("grafast");
/**
 * Parses the Postgres line segment syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
 */
function parseLseg(f) {
    if (f[0] === "[" && f[f.length - 1] === "]") {
        const [x1, y1, x2, y2] = f
            .slice(1, f.length - 1)
            .replace(/[()]/g, "")
            .split(",")
            .map((f) => parseFloat(f));
        return {
            a: { x: x1, y: y1 },
            b: { x: x2, y: y2 },
        };
    }
    else {
        throw new grafast_1.SafeError(`Failed to parse lseg ${f}`);
    }
}
/**
 * Stringifies to the Postgres line segment syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
 */
function stringifyLseg(lseg) {
    return `${lseg.a.x},${lseg.a.y},${lseg.b.x},${lseg.b.y}`;
}
//# sourceMappingURL=lseg.js.map