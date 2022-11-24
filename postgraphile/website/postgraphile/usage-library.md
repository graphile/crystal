---
title: Usage - Library
---

# Using PostGraphile as a Library

Library mode is the most popular way of running PostGraphile; it gives more
power than using the CLI (see [CLI usage](./usage-cli/)) because you can
leverage the capabilities and ecosystems of your chosen Node.js webserver
(Express, Koa, Fastify, etc), but is much easier to setup and more fully
featured than [Schema-only Usage](./usage-schema/).

## Getting a PostGraphile instance

Library mode is configured using a preset (see [Configuration](./config.md) for
the options) and returns a "PostGraphile Instance" which has various methods
you can use depending on what you're trying to do.

```js title="instance.js"
import preset from "./graphile.config.js";
import postgraphile from "postgraphile";

export const instance = postgraphile(preset);
```

:::warning

The `(await instance.getGrafserv()).handler` API is likely to change before the V5.0.0 release to
allow for PostGraphile to be used with a wide array of JS webserver frameworks.

:::

### instance.getGrafserv()

Builds and returns a [Grafserv][] instance (will always return the same
instance after the first call). This is not itself a webserver, but it
can be mounted inside one, for example in Node's HTTP server:

```js title="server.js"
import { instance } from "./instance.js";
import { createServer } from "node:http";

const grafserv = await instance.getGrafserv();
const server = createServer(grafserv.handler);
server.listen(5678);
console.log("Server listening at http://localhost:5678");
```

For information about using PostGraphile with Connect, Express, Koa, Fastify,
Restify, or any other HTTP servers, please see the [Grafserv
documentation][grafserv].

### instance.getServerParams()

:::warning

This will likely be renamed before the V5.0.0 release.

:::

Returns a promise to the server parameters - an object containing:

- `schema` - the GraphQL schema
- `config` - the resolved preset

Note that this may change over time, e.g. in watch mode.

### instance.getSchema()

Shortcut to `(await getServerParams()).schema` - the current GraphQL schema the
instance represents (may change due to watch mode).

### instance.release()

Call this when you don't need the PostGraphile instance any more and it will
release any resources it holds (for example schema watching, etc).

[grafserv]: https://grafast.org/grafserv/
