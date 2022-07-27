import type { GraphQLOutputType } from "graphql";

/**
 * @internal
 */
export interface GlobalState {
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
