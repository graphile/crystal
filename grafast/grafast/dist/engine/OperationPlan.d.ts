import type { FragmentDefinitionNode, GraphQLFieldMap, GraphQLObjectType, GraphQLSchema, GraphQLUnionType, OperationDefinitionNode } from "graphql";
import type { Constraint } from "../constraints.js";
import type { SelectionSetDigest } from "../graphqlCollectFields.js";
import type { GrafastPlanJSON } from "../index.js";
import { Step } from "../index.js";
import { $$timeout, $$ts } from "../interfaces.js";
import type { LayerPlanReasonSubroutine } from "./LayerPlan.js";
import { LayerPlan } from "./LayerPlan.js";
import { OutputPlan } from "./OutputPlan.js";
export declare const POLYMORPHIC_ROOT_PATH: null;
export declare const POLYMORPHIC_ROOT_PATHS: ReadonlySet<string> | null;
/** Beware: the list of phases may change over time... @experimental */
export type OperationPlanPhase = "init" | "plan" | "validate" | "optimize" | "finalize" | "ready";
export interface MetaByMetaKey {
    [metaKey: string | number | symbol]: Record<string, any>;
}
export declare class OperationPlan {
    readonly schema: GraphQLSchema;
    readonly operation: OperationDefinitionNode;
    readonly fragments: {
        [fragmentName: string]: FragmentDefinitionNode;
    };
    readonly variableValues: {
        [key: string]: any;
    };
    readonly context: {
        [key: string]: any;
    };
    readonly rootValue: any;
    private readonly planningTimeout;
    readonly [$$timeout]: undefined;
    readonly [$$ts]: undefined;
    readonly queryType: GraphQLObjectType;
    readonly mutationType: GraphQLObjectType | null;
    readonly subscriptionType: GraphQLObjectType | null;
    readonly unionsContainingObjectType: {
        [objectTypeName: string]: ReadonlyArray<GraphQLUnionType>;
    };
    private operationType;
    /**
     * What state is the OpPlan in?
     *
     * 1. init
     * 2. plan
     * 3. validate
     * 5. optimize
     * 6. finalize
     * 7. ready
     *
     * Once in 'ready' state we can execute the plan.
     */
    phase: OperationPlanPhase;
    /**
     * Gets updated as we work our way through the plan, useful for making errors more helpful.
     */
    loc: string[] | null;
    /**
     * If true, then this operation doesn't use (custom) resolvers.
     */
    pure: boolean;
    private startTime;
    private previousLap;
    private laps;
    private optimizeMeta;
    private scalarPlanInfo;
    constructor(schema: GraphQLSchema, operation: OperationDefinitionNode, fragments: {
        [fragmentName: string]: FragmentDefinitionNode;
    }, variableValuesConstraints: Constraint[], variableValues: {
        [key: string]: any;
    }, contextConstraints: Constraint[], context: {
        [key: string]: any;
    }, rootValueConstraints: Constraint[], rootValue: any, planningTimeout: number | null);
    private lap;
    private checkTimeout;
    private planOperation;
    /**
     * Plans a GraphQL query operation.
     */
    private planQuery;
    /**
     * Implements the `PlanOpPlanMutation` algorithm.
     */
    private planMutation;
    /**
     * Implements the `PlanOpPlanSubscription` algorithm.
     */
    private planSubscription;
    /**
     * Gets the item plan for a given parent list plan - this ensures we only
     * create one item plan per parent plan.
     */
    private itemStepForListStep;
    processGroupedFieldSet(outputPlan: OutputPlan, path: readonly string[], polymorphicPath: string | null, polymorphicPaths: ReadonlySet<string> | null, parentStep: Step, objectType: GraphQLObjectType, objectTypeFields: GraphQLFieldMap<any, any>, isMutation: boolean, groupedFieldSet: SelectionSetDigest): void;
    /**
     *
     * @param outputPlan - The output plan that this selection set is being added to
     * @param path - The path within the outputPlan that we're adding stuff (only for root/object OutputPlans)
     * @param parentStep - The step that represents the selection set root
     * @param objectType - The object type that this selection set is being evaluated for (note polymorphic selection should already have been handled by this point)
     * @param selections - The GraphQL selections (fields, fragment spreads, inline fragments) to evaluate
     * @param isMutation - If true this selection set should be executed serially rather than in parallel (each field gets its own LayerPlan)
     */
    private planSelectionSet;
    private internalDependency;
    private planIntoOutputPlan;
    private polymorphicLayerPlanByPathByLayerPlan;
    private getPolymorphicLayerPlan;
    private planField;
    /**
     * A replacement for GraphQL's
     * `CoerceArgumentValues` that factors in tracked variables.
     *
     * @see https://spec.graphql.org/draft/#CoerceArgumentValues()
     */
    private getTrackedArguments;
    /**
     * Sets up tracking for the given value (variableValues, context, rootValue).
     */
    private track;
    /**
     * Checks that no step has a property on it whose value is another step. It
     * should addDependency instead.
     */
    private validateSteps;
    private replaceStep;
    private processStep;
    /**
     * Peers are steps of the same type (but not the same step!) that are in
     * compatible layers and have the same dependencies. Peers must not have side
     * effects. A step is not its own peer.
     */
    private getPeers;
    private isImmoveable;
    /**
     * Attempts to hoist the step into a higher layerPlan to maximize
     * deduplication.
     */
    private hoistStep;
    /**
     * Attempts to push the step into the lowest layerPlan to minimize the need
     * for copying between layer plans.
     */
    private pushDown;
    private _deduplicateInnerLogic;
    private deduplicateStep;
    private deduplicateStepsProcess;
    /**
     * Gives us a chance to replace nearly-duplicate plans with other existing
     * plans (and adding the necessary transforms); this means that by the time
     * we come to optimize the plan tree should already be simpler. For example
     * if you have two plans at the same level that both request row data from
     * the same database table with the same identifiers, `WHERE`, `LIMIT`,
     * `OFFSET` and `ORDER BY`, but different `SELECT`s we could merge the two
     * plans together by replacing the latter with the former and having the
     * former SELECT additional fields, then transform the results back to what
     * our child plans would be expecting.
     */
    private deduplicateSteps;
    private hoistAndDeduplicate;
    private hoistSteps;
    private pushDownSteps;
    /**
     * Calls the 'optimize' method on a plan, which may cause the plan to
     * communicate with its (deep) dependencies, and even to replace itself with
     * a different plan.
     */
    private optimizeStep;
    /**
     * Note that we work through dependents first so we can make sure that we
     * know all our dependent's needs before we optimise ourself.
     */
    private optimizeSteps;
    private inlineSteps;
    /** Finalizes each step */
    private finalizeSteps;
    private finalizeLayerPlans;
    /** Optimizes each output plan */
    private optimizeOutputPlans;
    /** Finalizes each output plan */
    private finalizeOutputPlans;
    private walkOutputPlans;
    generatePlanJSON(): GrafastPlanJSON;
    finishSubroutine(subroutineStep: Step, layerPlan: LayerPlan<LayerPlanReasonSubroutine>): void;
    getStepsByMetaKey(metaKey: string | number | symbol): Step[];
    getStepsByStepClass<TClass extends Step>(klass: {
        new (...args: any[]): TClass;
    }): TClass[];
    private _cacheStepStoreByLayerPlanAndActionKey;
    /**
     * Cache a generated step by a given identifier (cacheKey) such that we don't
     * need to regenerate it on future calls, significantly reducing the load on
     * deduplication later.
     *
     * Note: automatically extends the cached step into other (relevant)
     * polymorphic paths; if this shouldn't be the case then don't use cacheStep
     * and instead rely on deduplication as usual.
     *
     * @experimental
     */
    cacheStep<T extends Step>(ownerStep: Step, actionKey: string, cacheKey: symbol | string | number | boolean | null | undefined, cb: () => T): T;
    /**
     * Clears the cache, typically due to side effects having taken place. Called
     * from setting hasSideEffects on an ExecutableStep, among other places.
     */
    resetCache(): void;
    withRootLayerPlan<T>(cb: () => T): T;
}
//# sourceMappingURL=OperationPlan.d.ts.map