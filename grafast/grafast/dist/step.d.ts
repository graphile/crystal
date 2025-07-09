import type { GraphQLObjectType } from "graphql";
import type { LayerPlan, LayerPlanReasonSubroutine } from "./engine/LayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { AddDependencyOptions, DependencyOptions, ExecutionDetails, ExecutionEntryFlags, ExecutionResults, GrafastResultsList, JSONValue, PromiseOrDirect, StepOptimizeOptions, UnbatchedExecutionExtra } from "./interfaces.js";
import { $$subroutine } from "./interfaces.js";
import type { __FlagStep, __ItemStep } from "./steps/index.js";
declare function reallyAssertFinalized(plan: Step): void;
export declare const assertFinalized: typeof reallyAssertFinalized;
/**
 * Executable plans are the plans associated with leaves on the GraphQL tree,
 * they must be able to execute to return values.
 */
export declare class Step<TData = any> {
    readonly operationPlan: OperationPlan;
    [$$subroutine]: LayerPlan<LayerPlanReasonSubroutine> | null;
    isArgumentsFinalized: boolean;
    isFinalized: boolean;
    debug: boolean;
    static $$export: any;
    /**
     * Setting this true is a performance optimisation, but it comes with strong
     * rules; we do not test you comply with these rules (as that would undo the
     * performance gains) but should you break them the behaviour is undefined
     * (and, basically, the schema may no longer be GraphQL compliant).
     *
     * Do not set this true unless the following hold:
     *
     * - The `execute` method must be a regular (not async) function
     * - The `execute` method must NEVER return a promise
     * - The values within the list returned from `execute` must NEVER include
     *   promises or FlaggedValue objects
     * - The result of calling `execute` should not differ after a
     *   `step.hasSideEffects` has executed (i.e. it should be pure, only
     *   dependent on its deps and use no external state)
     *
     * It's acceptable for the `execute` method to throw if it needs to.
     *
     * This optimisation applies to the majority of the built in plans and allows
     * the engine to execute without needing to resolve any promises which saves
     * precious event-loop ticks.
     */
    isSyncAndSafe: boolean;
    /**
     * (default = ALL_FLAGS & ~FLAG_NULL)
     */
    protected readonly defaultForbiddenFlags: ExecutionEntryFlags;
    /**
     * The plan this plan will need data from in order to execute.
     */
    protected readonly dependencies: ReadonlyArray<Step>;
    /**
     * Unique identifier for this step within the plan.
     */
    readonly id: number;
    /**
    /**
     * True when `optimize` has been called at least once.
     */
    isOptimized: boolean;
    /**
     * Set this true if your plan's optimize method can be called a second time;
     * note that in this situation it's likely that your dependencies will not be
     * what you expect them to be (e.g. a PgSelectSingleStep might become an
     * AccessStep).
     */
    allowMultipleOptimizations: boolean;
    /**
     * Set the metaKey so `execute` will be passed a meta object to use.
     * Depending on what you set it to, you can share execution meta between
     * multiple steps of the same class (or even a family of step classes).
     *
     * A sensible value for it is `this.metaKey = this.id;`.
     */
    metaKey: number | string | symbol | undefined;
    /**
     * Like `metaKey` but for the optimize phase
     */
    optimizeMetaKey: number | string | symbol | undefined;
    /**
     * If the peerKey of two steps do not match, then they are definitely not
     * peers. Use this to reduce the load on deduplicate by more quickly
     * eradicating definitely-not-peers.
     *
     * Note: we may well change this to be a function in future, so it's advised
     * that you don't use this unless you're working inside the graphile/crystal
     * core codebase.
     *
     * @experimental
     */
    peerKey: string | null;
    /**
     * Set this true for plans that implement mutations; this will prevent them
     * from being tree-shaken.
     */
    hasSideEffects: boolean;
    constructor();
    /**
     * Generally you should only use this once the dependencies of a step are
     * established, if you use it beforehand and it returns `true` then adding a
     * non-unary dependency later will result in an error.
     */
    getAndFreezeIsUnary(): boolean;
    protected withMyLayerPlan<T>(callback: () => T): T;
    /** @experimental */
    withLayerPlan<T>(callback: () => T): T;
    protected getStep(id: number): Step;
    protected getDepOptions<TStep extends Step = Step>(depId: number): DependencyOptions<TStep>;
    protected getDep<TStep extends Step = Step>(_depId: number): TStep | __FlagStep<TStep>;
    protected getDep<TStep extends Step = Step>(_depId: number, throwOnFlagged: true): TStep;
    protected maybeGetDep<TStep extends Step = Step>(depId: number | null | undefined): TStep | __FlagStep<TStep> | null;
    protected maybeGetDep<TStep extends Step = Step>(depId: number | null | undefined, throwOnFlagged: true): TStep | null;
    protected getDepOrConstant<TData = any>(_depId: number | null, _fallback: TData): Step<TData>;
    /**
     * Like getDep, except it skips over __ItemStep and similar steps to get to
     * where the parent really is.
     *
     * @experimental
     */
    protected getDepDeep(depId: number): Step;
    /**
     * Cache a generated step by a given identifier (cacheKey) such that we don't
     * need to regenerate it on future calls, significantly reducing the load on
     * deduplication later.
     *
     * @experimental
     */
    protected cacheStep<T extends Step>(actionKey: string, cacheKey: symbol | string | number, cb: () => T): T;
    toString(): string;
    /**
     * This metadata will be merged into toString when referencing this plan.
     */
    toStringMeta(): string | null;
    planJSONExtra(): Record<string, JSONValue | undefined> | undefined;
    protected canAddDependency(step: Step): boolean;
    protected addDependency(stepOrOptions: Step | AddDependencyOptions): number;
    /**
     * Adds "unary" dependencies; in `execute({count, values})` you'll receive a
     * `values[index]` (where `index` is the return value of this function) with
     * `isBatch = false` so you can use the `values[index].value` property
     * directly.
     */
    protected addUnaryDependency(stepOrOptions: Step | AddDependencyOptions): number;
    /**
     * Given a list of "peer" steps, return a list of these `peers` that are
     * equivalent to this step.
     *
     * NOTE: equivalence goes both ways: `a.deduplicate([b]).includes(b)` if and
     * only if `b.deduplicate([a]).includes(a)`.
     *
     * If you need to transform the peer to be equivalent you should do so via
     * the `deduplicatedWith` callback later.
     */
    deduplicate?(_peers: readonly Step[]): readonly Step[];
    /**
     * If this plan is replaced via deduplication, this method gives it a chance
     * to hand over its responsibilities to its replacement.
     */
    deduplicatedWith?(replacement: Step): void;
    /**
     * Our chance to optimise the plan (which could go as far as to inline the
     * plan into the parent plan).
     */
    optimize?(_options: StepOptimizeOptions): Step;
    finalize(): void;
    /**
     * This function will be called with 'execution details', an object containing:
     *
     * - `count`: the number of entries in the batch that's being executed
     * - `values`: a tuple representing the runtime values of the steps
     *   dependencies; each value in the tuple is an object, either a batch object
     *   containing a list of size `count` containing the values, or a unary
     *   object containing the single value common to all entries.
     * - `indexMap`: helper function to map over each index from `0` to `count-1`,
     *   returning the resulting array.
     * - `indexForEach`: as `indexMap`, but without the array result.
     * - `meta`: [experimental]
     *
     * `execute` must return a list with `count` entries, where each value in the
     * list relates to the result of executing this plan for the corresponding
     * entry in each of the entries in the `values` tuple.
     *
     * IMPORTANT: it is up to the execute function to cache/memoize results as
     * appropriate for performance, this can be done via the `meta` object.
     *
     * The `meta` object is an empty object stored to `grafastContext.metaByPlan`
     * that can be used to store anything this plan needs. We recommend that you
     * add attributes to meta for each purpose (e.g. use `meta.cache` for
     * memoizing results) so that you can expand your usage of meta in future.
     */
    execute(details: ExecutionDetails): ExecutionResults<TData>;
    destroy(): void;
}
export declare abstract class UnbatchedStep<TData = any> extends Step<TData> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    finalize(): void;
    execute({ indexMap, values, extra, }: ExecutionDetails): PromiseOrDirect<GrafastResultsList<TData>>;
    abstract unbatchedExecute(extra: UnbatchedExecutionExtra, ...tuple: any[]): PromiseOrDirect<TData>;
}
export declare function isStep<TData = any>(step: unknown): step is Step<TData>;
export declare function assertStep<TData>(step: unknown): asserts step is Step<TData>;
export declare function isUnbatchedStep<TData = any>(step: unknown): step is UnbatchedStep<TData>;
export type ObjectLikeStep<TData extends {
    [key: string]: Step;
} = {
    [key: string]: Step;
}> = Step<{
    [key in keyof TData]: TData[key] extends Step<infer U> ? U : never;
}> & {
    get<TKey extends keyof TData>(key: TKey): Step<TData[TKey]>;
};
export declare function isObjectLikeStep<TData extends {
    [key: string]: Step;
} = {
    [key: string]: Step;
}>(plan: Step): plan is ObjectLikeStep<TData>;
export type ListLikeStep<TData extends [...Step[]] = [...Step[]]> = Step<{
    [key in keyof TData]: TData[key] extends Step<infer U> ? U : never;
}> & {
    at<TKey extends keyof TData>(key: TKey): Step<TData[TKey]>;
};
export declare function isListLikeStep<TData extends [...Step[]] = [...Step[]]>(plan: Step): plan is ListLikeStep<TData>;
export type PolymorphicStep = Step & {
    planForType(objectType: GraphQLObjectType): Step;
};
export declare function isPolymorphicStep(s: Step): s is PolymorphicStep;
export interface ListCapableStep<TOutputData, TItemStep extends Step<TOutputData> = Step<TOutputData>> extends Step<ReadonlyArray<any>> {
    listItem(itemPlan: __ItemStep<this>): TItemStep;
}
export declare function isListCapableStep<TData, TItemStep extends Step<TData>>(plan: Step<ReadonlyArray<TData>>): plan is ListCapableStep<TData, TItemStep>;
export declare function assertListCapableStep<TData, TItemStep extends Step<TData>>(plan: Step<ReadonlyArray<TData>>, pathDescription: string): asserts plan is ListCapableStep<TData, TItemStep>;
export { 
/** @deprecated Use ExecutableStep instead */
Step as ExecutableStep, 
/** @deprecated Use UnbatchedStep instead */
UnbatchedStep as UnbatchedExecutableStep, };
/** @deprecated Use isStep instead */
export declare const isExecutableStep: typeof isStep;
/** @deprecated Use isStep instead */
export declare function assertExecutableStep<TData>(step: unknown): asserts step is Step<TData>;
//# sourceMappingURL=step.d.ts.map