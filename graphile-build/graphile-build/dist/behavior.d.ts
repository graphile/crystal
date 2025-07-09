type BehaviorScope = string[];
interface BehaviorSpec {
    positive: boolean;
    scope: BehaviorScope;
}
export type BehaviorDynamicMethods = {
    [entityType in keyof GraphileBuild.BehaviorEntities as `${entityType}Matches`]: (entity: GraphileBuild.BehaviorEntities[entityType], filter: keyof GraphileBuild.BehaviorStrings) => boolean | undefined;
} & {
    [entityType in keyof GraphileBuild.BehaviorEntities as `${entityType}Behavior`]: (entity: GraphileBuild.BehaviorEntities[entityType]) => string;
};
export declare class Behavior {
    private resolvedPreset;
    private build;
    private behaviorEntities;
    private behaviorRegistry;
    behaviorEntityTypes: (keyof GraphileBuild.BehaviorEntities)[];
    private globalDefaultBehavior;
    constructor(resolvedPreset: GraphileConfig.ResolvedPreset, build: GraphileBuild.Build);
    /**
     * Forbid registration of more global behavior defaults, behavior entity types, etc.
     */
    freeze(): Behavior & BehaviorDynamicMethods;
    private registerEntity;
    private assertEntity;
    /**
     * @param localBehaviorSpecsString - the behavior of the entity as determined by details on the entity itself and any applicable ancestors
     * @param filter - the behavior the plugin specifies
     */
    entityMatches<TEntityType extends keyof GraphileBuild.BehaviorEntities, TFilter extends keyof GraphileBuild.BehaviorStrings>(entityType: TEntityType, entity: GraphileBuild.BehaviorEntities[TEntityType], filter: TFilter): boolean | undefined;
    /**
     * Given the entity `rawEntity` of type `entityType`, this function will
     * return the final behavior string for this entity, respecting all the
     * global and entity-specific behaviors.
     *
     * This is expensive to compute, so we cache it.
     *
     * **IMPORTANT**: `rawEntity` should be a fixed value so that the cache can be
     * reused. If it is a dynamic value (e.g. it's a combination of multiple
     * entities) then you should represent it as a tuple and we'll automatically
     * cache that.
     */
    getBehaviorForEntity<TEntityType extends keyof GraphileBuild.BehaviorEntities>(entityType: TEntityType, rawEntity: GraphileBuild.BehaviorEntities[TEntityType]): ResolvedBehavior;
    getInferredBehaviorForEntity<TEntityType extends keyof GraphileBuild.BehaviorEntities>(entityType: TEntityType, rawEntity: GraphileBuild.BehaviorEntities[TEntityType]): ResolvedBehavior;
    getOverrideBehaviorForEntity<TEntityType extends keyof GraphileBuild.BehaviorEntities>(entityType: TEntityType, rawEntity: GraphileBuild.BehaviorEntities[TEntityType]): ResolvedBehavior;
    getCombinedBehaviorForEntities<TEntityType extends keyof GraphileBuild.BehaviorEntities>(entityType: TEntityType, sources: {
        [entityType in keyof GraphileBuild.BehaviorEntities]?: GraphileBuild.BehaviorEntities[entityType];
    }): ResolvedBehavior;
    getPreferencesAppliedBehaviors<TEntityType extends keyof GraphileBuild.BehaviorEntities>(entityType: TEntityType, inferredBehavior: ResolvedBehavior, overrideBehavior: ResolvedBehavior): ResolvedBehavior;
    /** @deprecated Please use entityMatches or stringMatches instead */
    matches(localBehaviorSpecsString: string | string[] | null | undefined, filter: string, defaultBehavior?: string): boolean | undefined;
    parseBehaviorString(behaviorString: string): BehaviorSpec[];
    parseScope(filter: string): BehaviorScope;
    private resolveBehavior;
    private validateBehavior;
    _defaultBehaviorByEntityTypeCache: Map<"string", string>;
    getDefaultBehaviorFor(entityType: keyof GraphileBuild.BehaviorEntities): string;
}
export declare function joinBehaviors(strings: ReadonlyArray<string | null | undefined>): GraphileBuild.BehaviorString;
export declare function joinResolvedBehaviors(behaviors: ReadonlyArray<ResolvedBehavior>): ResolvedBehavior;
interface StackItem {
    source: string;
    prefix: string;
    suffix: string;
}
interface ResolvedBehavior {
    stack: ReadonlyArray<StackItem>;
    behaviorString: GraphileBuild.BehaviorString;
    toString(): string;
}
/**
 * We're strict with this because we want to be able to expand this in future.
 * For example I want to allow `@behavior all some` to operate the same as
 * `@behavior all\n@behavior some`. I also want to be able to add
 * `@behavior -all` to remove a previously enabled behavior.
 */
export declare function isValidBehaviorString(behavior: unknown): behavior is GraphileBuild.BehaviorString;
export {};
//# sourceMappingURL=behavior.d.ts.map