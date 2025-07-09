export interface PgBox {
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
 * Parses the Postgres box syntax.
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-BOX}
 */
export declare function parseBox(f: string): PgBox;
/**
 * Stringifies a box to the Postgres box syntax.
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-BOX}
 */
export declare function stringifyBox(box: PgBox): string;
//# sourceMappingURL=box.d.ts.map