import { readFileSync } from "fs";
import type { GraphiQLProps } from "graphiql";
import { fileURLToPath } from "node:url";
import * as path from "path";

function escapeHTMLEntities(str: string): string {
  return str.replace(
    /[&"<>]/g,
    (l) =>
      ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" }[l as any]),
  );
}

// TODO: make this 'readFileSync' call webpackable
const graphiQLContent = readFileSync(
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../bundle/graphile-inspect.min.js",
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
<title>Graphile Inspect</title>
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>
</head>
<body style="margin: 0;">
<div style="height: 100vh;" id="graphile-inspect-root"></div>
<link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
<script>${escapeJS(graphiQLContent)}</script>
<script>
  const { React, createRoot, GraphileInspect } = GraphileInspectBundle;
  const tree = React.createElement(GraphileInspect, `;

const graphiQLFooter = `\
);
  const container = document.getElementById("graphile-inspect-root");
  const root = createRoot(container);
  root.render(tree);
</script>
</body>
</html>
`;

export interface GraphileInspectServerConfig {
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

export function graphileInspectHTML(config: GraphileInspectServerConfig) {
  return `${graphiQLHeader}${escapeJS(
    JSON.stringify(config),
  )}${graphiQLFooter}`;
}
