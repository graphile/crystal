import { createServer } from "node:http";

import { grafserv } from "grafserv/node";

import { createWithPgClient } from "./dist/adaptors/pg.js";
import { makeExampleSchema } from "./examples/exampleSchema.mts";

const schema = makeExampleSchema();
const withPgClient = createWithPgClient({
  connectionString: "postgres:///graphilecrystaltest",
});
const serv = grafserv({
  preset: { grafast: { context: { withPgClient }, explain: true } },
  schema,
});
const server = createServer();
serv.addTo(server);
server.listen(5555);
console.log("Listening on http://localhost:5555/");
