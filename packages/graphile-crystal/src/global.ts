import type { Aether } from "./aether";
import { GLOBAL_PATH } from "./constants";

export const globalState = {
  debug: false as boolean,
  aether: null as Aether | null,
  parentPathIdentity: GLOBAL_PATH as string,
};

/**
 * Since plan functions are called synchronously _by us_ we don't need to pass
 * around a reference to Aether that users then have to pass back to us;
 * instead we can pull it from this global state. This is not dissimilar to how
 * React's hooks work.
 */
export function getCurrentAether(): Aether {
  const aether = globalState.aether;
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
  return globalState.parentPathIdentity;
}
