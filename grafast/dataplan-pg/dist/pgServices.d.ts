import type { PgClient, WithPgClient } from "./executor.js";
type PromiseOrDirect<T> = T | PromiseLike<T>;
/** @experimental */
export interface PgAdaptor<TAdaptor extends keyof GraphileConfig.PgAdaptors = keyof GraphileConfig.PgAdaptors> {
    createWithPgClient: (adaptorSettings: GraphileConfig.PgAdaptors[TAdaptor]["adaptorSettings"], variant?: "SUPERUSER" | string | null) => PromiseOrDirect<WithPgClient<GraphileConfig.PgAdaptors[TAdaptor]["client"]>>;
    makePgService: (options: GraphileConfig.PgAdaptors[TAdaptor]["makePgServiceOptions"]) => GraphileConfig.PgServiceConfiguration<TAdaptor>;
}
/**
 * Is "thenable".
 */
export declare function isPromiseLike<T>(t: T | Promise<T> | PromiseLike<T>): t is PromiseLike<T>;
/**
 * Get or build the 'withPgClient' callback function for a given database
 * config, caching it to make future lookups faster.
 */
export declare function getWithPgClientFromPgService<TAdaptor extends keyof GraphileConfig.PgAdaptors = keyof GraphileConfig.PgAdaptors>(config: GraphileConfig.PgServiceConfiguration<TAdaptor>): PromiseOrDirect<WithPgClient<GraphileConfig.PgAdaptors[TAdaptor]["client"]>>;
export declare function withPgClientFromPgService<T>(config: GraphileConfig.PgServiceConfiguration, pgSettings: Record<string, string | undefined> | null, callback: (client: PgClient) => T | Promise<T>): Promise<T>;
export declare function withSuperuserPgClientFromPgService<T>(config: GraphileConfig.PgServiceConfiguration, pgSettings: Record<string, string | undefined> | null, callback: (client: PgClient) => T | Promise<T>): Promise<T>;
export {};
//# sourceMappingURL=pgServices.d.ts.map