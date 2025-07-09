"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCircle = parseCircle;
exports.stringifyCircle = stringifyCircle;
const grafast_1 = require("grafast");
const point_js_1 = require("./point.js");
/**
 * Parses the Postgres circle syntax
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9}
 */
function parseCircle(f) {
    if (f[0] === "<" && f[f.length - 1] === ">") {
        const [x, y, r] = f
            .slice(1, f.length - 1)
            .replace(/[()]/g, "")
            .split(",")
            .map((f) => parseFloat(f));
        return {
            center: { x, y },
            radius: r,
        };
    }
    else {
        throw new grafast_1.SafeError(`Failed to parse circle ${f}`);
    }
}
/**
 * Stringifies to the Postgres circle syntax
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9}
 */
function stringifyCircle(circle) {
    return `<${(0, point_js_1.stringifyPoint)(circle.center)},${circle.radius}>`;
}
//# sourceMappingURL=circle.js.map