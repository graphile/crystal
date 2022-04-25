import type { GraphiQLProps } from "graphiql";

export interface GraphileInspectProps {
  /**
   * The URL to the GraphQL endpoint.
   */
  endpoint?: string;

  /**
   * If set, we'll try and monitor this URL via `EventSource` for schema
   * changes.
   */
  streamEndpoint?: string;

  /**
   * The fetcher function to issue GraphQL requests.
   */
  fetcher?: GraphiQLProps["fetcher"];
  editorTheme?: GraphiQLProps["editorTheme"];

  /**
   * The list of debug tools available to the user.
   *
   * explain - output the SQL executed
   * plan - output the plan executed
   */
  debugTools?: ["explain", "plan"];
}
