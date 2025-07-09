import type { ExecutableStep, ExecutionDetails, GrafastResultsList, PageInfoCapableStep } from "grafast";
import { ConnectionStep, UnbatchedStep } from "grafast";
import type { PgCursorStep } from "./pgCursor.js";
import type { PgSelectParsedCursorStep, PgSelectStep } from "./pgSelect.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgUnionAllSingleStep, PgUnionAllStep } from "./pgUnionAll.js";
/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * Invoking PgPageInfoStep should have no direct overhead (e.g.
 * `pageInfo { __typename }` is free); cost should not be incurred until one of
 * the submethods is called.
 *
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
export declare class PgPageInfoStep<TStep extends PgSelectStep<any> | PgUnionAllStep<any, any>> extends UnbatchedStep<any> implements PageInfoCapableStep {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private connectionStepId;
    constructor(connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>);
    /**
     * Returns true if the following hold:
     *
     * - first is set
     * - last is not set
     * - if first had been one larger, another record would have been returned.
     *
     * In all other cases, false is returned.
     *
     * @see {@link https://relay.dev/graphql/connections.htm#HasNextPage()}
     */
    hasNextPage(): ExecutableStep<boolean>;
    /**
     * Returns true if the following hold:
     *
     * - last is set
     * - first is not set
     * - if last had been one larger, another record would have been returned.
     *
     * In all other cases, false is returned.
     *
     * @see {@link https://relay.dev/graphql/connections.htm#HasPreviousPage()}
     */
    hasPreviousPage(): ExecutableStep<boolean>;
    startCursor(): PgCursorStep<PgSelectSingleStep<any> | PgUnionAllSingleStep>;
    endCursor(): PgCursorStep<PgSelectSingleStep<any> | PgUnionAllSingleStep>;
    execute({ count }: ExecutionDetails): GrafastResultsList<object>;
    unbatchedExecute(): any;
}
/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
export declare function pgPageInfo<TStep extends PgSelectStep<any> | PgUnionAllStep<any, any>>(connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>): PgPageInfoStep<TStep>;
//# sourceMappingURL=pgPageInfo.d.ts.map