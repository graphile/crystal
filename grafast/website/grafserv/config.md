---
sidebar_position: 2
---

# Configuration

Grafserv is configured via a [`graphile-config`
preset](https://star.graphile.org/graphile-config/preset), typically stored to
`graphile.config.ts` (or variants with an alternative file extension).

## Minimal example

The preset can be an
empty object, in which case the defaults will be used:

```ts title="graphile.config.ts"
export default {};
```

## Common example

Common settings you might wish to configure are outlined below:

```ts title="graphile.config.ts"
import type {} from "grafserv";

const preset: GraphileConfig.Preset = {
  grafserv: {
    port: 5678,
    host: "0.0.0.0",
    dangerouslyAllowAllCORSRequests: false,
    graphqlPath: "/graphql",
    graphiqlPath: "/",
    eventStreamPath: "/graphql/stream",
    graphqlOverGET: true,
    graphiql: true,
    websockets: true,
    maxRequestLength: 100000,
  },
};

export default preset;
```

<!-- START:OPTIONS:grafserv -->
<!-- END:OPTIONS:grafserv -->
