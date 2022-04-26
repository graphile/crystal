import type { GraphiQLProps } from "graphiql";

export interface GraphileInspectProps {
  /**
   * The URL to the GraphQL endpoint.
   */
  endpoint?: string;

  editorTheme?: GraphiQLProps["editorTheme"];

  /**
   * The list of debug tools available to the user.
   *
   * explain - output the SQL executed
   * plan - output the plan executed
   */
  debugTools?: Array<"explain" | "plan">;
}
