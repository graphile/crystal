export interface GraphileInspectProps {
  /**
   * The URL to the GraphQL endpoint.
   */
  url?: string;

  /**
   * The fetcher function to issue GraphQL requests.
   */
  fetcher?: GraphiQLProps["fetcher"];
  editorTheme?: GraphiQLProps["editorTheme"];
}
