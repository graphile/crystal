"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePoint = parsePoint;
exports.stringifyPoint = stringifyPoint;
const grafast_1 = require("grafast");
/**
 * Parses the Postgres point syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
 */
function parsePoint(f) {
    if (f[0] === "(" && f[f.length - 1] === ")") {
        const [x, y] = f
            .slice(1, f.length - 1)
            .split(",")
            .map((f) => parseFloat(f));
        return { x, y };
    }
    else {
        throw new grafast_1.SafeError(`Failed to parse point ${f}`);
    }
}
/**
 * Stringifies to the Postgres point syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
 */
function stringifyPoint(point) {
    return `(${point.x},${point.y})`;
}
//# sourceMappingURL=point.js.map