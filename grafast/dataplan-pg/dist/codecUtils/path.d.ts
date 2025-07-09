import type { PgPoint } from "./point.js";
export interface PgPath {
    isOpen: boolean;
    points: PgPoint[];
}
/**
 * Parses the Postgres path syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export declare function parsePath(f: string): PgPath;
/**
 * Stringifies to the Postgres path syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export declare function stringifyPath(path: PgPath): string;
//# sourceMappingURL=path.d.ts.map