# Nuxt API route

Grafserv handles a number of API routes, so you should define one for each of
the things you care about. It's critical that you ensure that the paths line up
with those used in the Graphile config, otherwise the assets will not correctly
be served/referenced, this may cause issues when communicating between Ruru
and GraphQL.

Creating `grafserv`:

```ts title="server/grafserv/serv.ts"
import { grafserv } from "grafserv/h3/v1";
import preset from "./graphile.config";
import schema from "./schema.mjs";

// Create a shared Grafserv instance
export const serv = grafserv({ schema, preset });
```

## API routes

### Graphql endpoint

_without websockets_

```ts title="server/api/graphql.ts"
import { eventHandler } from "h3";
import { serv } from "@/server/grafserv/serv";

// Create and export the `/api/graphql` route handler
export default eventHandler((event) => serv.handleGraphQLEvent(event));
```

_or with websockets enabled_ (need h3@^1.13.0):

```ts title="server/api/graphql.ts"
import { eventHandler } from "h3";
import { serv } from "@/server/grafserv/serv";

export default eventHandler({
  // Create and export the `/api/graphql` route handler
  handler: (event) => serv.handleGraphQLEvent(event),
  // Create and export the `/api/graphql` websocket handler
  websocket: serv.makeWsHandler(),
});
```

### Ruru endpoint

```ts title="pages/routes/ruru.ts"
import { eventHandler } from "h3";
import { serv } from "@/server/grafserv/serv";

// Create and export the `/ruru` route handler
export default eventHandler((event) => serv.handleGraphiqlEvent(event));
```

### EventStream endpoint

```ts title="pages/api/graphql/stream.ts"
import { eventHandler } from "h3";
import { serv } from "@/server/grafserv/serv";

// Create and export the `/api/graphql/stream` route handler
export default eventHandler((event) => serv.handleEventStreamEvent(event));
```
