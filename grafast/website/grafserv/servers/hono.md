# Hono

**THIS INTEGRATION IS EXPERIMENTAL**. PRs improving it are welcome.

```ts
import { grafserv } from "grafserv/hono";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

import { Hono } from "hono";
import { serve } from "@hono/node-server";

// Create a Node HTTP server
const app = new Hono();

// Create a Grafserv instance
// the second argument is an optional websocket upgrade handler
// see https://hono.dev/docs/helpers/websocket
const serv = grafserv({ schema, preset });

// Mount the request handler into a new HTTP server
serv.addTo(server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the server with the chosen Hono adapter - here Node.js
serve(app);
```
