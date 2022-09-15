import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import type { createProxyServer } from "http-proxy";
import { createServer } from "node:http";

import { graphileInspectHTML } from "./server.js";

export function options(yargs: Argv) {
  return yargs
    .usage("$0", "Run a Graphile Inspect server")
    .example(
      "$0 [-SP] [--endpoint http://localhost:5678/graphql]",
      "Runs a Graphile Inspect server accessing the given GraphQL API, with subscriptions support and automatic proxying (to bypass CORS issues)",
    )
    .option("endpoint", {
      alias: "e",
      type: "string",
      description: "endpoint for query and mutation operations",
      default: "http://localhost:5678/graphql",
    })
    .option("port", {
      alias: "p",
      type: "number",
      description: "port number to run the server on",
      default: 1337,
    })
    .option("proxy", {
      alias: "P",
      type: "boolean",
      description: "Proxy requests to work around CORS issues",
    })
    .options("subscriptions", {
      alias: "S",
      type: "boolean",
      description: "enable subscriptions, converting --endpoint to a ws:// URL",
      default: false,
    })
    .option("subscription-endpoint", {
      alias: "s",
      type: "string",
      description: "endpoint for subscription operations (overrides -S)",
    });
}

/**
 * Optionally we proxy the request.
 */
async function tryLoadHttpProxyCreateProxyServer() {
  try {
    return ((await import("http-proxy")) as any).default
      .createProxyServer as typeof createProxyServer;
  } catch {
    return null;
  }
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const {
    port,
    endpoint,
    subscriptionEndpoint,
    subscriptions,
    proxy: enableProxy,
  } = args;
  const createProxyServer = enableProxy
    ? await tryLoadHttpProxyCreateProxyServer()
    : null;
  const proxy = createProxyServer?.({ target: endpoint, ws: true });
  if (enableProxy && !proxy) {
    throw new Error(
      "Failed to create a proxy - please be sure to install the 'http-proxy' module alongside 'graphile-inspect'",
    );
  }
  proxy?.on("error", (e, req, res) => {
    console.error("Error occurred whilst attempting to proxy:", e);
    if (res && "writeHead" in res && res.writeHead) {
      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end('{"errors": [{"message": "Proxying failed"}]}');
    } else if (res) {
      // Terminate the socket
      res.end();
    }
  });
  const endpointUrl = new URL(endpoint);
  const subscriptionsEndpointUrl = subscriptionEndpoint
    ? new URL(subscriptionEndpoint)
    : subscriptions
    ? (() => {
        const url = new URL(endpointUrl);
        url.protocol = endpointUrl.protocol === "https:" ? "wss:" : "ws:";
        return url;
      })()
    : undefined;
  const endpointBase = new URL(endpointUrl);
  endpointBase.pathname = "";
  endpointBase.search = "";
  endpointBase.hash = "";
  const endpointWsBase = new URL(endpointBase);
  endpointWsBase.protocol = endpointBase.protocol === "https:" ? "wss:" : "ws:";

  if (!proxy) {
    console.log(
      `If you receive CORS issues, consider installing the 'http-proxy' module alongside 'graphile-inspect' and we'll proxy to the API for you`,
    );
  }
  const server = createServer((req, res) => {
    if (req.url === "/" && req.headers.accept?.includes("text/html")) {
      res.writeHead(200, undefined, {
        "Content-Type": "text/html; charset=utf-8",
      });
      res.end(
        graphileInspectHTML({
          endpoint: proxy
            ? endpointUrl.pathname + endpointUrl.search
            : endpoint,
          subscriptionEndpoint:
            proxy && subscriptionsEndpointUrl
              ? subscriptionsEndpointUrl.pathname +
                subscriptionsEndpointUrl.search
              : subscriptionEndpoint,
        }),
      );
      return;
    }
    if (proxy) {
      proxy.web(req, res, { target: endpointBase });
      return;
    } else {
      res.writeHead(308, undefined, { Location: "/" });
      res.end();
      return;
    }
  });

  if (proxy) {
    server.on("upgrade", (req, socket, head) => {
      proxy.ws(req, socket, head, {
        target: endpointWsBase,
      });
    });
  }

  server.listen(port, () => {
    console.log(
      `Serving Graphile Inspect at http://localhost:${port} for GraphQL API at '${args.endpoint}'`,
    );
  });
}
