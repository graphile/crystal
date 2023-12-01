import type { PromiseOrDirect } from "grafast";
import type {} from "graphile-config";

/**
 * Given a persisted operation hash, return the associated GraphQL operation
 * document.
 */
export type PersistedOperationGetter = (
  hash: string,
) => PromiseOrDirect<string>;
