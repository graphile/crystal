import type { RuruProps } from "ruru-components";

import type {
  BakedRuruClientConfig,
  RuruConfig,
  RuruHTMLParts,
} from "./interfaces.js";
import { version } from "./version.js";
export { RuruClientConfig, RuruConfig, RuruHTMLParts } from "./interfaces.js";

const DEFAULT_STATIC_PATH = `https://unpkg.com/ruru@${version}/static/`;

// Ref: https://v8.dev/features/subsume-json
const escapeJS = (str: string) => {
  return str
    .replaceAll("<!--", "<\\!--")
    .replaceAll("</script", "<\\/script")
    .replaceAll("<script", "<\\script");
};

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  '"': "&quot;",
  "<": "&lt;",
  ">": "&gt;",
};
const escapeHTML = (str: string) => str.replace(/[&"<>]/g, (c) => ENTITIES[c]!);

function html(arr: TemplateStringsArray, ...placeholders: string[]) {
  const final = arr
    .map((str, i) => (i === 0 ? str : placeholders[i - 1] + str))
    .join("");
  return final.trim().replace(/^\s+/gm, "");
}

const baseTitleTag = html` <title>Ruru - GraphQL/Grafast IDE</title> `;
const baseElements = html`
  <div id="ruru-root">
    <div class="graphiql-container">
      <div class="graphiql-sidebar"></div>
      <div class="graphiql-main">
        <div
          class="graphiql-plugin"
          style="min-width: 200px; flex: 0.333333 1 0%;"
        >
          <div>
            <div class="graphiql-doc-explorer-header">
              <div class="graphiql-doc-explorer-title">Loading...</div>
            </div>
            <div class="graphiql-doc-explorer-content">
              <p>Ruru is loading, this should only take a moment...</p>
            </div>
          </div>
        </div>
        <div class="graphiql-horizontal-drag-bar"></div>
        <div class="graphiql-sessions" style="flex: 1 1 0%;">
          <div class="graphiql-session-header">
            <ul role="tablist" class="graphiql-tabs no-scrollbar">
              <li class="graphiql-tab graphiql-tab-active">
                <button
                  type="button"
                  class="graphiql-un-styled graphiql-tab-button"
                  disabled
                >
                  Loading...
                </button>
              </li>
            </ul>
          </div>
          <div role="tabpanel" id="graphiql-session">
            <div class="graphiql-editors" style="flex: 1 1 0%;">
              <section class="graphiql-query-editor" style="flex: 3 1 0%;">
                <div class="graphiql-editor"></div>
                <div class="graphiql-toolbar"></div>
              </section>
              <div class="graphiql-editor-tools">
                <button
                  type="button"
                  class="graphiql-un-styled active"
                  disabled
                >
                  &nbsp;
                </button>
              </div>
            </div>
            <div class="graphiql-horizontal-drag-bar"></div>
            <div class="graphiql-response" style="flex: 1 1 0%;">
              <section class="result-window"></section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
const baseBodyScripts = html`
  <script type="module">
    const $ = (s) => document.querySelector(s);
    if (!localStorage.getItem("graphiql:visiblePlugin")) {
      $(".graphiql-plugin").style.display = "none";
      $(".graphiql-horizontal-drag-bar").style.display = "none";
    }
    const flexes = [
      ["docExplorerFlex", ".graphiql-plugin"],
      ["editorFlex", ".graphiql-editors"],
    ];
    for (const [key, sel] of flexes) {
      const val = localStorage.getItem("graphiql:" + key);
      if (val) $(sel).style.flex = val + " 1 0%";
    }
  </script>
`;

export interface RuruServerConfig extends RuruConfig {
  // ----- Legacy -----
  /** @deprecated Use clientConfig.editorTheme instead */
  editorTheme?: RuruProps["editorTheme"];
  /** @deprecated Use clientConfig.debugTools instead */
  debugTools?: RuruProps["debugTools"];
  /** @deprecated Use clientConfig.eventSourceInit instead */
  eventSourceInit?: RuruProps["eventSourceInit"];
}

export function makeHTMLParts(config: RuruServerConfig): RuruHTMLParts {
  const { endpoint, subscriptionEndpoint } = config;
  const staticPath = config.staticPath ?? DEFAULT_STATIC_PATH;

  const clientConfig: BakedRuruClientConfig = {
    // Legacy props that should now be part of `clientConfig`:
    editorTheme: config.editorTheme,
    debugTools: config.debugTools,
    eventSourceInit: config.eventSourceInit,

    // Everything the user has asked to be sent to the client
    ...config.clientConfig,

    // Our own settings that we want to make available to the client
    staticPath,
    endpoint,
    subscriptionEndpoint,
  };

  const baseMetaTags = html`
    <meta charset="utf-8" />
    <link rel="modulepreload" href="${escapeHTML(staticPath + "ruru.js")}" />
    <link
      rel="modulepreload"
      href="${escapeHTML(staticPath + "jsonWorker.js")}"
      as="worker"
    />
    <link
      rel="modulepreload"
      href="${escapeHTML(staticPath + "graphqlWorker.js")}"
      as="worker"
    />
    <link
      rel="modulepreload"
      href="${escapeHTML(staticPath + "editorWorker.js")}"
      as="worker"
    />
  `;
  const baseStyleTags = html`
    <link rel="stylesheet" href="${staticPath}ruru.css" />
    <style>
      body {
        margin: 0;
      }
      #ruru-root {
        height: 100vh;
      }
    </style>
  `;
  const baseConfigScript = html`
    <script>
      const RURU_CONFIG = ${escapeJS(JSON.stringify(clientConfig))};
    </script>
  `;
  const baseHeaderScripts = html`
    <script type="module">
      const worker = (file) =>
        new Worker(
          new URL(${JSON.stringify(staticPath)} + file, import.meta.url),
          { type: "module" },
        );
      globalThis.MonacoEnvironment = {
        getWorker(_, label) {
          switch (label) {
            case "json":
              return worker("jsonWorker.js");
            case "graphql":
              return worker("graphqlWorker.js");
            default:
              return worker("editorWorker.js");
          }
        },
      };
    </script>
  `;
  const baseBodyInitScript = html`
    <script type="module">
      import { React, createRoot, Ruru } from ${JSON.stringify(
        staticPath + "ruru.js",
      )};
      createRoot(document.getElementById("ruru-root"))
        .render(React.createElement(Ruru, RURU_CONFIG));
    </script>
  `;
  const parts: RuruHTMLParts = {
    metaTags: baseMetaTags,
    titleTag: baseTitleTag,
    styleTags: baseStyleTags,
    configScript: baseConfigScript,
    headerScripts: baseHeaderScripts,
    bodyContent: baseElements,
    bodyScripts: baseBodyScripts,
    bodyInitScript: baseBodyInitScript,
  };
  for (const k of Object.keys(parts) as ReadonlyArray<keyof RuruHTMLParts>) {
    const val = config.htmlParts?.[k];
    if (typeof val === "function") {
      parts[k] = val(parts[k], clientConfig, config, parts, k);
    } else if (typeof val === "string") {
      parts[k] = val;
    } else if (val != null) {
      throw new Error(
        `Unexpected value for config.htmlParts.${k}: ${typeof val}`,
      );
    }
  }
  return parts;
}

export function ruruHTML(
  config: RuruServerConfig,
  htmlParts = makeHTMLParts(config),
) {
  return `\
<!DOCTYPE html>
<html lang="en">
<head>
${htmlParts.metaTags}
${htmlParts.titleTag}
${htmlParts.styleTags}
${htmlParts.configScript}
${htmlParts.headerScripts}
</head>
<body>
${htmlParts.bodyContent}
${htmlParts.bodyScripts}
${htmlParts.bodyInitScript}
</body>
</html>
`;
}

declare global {
  namespace GraphileConfig {
    interface Preset {
      ruru?: RuruConfig;
    }
  }
}
