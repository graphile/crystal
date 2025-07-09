export interface PgHStore {
    [key: string]: string | null;
}
/**
 * Parses the Postgres HStore syntax
 *
 * @see {@link https://www.postgresql.org/docs/14/hstore.html#id-1.11.7.25.5}
 */
export declare function parseHstore(hstoreString: string): PgHStore;
/**
 * Stringifies to the Postgres HStore syntax
 *
 * @see {@link https://www.postgresql.org/docs/14/hstore.html#id-1.11.7.25.5}
 */
export declare function stringifyHstore(o: PgHStore | null): string | null;
//# sourceMappingURL=hstore.d.ts.map