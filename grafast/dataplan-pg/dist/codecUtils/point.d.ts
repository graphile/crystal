export interface PgPoint {
    x: number;
    y: number;
}
/**
 * Parses the Postgres point syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
 */
export declare function parsePoint(f: string): PgPoint;
/**
 * Stringifies to the Postgres point syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
 */
export declare function stringifyPoint(point: PgPoint): string;
//# sourceMappingURL=point.d.ts.map