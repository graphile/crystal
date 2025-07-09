export interface PgLseg {
    a: {
        x: number;
        y: number;
    };
    b: {
        x: number;
        y: number;
    };
}
/**
 * Parses the Postgres line segment syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
 */
export declare function parseLseg(f: string): PgLseg;
/**
 * Stringifies to the Postgres line segment syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
 */
export declare function stringifyLseg(lseg: PgLseg): string;
//# sourceMappingURL=lseg.d.ts.map