# Next.js API route

**TODO: actually implement this!**

Grafserv handles a number of API routes, so you should define one for each of
the things you care about. It's critical that you ensure that the paths line up
with those used in the Graphile config, otherwise the assets will not correctly
be served/referenced, this may cause issues when communicating between [Ruru][]
and GraphQL.

```js
// utils/grafserv.mjs
import { grafserv } from "grafserv/next/v13";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a shared Grafserv instance
export const serv = grafserv({ schema, preset });
```

```js
// pages/api/graphql.mjs
import { serv } from "../../utils/grafserv.mjs";

// Create and export the `/graphql` route handler
const handler = serv.createGraphQLHandler();
export default handler;
```

```js
// pages/api/ruru.mjs
import { serv } from "../../utils/grafserv.mjs";

// Create and export the `/ruru` route handler
const handler = serv.createRuruHandler();
export default handler;
```
