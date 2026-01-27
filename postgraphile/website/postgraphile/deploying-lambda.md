---
title: Deploying to AWS Lambda
---

PostGraphile V5 can run on AWS Lambda via the [Grafserv Lambda adaptor](https://grafast.org/grafserv/servers/lambda)
(`postgraphile/grafserv/lambda/v1`). We
strongly recommend you [export your schema as executable
code](./exporting-schema.md) so that startup time is minimized.

```ts
import { grafserv } from "grafserv/lambda/v1";
import preset from "./graphile.config.mjs";
import schema from "./exported-schema.mjs";

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Export a lambda handler for GraphQL
export const handler = serv.createHandler();
```

Please ask for help [via the discord](https://discord.gg/graphile) (or GitHub
issues) and submit improvements to this page if/when you get it working.
