# Koa V2

```js
import { createServer } from "node:http";
import Koa from "koa";
import { grafserv } from "grafserv/koa/v2";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Koa app
const app = new Koa();
// (Add any Koa middleware you want here.)

// Create a Node HTTP server, mounting Koa into it
const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Koa app, and register
// websockets if desired
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Koa server
server.listen(preset.grafserv?.port ?? 5678);
```
