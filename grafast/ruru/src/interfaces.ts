import type { RuruProps } from "ruru-types";

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
   * `<script>` tag before all others that sets RURU_CONFIG.
   */
  configScript: string;

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

export interface RuruClientConfig
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
    | "inputValueDeprecation"
    | "showPersistHeadersSettings"
    | "isHeadersEditorEnabled"
    | "className"
    | "eventSourceInit"
  > {}

export interface BakedRuruClientConfig extends RuruClientConfig {
  staticPath: string;
  endpoint?: RuruProps["endpoint"];
  subscriptionEndpoint?: RuruProps["subscriptionEndpoint"];
}

export interface RuruConfig {
  /**
   * Ruru's static assets must be served for Ruru to work. Pass the URL to the
   * root of this folder; it must end in a slash. Defaults to
   * `https://unpkg.com/ruru@${version}/static/` in most places, though the CLI
   * defaults to `/ruru-static/` since it serves its own files.
   */
  staticPath?: string;

  /**
   * The port for `ruru` CLI to listen on.
   */
  port?: number;

  /**
   * The URL to the GraphQL endpoint. (http:// or https://)
   */
  endpoint?: string;

  /**
   * The URL to the GraphQL subscriptions endpoint. (ws:// or wss://)
   */
  subscriptionEndpoint?: string;

  subscriptions?: boolean;
  enableProxy?: boolean;

  /**
   * Override the HTML parts that are used to build the Ruru
   */
  htmlParts?: {
    [K in keyof RuruHTMLParts]?:
      | string
      | ((
          original: string,
          clientConfig: BakedRuruClientConfig,
          serverConfig: RuruConfig,
          htmlParts: RuruHTMLParts,
          key: keyof RuruHTMLParts,
        ) => string);
  };

  /** Will be serialized and sent to the client */
  clientConfig?: RuruClientConfig;
}
