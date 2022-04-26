import type { GraphQLScalarType } from "graphql";
import { inspect } from "util";

import type { CrystalError } from ".";
import { isCrystalError, newCrystalError } from "./error";
import type {
  ExecutionEventEmitter} from "./interfaces";
import {
  $$concreteType,
  $$idempotent
} from "./interfaces";
import type { ExecutablePlan } from "./plan";
import { isPolymorphicData } from "./polymorphic";
import { arrayOfLength } from "./utils";

/**
 * This is an interface other interfaces inherit from, it should never be used
 * directly.
 */
export interface IBucketDefinitionOutputMode {
  /**
   * O - outputs an object
   * A - outputs an array
   * L - outputs a leaf
   */
  type: "O" | "A" | "L";
  notNull: boolean;
}

/** For objects */
export interface BucketDefinitionObjectOutputMode
  extends IBucketDefinitionOutputMode {
  type: "O";
  objectCreator: (typeName: string | null) => object;
}

/** For arrays (a.k.a. lists) */
export interface BucketDefinitionArrayOutputMode
  extends IBucketDefinitionOutputMode {
  type: "A";
}

/** For leaves - enums and scalars */
export interface BucketDefinitionLeafOutputMode
  extends IBucketDefinitionOutputMode {
  type: "L";
  serialize: GraphQLScalarType["serialize"];
}

export type BucketDefinitionOutputMode =
  | BucketDefinitionObjectOutputMode
  | BucketDefinitionArrayOutputMode
  | BucketDefinitionLeafOutputMode;

// TODO: for defer buckets we'll need to copy previous plans across and set
// their outputs again (if they're duplicated in the deferred selection set as
// well as the root selection set).
export interface BucketDefinitionFieldOutputMap {
  /**
   * The plan that populates this field, which may differ based on the
   * rootPathIdentity used to reach here.
   */
  planIdByRootPathIdentity: {
    [rootPathIdentity: string]: string;
  };
  modeType: BucketDefinitionOutputMode["type"];
  /**
   * The mode for this field; either object, array or leaf.
   */
  modeByRootPathIdentity: {
    [rootPathIdentity: string]: BucketDefinitionOutputMode;
  };
  /**
   * The name of the named GraphQL result type of this field.
   */
  typeName: string;
  /**
   * Only valid when mode is 'O'; otherwise null.
   */
  children: {
    [responseKey: string]: BucketDefinitionFieldOutputMap;
  } | null;
  /**
   * For a polymorphic bucket, the list of type names within that bucket that
   * set this (potentially nested) key; otherwise null.
   */
  typeNames: null | string[];
}

/**
 * A "bucket" is where the results from plans are stored so that other plans
 * can retrieve them, it may take on different forms depending on the mode of
 * execution. A "BucketDefinition" is used to both identify the bucket and to
 * specify why it exists and how it behaves.
 *
 * Every `ExecutablePlan` belongs to exactly one bucket, specified by
 * `plan.bucketId`. Which bucket the plan belongs to is determined by:
 *
 * - `__ItemPlan`s trigger a new bucket for themselves and anything
 *   that depends on them.  This covers "list", "stream" and "subscription".
 * - Otherwise, plans that cross a `@defer` boundary (i.e. they're needed to resolve a
 *   `@defer`'d fragment but they aren't required to resolve the parent selection
 *   set (ignoring the deferred fragment)) will be assigned a new "defer"
 *   bucket.
 * - Otherwise, plans that cross a mutation field boundary (they exist for the
 *   mutation's result selection set) get a new bucket.
 * - Otherwise, plans that have no dependencies go into the root bucket
 * - Otherwise, if all the plan's dependencies' buckets overlap then the plan
 *   is assigned to the containing bucket (the largest bucket), and add the ids
 *   for plans not in this containing bucket to the containing bucket's
 *   `copyPlanIds`.
 * - Otherwise, a new "join" bucket is created representing the union of the
 *   largest non-overlapping buckets (and the relevant "copyPlanIds" are set).
 *
 * This value is then used to influence:
 *
 * 1. how plans are deduplicated
 * 2. the order in which the plans are executed
 * 3. where the result of executing the plan is stored
 * 4. when the plan execution cache is allowed to be GC'd
 *
 * NOTE: `__ListTransformPlan`'s effectively have a temporary bucket inside
 * them (built on the `__Item`) that's thrown away once the transform is
 * complete.
 *
 * @internal
 */
export interface BucketDefinition {
  /**
   * The array index of this BucketDefinition in Aether.buckets
   */
  id: number;

  /**
   * All buckets have at least one parent, except the root bucket
   */
  parent: BucketDefinition | null;

  /**
   * Every bucket represents one or more selection sets (or a list/stream
   * intermediary), as such they have a list of "root path identities" they
   * represent. For `group` buckets this is the rootPathIdentities of the
   * group, for `item` buckets this is the path identities that the
   * `__ItemPlan`'s parent serves plus `[]`.
   */
  rootPathIdentities: string[];

  /**
   * If this bucket has a plan for setting it's own root object, let this be
   * that.
   */
  rootOutputPlanId?: string;
  /**
   * If this bucket has a plan for setting it's own root object, what type of
   * processing should it get?.
   */
  rootOutputModeType?: BucketDefinitionOutputMode["type"];
  rootOutputModeByRootPathIdentity?: {
    [rootPathIdentity: string]: BucketDefinitionOutputMode;
  };

  /**
   * If this is not a polymorphic bucket, what is the associated type name?
   */
  singleTypeNameByRootPathIdentity: {
    [rootPathIdentity: string]: string;
  } | null;

  /**
   * Some plans that execute within this bucket may be output to a particular
   * path identity or list of path identities (as dictated by a reverse lookup
   * on Aether's planIdByPathIdentity). This output map is a digest of this
   * information.
   */
  outputMap: {
    [fieldName: string]: BucketDefinitionFieldOutputMap;
  };

  /**
   * Parents, grandparents, etc
   */
  ancestors: BucketDefinition[];

  /**
   * All buckets that have this bucket as one of their parents
   */
  children: BucketDefinition[];

  // The following properties indicate the type of this bucket -
  // item/group/polymorphic. Note that every bucket should have at least one of
  // these properties set. The root bucket is seen as "group 0".  Previously we
  // had a 'type' field, but we need to cover the case of a "deferred
  // polymorphic" bucket which mixes group and polymorphic, so we went with a
  // list of options instead.
  // TODO: a stream interface should really have that the stream item is both
  // deferred (group) and item.
  /**
   * If this bucket was caused by an `__ItemPlan` (list, stream, subscription)
   * then what's the id of that `__ItemPlan`.
   */
  itemPlanId?: string;
  /**
   * If this is a 'group' bucket, which group is it?
   */
  groupId?: number;
  /**
   * If this is a 'polymorphic' bucket, the ids of the polymorphic plan(s) that
   * can use it.
   */
  polymorphicPlanIds?: string[];
  /**
   * If this is a 'polymorphic' bucket, the name of the object type(s) it applies to.
   */
  polymorphicTypeNames?: string[];

  /*
   * TODO:
   *
   * Consider splitting 'item' into:
   *
   * - list - represents plans starting at an `__ItemPlan` from a list
   * - stream - represents plans starting at an `__ItemPlan` from a list that has `@stream` (async iterator)
   * - subscription - represents plans starting at an `__ItemPlan` from a subscription (async iterator)
   *
   * Consider splitting 'group' into:
   *
   * - mutation - plans that are for a mutations' resulting selection set
   * - defer - represents plans that are `@defer`-red
   *
   * @stream should not increase the groupId until the `__ItemPlan`? (Maybe
   * this is already the case?) How does @stream affect buckets?
   */

  /**
   * Which plans the results for which are available in a parent bucket need to
   * be "copied across" to this bucket because plans in this bucket still
   * reference them?
   */
  copyPlanIds: string[];

  plans: ExecutablePlan[];
  startPlans: ExecutablePlan[];
}

/**
 * @internal
 */
export interface RequestContext {
  readonly shouldTryToBypassGraphQL: boolean;
  readonly hasIssue: () => void;
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
 * When we take a plan result and store it to the result tree, for non-leaf
 * plans we're either storing a list or an object. What the underlying plan
 * represents this as is irrelevant - e.g. a plan for an object type might
 * return a tuple instead of an object; this is fine - we should still add an
 * object to the result tree.
 *
 * Where possible we try and "merge" the result with the previous result.
 *
 * @internal
 */
export function bucketValue(
  object: object,
  key: string | number,
  value: any,
  mode: BucketDefinitionOutputMode,
  concreteType: string | null,
  // This gets called if any of the non-null constraints are failed, or if
  // there was an error. This triggers processing through the GraphQL.js stack.
  requestContext: RequestContext,
): any {
  const handleNull = (v: undefined | null | CrystalError) => {
    if (mode.notNull || v != null) {
      requestContext.hasIssue();
    }
    return v != null ? v : v;
  };
  if (isCrystalError(value)) {
    return handleNull(value);
  }
  if (value == null) {
    return handleNull(value);
  }
  switch (mode.type) {
    case "A": {
      if (Array.isArray(value)) {
        return arrayOfLength(value.length);
      } else {
        console.warn(
          `Hit fallback for value ${inspect(value)} coercion to mode ${
            mode.type
          }`,
        );
        return handleNull(null);
      }
    }
    case "O": {
      const typeName = isPolymorphicData(value)
        ? value[$$concreteType]
        : concreteType;
      return mode.objectCreator(typeName);
    }
    case "L": {
      if (requestContext.shouldTryToBypassGraphQL) {
        if (mode.serialize[$$idempotent]) {
          try {
            return mode.serialize(value);
          } catch (e) {
            return handleNull(newCrystalError(e));
          }
        } else {
          // Queue serialization to take place when we know no errors can occur
          requestContext.toSerialize.push({
            o: object,
            k: key,
            s: mode.serialize,
          });
          return value;
        }
      } else {
        return value;
      }
    }
    default: {
      const never: never = mode;
      throw new Error(
        `GraphileInternalError<31d26531-b20f-434c-91d8-686048da404c>: Unhandled bucket mode '${never}'`,
      );
    }
  }
}

/**
 * An indirection that allows replacing the root value (e.g. if an error
 * occurs).
 *
 * @remarks
 *
 * This will become more complex when we add error handling into the execution
 * V2 code; currently we just defer that to GraphQL.js.
 */
export class BucketSetter {
  public concreteType: string | undefined;
  constructor(
    public rootPathIdentity: string,
    public parentObject: object | unknown[],
    public parentKey: number | string,
  ) {
    this.concreteType = parentObject[parentKey]?.[$$concreteType];
  }

  public getRoot() {
    return this.parentObject[this.parentKey];
  }
  public setRoot(newRoot: any) {
    this.parentObject[this.parentKey] = newRoot;
    this.concreteType = newRoot?.[$$concreteType];
  }
}

/**
 * A run-time bucket (incarnation of a BucketDefinition), this is where plan
 * results are stored so that they can be fed into the next plans to run.
 */
export interface Bucket {
  /**
   * The bucket definition this bucket adheres to
   */
  definition: BucketDefinition;
  /**
   * Same length as the bucket has 'size'
   */
  input: BucketSetter[];
  /**
   * An array of the same size as the bucket to feed to plans that have no
   * dependencies so they output the right number of results.
   */
  noDepsList: readonly undefined[];
  /**
   * Every entry in the store is a list with the same length as the bucket has
   * `size`.
   */
  store: { [planId: string]: any[] };

  /**
   * If an error occurred at any stage we need to drop down to more careful
   * (and slower) handling.
   */
  hasErrors: boolean;
}
