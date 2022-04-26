import { createServer } from "http";
import url from "url";
import type { Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { graphileInspectHTML } from "./server.js";

function options(yargs: Argv) {
  return yargs
    .option("port", {
      alias: "p",
      type: "number",
      description: "port number to run the server on",
      default: 1337,
    })
    .option("endpoint", {
      alias: "e",
      type: "string",
      description: "the endpoint to connect to",
      default: "http://localhost:5000/graphql",
    })
    .option("proxy", {
      alias: "P",
      type: "boolean",
      description: "Proxy requests to work around CORS issues",
    });
}

type InspectArgv = ReturnType<typeof options> extends Argv<infer U> ? U : never;

/**
 * Optionally we proxy the request.
 */
async function tryLoadHttpProxy() {
  try {
    return (await import("http-proxy")).default;
  } catch {
    return null;
  }
}
async function run(argv: InspectArgv) {
  const { port, endpoint, proxy: enableProxy } = argv;
  const httpProxy = enableProxy ? await tryLoadHttpProxy() : null;
  const proxy = httpProxy?.createProxyServer({});
  if (enableProxy && !proxy) {
    throw new Error(
      "Failed to create a proxy - please be sure to install the 'http-proxy' module alongside 'graphile-inspect'",
    );
  }
  proxy?.on("error", (e, req, res) => {
    console.error("Error occurred whilst attempting to proxy:", e);
    if ("writeHead" in res && res.writeHead) {
      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end('{"errors": [{"message": "Proxying failed"}]}');
    } else {
      // Terminate the socket
      res.end();
    }
  });
  const endpointUrl = new URL(endpoint);
  const endpointBase = new URL(endpointUrl);
  endpointBase.pathname = "";
  endpointBase.search = "";
  endpointBase.hash = "";

  if (!httpProxy) {
    console.log(
      `If you receive CORS issues, consider installing the 'http-proxy' module alongside 'graphile-inspect' and we'll proxy to the API for you`,
    );
  }
  const server = createServer((req, res) => {
    if (req.url === "/" && req.headers.accept?.includes("text/html")) {
      res.writeHead(200, undefined, {
        "Content-Type": "text/html; charset=utf-8",
      });
      console.log({
        endpoint: proxy ? endpointUrl.pathname + endpointUrl.search : endpoint,
      });
      res.end(
        graphileInspectHTML({
          endpoint: proxy
            ? endpointUrl.pathname + endpointUrl.search
            : endpoint,
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
      proxy.ws(req, socket, head);
    });
  }

  server.listen(port, () => {
    console.log(
      `Serving Graphile Inspect at http://localhost:${port} for GraphQL API at '${argv.endpoint}'`,
    );
  });
}

async function main() {
  const argv = await options(yargs(hideBin(process.argv))).argv;

  await run(argv);
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  // module was not imported but called directly
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}