import type { ExecutionDetails, GrafastResultsList, Maybe, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never[];
/**
 * Describes what a plan needs to implement in order to be suitable for
 * supplying what the `PageInfo` type requires.
 */
export interface PageInfoCapableStep extends Step {
    hasNextPage(): Step<boolean>;
    hasPreviousPage(): Step<boolean>;
    startCursor(): Step<string | null>;
    endCursor(): Step<string | null>;
}
export declare function assertPageInfoCapableStep($step: Step | PageInfoCapableStep): asserts $step is PageInfoCapableStep;
/**
 * Describes what a plan needs to implement in order to be suitable for
 * supplying what a ConnectionStep requires.
 */
export interface ConnectionCapableStep<TItemStep extends Step, TCursorStep extends Step> extends Step {
    /**
     * Clone the plan; it's recommended that you add `$connection` as a
     * dependency so that you can abort execution early in the case of errors
     * (e.g. if the cursors cannot be parsed).
     */
    connectionClone($connection: ConnectionStep<TItemStep, TCursorStep, any, any>, ...args: any[]): ConnectionCapableStep<TItemStep, TCursorStep>;
    pageInfo($connection: ConnectionStep<TItemStep, TCursorStep, ConnectionCapableStep<TItemStep, TCursorStep>, any>): PageInfoCapableStep;
    setFirst($first: Step<Maybe<number>>): void;
    setLast($last: Step<Maybe<number>>): void;
    setOffset($offset: Step<Maybe<number>>): void;
    parseCursor($cursor: Step<Maybe<string>>): TCursorStep;
    setBefore($before: TCursorStep): void;
    setAfter($after: TCursorStep): void;
    items(): Step<ReadonlyArray<TItemStep extends Step<infer U> ? U : any>>;
}
/**
 * Handles GraphQL cursor pagination in a standard and consistent way
 * indepdenent of data source.
 */
export declare class ConnectionStep<TItemStep extends Step, TCursorStep extends Step, TStep extends ConnectionCapableStep<TItemStep, TCursorStep>, TEdgeDataStep extends Step = TItemStep, TNodeStep extends Step = Step> extends UnbatchedStep<unknown> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private subplanId;
    private _firstDepId;
    private _lastDepId;
    private _offsetDepId;
    private _beforeDepId;
    private _afterDepId;
    /** Plan for data to associate with the edge */
    readonly edgeDataPlan?: ($item: TItemStep) => TEdgeDataStep;
    /** The node plan */
    readonly itemPlan?: ($item: TItemStep) => TNodeStep;
    readonly cursorPlan?: ($item: TItemStep) => Step<string | null> | undefined;
    constructor(subplan: TStep, config?: ConnectionConfig<TItemStep, TEdgeDataStep, TNodeStep>);
    toStringMeta(): string;
    getFirst(): Step<number | null | undefined> | null;
    setFirst(first: Step<number | null | undefined> | number): void;
    getLast(): Step<number | null | undefined> | null;
    setLast(last: Step<number | null | undefined> | number): void;
    getOffset(): Step<number | null | undefined> | null;
    setOffset(offset: Step<number | null | undefined> | number): void;
    getBefore(): TCursorStep | null;
    setBefore($beforePlan: Step<string | null | undefined>): void;
    getAfter(): TCursorStep | null;
    setAfter($afterPlan: Step<string | null | undefined>): void;
    /**
     * This should not be called after the arguments have been finalized.
     */
    getSubplan(): TStep;
    /**
     * This represents the entire collection with conditions and ordering
     * applied, but without any pagination constraints (before, after, first,
     * last, offset) applied. It's useful for the following:
     *
     * - performing aggregates e.g. totalCount across the entire collection
     * - determining fields for pageInfo, e.g. is there a next/previous page
     *
     * This cannot be called before the arguments have been finalized.
     */
    cloneSubplanWithoutPagination(...args: ParametersExceptFirst<TStep["connectionClone"]>): TStep;
    /**
     * This represents a single page from the collection - not only have
     * conditions and ordering been applied but we've also applied the pagination
     * constraints (before, after, first, last, offset). It's useful for
     * returning the actual edges and nodes of the connection.
     *
     * This cannot be called before the arguments have been finalized.
     */
    cloneSubplanWithPagination(...args: ParametersExceptFirst<TStep["connectionClone"]> | []): TStep;
    /**
     * Subplans may call this from their `setBefore`/`setAfter`/etc plans in order
     * to add a dependency to us, which is typically useful for adding validation
     * functions so that they are thrown "earlier", avoiding error bubbling.
     */
    addValidation(callback: () => Step): void;
    get(fieldName: string): Step<any> | undefined;
    edges(): Step;
    nodes(): import("./listTransform.js").__ListTransformStep<any, any, any, any> | TStep;
    wrapEdge($edge: TItemStep): EdgeStep<TItemStep, TCursorStep, TStep, TEdgeDataStep, TNodeStep>;
    pageInfo(): PageInfoCapableStep;
    execute({ count, }: ExecutionDetails): GrafastResultsList<Record<string, never>>;
    unbatchedExecute(): any;
}
export interface EdgeCapableStep<TNodeStep extends Step> extends Step {
    node(): TNodeStep;
    cursor(): Step<string | null>;
}
export declare function assertEdgeCapableStep<TNodeStep extends Step>($step: Step | EdgeCapableStep<TNodeStep>): asserts $step is EdgeCapableStep<TNodeStep>;
export declare class EdgeStep<TItemStep extends Step, TCursorStep extends Step, TStep extends ConnectionCapableStep<TItemStep, TCursorStep>, TEdgeDataStep extends Step = TItemStep, TNodeStep extends Step = Step> extends UnbatchedStep implements EdgeCapableStep<TNodeStep> {
    private skipCursor;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private connectionDepId;
    private readonly cursorDepId;
    private needCursor;
    constructor($connection: ConnectionStep<TItemStep, TCursorStep, TStep, TEdgeDataStep, TNodeStep>, $item: TItemStep, skipCursor?: boolean);
    get(fieldName: string): Step<string | null> | TNodeStep | undefined;
    private getConnectionStep;
    private getItemStep;
    data(): TEdgeDataStep;
    node(): TNodeStep;
    cursor(): Step<string | null>;
    optimize(): EdgeStep<TItemStep, TCursorStep, TStep, TNodeStep, Step<any>>;
    deduplicate(_peers: EdgeStep<any, any, any, any>[]): EdgeStep<TItemStep, TCursorStep, TStep, TNodeStep>[];
    deduplicatedWith(replacement: EdgeStep<any, any, any, any>): void;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, record: any, cursor: any): any;
}
interface ConnectionConfig<TItemStep extends Step, TEdgeDataStep extends Step = TItemStep, TNodeStep extends Step = Step> {
    nodePlan?: ($item: TItemStep) => TNodeStep;
    edgeDataPlan?: ($item: TItemStep) => TEdgeDataStep;
    cursorPlan?: ($item: TItemStep) => Step<string | null>;
}
/**
 * Wraps a collection fetch to provide the utilities for working with GraphQL
 * cursor connections.
 */
export declare function connection<TItemStep extends Step, TCursorStep extends Step, TStep extends ConnectionCapableStep<TItemStep, TCursorStep>, TEdgeDataStep extends Step = TItemStep, TNodeStep extends Step = Step>(step: TStep, config?: ConnectionConfig<TItemStep, TEdgeDataStep, TNodeStep>): ConnectionStep<TItemStep, TCursorStep, TStep, TEdgeDataStep, TNodeStep>;
export type ItemsStep<T extends Step<readonly any[]> | ConnectionCapableStep<any, any>> = T extends ConnectionCapableStep<any, any> ? ReturnType<T["items"]> : T;
export declare function itemsOrStep<T extends Step<readonly any[]> | ConnectionCapableStep<any, any>>($step: T): Step<readonly any[]>;
export {};
//# sourceMappingURL=connection.d.ts.map