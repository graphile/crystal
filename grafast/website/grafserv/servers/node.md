# Node HTTP server

```js
import { createServer } from "node:http";
import { grafserv } from "grafserv/node";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

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
server.listen(preset.grafserv?.port ?? 5678);
```
