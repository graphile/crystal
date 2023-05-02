import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { loadConfig } from "graphile-config/load";
import { resolvePresets } from "graphile-config";
import type { createProxyServer } from "http-proxy";
import { createServer } from "node:http";

import { RuruConfig, makeHTMLParts, ruruHTML } from "./server.js";

export function options(yargs: Argv) {
  return yargs
    .usage("$0", "Run a Ruru server")
    .example(
      "$0 [-SP] [--endpoint http://localhost:5678/graphql]",
      "Runs a Ruru server accessing the given GraphQL API, with subscriptions support and automatic proxying (to bypass CORS issues)",
    )
    .option("endpoint", {
      alias: "e",
      type: "string",
      description: "endpoint for query and mutation operations",
    })
    .option("port", {
      alias: "p",
      type: "number",
      description: "port number to run the server on",
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
    })
    .option("subscription-endpoint", {
      alias: "s",
      type: "string",
      description: "endpoint for subscription operations (overrides -S)",
    })
    .option("config", {
      alias: "C",
      type: "string",
      description: "The path to the graphile.config.mjs (or similar) file",
      normalize: true,
    });
}

/**
 * Optionally we proxy the request.
 */
async function tryLoadHttpProxyCreateProxyServer(): Promise<
  typeof createProxyServer | null
> {
  try {
    const module = (await import("http-proxy")) as any;
    return module.default?.createProxyServer ?? module.createProxyServer;
  } catch {
    return null;
  }
}

async function configFromArgs(args: ArgsFromOptions<typeof options>) {
  const {
    port,
    endpoint,
    subscriptionEndpoint,
    subscriptions,
    proxy: enableProxy,
    config: configFileLocation,
  } = args;

  const userPreset = await loadConfig(configFileLocation);

  const preset = {
    extends: [...(userPreset ? [userPreset] : [])],
    ruru: {} as RuruConfig,
  } satisfies GraphileConfig.Preset;

  if (port) {
    preset.ruru.port = port;
  }
  if (endpoint) {
    preset.ruru.endpoint = endpoint;
  }
  if (subscriptionEndpoint) {
    preset.ruru.subscriptionEndpoint = subscriptionEndpoint;
  }
  if (subscriptions) {
    preset.ruru.subscriptions = subscriptions;
  }
  if (enableProxy) {
    preset.ruru.enableProxy = enableProxy;
  }

  const config = resolvePresets([preset]);
  return config;
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const config = await configFromArgs(args);

  const {
    port = 1337,
    endpoint = "http://localhost:5678/graphql",
    subscriptionEndpoint,
    subscriptions = false,
    enableProxy,
  } = config.ruru ?? {};

  const htmlParts = {
    ...makeHTMLParts(),
    ...config.ruru?.htmlParts,
  };

  const createProxyServer = enableProxy
    ? await tryLoadHttpProxyCreateProxyServer()
    : null;
  const proxy = createProxyServer?.({
    target: endpoint,
    ws: true,
    changeOrigin: true,
  });
  if (enableProxy && !proxy) {
    throw new Error(
      "Failed to create a proxy - please be sure to install the 'http-proxy' module alongside 'ruru'",
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
      `If you receive CORS issues, consider installing the 'http-proxy' module alongside 'ruru' and using the '-P' option so that we'll proxy to the API for you`,
    );
  }
  const server = createServer((req, res) => {
    if (req.url === "/" && req.headers.accept?.includes("text/html")) {
      res.writeHead(200, undefined, {
        "Content-Type": "text/html; charset=utf-8",
      });
      res.end(
        ruruHTML(
          {
            endpoint: proxy
              ? endpointUrl.pathname + endpointUrl.search
              : endpoint,
            subscriptionEndpoint:
              proxy && subscriptionsEndpointUrl
                ? subscriptionsEndpointUrl.pathname +
                  subscriptionsEndpointUrl.search
                : subscriptionEndpoint,
          },
          htmlParts,
        ),
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
      `Serving Ruru at http://localhost:${port} for GraphQL API at '${endpoint}'`,
    );
  });
}
