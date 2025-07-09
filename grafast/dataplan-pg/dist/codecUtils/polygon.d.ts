import type { PgPoint } from "./point.js";
export interface PgPolygon {
    points: PgPoint[];
}
/**
 * Parses the Postgres polygon syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export declare function parsePolygon(f: string): PgPolygon;
/**
 * Stringifies to the Postgres polygon syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export declare function stringifyPolygon(polygon: PgPolygon): string;
//# sourceMappingURL=polygon.d.ts.map