export interface PgLine {
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
 * Parses the Postgres line syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE
 */
export declare function parseLine(f: string): PgLine;
/**
 * Stringifies to the Postgres line syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE
 */
export declare function stringifyLine(line: PgLine): string;
//# sourceMappingURL=line.d.ts.map