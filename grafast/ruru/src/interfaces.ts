import type { Fetcher } from "@graphiql/toolkit";
import type { GraphiQLProps } from "graphiql";

export { Fetcher };

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
}
