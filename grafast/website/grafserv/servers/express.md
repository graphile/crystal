# Express V4

```js
import { createServer } from "node:http";
import express from "express";
import { grafserv } from "grafserv/express/v4";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create an express app
const app = express();
// (Add any Express middleware you want here.)

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
server.listen(preset.grafserv?.port ?? 5678);
```
