import type { PromiseOrDirect } from "grafast";
/**
 * Given a persisted operation hash, return the associated GraphQL operation
 * document.
 */
export type PersistedOperationGetter = (hash: string) => PromiseOrDirect<string>;
//# sourceMappingURL=interfaces.d.ts.map