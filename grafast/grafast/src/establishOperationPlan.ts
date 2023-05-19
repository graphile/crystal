import LRU from "@graphile/lru";
import debugFactory from "debug";
import type {
  FragmentDefinitionNode,
  GraphQLSchema,
  OperationDefinitionNode,
} from "graphql";

import { matchesConstraints } from "./constraints.js";
import { isDev, noop } from "./dev.js";
import { OperationPlan, SafeError } from "./index.js";
import type {
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
} from "./interfaces.js";
import { $$timeout, $$ts } from "./interfaces.js";
import { timeSource } from "./timeSource.js";

const debug = debugFactory("grafast:establishOperationPlan");

// How long is a timeout valid for? Here I've set it to 60 seconds.
const TIMEOUT_TIMEOUT =
  (typeof process.env.GRAFAST_TIMEOUT_VALIDITY_MS === "string"
    ? parseInt(process.env.GRAFAST_TIMEOUT_VALIDITY_MS, 10)
    : null) || 60_000;
// TODO: we should consider increasing the timeout once the process has been
// running a while (since the JIT should have kicked in) - we could even use
// `setTimeout` to trigger it after certain amount of time elapsed.

type Fragments = {
  [key: string]: FragmentDefinitionNode;
};

type OperationPlanOrError =
  | OperationPlan
  | Error
  | SafeError<
      | { [$$timeout]: number; [$$ts]: number }
      | { [$$timeout]?: undefined; [$$ts]?: undefined }
      | undefined
    >;

interface LinkedList<T> {
  value: T;
  next: LinkedList<T> | null;
}

/**
 * This represents the list of possible operationPlans for a specific document.
 *
 * @remarks
 *
 * It also includes the fragments for validation, but generally we trust that
 * if the OperationDefinitionNode is the same then the request is equivalent.
 */
interface Cache {
  /**
   * Implemented as a linked list so the hot operationPlans can be kept at the top of the
   * list, and if the list grows beyond a maximum size we can drop the last
   * element.
   */
  possibleOperationPlans: LinkedList<OperationPlanOrError> | null;
  fragments: Fragments;
}

/**
 * The starting point for finding/storing the relevant OperationPlan for a request.
 */
type CacheByOperation = LRU<OperationDefinitionNode, Cache>;

/**
 * This is a development-only validation to check fragments do, in fact, match
 * - even if the objects themselves differ.
 */
function reallyAssertFragmentsMatch(
  oldFragments: Fragments,
  fragments: Fragments,
): void {
  if (oldFragments !== fragments) {
    debug("fragments aren't `===` for same operation");
    // Consistency check - we assume that if the operation is the same then
    // the fragments will be, but this may not be the case depending on if
    // GraphQL.js caches the operation node.
    const oldKeys = Object.keys(oldFragments).sort();
    const newKeys = Object.keys(fragments).sort();
    const oldKeyStr = oldKeys.join(",");
    const newKeyStr = newKeys.join(",");
    if (oldKeyStr.length !== newKeyStr.length) {
      throw new Error(
        `Inconsistency error: operation matches, but fragment keys differ: '${oldKeyStr}' != '${newKeyStr}'.`,
      );
    }
    for (const key of newKeys) {
      if (oldFragments[key] !== fragments[key]) {
        throw new Error(
          `Inconsistency error: operation matches, fragment names match, but fragment '${key}' is not '===' to the previous value.`,
        );
      }
    }
  }
}

// Optimise this away in production.
const assertFragmentsMatch = !isDev ? noop : reallyAssertFragmentsMatch;

/**
 * Implements the `IsOpPlanCompatible` algorithm.
 *
 * @remarks Due to the optimisation in `establishOperationPlan`, the schema, document
 * and operationName checks have already been performed.
 */
function isOperationPlanCompatible<
  TVariables extends BaseGraphQLVariables = BaseGraphQLVariables,
  TContext extends Grafast.Context = Grafast.Context,
  TRootValue extends BaseGraphQLRootValue = BaseGraphQLRootValue,
>(
  operationPlan: OperationPlan,
  variableValues: TVariables,
  context: TContext,
  rootValue: TRootValue,
): operationPlan is OperationPlan {
  const {
    variableValuesConstraints,
    contextConstraints,
    rootValueConstraints,
  } = operationPlan;
  if (!matchesConstraints(variableValuesConstraints, variableValues)) {
    return false;
  }
  if (!matchesConstraints(contextConstraints, context)) {
    return false;
  }
  if (!matchesConstraints(rootValueConstraints, rootValue)) {
    return false;
  }
  return true;
}

/**
 * We store the cache directly onto the GraphQLSchema so that it gets garbage
 * collected along with the schema when it's not needed any more. To do so, we
 * attach it using this symbol.
 */
const $$cacheByOperation = Symbol("cacheByOperation");

declare module "graphql" {
  interface GraphQLSchema {
    [$$cacheByOperation]?: CacheByOperation;
  }
}

/**
 * Implements the `EstablishOpPlan` algorithm.
 *
 * @remarks Though EstablishOpPlan accepts document and operationName, we
 * instead accept operation and fragments since they're easier to get a hold of
 * in GraphQL.js.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function establishOperationPlan<
  TVariables extends BaseGraphQLVariables = BaseGraphQLVariables,
  TContext extends Grafast.Context = Grafast.Context,
  TRootValue extends BaseGraphQLRootValue = BaseGraphQLRootValue,
>(
  schema: GraphQLSchema,
  operation: OperationDefinitionNode,
  fragments: Fragments,
  variableValues: TVariables,
  context: TContext,
  rootValue: TRootValue,
  planningTimeout: number | null = null,
): OperationPlan {
  let cacheByOperation = schema[$$cacheByOperation];

  let cache = cacheByOperation?.get(operation);

  // These two variables to make it easy to trim the linked list later.
  let count = 0;
  let lastButOneItem: LinkedList<OperationPlanOrError> | null = null;

  if (cache !== undefined) {
    // Dev-only validation
    assertFragmentsMatch(cache.fragments, fragments);

    let previousItem: LinkedList<OperationPlanOrError> | null = null;
    let linkedItem: LinkedList<OperationPlanOrError> | null =
      cache.possibleOperationPlans;
    while (linkedItem) {
      const value = linkedItem.value;
      if (value instanceof SafeError) {
        if (value.extensions?.[$$timeout] != null) {
          if (value.extensions[$$ts] < timeSource.now() - TIMEOUT_TIMEOUT) {
            // Remove this out of date timeout
            linkedItem = linkedItem.next;
            if (previousItem !== null) {
              previousItem.next = linkedItem;
            } else {
              cache.possibleOperationPlans = linkedItem;
            }
            continue;
          }
          if (
            planningTimeout !== null &&
            value.extensions[$$timeout] >= planningTimeout
          ) {
            // It was a timeout error - do not retry
            throw value;
          } else {
            // That's Not My Timeout, let's try again.
          }
        } else {
          // Not a timeout error - this will always fail in the same way?
          throw value;
        }
      } else if (value instanceof Error) {
        // Not a timeout error - this will always fail in the same way?
        throw value;
      } else if (
        isOperationPlanCompatible(value, variableValues, context, rootValue)
      ) {
        // Hoist to top of linked list
        if (previousItem !== null) {
          // Remove linkedItem from existing chain
          previousItem.next = linkedItem.next;
          // Add rest of chain after linkedItem
          linkedItem.next = cache.possibleOperationPlans;
          // linkedItem is now head of chain
          cache.possibleOperationPlans = linkedItem;
        }

        // We found a suitable OperationPlan - use that!
        return value;
      }

      count++;
      lastButOneItem = previousItem;
      previousItem = linkedItem;
      linkedItem = linkedItem.next;
    }
  }

  // No suitable OperationPlan found, time to make one.
  let operationPlan: OperationPlan | undefined;
  let error: Exclude<OperationPlanOrError, OperationPlan> | undefined;
  try {
    operationPlan = new OperationPlan(
      schema,
      operation,
      fragments,
      variableValues,
      context,
      rootValue,
      planningTimeout,
    );
  } catch (e) {
    error = e;
  }

  // Store it to the cache
  if (!cacheByOperation) {
    // TODO: make this configurable
    cacheByOperation = new LRU({ maxLength: 500 });
    schema[$$cacheByOperation] = cacheByOperation;
  }
  const operationPlanOrError = operationPlan ?? error!;
  if (!cache) {
    cache = {
      fragments,
      possibleOperationPlans: { value: operationPlanOrError, next: null },
    };
    cacheByOperation.set(operation, cache);
  } else {
    // TODO: make this configurable
    if (count >= 50) {
      // Remove the tail to ensure we never grow too big
      lastButOneItem!.next = null;
      count--;
      // TODO: we should announce this so that people know there's something that needs fixing in their schema (too much eval?)
    }

    // Add new operationPlan to top of the linked list.
    cache.possibleOperationPlans = {
      value: operationPlanOrError,
      next: cache.possibleOperationPlans,
    };
  }
  if (error !== undefined) {
    throw error;
  } else {
    return operationPlan!;
  }
}
