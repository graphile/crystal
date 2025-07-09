import type { GraphiQLProps } from "graphiql";
import type { RuruConfig } from "./interfaces.js";
export { RuruConfig } from "./interfaces.js";
/**
 * The `EventSource` specification only specifies the `withCredentials` option,
 * but some implementations support additional options. Our configuration
 * allows arbitrary options.
 */
interface RuruEventSourceInit extends EventSourceInit, Record<string, any> {
}
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
    /**
     * Will be passed to `new EventSource(url, eventSourceInit)`.
     *
     * Per the specification, the only option is `withCredentials`; however, some
     * implementations support additional options. For example:
     *
     * - `reconnectInterval: 1000`
     * - `maxReconnectAttempts: 3`
     */
    eventSourceInit?: RuruEventSourceInit;
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
export declare function makeHTMLParts(): RuruHTMLParts;
export declare const defaultHTMLParts: Readonly<RuruHTMLParts>;
export declare function ruruHTML(config: RuruServerConfig, htmlParts?: Readonly<RuruHTMLParts>): string;
declare global {
    namespace GraphileConfig {
        interface Preset {
            ruru?: RuruConfig;
        }
    }
}
//# sourceMappingURL=server.d.ts.map