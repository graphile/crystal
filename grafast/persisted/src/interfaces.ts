import type { PromiseOrDirect } from "grafast";
import type {
  ParsedGraphQLBody,
  ProcessGraphQLRequestBodyEvent,
} from "grafserv";
import type {} from "graphile-config";

/**
 * Given a persisted operation hash, return the associated GraphQL operation
 * document.
 */
export type PersistedOperationGetter = (
  hash: string,
) => PromiseOrDirect<string>;

declare global {
  namespace GraphileConfig {
    interface GrafservOptions {
      /**
       * This function will be passed a GraphQL request object (normally
       * `{query: string, variables?: any, operationName?: string, extensions?: any}`,
       * but in the case of persisted operations it likely won't have a `query`
       * property), and must extract the hash to use to identify the persisted
       * operation. For Apollo Client, this might be something like:
       * `request?.extensions?.persistedQuery?.sha256Hash`; for Relay something
       * like: `request?.documentId`.
       */
      hashFromPayload?(request: ParsedGraphQLBody): string | undefined;

      /**
       * We can read persisted operations from a folder (they must be named
       * `<hash>.graphql`). When used in this way, the first request for a hash
       * will read the file, and then the result will be cached such that the
       * **filesystem read** will only impact the first use of that hash. We
       * periodically scan the folder for new files, requests for hashes that
       * were not present in our last scan of the folder will be rejected to
       * mitigate denial of service attacks asking for non-existent hashes.
       */
      persistedOperationsDirectory?: string;

      /**
       * An optional string-string key-value object defining the persisted
       * operations, where the keys are the hashes, and the values are the
       * operation document strings to use.
       */
      persistedOperations?: { [hash: string]: string };

      /**
       * If your known persisted operations may change over time, or you'd rather
       * load them on demand, you may supply this function. Note this function is
       * **performance critical** so you should use caching to improve
       * performance of any follow-up requests for the same hash.
       */
      persistedOperationsGetter?: PersistedOperationGetter;

      /**
       * There are situations where you may want to allow arbitrary operations
       * (for example using GraphiQL in development, or allowing an admin to
       * make arbitrary requests in production) whilst enforcing Persisted
       * Operations for the application and non-admin users. This function
       * allows you to determine under which circumstances persisted operations
       * may be bypassed.
       *
       * IMPORTANT: this function must not throw!
       *
       * @example
       *
       * ```
       * app.use(postgraphile(DATABASE_URL, SCHEMAS, {
       *   allowUnpersistedOperation(event) {
       *     return process.env.NODE_ENV === "development" && event.request?.getHeader('referer')?.endsWith("/graphiql");
       *   }
       * });
       * ```
       */
      allowUnpersistedOperation?:
        | boolean
        | ((event: ProcessGraphQLRequestBodyEvent) => boolean);
    }
  }
}
