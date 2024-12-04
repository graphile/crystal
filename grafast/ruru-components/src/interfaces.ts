import type { Fetcher } from "@graphiql/toolkit";
import type { GraphiQLProps } from "graphiql";

export { Fetcher };

/**
 * The `EventSource` specification only specifies the `withCredentials` option,
 * but some implementations support additional options. Our configuration
 * allows arbitrary options.
 */
interface RuruEventSourceInit extends EventSourceInit, Record<string, any> {}

export interface RuruProps {
  /**
   * Optionally override the fetcher.
   */
  fetcher?: Fetcher;

  /**
   * The URL to the GraphQL endpoint. (http:// or https://)
   */
  endpoint?: string;

  /**
   * The URL to the GraphQL subscriptions endpoint. (ws:// or wss://)
   */
  subscriptionEndpoint?: string;

  editorTheme?: GraphiQLProps["editorTheme"];

  /**
   * The list of debug tools available to the user.
   *
   * explain - output the SQL executed
   * plan - output the plan executed
   */
  debugTools?: Array<"explain" | "plan">;

  /**
   * The query to use when the user has never visited the page before (unless `initialQuery` is set).
   */
  defaultQuery?: string;

  /**
   * @deprecated Use `query` instead
   */
  initialQuery?: string;

  /**
   * @deprecated Use `variables` instead
   */
  initialVariables?: string;

  /**
   * The query to prepopulate the editor with.
   */
  query?: string;

  /**
   * The variables to prepopulate the editor with.
   */
  variables?: string;

  /**
   * Callback executed when the current query changes.
   */
  onEditQuery?: GraphiQLProps["onEditQuery"];

  /**
   * Callback executed when the variables change.
   */
  onEditVariables?: GraphiQLProps["onEditVariables"];

  /**
   * Will be passed to `new EventSource(url, eventSourceInit)`.
   *
   * Per the specification, the only option is `withCredentials`; however, some
   * implementations support additional options. For example:
   *
   * - `reconnectInterval: 1000`
   * - `maxReconnectAttempts: 3`
   */
  eventSourceInit?: RuruEventSourceInit;
}
