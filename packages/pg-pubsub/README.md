# @graphile/pg-pubsub

This PostGraphile [server
plugin](https://www.graphile.org/postgraphile/plugins/) provides a `pubsub`
instance to [schema
plugins](https://www.graphile.org/postgraphile/extending/) that uses
PostgreSQL `LISTEN`/`NOTIFY` to provide realtime features.

Also adds support for `@pgSubscriptions` directive to easily define your own
subscriptions using LISTEN/NOTIFY with `makeExtendSchemaPlugin`; and adds the
`--simple-subscriptions` feature which, when enabled, adds a simple `listen`
subscription field to your GraphQL API.

It's intended that you use this plugin as a provider of realtime data to
other plugins which can use it to add subscription fields to your API.

For full documentation, see: https://www.graphile.org/postgraphile/subscriptions/

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask
all individuals and businesses that use it to help support its ongoing
maintenance and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website/"><img src="https://www.graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a></td>
<td align="center"><a href="https://storyscript.io/?utm_source=postgraphile"><img src="https://www.graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Storyscript" /><br />Storyscript</a></td>
<td align="center"><a href="http://p72.vc/"><img src="https://www.graphile.org/images/sponsors/p72.png" width="90" height="90" alt="Point72 Ventures" /><br />Point72 Ventures</a></td>
</tr></table>

<!-- SPONSORS_END -->

## Usage

CLI:

```
yarn add @graphile/pg-pubsub

postgraphile \
  --plugins @graphile/pg-pubsub \
  --subscriptions \
  --simple-subscriptions \
  -c postgres:///mydb
```

Library:

```js
const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const { default: PgPubsub } = require("@graphile/pg-pubsub");

const pluginHook = makePluginHook([PgPubsub]);

const postgraphileOptions = {
  pluginHook,
  subscriptions: true, // Enable PostGraphile websocket capabilities
  simpleSubscriptions: true, // Add the `listen` subscription field
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that they should only
    // manipulate properties on req/res, they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],
};

const app = express();
app.use(postgraphile(databaseUrl, "app_public", postgraphileOptions));
app.listen(parseInt(process.env.PORT, 10) || 3000);
```
