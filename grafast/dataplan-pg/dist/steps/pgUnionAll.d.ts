import type { ConnectionCapableStep, ConnectionStep, EdgeCapableStep, ExecutionDetails, GrafastResultsList, GrafastValuesList, Maybe, PolymorphicStep } from "grafast";
import { Step } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";
import type { SQL } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgResource, PgResourceUnique } from "../datasource.js";
import type { PgCodecRefPath, PgGroupSpec } from "../index.js";
import type { PgCodec, PgQueryBuilder, PgSQLCallbackOrDirect, PgTypedStep, PgUnionAllQueryBuilderCallback, ReadonlyArrayOrDirect } from "../interfaces.js";
import { PgLocker } from "../pgLocker.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import type { PgHavingConditionSpec, PgWhereConditionSpec } from "./pgCondition.js";
import { PgCondition } from "./pgCondition.js";
import type { PgCursorDetails } from "./pgCursor.js";
import { PgCursorStep } from "./pgCursor.js";
import type { PgPageInfoStep } from "./pgPageInfo.js";
import type { PgSelectParsedCursorStep } from "./pgSelect.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgStmtDeferredPlaceholder, PgStmtDeferredSQL } from "./pgStmt.js";
import { PgStmtBaseStep } from "./pgStmt.js";
export type PgUnionAllStepConfigAttributes<TAttributes extends string> = {
    [attributeName in TAttributes]: {
        codec: PgCodec;
        notNull?: boolean;
    };
};
export interface PgUnionAllStepMember<TTypeNames extends string> {
    typeName: TTypeNames;
    resource: PgResource<any, any, ReadonlyArray<PgResourceUnique<any>>, any, any>;
    match?: {
        [resourceAttributeName: string]: {
            step: PgTypedStep<any>;
            codec?: never;
        } | {
            step: Step;
            codec: PgCodec;
        };
    };
    path?: PgCodecRefPath;
}
export interface PgUnionAllStepConfig<TAttributes extends string, TTypeNames extends string> {
    resourceByTypeName: {
        [typeName in TTypeNames]: PgResource<any, any, any, any, any>;
    };
    attributes?: PgUnionAllStepConfigAttributes<TAttributes>;
    members?: PgUnionAllStepMember<TTypeNames>[];
    mode?: PgUnionAllMode;
    name?: string;
    /**
     * Set this true if your query includes any `VOLATILE` function (including
     * seemingly innocuous things such as `random()`) otherwise we might only
     * call the relevant function once and re-use the result.
     */
    forceIdentity?: boolean;
}
export interface PgUnionAllStepCondition<TAttributes extends string> {
    attribute: TAttributes;
    callback: (fragment: SQL) => SQL;
}
export interface PgUnionAllStepOrder<TAttributes extends string> {
    attribute: TAttributes;
    direction: "ASC" | "DESC";
}
export declare class PgUnionAllSingleStep extends Step implements PolymorphicStep, EdgeCapableStep<any> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private typeKey;
    private pkKey;
    private readonly spec;
    constructor($parent: PgUnionAllStep<any, any>, $item: Step);
    planForType(objectType: GraphQLObjectType<any, any>): Step;
    /**
     * When selecting a connection we need to be able to get the cursor. The
     * cursor is built from the values of the `ORDER BY` clause so that we can
     * find nodes before/after it.
     */
    cursor(): PgCursorStep<this>;
    getClassStep(): PgUnionAllStep<string, string>;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    node(): this;
    scopedSQL: <T>(cb: PgSQLCallbackOrDirect<T>) => T;
    placeholder($step: PgTypedStep<any>): SQL;
    placeholder($step: Step, codec: PgCodec): SQL;
    /**
     * Returns a plan representing the result of an expression.
     */
    expression<TExpressionCodec extends PgCodec>(expression: SQL, codec: TExpressionCodec, guaranteedNotNull?: boolean): PgClassExpressionStep<TExpressionCodec, any>;
    select<TExpressionCodec extends PgCodec>(fragment: PgSQLCallbackOrDirect<SQL>, codec: TExpressionCodec, guaranteedNotNull?: boolean): PgClassExpressionStep<TExpressionCodec, any>;
    execute({ count, values: [values0], }: ExecutionDetails): GrafastResultsList<any>;
}
export type PgUnionAllMode = "normal" | "aggregate";
interface PgUnionAllStepResult {
    m: Record<string, unknown>;
    hasMore?: boolean;
    /** a tuple based on what is selected at runtime */
    items: ReadonlyArray<unknown[]>;
    cursorDetails?: PgCursorDetails;
}
/**
 * Represents a `UNION ALL` statement, which can have multiple table-like
 * resources, but must return a consistent data shape.
 */
export declare class PgUnionAllStep<TAttributes extends string = string, TTypeNames extends string = string> extends PgStmtBaseStep<PgUnionAllStepResult> implements ConnectionCapableStep<PgSelectSingleStep<any>, PgSelectParsedCursorStep> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    symbol: symbol;
    alias: SQL;
    private selects;
    private executor;
    private contextId;
    /**
     * Values used in this plan.
     */
    protected placeholders: Array<PgStmtDeferredPlaceholder>;
    protected deferreds: Array<PgStmtDeferredSQL>;
    private groups;
    private havingConditions;
    protected firstStepId: number | null;
    protected lastStepId: number | null;
    protected fetchOneExtra: boolean;
    /** When using natural pagination, this index is the lower bound (and should be excluded) */
    protected lowerIndexStepId: number | null;
    /** When using natural pagination, this index is the upper bound (and should be excluded) */
    protected upperIndexStepId: number | null;
    /** When we calculate the limit/offset, we may be able to determine there cannot be a next page */
    private limitAndOffsetId;
    protected offsetStepId: number | null;
    protected beforeStepId: number | null;
    protected afterStepId: number | null;
    private connectionDepId;
    readonly mode: PgUnionAllMode;
    protected locker: PgLocker<this>;
    private memberDigests;
    private _limitToTypes;
    private applyDepIds;
    /**
     * Set this true if your query includes any `VOLATILE` function (including
     * seemingly innocuous things such as `random()`) otherwise we might only
     * call the relevant function once and re-use the result.
     */
    forceIdentity: boolean;
    static clone<TAttributes extends string = string, TTypeNames extends string = string>(cloneFrom: PgUnionAllStep<TAttributes, TTypeNames>, mode?: PgUnionAllMode): PgUnionAllStep<TAttributes, TTypeNames>;
    constructor(spec: PgUnionAllStepConfig<TAttributes, TTypeNames>);
    connectionClone($connection: ConnectionStep<any, any, any, any>, mode?: PgUnionAllMode): PgUnionAllStep<TAttributes, TTypeNames>;
    select<TAttribute extends TAttributes>(key: TAttribute): number;
    selectAndReturnIndex(rawFragment: PgSQLCallbackOrDirect<SQL>): number;
    selectPk(): number;
    selectExpression(rawExpression: PgSQLCallbackOrDirect<SQL>, codec: PgCodec): number;
    selectType(): number;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    /**
     * If this plan may only return one record, you can use `.singleAsRecord()`
     * to return a plan that resolves to that record (rather than a list of
     * records as it does currently).
     *
     * Beware: if you call this and the database might actually return more than
     * one record then you're potentially in for a Bad Time.
     */
    singleAsRecord(): PgUnionAllSingleStep;
    single(): PgUnionAllSingleStep;
    row($row: Step): PgUnionAllSingleStep;
    apply($step: Step<ReadonlyArrayOrDirect<Maybe<PgUnionAllQueryBuilderCallback>>>): void;
    items(): PgUnionAllRowsStep<TAttributes, TTypeNames>;
    listItem(itemPlan: Step): any;
    pageInfo($connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, this, any>): PgPageInfoStep<this>;
    where(rawWhereSpec: PgSQLCallbackOrDirect<PgWhereConditionSpec<TAttributes>>): void;
    groupBy(group: PgSQLCallbackOrDirect<PgGroupSpec>): void;
    having(rawCondition: PgSQLCallbackOrDirect<PgHavingConditionSpec<string>>): void;
    orderBy(orderSpec: PgUnionAllStepOrder<TAttributes>): void;
    setOrderIsUnique(): void;
    protected assertCursorPaginationAllowed(): void;
    /** @experimental */
    limitToTypes(types: readonly string[]): void;
    optimize(): this;
    getCursorDetails(): Step<PgCursorDetails>;
    private typeIdx;
    finalize(): void;
    execute(executionDetails: ExecutionDetails): Promise<GrafastValuesList<any>>;
    [$$toSQL](): SQL;
    protected shouldReverseOrderId: number | null;
    protected limitAndOffsetSQL: SQL | null;
}
export declare class PgUnionAllRowsStep<TAttributes extends string = string, TTypeNames extends string = string> extends Step {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    constructor($pgUnionAll: PgUnionAllStep<TAttributes, TTypeNames>);
    getClassStep(): PgUnionAllStep<TAttributes, TTypeNames>;
    listItem(itemPlan: Step): any;
    deduplicate(_peers: readonly Step[]): readonly Step<any>[];
    optimize(): import("grafast").AccessStep<unknown>;
    execute(executionDetails: ExecutionDetails): readonly any[];
}
export declare function pgUnionAll<TAttributes extends string, TTypeNames extends string>(spec: PgUnionAllStepConfig<TAttributes, TTypeNames>): PgUnionAllStep<TAttributes, TTypeNames>;
export interface PgUnionAllQueryBuilder<TAttributes extends string = string, _TTypeNames extends string = string> extends PgQueryBuilder {
    /** Instruct to add another order */
    orderBy(spec: PgUnionAllStepOrder<TAttributes>): void;
    /** Inform that the resulting order is now unique */
    setOrderIsUnique(): void;
    where(whereSpec: PgWhereConditionSpec<TAttributes>): void;
    whereBuilder(): PgCondition<this>;
    having(rawCondition: PgHavingConditionSpec<string>): void;
    havingBuilder(): PgCondition<this>;
    /** Only return values of the given types */
    limitToTypes(types: readonly string[]): void;
}
export {};
//# sourceMappingURL=pgUnionAll.d.ts.map