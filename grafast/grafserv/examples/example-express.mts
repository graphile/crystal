import { createServer } from "node:http";

import express from "express";
import { grafserv } from "grafserv/express/v4";

import preset from "./graphile.config.mts";
import schema from "./schema.mts";

// Create an express app
const app = express();
// (Add any Express middleware you want here.)
app.use((req, _res, next) => {
  req.thing = "Hello from Express!";
  next();
});

// Create a Node HTTP server, mounting Express into it
const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Express app, and register
// websockets if desired
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Express server
server.listen(preset.grafserv.port ?? 5678);
