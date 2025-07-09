"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePolygon = parsePolygon;
exports.stringifyPolygon = stringifyPolygon;
const grafast_1 = require("grafast");
const point_js_1 = require("./point.js");
/**
 * Parses the Postgres polygon syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
function parsePolygon(f) {
    if (f[0] === "(" && f[f.length - 1] === ")") {
        const xsAndYs = f
            //.slice(1, f.length - 1)
            .replace(/[()]/g, "")
            .split(",")
            .map((f) => parseFloat(f));
        if (xsAndYs.length % 2 !== 0) {
            throw new grafast_1.SafeError("Invalid polygon representation");
        }
        const points = [];
        for (let i = 0, l = xsAndYs.length; i < l; i += 2) {
            points.push({ x: xsAndYs[i], y: xsAndYs[i + 1] });
        }
        return {
            points,
        };
    }
    else {
        throw new grafast_1.SafeError(`Failed to parse polygon`);
    }
}
/**
 * Stringifies to the Postgres polygon syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
function stringifyPolygon(polygon) {
    return polygon.points.map(point_js_1.stringifyPoint).join(",");
}
//# sourceMappingURL=polygon.js.map