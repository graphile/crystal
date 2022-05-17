import type { GraphQLOutputType } from "graphql";

import type { Aether } from "./aether.js";

/**
 * @internal
 */
export interface GlobalState {
  aether: Aether;
  parentPathIdentity: string;
  // TODO: rename?
  currentGraphQLType?: GraphQLOutputType;
}

let globalState: GlobalState | null = null;

/**
 * @internal
 */
function getGlobalState(): GlobalState {
  if (!globalState) {
    throw new Error(
      `getGlobalState called at inappropriate time - there is no global state right now.`,
    );
  }
  return globalState;
}

/**
 * This function sets a global state and then invokes the callback, restoring
 * the global state afterwards. This allows code inside the callback to easily
 * access a wealth of information without us having to hand the information all
 * the way through the call tree - this is not dissimilar to how React hooks
 * work.
 *
 * Calls to this function must never be nested (doing so will throw an
 * error).
 *
 * @internal
 */
export function withGlobalState<T>(
  newGlobalState: GlobalState,
  callback: () => T,
): T {
  if (globalState) {
    throw new Error("withGlobalState may not be called nested");
  }
  globalState = newGlobalState;
  try {
    return callback();
  } finally {
    globalState = null;
  }
}

/**
 * Since plan functions are called synchronously _by us_ we don't need to pass
 * around a reference to Aether that users then have to pass back to us;
 * instead we can pull it from this global state. This is not dissimilar to how
 * React's hooks work.
 */
export function getCurrentAether(): Aether {
  const aether = getGlobalState().aether;
  if (!aether) {
    throw new Error(
      "You have broken the rules of Graphile Crystal Plans; they must only be created synchronously from inside the relevant `plan` function.",
    );
  }
  return aether;
}

/**
 * Like with `getCurrentAether`, since plan functions are called synchronously
 * _by us_ we can pull the current parentPathIdentity from global state.
 *
 * @internal
 */
export function getCurrentParentPathIdentity(): string {
  return getGlobalState().parentPathIdentity;
}

/**
 * @internal
 */
export function getCurrentGraphQLType(): GraphQLOutputType | undefined {
  return getGlobalState().currentGraphQLType;
}

let debug = false;
export function setDebug(newDebug: boolean): void {
  debug = newDebug;
}
export function getDebug(): boolean {
  return debug;
}
