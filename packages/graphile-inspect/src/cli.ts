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
    });
}

type InspectArgv = ReturnType<typeof options> extends Argv<infer U> ? U : never;

function run(argv: InspectArgv) {
  const { port, endpoint } = argv;
  const server = createServer((req, res) => {
    if (req.url !== "/") {
      res.writeHead(308, undefined, { Location: "/" });
      res.end();
      return;
    }
    res.writeHead(200, undefined, {
      "Content-Type": "text/html; charset=utf-8",
    });
    res.end(
      graphileInspectHTML({
        endpoint,
      }),
    );
  });

  server.listen(port, () => {
    console.log(
      `Serving Graphile Inspect at http://localhost:${port} for GraphQL API at '${argv.endpoint}'`,
    );
  });
}

async function main() {
  const argv = await options(yargs(hideBin(process.argv))).argv;

  run(argv);
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  // module was not imported but called directly
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
