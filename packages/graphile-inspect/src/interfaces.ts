import { GraphiQLProps } from "graphiql";

export interface GraphileInspectProps {
  /**
   * The URL to the GraphQL endpoint.
   */
  url?: string;

  /**
   * If set, we'll try and monitor this URL via `EventSource` for schema
   * changes.
   */
  streamUrl?: string;

  /**
   * The fetcher function to issue GraphQL requests.
   */
  fetcher?: GraphiQLProps["fetcher"];
  editorTheme?: GraphiQLProps["editorTheme"];
}
