/**
 * This is an adaptor for the `pg` module.
 */
import "../interfaces.js";
import type { GrafastSubscriber, PromiseOrDirect } from "grafast";
import type { Pool, PoolClient, PoolConfig } from "pg";
import type { PgClient, WithPgClient } from "../executor.js";
import type { MakePgServiceOptions } from "../interfaces.js";
declare global {
    namespace Grafast {
        interface Context {
            pgSettings: Record<string, string | undefined> | null;
            withPgClient: WithPgClient<NodePostgresPgClient>;
            pgSubscriber: PgSubscriber | null;
        }
    }
    namespace GraphileConfig {
        interface PgAdaptors {
            "@dataplan/pg/adaptors/pg": {
                adaptorSettings: PgAdaptorSettings | undefined;
                makePgServiceOptions: PgAdaptorMakePgServiceOptions;
                client: NodePostgresPgClient;
            };
        }
    }
}
declare const $$isSetup: unique symbol;
export interface NodePostgresPgClient extends PgClient {
    rawClient: PoolClient;
}
declare const $$queue: unique symbol;
declare module "pg" {
    interface PoolClient {
        [$$queue]?: Promise<any> | null;
        [$$isSetup]?: true;
    }
}
/**
 * Returns a `withPgClient` for the given `Pool` instance.
 */
export declare function makePgAdaptorWithPgClient(pool: Pool, release?: () => PromiseOrDirect<void>): WithPgClient<NodePostgresPgClient>;
/**
 * Returns a `withPgClient` for the given `PoolClient` instance. ONLY
 * SUITABLE FOR TESTS!
 *
 */
export declare function makeWithPgClientViaPgClientAlreadyInTransaction(pgClient: PoolClient, alreadyInTransaction?: boolean): WithPgClient<NodePostgresPgClient>;
export interface PgAdaptorSettings extends CommonPgAdaptorAndServiceSettings {
    /** ONLY FOR USE IN TESTS! */
    poolClient?: PoolClient;
    /** ONLY FOR USE IN TESTS! */
    poolClientIsInTransaction?: boolean;
    /** ONLY FOR USE IN TESTS! */
    superuserPoolClient?: PoolClient;
    /** ONLY FOR USE IN TESTS! */
    superuserPoolClientIsInTransaction?: boolean;
}
interface CommonPgAdaptorAndServiceSettings {
    pool?: Pool;
    poolConfig?: Omit<PoolConfig, "connectionString">;
    connectionString?: string;
    /** For installing the watch fixtures */
    superuserPool?: Pool;
    /** For installing the watch fixtures */
    superuserPoolConfig?: Omit<PoolConfig, "connectionString">;
    /** For installing the watch fixtures */
    superuserConnectionString?: string;
}
/** @deprecated Use PgAdaptorSettings instead. */
export type PgAdaptorOptions = PgAdaptorSettings;
export declare function createWithPgClient(options?: PgAdaptorSettings, variant?: "SUPERUSER" | string | null): WithPgClient<NodePostgresPgClient>;
/**
 * This class provides helpers for Postgres' LISTEN/NOTIFY pub/sub
 * implementation. We aggregate all LISTEN/NOTIFY events so that we can supply
 * them all via a single pgClient. We grab and release this client from/to the
 * pool automatically. If the Postgres connection is interrupted then we'll
 * automatically reconnect and re-establish the LISTENs, however _events can be
 * lost_ when this happens, so you should be careful that Postgres connections
 * will not be prematurely terminated in general.
 */
export declare class PgSubscriber<TTopics extends {
    [key: string]: string;
} = {
    [key: string]: string;
}> implements GrafastSubscriber<TTopics> {
    private pool;
    private topics;
    private eventEmitter;
    private alive;
    constructor(pool: Pool);
    private recordNotification;
    subscribe<TTopic extends keyof TTopics>(topic: TTopic): AsyncIterableIterator<TTopics[TTopic]>;
    private listen;
    private unlisten;
    private subscribedTopics;
    private sync;
    private syncWithClient;
    private resetClient;
    private listeningClient;
    private listeningClientPromise;
    private getClient;
    release(): void;
    private promise;
    private chain;
}
export interface PgAdaptorMakePgServiceOptions extends MakePgServiceOptions, CommonPgAdaptorAndServiceSettings {
}
export declare function makePgService(options: PgAdaptorMakePgServiceOptions): GraphileConfig.PgServiceConfiguration<"@dataplan/pg/adaptors/pg">;
export {};
//# sourceMappingURL=pg.d.ts.map