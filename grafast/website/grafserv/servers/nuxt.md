# Nuxt API route

Grafserv handles a number of API routes, so you should define one for each of
the things you care about. It's critical that you ensure that the paths line up
with those used in the Graphile config, otherwise the assets will not correctly
be served/referenced, this may cause issues when communicating between Ruru
and GraphQL.

Creating grafserv :

```ts
// server/grafserv/serv.ts
import { grafserv } from "grafserv/h3/v1";
import preset from "./graphile.config";
import schema from "./schema.mjs";

// Create a shared Grafserv instance
export const serv = grafserv({ schema, preset });
```

and the API routes :

```ts
// server/api/graphql.ts
import { serv } from "@/server/grafserv/serv";

// Create and export the `/api/graphql` route handler
export default eventHandler((event) => serv.handleGraphqlEvent(event));
```

```ts
// pages/routes/ruru.ts
import { serv } from "@/server/grafserv/serv";

// Create and export the `/ruru` route handler
export default eventHandler((event) => serv.handleGraphiqlEvent(event));
```

```ts
// pages/api/graphql/stream.ts
import { serv } from "@/server/grafserv/serv";

// Create and export the `/api/graphql/stream` route handler
export default eventHandler((event) => serv.handleEventStreamEvent(event));
```

# Experimental

## Websocket support

Nitro and h3 does not yet support WebSocket.

An unofficial and experimental workaround consists to create a nuxt module :

```ts
// modules/grafserv/index.ts

// nuxt auto-register modules located in `modules/*.ts` or `modules/*/index.ts`

import { defineNuxtModule, addServerPlugin } from "@nuxt/kit";

import httpProxy from "http-proxy";

export default defineNuxtModule({
  async setup(options, nuxt) {
    /**
     * Register websockets in DEVELOPMENT mode.
     */
    if (nuxt.options.dev) {
      // hook called in development only
      nuxt.hook("listen", (devServer) => {
        // create a proxy for routing ws to runtime server created in dev plugin
        const proxy = httpProxy.createProxy({
          target: {
            host: "localhost",
            port: 3100,
          },
        });
        // registering ws on devServer
        devServer.on("upgrade", (req, socket, head) => {
          // routing ws by path
          switch (req.url) {
            case "/api/graphql":
              // proxy websocket to runtime server created in dev plugin
              proxy.ws(req, socket, head);
              break;
            default:
              socket.destroy();
          }
        });
      });
      // Registering runtime plugin for dev
      addServerPlugin("@/modules/grafserv/ws-dev");
    }

    /**
     * Register websockets in PRODUCTION mode.
     */
    if (!nuxt.options.dev)
      // Registering runtime plugin for production
      addServerPlugin("@/modules/grafserv/ws");
  },
});
```

and two Nitro plugins (one for dev, and one for prod)

```ts
// modules/grafserv/ws-dev.ts
import { Server } from "http";
import { serv } from "@/server/grafserv/serv";

// plugin running in DEVELOPMENT (runtime)
export default defineNitroPlugin(async (nitroApp) => {
  // Create a server for handling websockets
  const server = new Server().listen({ port: 3100 }, () =>
    console.log("Runtime server listening on port 3100"),
  );
  // Cleanly close server (on leave or HMR before plugin reload)
  nitroApp.hooks.hookOnce("close", () => {
    server.closeAllConnections();
    server.close((err) =>
      err
        ? console.warn("Runtime server wrongly closed", err)
        : console.log("Runtime server stopped"),
    );
  });
  // Attaching ws to server
  serv.attachWebsocketsToServer_experimental(server);
});
```

```ts
// modules/grafserv/ws.ts
import { serv } from "@/server/grafserv/serv";

// plugin running in PRODUCTION (runtime)
export default defineNitroPlugin(async (nitroApp) => {
  // this hook will be called only once at first http request
  nitroApp.hooks.hookOnce("request", (event: H3Event) => {
    const server = event.node.req.socket.server;
    if (server) {
      // Attaching ws to server
      serv.attachWebsocketsToServer_experimental(server);
    }
  });
});
```
