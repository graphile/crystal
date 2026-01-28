# Next.js API route

Grafserv does not currently ship an official Next.js adaptor. If you are using
Next.js, run Grafserv in a separate server process (for example the Node or
Express adaptor) and proxy requests from your Next.js app to that server.

If you need direct integration, keep an eye on the Grafserv server adaptors
list and migrate when a Next.js adaptor becomes available.

## Shape of solution

If you plan to implement a Next.js adaptor, here's the kind of shape we'd expect
it to take:

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

If you're interested in contributing such an adaptor, please reach out.
