import type { ExecutableStep, ExecutionEventEmitter, GrafastValuesList, ObjectStep, PromiseOrDirect } from "grafast";
import type { SQLRawValue } from "pg-sql2";
export interface PgClientQuery {
    /** The query string */
    text: string;
    /** The values to put in the placeholders */
    values?: Array<any>;
    /** An optimisation, to avoid you having to decode attribute names */
    arrayMode?: boolean;
    /** For prepared statements */
    name?: string;
}
export interface PgClientResult<TData> {
    /**
     * For `SELECT` or `INSERT/UPDATE/DELETE ... RETURNING` this will be the list
     * of rows returned.
     */
    rows: readonly TData[];
    /**
     * For `INSERT/UPDATE/DELETE` without `RETURNING`, this will be the number of
     * rows created/updated/deleted.
     */
    rowCount: number | null;
}
/**
 * This is a generic interface that your Postgres client must honor; have a
 * look at adaptors/pg.ts for an example of a compliant implementation that
 * uses the `pg` module, but you should be able to write an adaptor for many
 * different Postgres drivers.
 */
export interface PgClient {
    query<TData>(opts: PgClientQuery): Promise<PgClientResult<TData>>;
    withTransaction<T>(callback: (client: this) => Promise<T>): Promise<T>;
}
export interface WithPgClient<TPgClient extends PgClient = PgClient> {
    <T>(pgSettings: Record<string, string | undefined> | null, callback: (client: TPgClient) => T | Promise<T>): Promise<T>;
    release?(): PromiseOrDirect<void>;
}
export type PgExecutorContext<TSettings = any, TPgClient extends PgClient = PgClient> = {
    pgSettings: TSettings;
    withPgClient: WithPgClient<TPgClient>;
};
export type PgExecutorContextPlans<TSettings = any, TPgClient extends PgClient = PgClient> = {
    pgSettings: ExecutableStep<TSettings>;
    withPgClient: ExecutableStep<WithPgClient<TPgClient>>;
};
export type PgExecutorInput<TInput> = {
    context: PgExecutorContext;
    queryValues: ReadonlyArray<TInput>;
};
export type PgExecutorOptions = {
    text: string;
    rawSqlValues: Array<SQLRawValue>;
    identifierIndex?: number | null;
    name?: string;
    eventEmitter: ExecutionEventEmitter | undefined;
    useTransaction?: boolean;
};
export type PgExecutorMutationOptions = {
    context: PgExecutorContext;
    text: string;
    values: ReadonlyArray<SQLRawValue>;
};
export type PgExecutorSubscribeOptions = {
    context: PgExecutorContext;
    topic: string;
};
/**
 * Represents a PostgreSQL database connection, can be used for issuing queries
 * to the database. Used by PgResource but also directly by things like
 * PgSimpleFunctionCallStep. Was once PgDataSource itself. Multiple PgExecutors
 * can exist in the same schema. PgExecutor is also responsible for things like
 * caching.
 */
export declare class PgExecutor<const TName extends string = string, TSettings = any> {
    name: TName;
    private contextCallback;
    private $$cache;
    constructor(options: {
        name: TName;
        context: () => ObjectStep<PgExecutorContextPlans<TSettings>>;
    });
    toString(): string;
    context(): ObjectStep<PgExecutorContextPlans<TSettings>>;
    private _executeWithClient;
    private _execute;
    private withTransaction;
    executeWithCache<TInput = any, TOutput = any>(values: GrafastValuesList<PgExecutorInput<TInput>>, common: PgExecutorOptions): Promise<{
        values: GrafastValuesList<ReadonlyArray<TOutput>>;
    }>;
    executeWithoutCache<TInput = any, TOutput = any>(values: GrafastValuesList<PgExecutorInput<TInput>>, common: PgExecutorOptions): Promise<{
        values: GrafastValuesList<ReadonlyArray<TOutput>>;
    }>;
    private _executeWithOrWithoutCache;
    /**
     * Returns a list of streams (async iterables), one for each entry in
     * `values`, for the results from the cursor defined by running the query
     * `common.text` with the given variables.
     */
    executeStream<TInput = any, TOutput = any>(values: GrafastValuesList<PgExecutorInput<TInput>>, common: PgExecutorOptions): Promise<{
        streams: Array<AsyncIterable<TOutput> | PromiseLike<never>>;
    }>;
    executeMutation<TData>(options: PgExecutorMutationOptions): Promise<PgClientResult<TData>>;
}
//# sourceMappingURL=executor.d.ts.map