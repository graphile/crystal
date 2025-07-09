import LRU from "@graphile/lru";
import type { FieldNode, GraphQLEnumType, GraphQLObjectType, GraphQLScalarType } from "graphql";
import * as graphql from "graphql";
import type { Bucket } from "../bucket.js";
import type { ExecutionEntryFlags, JSONValue, LocationDetails } from "../interfaces.js";
import type { Step } from "../step.js";
import type { PayloadRoot } from "./executeOutputPlan.js";
import type { LayerPlan } from "./LayerPlan.js";
export type OutputPlanTypeIntrospection = {
    mode: "introspection";
    /**
     * The GraphQL introspection field selection (may include arguments/etc). We
     * can build a GraphQL document from this and issue it to graphql-js rather
     * than replicating that effort.
     */
    field: FieldNode;
    /**
     * The names of the variables used in this document.
     */
    variableNames: string[];
    /**
     * No need to re-run the introspection each time, may as well cache it,
     * right?
     *
     * Key: canonical JSON stringify of the variables used.
     * Value: the GraphQL result (`{data, errors}`) for this.
     */
    introspectionCacheByVariableValues: LRU<string, JSONValue>;
};
export type OutputPlanTypeRoot = {
    /**
     * Always return `{}`
     */
    mode: "root";
    typeName: string;
};
export type OutputPlanTypeObject = {
    /**
     * Return `{}` if non-null
     */
    mode: "object";
    typeName: string;
    deferLabel: string | undefined;
};
export type OutputPlanTypePolymorphicObject = {
    /**
     * Return `{}` if non-null
     */
    mode: "polymorphic";
    typeNames: string[];
    deferLabel: string | undefined;
};
export type OutputPlanTypeArray = {
    /**
     * Return a list of the same length if an array
     */
    mode: "array";
};
export type OutputPlanTypeLeaf = {
    /**
     * Return the value.
     */
    mode: "leaf";
    graphqlType: GraphQLScalarType | GraphQLEnumType;
};
export type OutputPlanTypeNull = {
    mode: "null";
};
/**
 * Thanks to `@stream`, output plans must handle their own nullability concerns
 * and we might need an output plan for any of these:
 *
 * - A concrete object
 * - A polymorphic object
 * - A leaf (enum/scalar)
 * - Something we know will always be null
 * - A list of any of the above
 * - A list of lists
 *
 * In addition to the above, we also need to cover
 *
 * - The root object (which is like a concrete object, except it's never null)
 * - Introspection
 */
export type OutputPlanType = OutputPlanTypeRoot | OutputPlanTypeObject | OutputPlanTypePolymorphicObject | OutputPlanTypeLeaf | OutputPlanTypeNull | OutputPlanTypeArray | OutputPlanTypeIntrospection;
export type OutputPlanKeyValueOutputPlan = {
    type: "outputPlan";
    outputPlan: OutputPlan;
    isNonNull: boolean;
    locationDetails: LocationDetails;
};
export type OutputPlanKeyValueTypeName = {
    type: "__typename";
    locationDetails: LocationDetails;
};
export type OutputPlanKeyValue = OutputPlanKeyValueOutputPlan | OutputPlanKeyValueTypeName;
export type OutputPlanKeyValueOutputPlanWithCachedBits = OutputPlanKeyValueOutputPlan & {
    layerPlanId: number;
};
/**
 * Defines a way of taking a layerPlan and converting it into an output value.
 *
 * The result of executing an output plan will be the following:
 *
 * - data?: the data for this layer, could be object, array or leaf (see OutputPlanMode)
 * - errors: a list of errors that occurred (if any), including path details _within the output plan_
 * - streams: a list of streams that were created
 */
export declare class OutputPlan<TType extends OutputPlanType = OutputPlanType> {
    layerPlan: LayerPlan;
    readonly type: TType;
    /** For errors */
    readonly locationDetails: LocationDetails;
    /**
     * The step that represents the root value. How this is used depends on the
     * OutputPlanMode.
     */
    readonly rootStep: Step;
    /**
     * If this output plan should resolve to an error if a side effect step
     * raises an error, this is that side effect.
     */
    readonly sideEffectStep: Step | null;
    /**
     * For root/object output plans, the keys to set on the resulting object
     * grouped by the concrete object type name.
     *
     * IMPORTANT: the order of these keys is significant, they MUST match the
     * order in the request otherwise we break GraphQL spec compliance!
     */
    keys: {
        [key: string]: OutputPlanKeyValueTypeName | OutputPlanKeyValueOutputPlanWithCachedBits;
    };
    /**
     * For list output plans, the output plan that describes the list children.
     */
    child: OutputPlan | null;
    childIsNonNull: boolean;
    /**
     * For polymorphic output plans, the Object output plan for each specific type.
     */
    childByTypeName: {
        [typeName: string]: OutputPlan<OutputPlanTypeObject>;
    } | undefined;
    /**
     * For object output plan types only.
     */
    deferredOutputPlans: OutputPlan<OutputPlanTypeObject | OutputPlanTypePolymorphicObject>[];
    constructor(layerPlan: LayerPlan, 
    /**
     * For root, this should always be an object.
     *
     * For object this could represent an object or null.
     *
     * For polymorphic this could represent a polymorphic object or null.
     *
     * For array it's the list itself (or null) and dictates the length of the result.
     *
     * For leaf, it's the leaf plan itself.
     *
     * For `introspection`, `null` it's irrelevant. Use `constant(null)` or whatever.
     */
    rootStep: Step, type: TType, locationDetails: LocationDetails);
    print(): string;
    toString(): string;
    addChild(type: GraphQLObjectType | null, key: string | null, child: OutputPlanKeyValue): void;
    getLayerPlans(layerPlans?: Set<LayerPlan<import("./LayerPlan.js").LayerPlanReason>>): Set<LayerPlan>;
    makeNextStepByLayerPlan(): Record<number, any[]>;
    execute(this: OutputPlan, _root: PayloadRoot, _mutablePath: ReadonlyArray<string | number>, _bucket: Bucket, _bucketIndex: number, _rawBucketRootValue?: any, _bucketRootFlags?: ExecutionEntryFlags): JSONValue;
    executeString(this: OutputPlan, _root: PayloadRoot, _mutablePath: ReadonlyArray<string | number>, _bucket: Bucket, _bucketIndex: number, _rawBucketRootValue?: any, _bucketRootFlags?: ExecutionEntryFlags): string;
    optimize(): void;
    finalize(): void;
}
export declare function coerceError(error: Error, locationDetails: LocationDetails, path: ReadonlyArray<string | number>): graphql.GraphQLError;
export declare function nonNullError(locationDetails: LocationDetails, path: readonly (string | number)[]): graphql.GraphQLError;
//# sourceMappingURL=OutputPlan.d.ts.map