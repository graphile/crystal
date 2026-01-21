---
title: Server Extensions
---

:::note

This page relates to changing how the PostGraphile HTTP server
(Grafserv) and other non-schema concerns work. If you're instead looking to
change the generated GraphQL schema (e.g. to add fields or types), see [Schema
Plugins](./extending).

:::

In addition to the [Graphile Build plugin system](./extending) which builds the
GraphQL schema in PostGraphile, PostGraphile also has a plugin system for the
CLI and web layer. These use the same plugin system, `graphile-config`, just
different scopes.

Server extensions are regular `graphile-config` plugins and presets. Add them to
your configuration in `graphile.config.*` and PostGraphile will load them
automatically when it loads your configuration file.

## Adding extensions

You can typically install extensions with `yarn add` or `npm install`,
e.g.

```bash
yarn add @grafserv/persisted
```

but that's not enough to use them; you must also add them to your configuration,
either via `plugins: [...]` (for plugins) or `extends: [...]` (for presets).
If an extension makes available both plugins and a preset, it's likely that the
preset is what you want - typically it will compose those plugins together and
add a default set of options. Refer to the extension's documentation for the
correct instructions.

Here's a basic `graphile.config.ts` with a server plugin:

```ts title="graphile.config.ts"
import type { GraphileConfig } from "graphile-config";
import PersistedPlugin from "@grafserv/persisted";

const preset: GraphileConfig.Preset = {
  plugins: [PersistedPlugin],
};

export default preset;
```

## Writing your own plugins

Server plugins are plain objects that implement `graphile-config` plugin
interfaces such as `grafserv.middleware.*`. Multiple plugins may register
middleware; the output of one middleware function is fed as input to the next.
Every plugin must have a unique name.

Here's a minimal plugin that does nothing:

```ts
import type { GraphileConfig } from "graphile-config";

export const NoopPlugin: GraphileConfig.Plugin = {
  name: "NoopPlugin",
};
```

Here's a plugin that hooks the Grafserv `processGraphQLRequstBody`
middleware, but doesn't actually make any changes:

```ts
import type { GraphileConfig } from "graphile-config";

export const MyPlugin: GraphileConfig.Plugin = {
  name: "MyPlugin",
  version: "0.0.0",
  grafserv: {
    middleware: {
      processGraphQLRequestBody(next, event) {
        // mutate event.body as needed
        return next();
      },
    },
  },
};
```

Plugins are powerful. Depending on what you're trying to achieve, working with
the plugin system may require deep knowledge of the PostGraphile internals since
that is what you will be augmenting/overriding. It's hard to write documentation
to cover all possible use cases of the plugin system since it's incredibly
powerful, instead you may consider exploring existing plugins that achieve
similar functionality. Almost everything in PostGraphile is implemented through
the builtin set of plugins - use `graphile config print plugins` to see a list!

:::tip[Consider using a webserver middleware instead]

**Many things you might think you need a server plugin for are better served
with standard HTTP middleware**, e.g. by using Express/Koa/Fastify/etc
middleware you can implement CORS, sessions, custom authentication flows, rate
limiting, logging, routing, liveness/readiness/health endpoints, statistics
collection and much more - you probably do not need to write PostGraphile server
plugins for this kind of functionality.

:::

If you need help writing your own PostGraphile server plugins,
[ask in #help-and-support in our Discord chat](http://discord.gg/graphile).

Currently these scopes are undocumented, so here's some examples:

### Example: customizing Ruru's title

```ts
const title = "My Custom Ruru Title";
export const RuruTitlePlugin: GraphileConfig.Plugin = {
  name: "RuruTitlePlugin",
  version: "0.0.0",

  grafserv: {
    middleware: {
      ruruHTML(next, event) {
        const { htmlParts, request } = event;
        htmlParts.titleTag = `<title>${escapeHTML(
          title + " | " + request.getHeader("host"),
        )}</title>`;
        return next();
      },
    },
  },
};
```

### Example: manipulating the request body

Here's an example to allow users to pass only the operation name (not the full
document) and have the server populate the document automatically.

:::danger[Don't do this!]

This is purely for demonstration of the plugin API, you should not use this
plugin! Instead, consider the `@grafserv/persisted` preset (which also uses
`plugin.grafserv.middleware`, but in a much less short-sighted way) and read up
on [Trusted Documents](https://benjie.dev/graphql/trusted-documents).

:::

```ts
import { SafeError } from "grafast";

const documents = Object.assign(Object.create(null), {
  QueryName: `query QueryName { __typename }`,
  WhoAmI: `query WhoAmI { currentUser { name } }`,
  CreatePost: `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { post { id title } } }`,
});

export const QueryByNamePlugin: GraphileConfig.Plugin = {
  name: "QueryByNamePlugin",
  description:
    "Only specify the query name and the query will be populated. EXAMPLE ONLY!",
  version,

  grafserv: {
    middleware: {
      processGraphQLRequestBody(next, event) {
        const { body } = event;
        const document = documents[body.operationName];
        if (!document) {
          throw new SafeError(
            `QueryByNamePlugin couldn't find query '${body.operationName}'`,
            { statusCode: 400 },
          );
        } else {
          body.query = document;
        }
        return next();
      },
    },
  },
};
```
