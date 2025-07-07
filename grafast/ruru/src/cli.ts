import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "node:http";

import { resolvePreset } from "graphile-config";
import type { ArgsFromOptions, Argv } from "graphile-config/cli";
import { loadConfig } from "graphile-config/load";
import type { createProxyServer } from "http-proxy";

import { bundleData } from "./bundleData.js";
import type { RuruConfig } from "./server.js";
import { makeHTMLParts, ruruHTML } from "./server.js";

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

  const config = resolvePreset(preset);
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
  const STATIC = "/static/";
  const staticMw = cheapStaticMiddleware(STATIC);
  const server = createServer((req, res) => {
    if (req.url === "/" && req.headers.accept?.includes("text/html")) {
      res.writeHead(200, undefined, {
        "Content-Type": "text/html; charset=utf-8",
      });
      res.end(
        ruruHTML(
          {
            staticPath: STATIC,
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
    } else if (req.url?.startsWith(STATIC)) {
      return staticMw(req, res);
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

function getBaseHeaders(filename: string): Record<string, string> {
  const i = filename.lastIndexOf(".");
  if (i < 0) throw new Error(`${filename} has no extension`);
  const ext = filename.substring(i + 1);
  switch (ext) {
    case "txt":
      return { "content-type": "text/plain; charset=utf-8" };
    case "js":
      return { "content-type": "text/javascript; charset=utf-8" };
    case "ttf":
      return {
        "Access-Control-Allow-Origin": "*",
        "content-type": "font/ttf",
      };
    case "map":
      return { "content-type": "application/json" };
    default:
      throw new Error(`Unknown extension ${ext}`);
  }
}

const files: Record<
  string,
  { content: Buffer; headers: Record<string, string> }
> = Object.create(null);
for (const filename of Object.keys(bundleData)) {
  const content = bundleData[filename];
  const buffer = Buffer.isBuffer(content)
    ? content
    : Buffer.from(content, "utf8");
  files[filename] = {
    content: buffer,
    headers: {
      ...getBaseHeaders(filename),
      "content-length": String(buffer.length),
    },
  };
}

function cheapStaticMiddleware(STATIC: string) {
  return (
    req: IncomingMessage,
    res: ServerResponse,
    next?: (e?: Error) => void,
  ) => {
    if (req.url?.startsWith(STATIC)) {
      const path = req.url.substring(STATIC.length).replace(/\?.*$/, "");
      try {
        const file = files[path];
        if (file) {
          res.writeHead(200, file.headers);
          res.end(file.content);
        } else {
          res.writeHead(404, { "content-type": "text/plain" });
          res.end("Not found");
        }
      } catch (e) {
        if (typeof next === "function") {
          return next(e);
        } else {
          res.writeHead(500);
          res.end("Failed to setup static middleware");
        }
      }
    } else {
      if (typeof next === "function") {
        return next();
      } else {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
      }
    }
  };
}
