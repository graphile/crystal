import { schema } from "./schema-export-output.mjs";

import { createServer } from "node:http";
import { grafserv } from "grafserv/node";
import pg from "pg";
import { createWithPgClient } from "@dataplan/pg/adaptors/pg";

const pool = new pg.Pool({
  connectionString: "postgres:///pagila",
});

const preset = {
  grafast: {
    context() {
      return {
        withPgClient: createWithPgClient({
          pool,
        }),
      };
    },
  },
};

// Create a Node HTTP server
const server = createServer();
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Mount the request handler into a new HTTP server, and register websockets if
// desired
serv.addTo(server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Node server
const port = preset.grafserv?.port ?? 5678;
server.listen(port);
console.log(`LISTENING http://localhost:${port}`);
