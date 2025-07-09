import type { PgCodecExtensions, PgCodecRefExtensions, PgCodecRelationExtensions, PgResourceExtensions } from "@dataplan/pg";
type ArrayOrDirect<T> = Array<T> | T;
/**
 * Takes a smart tags object and extracts the 'behavior' (or 'behaviour')
 * property and coerces it to be a string.
 */
export declare function getBehavior(extensions: ArrayOrDirect<Partial<PgResourceExtensions | PgCodecRelationExtensions | PgCodecExtensions | PgCodecRefExtensions> | undefined>): GraphileBuild.BehaviorString;
export {};
//# sourceMappingURL=behavior.d.ts.map