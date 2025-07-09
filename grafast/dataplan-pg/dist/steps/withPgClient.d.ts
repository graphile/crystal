import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { Step } from "grafast";
import type { PgClient, PgExecutor, WithPgClient } from "../executor";
export type WithPgClientStepCallback<TData, TResult, TPgClient extends PgClient = PgClient> = (client: TPgClient, data: TData) => Promise<TResult>;
/**
 * Runs the given `callback` against the given `executor` using any plan data
 * from `$data` (which can be `constant(null)` if you don't need it). Typically
 * useful for running custom transactions.
 */
export declare class WithPgClientStep<TData = any, TResult = any, TPgClient extends PgClient = PgClient> extends Step<TResult> {
    private callback;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * Tells us what we're dealing with - data type, columns, where to insert it,
     * what it's called, etc.
     */
    readonly executor: PgExecutor;
    /**
     * The id for the PostgreSQL context plan.
     */
    private contextId;
    /**
     * The id for the data plan.
     */
    private dataId;
    constructor(executor: PgExecutor, $data: Step<TData>, callback: WithPgClientStepCallback<TData, TResult, TPgClient>);
    execute({ indexMap, values, }: ExecutionDetails<[
        {
            pgSettings: any;
            withPgClient: WithPgClient<TPgClient>;
        },
        TData
    ]>): GrafastResultsList<TResult>;
}
export declare function withPgClient<TData, TResult, TPgClient extends PgClient = PgClient>(executor: PgExecutor, $data: Step<TData> | (TData extends null | undefined ? null | undefined : never), callback: WithPgClientStepCallback<TData, TResult, TPgClient>): WithPgClientStep<TData, TResult, TPgClient>;
export declare function withPgClientTransaction<TData, TResult, TPgClient extends PgClient = PgClient>(executor: PgExecutor, $data: Step<TData> | (TData extends null | undefined ? null | undefined : never), callback: WithPgClientStepCallback<TData, TResult, TPgClient>): WithPgClientStep<TData, TResult, TPgClient>;
//# sourceMappingURL=withPgClient.d.ts.map