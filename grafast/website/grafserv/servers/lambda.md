# Lambda

**TODO: actually implement this!**

```js
import { grafserv } from "grafserv/lambda";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Export a lambda handler for GraphQL
export const handler = serv.createGraphQLHandler();
```
