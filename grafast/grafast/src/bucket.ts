// import type { GraphQLScalarType } from "graphql";

import type { ExecutableStep } from ".";
import type { LayerPlan } from "./engine/LayerPlan";
import type { MetaByMetaKey } from "./engine/OperationPlan";
import type {
  ExecutionEntryFlags,
  ExecutionEventEmitter,
  ExecutionValue,
} from "./interfaces.js";

/**
 * @internal
 */
export interface RequestTools {
  /** The `timeSource.now()` at which the request started executing */
  startTime: number;
  /** The `timeSource.now()` at which the request should stop executing (if a timeout was configured) */
  stopTime: number | null;

  // readonly toSerialize: Array<{
  //   /** object (or array) */
  //   o: object;
  //   /** key (or index) */
  //   k: string | number;
  //   /** serializer */
  //   s: GraphQLScalarType["serialize"];
  //   /** GraphQL request path */
  //   p: Array<string | number>;
  // }>;

  readonly eventEmitter: ExecutionEventEmitter | undefined;

  /**
   * If we're running inside GraphQL then we should not serialize scalars,
   * otherwise we'll face the double-serialization problem.
   */
  insideGraphQL: false;
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
  /** @internal */
  toString?(): string;

  /**
   * The LayerPlan definition this bucket adheres to
   */
  layerPlan: LayerPlan;

  /**
   * How many entries are there in the bucket?
   */
  size: number;

  /**
   * The polymorphic path through which each of the entries (respectively) has
   * travelled. This influences the steps that will be executed using the
   * related inputs.
   */
  polymorphicPathList: readonly (string | null)[];

  // PERF: this is only required when stream is enabled (and only for buckets
  // that may contain streamed things, directly or indirectly) - we should only
  // set it in those cases.
  /**
   * These are the iterators the bucket (or its descendents, without crossing a
   * stream/defer boundary) have created (if any). Each of these must either be
   * processed via `processRoot`, or must be manually released (via
   * `releaseUnusedIterators`) otherwise a memory leak could occur.
   */
  iterators: Array<Set<AsyncIterator<any> | Iterator<any>>>;

  /**
   * `metaByMetaKey` belongs to the bucket rather than the request context
   * because mutations and subscriptions shouldn't re-use caches.
   *
   * TODO: `inheritMeta: boolean`?
   */
  metaByMetaKey: MetaByMetaKey;

  /**
   * Every entry in the store is an execution value. If the execution value is a
   * batch, then it represents a list with the same length the bucket has
   * (`size`).
   *
   * The entry for '-1' is the request indexes, so we can associate the results
   * back to the request that triggered them.
   */
  store: Map<number, ExecutionValue>;

  setResult(
    step: ExecutableStep,
    index: number,
    value: any,
    flags: ExecutionEntryFlags,
  ): void;

  /**
   * Set this true when the bucket is fully executed.
   *
   * Initialize it to false.
   */
  isComplete: boolean;

  /**
   * A union of all the ExecutionEntryStates in this bucket. Generally, if it's
   * non-zero then we need to perform careful (and slower) handling.
   *
   * Initialize it to 0.
   */
  flagUnion: ExecutionEntryFlags;

  /**
   * The child buckets of this bucket.
   */
  children: {
    [layerPlanId: number]: {
      bucket: Bucket;
      map: Map<number, number | number[]>;
    };
  };
}
