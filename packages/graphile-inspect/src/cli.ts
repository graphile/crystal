import { createServer } from "http";
import { graphileInspectHTML } from "./server.js";
import yargs, { Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import url from "url";

function options(yargs: Argv) {
  return yargs.option("port", {
    alias: "p",
    type: "number",
    description: "port number to run the server on",
    default: 1337,
  });
}

function run(argv: any) {
  const { port = 1337 } = argv;
  const server = createServer((req, res) => {
    if (req.url !== "/") {
      res.writeHead(308, undefined, { Location: "/" });
      res.end();
      return;
    }
    res.writeHead(200, undefined, {
      "Content-Type": "text/html; charset=utf-8",
    });
    res.end(graphileInspectHTML({}));
  });

  server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
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
