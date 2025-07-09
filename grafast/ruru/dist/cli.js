"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const node_http_1 = require("node:http");
const graphile_config_1 = require("graphile-config");
const load_1 = require("graphile-config/load");
const server_js_1 = require("./server.js");
function options(yargs) {
    return yargs
        .usage("$0", "Run a Ruru server")
        .example("$0 [-SP] [--endpoint http://localhost:5678/graphql]", "Runs a Ruru server accessing the given GraphQL API, with subscriptions support and automatic proxying (to bypass CORS issues)")
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
async function tryLoadHttpProxyCreateProxyServer() {
    try {
        const module = (await import("http-proxy"));
        return module.default?.createProxyServer ?? module.createProxyServer;
    }
    catch {
        return null;
    }
}
async function configFromArgs(args) {
    const { port, endpoint, subscriptionEndpoint, subscriptions, proxy: enableProxy, config: configFileLocation, } = args;
    const userPreset = await (0, load_1.loadConfig)(configFileLocation);
    const preset = {
        extends: [...(userPreset ? [userPreset] : [])],
        ruru: {},
    };
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
    const config = (0, graphile_config_1.resolvePreset)(preset);
    return config;
}
async function run(args) {
    const config = await configFromArgs(args);
    const { port = 1337, endpoint = "http://localhost:5678/graphql", subscriptionEndpoint, subscriptions = false, enableProxy, } = config.ruru ?? {};
    const htmlParts = {
        ...(0, server_js_1.makeHTMLParts)(),
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
        throw new Error("Failed to create a proxy - please be sure to install the 'http-proxy' module alongside 'ruru'");
    }
    proxy?.on("error", (e, req, res) => {
        console.error("Error occurred whilst attempting to proxy:", e);
        if (res && "writeHead" in res && res.writeHead) {
            res.writeHead(500, {
                "Content-Type": "application/json",
            });
            res.end('{"errors": [{"message": "Proxying failed"}]}');
        }
        else if (res) {
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
        console.log(`If you receive CORS issues, consider installing the 'http-proxy' module alongside 'ruru' and using the '-P' option so that we'll proxy to the API for you`);
    }
    const server = (0, node_http_1.createServer)((req, res) => {
        if (req.url === "/" && req.headers.accept?.includes("text/html")) {
            res.writeHead(200, undefined, {
                "Content-Type": "text/html; charset=utf-8",
            });
            res.end((0, server_js_1.ruruHTML)({
                endpoint: proxy
                    ? endpointUrl.pathname + endpointUrl.search
                    : endpoint,
                subscriptionEndpoint: proxy && subscriptionsEndpointUrl
                    ? subscriptionsEndpointUrl.pathname +
                        subscriptionsEndpointUrl.search
                    : subscriptionEndpoint,
            }, htmlParts));
            return;
        }
        if (proxy) {
            proxy.web(req, res, { target: endpointBase });
            return;
        }
        else {
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
        console.log(`Serving Ruru at http://localhost:${port} for GraphQL API at '${endpoint}'`);
    });
}
//# sourceMappingURL=cli.js.map