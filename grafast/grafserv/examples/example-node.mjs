import { createServer } from "node:http";
import { grafserv } from "grafserv/node";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Grafserv instance
const instance = grafserv({ schema, preset });

// Mount the request handler into a new HTTP server
const server = createServer(instance.createHandler());

// Start the Node server
server.listen(preset.server.port ?? 5678);
