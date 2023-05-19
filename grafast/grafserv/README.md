# grafserv

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/grafserv.svg?style=flat)](https://www.npmjs.com/package/grafserv)
![MIT license](https://img.shields.io/npm/l/grafserv.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

_**A highly performant GraphQL server for Node.js, powered by
[Gra*fast*](https://grafast.org).**_

**Documentation**: https://grafast.org/grafserv/

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://surge.io/"><img src="https://graphile.org/images/sponsors/surge.png" width="90" height="90" alt="Surge" /><br />Surge</a> *</td>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Usage

Grafserv supports many different servers, and because each server is different
each has their own entrypoint, e.g. `grafserv/node` for the Node.js HTTP server
or `grafserv/express/v4` for Express v4. Generally you import the `grafserv`
function from the relevant entrypoint for your server of choice and then create
an instance:

```js
const serv = grafserv({ schema, preset });
```

`grafserv` is passed the GraphQL schema to use (if it's available, otherwise
passing either null or a promise is also acceptable) and a `graphql-config`
preset - i.e. your configuration.

Calling `grafserv` will return an instance; this instance will have a number of
helpers on it, including helpers specific to integrating it with your framework
of choice. For servers that operate on a middleware basis this is typically
`serv.addTo(app)` (which allows registering multiple route handlers), though
different servers may have different APIs, such as `serv.createGraphQLHandler()`
for Lambda and Next.js.

Note: There is little value in Grafserv reimplementing every non-GraphQL concern
your server may have, so instead it leans on the ecosystem of your chosen server
to handle things like compression, rate limits, sessions, cookies, etc. For
example, to compress your responses you'd need to use a module like
[`compression`](https://expressjs.com/en/resources/middleware/compression.html)
for Express, [`koa-compress`](https://www.npmjs.com/package/koa-compress) for
Koa, or [`@fastify/compress`](https://www.npmjs.com/package/@fastify/compress)
for Fastify.

### serv.release()

Releases any resources created by the instance; no further requests should be
handled (though currently active requests will be allowed to complete).

// TODO: consider terminating subscriptions or other long-lived things.

### serv.onRelease(cb)

Adds `cb` to the list of callbacks to be called when the server is released;
useful for releasing resources you created only for the server. Callbacks will
be called in reverse order that they were added.

### serv.setSchema(newSchema)

Replaces the schema to use for future requests (currently active requests are
unaffected) - this is primarily used for "watch" mode.

### serv.setPreset(newPreset)

Replaces the config to use for future requests (currently active requests are
unaffected) - this is primarily used for "watch" mode. Note that certain
configuration changes might not be reflected by certain servers until a restart.

### serv.getSchema()

Returns either the GraphQL schema that is currently in use, or a promise to the
same.

### serv.getPreset()

Returns the resolved `graphile-config` preset that is currently in use.

## Servers

### Node HTTP server

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

### Express V4

```js
import { createServer } from "node:http";
import express from "express";
import { grafserv } from "grafserv/express/v4";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create an express app
const app = express();
// (Add any Express middleware you want here.)

// Create a Node HTTP server, mounting Express into it
const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Express app, and register
// websockets if desired
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Express server
server.listen(preset.grafserv?.port ?? 5678);
```

### Koa V2

```js
import { createServer } from "node:http";
import Koa from "koa";
import { grafserv } from "grafserv/koa/v2";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Koa app
const app = new Koa();
// (Add any Koa middleware you want here.)

// Create a Node HTTP server, mounting Koa into it
const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Koa app, and register
// websockets if desired
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Koa server
server.listen(preset.grafserv?.port ?? 5678);
```

### Fastify V4

```js
import Fastify from "fastify";
// import websocket from '@fastify/websocket'
import { grafserv } from "grafserv/fastify/v4";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Fastify app
const app = Fastify({
  logger: true,
});
// (Add any Fastify middleware you want here.)
// await app.register(websocket);

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Fastify app
serv.addTo(app).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Fastify server
app.listen({ port: preset.grafserv?.port ?? 5678 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});
```

### Next.js API route

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

### Lambda

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
