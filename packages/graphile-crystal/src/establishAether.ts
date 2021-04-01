import {
  GraphQLSchema,
  FragmentDefinitionNode,
  OperationDefinitionNode,
} from "graphql";
import debugFactory from "debug";
import { Aether } from "./aether";
import { matchesConstraints } from "./constraints";
import { isDev, noop } from "./dev";

const debug = debugFactory("crystal:establishAether");
type Fragments = {
  [key: string]: FragmentDefinitionNode;
};

interface LinkedList<T> {
  value: T;
  next: LinkedList<T> | null;
}

interface Cache {
  /**
   * Implemented as a linked list so the hot aethers can be kept at the top of the
   * list, and if the list grows beyond a maximum size we can drop the last
   * element.
   */
  possibleAethers: LinkedList<Aether>;
  fragments: Fragments;
}
type CacheByOperation = WeakMap<OperationDefinitionNode, Cache>;
const cacheByOperationBySchema = new WeakMap<GraphQLSchema, CacheByOperation>();

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
 * Implements the `IsAetherCompatible` algorithm.
 *
 * @remarks Due to the optimisation in `establishAether`, the schema, document
 * and operationName checks have already been performed.
 */
export function isAetherCompatible(
  aether: Aether,
  variableValues: { [variableName: string]: unknown },
  context: unknown,
  rootValue: unknown,
): boolean {
  const {
    variableValuesConstraints,
    contextConstraints,
    rootValueConstraints,
  } = aether;
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
 * Implements the `EstablishAether` algorithm.
 *
 * @remarks Though EstablishAether accepts document and operationName, we
 * instead accept operation and fragments since they're easier to get a hold of
 * in GraphQL.js.
 */
export function establishAether<
  TContext extends { [key: string]: unknown }
>(details: {
  schema: GraphQLSchema;
  operation: OperationDefinitionNode;
  fragments: Fragments;
  variableValues: {
    [variableName: string]: unknown;
  };
  context: TContext;
  rootValue: {
    [key: string]: unknown;
  };
}): Aether {
  const {
    schema,
    operation,
    fragments,
    variableValues,
    context,
    rootValue,
  } = details;
  let cacheByOperation = cacheByOperationBySchema.get(schema);
  let cache = cacheByOperation?.get(operation);
  if (cache) {
    assertFragmentsMatch(cache.fragments, fragments);
    let previousItem: LinkedList<Aether> | null = null;
    let linkedItem: LinkedList<Aether> | null = cache.possibleAethers;
    while (linkedItem) {
      if (
        isAetherCompatible(linkedItem.value, variableValues, context, rootValue)
      ) {
        // Hoist to top of linked list
        if (previousItem) {
          // Remove linkedItem from existing chain
          previousItem.next = linkedItem.next;
          // Add rest of chain after linkedItem
          linkedItem.next = cache.possibleAethers;
          // linkedItem is now head of chain
          cache.possibleAethers = linkedItem;
        }
        return linkedItem.value;
      }
      previousItem = linkedItem;
      linkedItem = linkedItem.next;
    }
  }
  const aether = new Aether(
    schema,
    operation,
    fragments,
    variableValues,
    context,
    rootValue,
  );

  // Store it to the cache (temporarily)
  if (!cacheByOperation) {
    cacheByOperation = new WeakMap();
    cacheByOperationBySchema.set(schema, cacheByOperation);
  }
  if (!cache) {
    cache = {
      fragments,
      possibleAethers: { value: aether, next: null },
    };
    cacheByOperation.set(operation, cache);
  } else {
    // Add new aether to top of the linked list.
    cache.possibleAethers = {
      value: aether,
      next: cache.possibleAethers,
    };
    // TODO: trim off tail of list?
  }

  return aether;
}
