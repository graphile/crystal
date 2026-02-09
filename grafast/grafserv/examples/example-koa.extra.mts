import { createServer } from "node:http";

import { grafserv } from "grafserv/koa/v2";
import Koa from "koa";
import bodyParser from "koa-bodyparser";

import preset from "./graphile.config.mts";
import schema from "./schema.mts";

declare module "koa" {
  interface Context {
    thing?: string;
  }
}

// Create a Koa app
const app = new Koa();
// Parse the body
app.use(bodyParser());
// (Add any Koa middleware you want here.)

// Create a Node HTTP server, mounting Koa into it
const server = createServer(app.callback());
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Koa app, and register
// websockets if desired
serv.addTo(app, server).catch((e) => {
  console.error("Initializing server failed");
  console.error(e);
  process.exit(1);
});

// Start the Koa server
server.listen(preset.grafserv.port ?? 5678);
