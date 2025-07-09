type Transform<T> = (val: string) => T;
/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 *
 * Trusts the data (mostly), so only hook up to trusted Postgres servers.
 */
export declare function makeParseArrayWithTransform<T = string>(transform?: Transform<T>): (str: string) => readonly T[];
export declare const parseArray: (str: string) => readonly string[];
export {};
//# sourceMappingURL=parseArray.d.ts.map