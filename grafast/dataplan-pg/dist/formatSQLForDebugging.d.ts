/**
 * `@dataplan/pg` builds SQL queries in a particular format, this function will
 * tweak the queries to add some syntax highlighting to make the queries easier
 * to read.
 *
 * Further, if this is passed with a Postgres error, we'll try and add a
 * pointer that points to the relevant part of the query where the error
 * occurred.
 */
export declare function formatSQLForDebugging(sql: string, error?: {
    position?: string | number;
    message?: string;
} | null): string;
//# sourceMappingURL=formatSQLForDebugging.d.ts.map