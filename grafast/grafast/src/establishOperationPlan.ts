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
  Fragments,
  LinkedList,
  OperationPlanOrError,
} from "./interfaces.js";
import { $$cacheByOperation, $$timeout, $$ts } from "./interfaces.js";
import { timeSource } from "./timeSource.js";

const debug = debugFactory("grafast:establishOperationPlan");

// How long is a timeout valid for? Here I've set it to 60 seconds.
const TIMEOUT_TIMEOUT =
  (typeof process.env.GRAFAST_TIMEOUT_VALIDITY_MS === "string"
    ? parseInt(process.env.GRAFAST_TIMEOUT_VALIDITY_MS, 10)
    : null) || 60_000;
// OPTIMIZE: we should consider increasing the timeout once the process has been
// running a while (since the JIT should have kicked in) - we could even use
// `setTimeout` to trigger it after certain amount of time elapsed.

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
  let cacheByOperation = schema.extensions.grafast?.[$$cacheByOperation];

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
    if (!schema.extensions.grafast) {
      (schema.extensions as any).grafast = Object.create(null);
    }
    cacheByOperation = new LRU({
      maxLength: schema.extensions.grafast!.operationsCacheMaxLength ?? 500,
    });
    schema.extensions.grafast![$$cacheByOperation] = cacheByOperation;
  }
  const operationPlanOrError = operationPlan ?? error!;
  if (!cache) {
    cache = {
      fragments,
      possibleOperationPlans: { value: operationPlanOrError, next: null },
    };
    cacheByOperation.set(operation, cache);
  } else {
    const max =
      schema.extensions.grafast!.operationOperationPlansCacheMaxLength ?? 50;
    if (count >= max) {
      // Remove the tail to ensure we never grow too big
      lastButOneItem!.next = null;
      count--;
      // LOGGING: we should announce this so that people know there's something that needs fixing in their schema (too much eval?)
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
