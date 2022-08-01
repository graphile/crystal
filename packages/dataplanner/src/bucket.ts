import type { GraphQLScalarType } from "graphql";

import type { LayerPlan } from "./engine/LayerPlan";
import type { ExecutionEventEmitter } from "./interfaces.js";

/**
 * @internal
 */
export interface RequestContext {
  readonly toSerialize: Array<{
    /** object (or array) */
    o: object;
    /** key (or index) */
    k: string | number;
    /** serializer */
    s: GraphQLScalarType["serialize"];
  }>;

  readonly eventEmitter: ExecutionEventEmitter | undefined;
}

/**
 * A "bucket" is where the results from plans are stored so that other plans
 * can retrieve them, it may take on different forms depending on the mode of
 * execution. A "LayerPlan" is used to both identify the bucket and to specify
 * why it exists and how it behaves.
 *
 * Every `ExecutableStep` belongs to exactly one LayerPlan (and thus bucket),
 * specified by `plan.layerPlan`.
 *
 * @internal
 */
export interface Bucket {
  /**
   * The LayerPlan definition this bucket adheres to
   */
  layerPlan: LayerPlan;

  /**
   * An array of the same size as the bucket to feed to plans that have no
   * dependencies so they output the right number of results.
   */
  noDepsList: readonly undefined[];

  /**
   * Every entry in the store is a list with the same length as the bucket has
   * `size`.
   */
  store: { [planId: number]: any[] };
}
