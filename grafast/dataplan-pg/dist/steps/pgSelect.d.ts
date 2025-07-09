import type { ConnectionCapableStep, ConnectionStep, ExecutionDetails, GrafastResultsList, LambdaStep, Maybe, StepOptimizeOptions } from "grafast";
import { Step } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgCodecAttributes } from "../codecs.js";
import type { PgResource, PgResourceParameter } from "../datasource.js";
import type { GetPgResourceAttributes, GetPgResourceCodec, GetPgResourceRelations, PgCodec, PgGroupSpec, PgOrderSpec, PgQueryBuilder, PgSelectQueryBuilderCallback, PgSQLCallbackOrDirect, PgTypedStep, ReadonlyArrayOrDirect } from "../interfaces.js";
import { PgLocker } from "../pgLocker.js";
import { PgClassExpressionStep } from "./pgClassExpression.js";
import type { PgHavingConditionSpec, PgWhereConditionSpec } from "./pgCondition.js";
import { PgCondition } from "./pgCondition.js";
import type { PgCursorDetails } from "./pgCursor.js";
import type { PgPageInfoStep } from "./pgPageInfo.js";
import type { PgSelectSinglePlanOptions } from "./pgSelectSingle.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgStmtCommonQueryInfo, PgStmtCompileQueryInfo, PgStmtDeferredPlaceholder, PgStmtDeferredSQL } from "./pgStmt.js";
import { PgStmtBaseStep } from "./pgStmt.js";
export type PgSelectParsedCursorStep = LambdaStep<string, null | any[]>;
type PgSelectPlanJoin = {
    type: "cross";
    from: SQL;
    alias: SQL;
    attributeNames?: SQL;
    lateral?: boolean;
} | {
    type: "inner" | "left" | "right" | "full";
    from: SQL;
    alias: SQL;
    attributeNames?: SQL;
    conditions: SQL[];
    lateral?: boolean;
};
type PgSelectScopedPlanJoin = PgSQLCallbackOrDirect<PgSelectPlanJoin>;
export type PgSelectIdentifierSpec = {
    step: Step;
    codec: PgCodec;
    matches: (alias: SQL) => SQL;
} | {
    step: PgTypedStep<any>;
    codec?: PgCodec;
    matches: (alias: SQL) => SQL;
};
export type PgSelectArgumentSpec = {
    step: Step;
    pgCodec: PgCodec<any, any, any, any>;
    name?: string;
} | {
    step: PgTypedStep<any>;
    pgCodec?: never;
    name?: string;
};
export interface PgSelectArgumentDigest {
    position?: number;
    name?: string;
    placeholder: SQL;
    step?: never;
}
interface PgSelectArgumentBasics {
    position?: number;
    name?: string;
}
interface PgSelectArgumentPlaceholder extends PgSelectArgumentBasics {
    placeholder: SQL;
    step?: never;
    depId?: never;
}
export interface PgSelectArgumentRuntimeValue extends PgSelectArgumentBasics {
    placeholder?: never;
    value: unknown;
}
export type PgSelectMode = "normal" | "aggregate" | "mutation";
export interface PgSelectOptions<TResource extends PgResource<any, any, any, any, any> = PgResource> {
    /**
     * Tells us what we're dealing with - data type, columns, where to get it
     * from, what it's called, etc. Many of these details can be overridden
     * below.
     */
    resource: TResource;
    /**
     * The identifiers to limit the results down to just the row(s) you care
     * about.
     *
     * NOTE: this is required because it's a big footgun to omit it by accident,
     * if you truly do not need it (e.g. if you're calling a function with
     * limited results or you really want everything) then you can specify it as
     * an empty array `[]`.
     */
    identifiers: Array<PgSelectIdentifierSpec>;
    /**
     * Set this true if your query includes any `VOLATILE` function (including
     * seemingly innocuous things such as `random()`) otherwise we might only
     * call the relevant function once and re-use the result.
     */
    forceIdentity?: boolean;
    parameters?: readonly PgResourceParameter[];
    /**
     * If your `from` (or resource.from if omitted) is a function, the arguments
     * to pass to the function.
     */
    args?: ReadonlyArray<PgSelectArgumentSpec>;
    /**
     * If you want to build the data in a custom way (e.g. calling a function,
     * selecting from a view, building a complex query, etc) then you can
     * override the `resource.from` here with your own from code. Defaults to
     * `resource.from`.
     */
    from?: SQL | ((...args: PgSelectArgumentDigest[]) => SQL);
    /**
     * You should never rely on implicit order - use explicit `ORDER BY` (via
     * `$select.orderBy(...)`) instead. However, if you _are_ relying on implicit
     * order in your `from` result (e.g. a subquery or function call that has its
     * own internal ordering), setting this to `true` will prevent PgSelect from
     * inlining some queries (joins) that it thinks might impact the order of
     * results. Setting this to `true` does NOT guarantee that you can rely on
     * your order being maintained, but it does increase the chances.
     */
    hasImplicitOrder?: false;
    /**
     * If you pass a custom `from` (or otherwise want to aid in debugging),
     * passing a custom name can make it easier to follow the SQL/etc that is
     * generated.
     */
    name?: string;
    mode?: PgSelectMode;
    /**
     * If true and this turns into a join it should be a lateral join.
     */
    joinAsLateral?: boolean;
}
interface PgSelectStepResult {
    hasMore: boolean;
    /** a tuple based on what is selected at runtime */
    items: ReadonlyArray<unknown[]> | AsyncIterable<unknown[]>;
    cursorDetails: PgCursorDetails | undefined;
    groupDetails: PgGroupDetails | undefined;
    m: Record<string, unknown>;
}
export interface PgGroupDetails {
    readonly indicies: ReadonlyArray<{
        index: number;
        codec: PgCodec;
    }>;
}
/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <attributes>, <cursor?> FROM <table>`. You can also add
 * `JOIN`, `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`. You cannot add `GROUP BY`
 * because that would invalidate the identifiers; and as such you can't use
 * `HAVING` or functions that implicitly turn the query into an aggregate. We
 * don't allow `UNION`/`INTERSECT`/`EXCEPT`/`FOR UPDATE`/etc at this time,
 * purely because it hasn't been sufficiently considered.
 */
export declare class PgSelectStep<TResource extends PgResource<any, any, any, any, any> = PgResource> extends PgStmtBaseStep<PgSelectStepResult> implements ConnectionCapableStep<PgSelectSingleStep<TResource>, PgSelectParsedCursorStep> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private readonly from;
    private readonly hasImplicitOrder;
    /**
     * This defaults to the name of the resource but you can override it. Aids
     * in debugging.
     */
    readonly name: string;
    /**
     * To be used as the table alias, we always use a symbol unless the calling
     * code specifically indicates a string to use.
     */
    private readonly symbol;
    /**
     * When SELECTs get merged, symbols also need to be merged. The keys in this
     * map are the symbols of PgSelects that don't exist any more, the values are
     * symbols of the PgSelects that they were replaced with (which might also not
     * exist in future, but we follow the chain so it's fine).
     */
    private readonly _symbolSubstitutes;
    /** = sql.identifier(this.symbol) */
    readonly alias: SQL;
    /**
     * The resource from which we are selecting: table, view, etc
     */
    readonly resource: TResource;
    private relationJoins;
    private joins;
    private conditions;
    private groups;
    private havingConditions;
    private orders;
    private isOrderUnique;
    protected firstStepId: number | null;
    protected lastStepId: number | null;
    protected fetchOneExtra: boolean;
    /** When using natural pagination, this index is the lower bound (and should be excluded) */
    protected lowerIndexStepId: number | null;
    /** When using natural pagination, this index is the upper bound (and should be excluded) */
    protected upperIndexStepId: number | null;
    protected offsetStepId: number | null;
    protected beforeStepId: number | null;
    protected afterStepId: number | null;
    private connectionDepId;
    private applyDepIds;
    /**
     * Set this true if your query includes any `VOLATILE` function (including
     * seemingly innocuous things such as `random()`) otherwise we might only
     * call the relevant function once and re-use the result.
     */
    forceIdentity: boolean;
    protected placeholders: Array<PgStmtDeferredPlaceholder>;
    protected deferreds: Array<PgStmtDeferredSQL>;
    private fixedPlaceholderValues;
    /**
     * If true, we don't need to add any of the security checks from the
     * resource; otherwise we must do so. Default false.
     */
    private isTrusted;
    /**
     * If true, we know at most one result can be matched for each identifier, so
     * it's safe to do a `LEFT JOIN` without risk of returning duplicates. Default false.
     */
    private isUnique;
    /**
     * If true, we will not attempt to inline this into the parent query.
     * Default false.
     */
    private isInliningForbidden;
    /**
     * If true and this becomes a join during optimisation then it should become
     * a lateral join; e.g. in the following query, the left join must be
     * lateral.
     *
     * ```sql
     * select *
     * from foo
     * left join lateral (
     *   select (foo.col).*
     * ) t
     * on true
     * ```
     */
    private joinAsLateral;
    /**
     * The list of things we're selecting.
     */
    private selects;
    /**
     * The id for the PostgreSQL context plan.
     */
    private contextId;
    readonly mode: PgSelectMode;
    protected locker: PgLocker<this>;
    private _meta;
    static clone<TResource extends PgResource<any, any, any, any, any>>(cloneFrom: PgSelectStep<TResource>, mode?: PgSelectMode): PgSelectStep<TResource>;
    constructor(options: PgSelectOptions<TResource>);
    toStringMeta(): string;
    lock(): void;
    setInliningForbidden(newInliningForbidden?: boolean): this;
    inliningForbidden(): boolean;
    setTrusted(newIsTrusted?: boolean): this;
    trusted(): boolean;
    /**
     * Set this true ONLY if there can be at most one match for each of the
     * identifiers. If you set this true when this is not the case then you may
     * get unexpected results during inlining; if in doubt leave it at the
     * default.
     */
    setUnique(newUnique?: boolean): this;
    unique(): boolean;
    /**
     * Join to a named relationship and return the alias that can be used in
     * SELECT, WHERE and ORDER BY.
     */
    singleRelation<TRelationName extends keyof GetPgResourceRelations<TResource> & string>(relationIdentifier: TRelationName): SQL;
    /**
     * @experimental Please use `singleRelation` or `manyRelation` instead.
     */
    join(spec: PgSelectScopedPlanJoin): void;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    private nullCheckIndex;
    /**
     * Finalizes this instance and returns a mutable clone; useful for
     * connections/etc (e.g. copying `where` conditions but adding more, or
     * pagination, or grouping, aggregates, etc)
     */
    clone(mode?: PgSelectMode): PgSelectStep<TResource>;
    connectionClone($connection: ConnectionStep<any, any, any, any>, mode?: PgSelectMode): PgSelectStep<TResource>;
    where(rawCondition: PgSQLCallbackOrDirect<PgWhereConditionSpec<keyof GetPgResourceAttributes<TResource> & string>>): void;
    groupBy(group: PgSQLCallbackOrDirect<PgGroupSpec>): void;
    having(rawCondition: PgSQLCallbackOrDirect<PgHavingConditionSpec<keyof GetPgResourceAttributes<TResource> & string>>): void;
    orderBy(order: PgSQLCallbackOrDirect<PgOrderSpec>): void;
    setOrderIsUnique(): void;
    apply($step: Step<ReadonlyArrayOrDirect<Maybe<PgSelectQueryBuilderCallback>>>): void;
    protected assertCursorPaginationAllowed(): void;
    items(): PgSelectRowsStep<TResource>;
    pageInfo($connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, this, any>): PgPageInfoStep<this>;
    getCursorDetails(): Step<PgCursorDetails>;
    private needsGroups;
    getGroupDetails(): Step<PgGroupDetails>;
    /**
     * `execute` will always run as a root-level query. In future we'll implement a
     * `toSQL` method that allows embedding this plan within another SQL plan...
     * But that's a problem for later.
     *
     * This runs the query for every entry in the values, and then returns an
     * array of results where each entry in the results relates to the entry in
     * the incoming values.
     *
     * NOTE: we don't know what the values being fed in are, we must feed them to
     * the plans stored in this.identifiers to get actual values we can use.
     */
    execute(executionDetails: ExecutionDetails): Promise<GrafastResultsList<PgSelectStepResult>>;
    finalize(): void;
    deduplicate(peers: PgSelectStep<any>[]): PgSelectStep<TResource>[];
    private getParentForInlining;
    private mergeSelectsWith;
    /**
     * - Merge placeholders
     * - Merge fixedPlaceholders
     * - Merge deferreds
     * - Merge _symbolSubstitutes
     */
    private mergePlaceholdersInto;
    optimize({ stream }: StepOptimizeOptions): Step;
    /**
     * Most likely you want `.single()` instead of this method.
     *
     * If this plan may only return one record, you can use `.singleAsRecord()`
     * to return a plan that resolves to that record (rather than a list of
     * records as it does currently).
     *
     * The main reason to use this instead of `.single()` is if you are
     * paginating over a scalar and you truly need a PgSelectSingleStep interface
     * e.g. so you can get the `count(*)` aggregate.
     *
     * Beware: if you call this and the database might actually return more than
     * one record then you're potentially in for a Bad Time.
     */
    singleAsRecord(options?: PgSelectSinglePlanOptions): PgSelectSingleStep<TResource>;
    /**
     * If this plan may only return one record, you can use `.single()` to return
     * a plan that resolves to either that record (in the case of composite
     * types) or the underlying scalar (in the case of a resource whose codec has
     * no attributes).
     *
     * Beware: if you call this and the database might actually return more than
     * one record then you're potentially in for a Bad Time.
     */
    single(options?: PgSelectSinglePlanOptions): TResource extends PgResource<any, PgCodec<any, infer UAttributes, any, any, any, any, any>, any, any, any> ? UAttributes extends PgCodecAttributes ? PgSelectSingleStep<TResource> : PgClassExpressionStep<PgCodec<string, undefined, any, any, any, any, any>, TResource> : never;
    row($row: Step, options?: PgSelectSinglePlanOptions): PgSelectSingleStep<TResource>;
    /**
     * When you return a plan in a situation where GraphQL is expecting a
     * GraphQLList, it must implement the `.listItem()` method to return a plan
     * for an individual item within this list. Grafast will automatically call
     * this (possibly recursively) to pass to the plan resolvers on the children
     * of this field.
     *
     * NOTE: Grafast handles the list indexes for you, so your list item plan
     * should process just the single input list item.
     *
     * IMPORTANT: do not call `.listItem` from user code; it's only intended to
     * be called by Grafast.
     */
    listItem(itemPlan: Step): TResource extends PgResource<any, PgCodec<any, infer UAttributes, any, any, any, any, any>, any, any, any> ? UAttributes extends PgCodecAttributes ? PgSelectSingleStep<TResource> : PgClassExpressionStep<PgCodec<string, undefined, any, any, any, any, any>, TResource> : never;
    [$$toSQL](): SQL;
    whereBuilder(): PgCondition<this>;
    havingBuilder(): PgCondition<this>;
    setMeta(key: string, value: unknown): void;
    getMetaRaw(key: string): unknown;
    static getStaticInfo<TResource extends PgResource<any, any, any, any, any>>($source: PgSelectStep<TResource>): StaticInfo<TResource>;
}
export declare class PgSelectRowsStep<TResource extends PgResource<any, any, any, any, any> = PgResource> extends Step {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    constructor($pgSelect: PgSelectStep<TResource>);
    getClassStep(): PgSelectStep<TResource>;
    listItem(itemPlan: Step): TResource extends PgResource<any, PgCodec<any, infer UAttributes extends {
        [x: string]: import("../codecs.js").PgCodecAttribute<PgCodec<string, /*elided*/ any | undefined, any, any, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, undefined, any, any, undefined, any, undefined> | undefined>, boolean>;
    } | undefined, any, any, any, any, any>, any, any, any> ? UAttributes extends {
        [x: string]: import("../codecs.js").PgCodecAttribute<PgCodec<string, /*elided*/ any | undefined, any, any, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, undefined, any, any, undefined, any, undefined> | undefined>, boolean>;
    } ? PgSelectSingleStep<TResource> : PgClassExpressionStep<PgCodec<string, undefined, any, any, any, any, any>, TResource> : never;
    deduplicate(_peers: readonly Step[]): readonly Step<any>[];
    execute(executionDetails: ExecutionDetails): readonly any[];
}
export declare function pgSelect<TResource extends PgResource<any, any, any, any, any>>(options: PgSelectOptions<TResource>): PgSelectStep<TResource>;
/**
 * Turns a list of records (e.g. from PgSelectSingleStep.record()) back into a PgSelect.
 */
export declare function pgSelectFromRecords<TResource extends PgResource<any, any, any, any, any>>(resource: TResource, records: PgClassExpressionStep<PgCodec<any, undefined, any, any, GetPgResourceCodec<TResource>, any, any>, TResource> | Step<any[]>): PgSelectStep<TResource>;
export declare function sqlFromArgDigests(digests: readonly PgSelectArgumentDigest[]): SQL;
export declare function pgFromExpression($target: {
    getPgRoot(): Step & {
        placeholder(step: Step, codec: PgCodec): SQL;
        deferredSQL($step: Step<SQL>): SQL;
    };
}, baseFrom: SQL | ((...args: readonly PgSelectArgumentDigest[]) => SQL), inParameters?: readonly PgResourceParameter[] | undefined, specs?: ReadonlyArray<PgSelectArgumentSpec | PgSelectArgumentDigest>): SQL;
declare const $$generationCheck: unique symbol;
export declare function generatePgParameterAnalysis(parameters: readonly PgResourceParameter[]): {
    /** DO NOT GENERATE THIS OBJECT YOURSELF! Use generateParameterAnalysis(parameters) */
    [$$generationCheck]: readonly PgResourceParameter<string | null, PgCodec<string, {
        [x: string]: import("../codecs.js").PgCodecAttribute<PgCodec<string, /*elided*/ any | undefined, any, any, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, undefined, any, any, undefined, any, undefined> | undefined>, boolean>;
    } | undefined, any, any, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, undefined, any, any, undefined, any, undefined> | undefined>>[];
    parameterByName: Record<string, PgResourceParameter<string | null, PgCodec<string, {
        [x: string]: import("../codecs.js").PgCodecAttribute<PgCodec<string, /*elided*/ any | undefined, any, any, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, undefined, any, any, undefined, any, undefined> | undefined>, boolean>;
    } | undefined, any, any, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, any, any, any, any, any, any> | undefined, PgCodec<string, undefined, any, any, undefined, any, undefined> | undefined>>>;
    indexAfterWhichAllArgsAreNamed: number;
};
export declare function pgFromExpressionRuntime(from: (...args: PgSelectArgumentDigest[]) => SQL, parameters: readonly PgResourceParameter[], digests: ReadonlyArray<PgSelectArgumentPlaceholder | PgSelectArgumentRuntimeValue>, parameterAnalysis?: ReturnType<typeof generatePgParameterAnalysis>): SQL;
export declare function getFragmentAndCodecFromOrder(alias: SQL, order: PgOrderSpec, codecOrCodecs: PgCodec | PgCodec[]): [fragment: SQL, codec: PgCodec, isNullable?: boolean];
interface PgSelectQueryInfo<TResource extends PgResource<any, any, any, any, any> = PgResource> extends PgStmtCommonQueryInfo, PgStmtCompileQueryInfo {
    readonly name: string;
    readonly resource: TResource;
    readonly mode: PgSelectMode;
    /** Are we fetching just one record? */
    readonly isUnique: boolean;
    readonly joinAsLateral: boolean;
    /** Is the order that was established at planning time unique? */
    readonly isOrderUnique: boolean;
    readonly fixedPlaceholderValues: ReadonlyMap<symbol, SQL>;
    readonly _symbolSubstitutes: ReadonlyMap<symbol, symbol>;
    readonly needsGroups: boolean;
    readonly selects: ReadonlyArray<SQL>;
    readonly from: SQL;
    readonly joins: ReadonlyArray<PgSelectPlanJoin>;
    readonly conditions: ReadonlyArray<SQL>;
    readonly orders: ReadonlyArray<PgOrderSpec>;
    readonly relationJoins: ReadonlyMap<keyof GetPgResourceRelations<TResource>, SQL>;
    readonly meta: {
        readonly [key: string]: any;
    };
}
type CoreInfo<TResource extends PgResource<any, any, any, any, any>> = Readonly<Omit<PgSelectQueryInfo<TResource>, "placeholders" | "deferreds">>;
type StaticKeys = "forceIdentity" | "havingConditions" | "mode" | "hasSideEffects" | "name" | "alias" | "symbol" | "resource" | "groups" | "orders" | "selects" | "fetchOneExtra" | "isOrderUnique" | "isUnique" | "conditions" | "from" | "joins" | "needsCursor" | "needsGroups" | "relationJoins" | "meta" | "placeholderSymbols" | "deferredSymbols" | "fixedPlaceholderValues" | "_symbolSubstitutes" | "joinAsLateral";
type StaticInfo<TResource extends PgResource<any, any, any, any, any>> = Pick<CoreInfo<TResource>, StaticKeys>;
export interface PgSelectQueryBuilder<TResource extends PgResource<any, any, any, any, any> = PgResource> extends PgQueryBuilder {
    /** Instruct to add another order */
    orderBy(spec: PgOrderSpec): void;
    /** Inform that the resulting order is now unique */
    setOrderIsUnique(): void;
    /** Returns the SQL alias representing the table related to this relation */
    singleRelation<TRelationName extends keyof GetPgResourceRelations<TResource> & string>(relationIdentifier: TRelationName): SQL;
    where(condition: PgWhereConditionSpec<keyof GetPgResourceAttributes<TResource> & string>): void;
    whereBuilder(): PgCondition<this>;
    groupBy(group: PgGroupSpec): void;
    having(condition: PgHavingConditionSpec<keyof GetPgResourceAttributes<TResource> & string>): void;
    havingBuilder(): PgCondition<this>;
    join(spec: PgSelectPlanJoin): void;
    selectAndReturnIndex(fragment: SQL): number;
}
export {};
//# sourceMappingURL=pgSelect.d.ts.map