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

const baseMetaTags = `\
<meta charset="utf-8" />`;
const baseTitleTag = `\
<title>Ruru - GraphQL/Grafast IDE</title>
`;
const baseStyleTags = `\
<style>
body {
  margin: 0;
}
#ruru-root {
 height: 100vh;
}
</style>`;
const baseHeaderScripts = `\
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>`;

const baseElements = `\
<div id="ruru-root"></div>`;
const baseBodyScripts = `\
<script>${escapeJS(graphiQLContent)}</script>`;
const baseBodyInitScript = `\
<script>
  const { React, createRoot, Ruru } = RuruBundle;
  const tree = React.createElement(Ruru, RURU_CONFIG);
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>`;

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

/**
 * The parts of the HTML page created to serve Ruru. Create the defaults via
 * `defaultHTMLParts()` and then customize them as you see fit.
 */
export interface RuruHTMLParts {
  /**
   * `<meta />` tags to add to the `<head>` of the HTML page; by default this
   * is `<meta charset="utf-8" />`
   */
  metaTags: string;

  /**
   * The `<title>...</title>` tag to include in the HTML page.
   */
  titleTag: string;

  /**
   * `<style>` tags in the head of the HTML (or `<link rel="stylesheet" ... />`
   * if you prefer)
   */
  styleTags: string;

  /**
   * `<script>` tags to put in the header; by default this installs `prettier`.
   */
  headerScripts: string;

  /**
   * Any non-`<script>` tags to put in the `<body>` tag - you _must_ ensure
   * that this contains `<div id="ruru-root"></div>` for Ruru to be mounted into.
   */
  bodyContent: string;

  /**
   * `<script>` tags to add below the `bodyContent` in the HTML `<body>`. By
   * default this is the Ruru bundle, but you might consider replacing it with a
   * `<script src="..."></script>` to enable better browser caching, or even
   * replace with your own custom Ruru bundle.
   */
  bodyScripts: string;

  /**
   * The very last `<script>` tag in the HTML `<body>`; this is what triggers
   * Ruru to start running.
   */
  bodyInitScript: string;
}

export function defaultHTMLParts(): RuruHTMLParts {
  return {
    metaTags: baseMetaTags,
    titleTag: baseTitleTag,
    styleTags: baseStyleTags,
    headerScripts: baseHeaderScripts,
    bodyContent: baseElements,
    bodyScripts: baseBodyScripts,
    bodyInitScript: baseBodyInitScript,
  };
}
export const baseHTMLParts = Object.freeze(defaultHTMLParts());

export function ruruHTML(config: RuruServerConfig, htmlParts = baseHTMLParts) {
  const {
    metaTags,
    titleTag,
    styleTags,
    headerScripts,
    bodyContent,
    bodyScripts,
    bodyInitScript,
  } = htmlParts;

  return `\
<!DOCTYPE html>
<html lang="en">
<head>
${metaTags}
${titleTag}
${styleTags}
<script>const RURU_CONFIG = ${escapeJS(JSON.stringify(config))};</script>
${headerScripts}
</head>
<body>
${bodyContent}
${bodyScripts}
${bodyInitScript}
</body>
</html>`;
}
