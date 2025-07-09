import type { PgPoint } from "./point.js";
export interface PgCircle {
    center: PgPoint;
    radius: number;
}
/**
 * Parses the Postgres circle syntax
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9}
 */
export declare function parseCircle(f: string): PgCircle;
/**
 * Stringifies to the Postgres circle syntax
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9}
 */
export declare function stringifyCircle(circle: PgCircle): string;
//# sourceMappingURL=circle.d.ts.map