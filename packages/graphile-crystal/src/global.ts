import type { GraphQLOutputType } from "graphql";

import type { Aether } from "./aether";

export interface GlobalState {
  aether: Aether;
  parentPathIdentity: string;
  // TODO: rename?
  currentGraphQLType?: GraphQLOutputType;
}

let globalState: GlobalState | null = null;

export function getGlobalState(): GlobalState {
  if (!globalState) {
    throw new Error(
      `getGlobalState called at inappropriate time - there is no global state right now.`,
    );
  }
  return globalState;
}

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
 */
export function getCurrentParentPathIdentity(): string {
  return getGlobalState().parentPathIdentity;
}

let debug = false;
export function setDebug(newDebug: boolean): void {
  debug = newDebug;
}
export function getDebug(): boolean {
  return debug;
}
