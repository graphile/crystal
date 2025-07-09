/**
 * The representation of an 'interval' from Postgres. All entries are integers
 * _except_ `seconds` which is floating point
 */
export interface PgInterval {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
/**
 * Parses Postgres' 'interval' syntax. Note we only support
 * `intervalstyle = 'postgres'` right now.
 *
 * @see {@link https://www.postgresql.org/docs/14/datatype-datetime.html#DATATYPE-INTERVAL-OUTPUT}
 */
export declare function parseInterval(interval: string): PgInterval;
/**
 * Stringifies to Postgres' 'interval' syntax
 *
 * @see {@link https://www.postgresql.org/docs/14/datatype-datetime.html#DATATYPE-INTERVAL-INPUT}
 */
export declare function stringifyInterval(interval: PgInterval): string;
//# sourceMappingURL=interval.d.ts.map