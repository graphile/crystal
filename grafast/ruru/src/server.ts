import type { RuruProps } from "ruru-components";

import type { RuruConfig } from "./interfaces.js";
import { version } from "./version.js";
export { RuruConfig } from "./interfaces.js";

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
const baseHeaderScripts = ``;

const baseElements = `\
<div id="ruru-root"></div>`;
const baseBodyScripts = `\
<script type="module">
// Setup Monaco Editor workers
function worker(file) {
  return new Worker(new URL(RURU_CONFIG.staticPath + file, import.meta.url), { type: "module" });
}
globalThis.MonacoEnvironment = {
  getWorker(_workerId, label) {
    switch (label) {
      case "json": return worker('jsonWorker.js');
      case "graphql": return worker('graphqlWorker.js');
      default: return worker('editorWorker.js');
    }
  }
}
</script>
`;
const baseBodyInitScript = `\
<script type="module">
  const { React, createRoot, Ruru } = await import(RURU_CONFIG.staticPath + 'ruru.js');
  const tree = React.createElement(Ruru, RURU_CONFIG);
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>`;

export interface RuruServerConfig
  extends Pick<
    RuruProps,
    | "debugTools"
    | "editorTheme"
    | "forcedTheme"
    | "defaultTheme"
    | "initialHeaders"
    | "defaultHeaders"
    | "defaultQuery"
    | "initialQuery"
    | "responseTooltip"
    | "maxHistoryLength"
    | "initialVariables"
    | "schemaDescription"
    | "subscriptionEndpoint"
    | "inputValueDeprecation"
    | "showPersistHeadersSettings"
    | "isHeadersEditorEnabled"
    | "className"
    | "endpoint"
    | "eventSourceInit"
  > {
  /**
   * Ruru's static assets must be served for Ruru to work. Pass the URL to the
   * root of this folder; it must end in a slash. Defaults to
   * `https://unpkg.com/ruru@${version}/static/`
   */
  staticPath?: string;
}

/**
 * The parts of the HTML page created to serve Ruru. Create the defaults via
 * `makeHTMLParts()` and then customize them as you see fit.
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

export function makeHTMLParts(): RuruHTMLParts {
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
export const defaultHTMLParts = Object.freeze(makeHTMLParts());

export function ruruHTML(
  config: RuruServerConfig,
  htmlParts = defaultHTMLParts,
) {
  const finalConfig = {
    ...config,
    staticPath:
      config.staticPath ?? `https://unpkg.com/ruru@${version}/static/`,
  };
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
<script>const RURU_CONFIG = ${escapeJS(JSON.stringify(finalConfig))};</script>
${headerScripts}
</head>
<body>
${bodyContent}
${bodyScripts}
${bodyInitScript}
</body>
</html>`;
}

declare global {
  namespace GraphileConfig {
    interface Preset {
      ruru?: RuruConfig;
    }
  }
}
