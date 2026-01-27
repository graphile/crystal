import type { Fetcher } from "@graphiql/toolkit";
import type { GraphiQLProps } from "graphiql";

export type { Fetcher };

/**
 * The `EventSource` specification only specifies the `withCredentials` option,
 * but some implementations support additional options. Our configuration
 * allows arbitrary options.
 */
interface RuruEventSourceInit extends EventSourceInit, Record<string, any> {}

export interface RuruProps
  extends Pick<
    GraphiQLProps,
    | "editorTheme"
    | "defaultTheme"
    | "maxHistoryLength"
    | "inputValueDeprecation"
    | "schemaDescription"
    | "showPersistHeadersSettings"
    | "onEditQuery"
    | "onEditVariables"
    | "onEditHeaders"
    | "responseTooltip"
    | "defaultEditorToolsVisibility"
    | "isHeadersEditorEnabled"
    | "forcedTheme"
    | "confirmCloseTab"
    | "className"
    | "initialVariables"
    | "initialQuery"
    | "initialHeaders"
    | "defaultQuery"
    | "defaultHeaders"
  > {
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

  /**
   * The list of debug tools available to the user.
   *
   * explain - output the SQL executed
   * plan - output the plan executed
   */
  debugTools?: Array<"explain" | "plan">;

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
