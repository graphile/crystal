import type { __InputStaticLeafStep, ExecutionDetails, Maybe } from "grafast";
import { Step } from "grafast";
import { type SQL } from "pg-sql2";
import type { PgCodec, PgGroupSpec, PgQueryRootStep, PgTypedStep } from "../interfaces.js";
import type { PgLocker } from "../pgLocker.js";
import type { PgSelectParsedCursorStep } from "./pgSelect.js";
export interface QueryValue {
    dependencyIndex: number;
    codec: PgCodec;
    alreadyEncoded: boolean;
}
/**
 * Sometimes we want to refer to something that might change later - e.g. we
 * might have SQL that specifies a list of explicit values, or it might later
 * want to be replaced with a reference to an existing table value (e.g. when a
 * query is being inlined). PgStmtDeferred allows for this kind of
 * flexibility. It's really important to keep in mind that the same placeholder
 * might be used in multiple different SQL queries, and in the different
 * queries it might end up with different values - this is particularly
 * relevant when using `@stream`/`@defer`, for example.
 */
export type PgStmtDeferredPlaceholder = {
    symbol: symbol;
    dependencyIndex: number;
    codec: PgCodec;
    alreadyEncoded: boolean;
};
export type PgStmtDeferredSQL = {
    symbol: symbol;
    dependencyIndex: number;
};
export declare abstract class PgStmtBaseStep<T> extends Step<T> implements PgQueryRootStep {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    protected abstract locker: PgLocker<any>;
    /**
     * Values used in this plan.
     */
    protected abstract placeholders: Array<PgStmtDeferredPlaceholder>;
    protected abstract deferreds: Array<PgStmtDeferredSQL>;
    protected abstract firstStepId: number | null;
    protected abstract lastStepId: number | null;
    protected abstract fetchOneExtra: boolean;
    protected abstract offsetStepId: number | null;
    protected abstract beforeStepId: number | null;
    protected abstract afterStepId: number | null;
    protected needsCursor: boolean;
    scopedSQL: <T_1>(cb: import("../interfaces.js").PgSQLCallbackOrDirect<T_1>) => T_1;
    /**
     * If we can't figure out the SQL until runtime, we can pass a step that
     * resolves to an SQL fragment.
     *
     * IMPORTANT: this step must be a "unary" step; i.e. it can only depend on
     * request-global dependencies such as variableValues, context, and input
     * arguments.
     */
    deferredSQL($step: Step<SQL>): SQL;
    placeholder($step: PgTypedStep<PgCodec>): SQL;
    placeholder($step: Step, codec: PgCodec, alreadyEncoded?: boolean): SQL;
    protected makeValues(executionDetails: ExecutionDetails, name: string): {
        queryValues: QueryValue[];
        placeholderValues: Map<symbol, SQL>;
        identifiersSymbol: symbol;
        identifiersAlias: SQL;
        handlePlaceholder: (placeholder: PgStmtDeferredPlaceholder) => void;
    };
    protected abstract assertCursorPaginationAllowed(): void;
    setFirst($first: Step<Maybe<number>>): this;
    setLast($last: Step<Maybe<number>>): this;
    setOffset($offset: Step<Maybe<number>>): this;
    setAfter($parsedCursorPlan: PgSelectParsedCursorStep): void;
    setBefore($parsedCursorPlan: PgSelectParsedCursorStep): void;
    parseCursor($cursorPlan: __InputStaticLeafStep<Maybe<string>>): PgSelectParsedCursorStep;
    /**
     * Someone (probably pageInfo) wants to know if there's more records. To
     * determine this we fetch one extra record and then throw it away.
     */
    hasMore(): Step<boolean>;
    getPgRoot(): this;
}
export declare function getUnary<T>(values: ExecutionDetails["values"], stepId: number): T;
export declare function getUnary<T>(values: ExecutionDetails["values"], stepId: number | null): T | undefined;
export declare function calculateLimitAndOffsetSQL(params: {
    cursorLower: Maybe<number>;
    cursorUpper: Maybe<number>;
    first: Maybe<number>;
    last: Maybe<number>;
    offset: Maybe<number>;
    fetchOneExtra: boolean;
}): SQL[];
export interface PgStmtCommonQueryInfo {
    readonly symbol: symbol | string;
    readonly alias: SQL;
    readonly hasSideEffects: boolean;
    readonly executionDetails: ExecutionDetails;
    readonly placeholderSymbols: ReadonlyArray<symbol>;
    readonly deferredSymbols: ReadonlyArray<symbol>;
    readonly fetchOneExtra: boolean;
    readonly forceIdentity: boolean;
    readonly needsCursor: boolean;
    readonly firstStepId: number | null;
    readonly lastStepId: number | null;
    readonly offsetStepId: number | null;
    readonly beforeStepId: number | null;
    readonly afterStepId: number | null;
    readonly groups: ReadonlyArray<PgGroupSpec>;
    readonly havingConditions: ReadonlyArray<SQL>;
    readonly applyDepIds: ReadonlyArray<number>;
}
export interface PgStmtCompileQueryInfo extends PgStmtCommonQueryInfo {
    readonly placeholders: ReadonlyArray<PgStmtDeferredPlaceholder>;
    readonly deferreds: ReadonlyArray<PgStmtDeferredSQL>;
}
export interface MutablePgStmtCommonQueryInfo {
    cursorLower: Maybe<number>;
    cursorUpper: Maybe<number>;
    first: Maybe<number>;
    last: Maybe<number>;
    shouldReverseOrder: boolean;
    offset: Maybe<number>;
    cursorDigest: string | null;
    readonly cursorIndicies: Array<{
        readonly index: number;
        readonly codec: PgCodec;
    }> | null;
}
export interface ResolvedPgStmtCommonQueryInfo {
    readonly cursorLower: Maybe<number>;
    readonly cursorUpper: Maybe<number>;
    readonly first: Maybe<number>;
    readonly last: Maybe<number>;
    readonly shouldReverseOrder: boolean;
    readonly offset: Maybe<number>;
    readonly cursorDigest: string | null;
    readonly cursorIndicies: ReadonlyArray<{
        readonly index: number;
        readonly codec: PgCodec;
    }> | null;
}
export declare function calculateLimitAndOffsetSQLFromInfo(info: PgStmtCommonQueryInfo & {
    readonly cursorLower: Maybe<number>;
    readonly cursorUpper: Maybe<number>;
}): SQL[];
export declare function applyCommonPaginationStuff(info: PgStmtCommonQueryInfo & MutablePgStmtCommonQueryInfo): void;
export declare function makeValues(info: PgStmtCommonQueryInfo & PgStmtCompileQueryInfo, name: string): {
    queryValues: QueryValue[];
    placeholderValues: Map<symbol, SQL>;
    identifiersSymbol: symbol;
    identifiersAlias: SQL;
    handlePlaceholder: (placeholder: PgStmtDeferredPlaceholder) => void;
};
//# sourceMappingURL=pgStmt.d.ts.map