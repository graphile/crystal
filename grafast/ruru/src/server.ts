import { readFileSync } from "fs";
import type { GraphiQLProps } from "graphiql";
import { fileURLToPath } from "node:url";
import * as path from "path";

// TODO: make this 'readFileSync' call webpackable
const graphiQLContent = readFileSync(
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../bundle/ruru.min.js",
  ),
  "utf8",
);

// Ref: https://v8.dev/features/subsume-json
const escapeJS = (str: string) => {
  return str
    .replaceAll("<!--", "<\\!--")
    .replaceAll("</script", "<\\/script")
    .replaceAll("<script", "<\\script");
};

const graphiQLHeader = `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Ruru</title>
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>
</head>
<body style="margin: 0;">
<div style="height: 100vh;" id="ruru-root"></div>
<script>${escapeJS(graphiQLContent)}</script>
<script>
  const { React, createRoot, Ruru } = RuruBundle;
  const tree = React.createElement(Ruru, `;

const graphiQLFooter = `\
);
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>
</body>
</html>
`;

export interface RuruServerConfig {
  /**
   * The URL to the GraphQL endpoint.
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

export function ruruHTML(config: RuruServerConfig) {
  return `${graphiQLHeader}${escapeJS(
    JSON.stringify(config),
  )}${graphiQLFooter}`;
}
