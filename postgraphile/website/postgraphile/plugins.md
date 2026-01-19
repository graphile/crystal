---
title: Server Plugins
---

:::note

This page relates to changing how the PostGraphile HTTP server
(Grafserv) and other non-schema concerns work. If you're instead looking to
change the generated GraphQL schema (e.g. to add fields or types), see [Schema
Plugins](./extending).

:::

In addition to the [Graphile Build plugin system](./extending) which builds
the GraphQL schema in PostGraphile, PostGraphile also has a plugin system for
the CLI and web layer. Thanks to `graphile-config`, this now uses the same
plugin system, just different scopes.

Server plugins are regular `graphile-config` plugins. Add them to your preset
and PostGraphile will pick them up automatically.

Here's a basic `graphile.config.ts` with a server plugin:

```ts title="graphile.config.ts"
import type { GraphileConfig } from "graphile-config";
import PersistedPlugin from "@grafserv/persisted";

const preset: GraphileConfig.Preset = {
  plugins: [PersistedPlugin],
};

export default preset;
```

Currently these scopes are undocumented, so here's some examples:

## Customizing Ruru's title:

```ts
function ruruTitle(title: string): GraphileConfig.Plugin {
  return {
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
}
```

## Manipulating the request body

For example you might want to implement a plugin where you pass only the
operation name (not the full document) and have the server populate the
document by looking up the operation name.

:::tip

This is purely for demonstration of the plugin API, you should not use this
plugin! Instead, consider the `@grafserv/persisted` module (which uses the same
middleware).

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
  description: "Only specify the query name and the query will be populated",
  version,

  grafserv: {
    middleware: {
      processGraphQLRequestBody(next, event) {
        const { body } = event;
        const document = documents[body.id];
        if (!document) {
          throw new SafeError(
            `QueryByNamePlugin couldn't find query '${body.id}'`,
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

<!-- TODO: port!

### First-party open-source plugins

We have some first-party open source plugins that can enhance your PostGraphile
experience, or act as a template for writing your own plugins:

- `@graphile/operation-hooks` - enables you to add callbacks to certain
  operations, useful for validation, pre-flight checks, authorization, error
  handling, notifying users of semi-related information, etc.
- `@graphile/pg-pubsub` - provides realtime capabilities to schema plugins
  powered by PostgreSQL's LISTEN/NOTIFY.

### Installing

You can install plugins with `yarn add` or `npm install`, e.g.

```bash
yarn add @grafserv/persisted
```

### Enabling plugins

PostGraphile V5 uses `graphile-config` presets for configuration. Enable
plugins by adding them to your preset (typically in `graphile.config.ts`), or
by using `--preset` to include a preset module.

```ts title="graphile.config.ts"
import type { GraphileConfig } from "graphile-config";
import PersistedPlugin from "@grafserv/persisted";

const preset: GraphileConfig.Preset = {
  plugins: [PersistedPlugin],
};

export default preset;
```

```bash
postgraphile --preset ./graphile.config.ts -c postgres:///my_db
```

### Writing your own plugins

**IMPORTANT**: here be dragons. This interface is experimental, and
documentation on it is far from complete. To use this interface you are expected
to have deep knowledge of the PostGraphile internals, since that is what you
will be augmenting/overriding. Note that **many things you might think you need
a server plugin for are better served with standard HTTP middleware**, e.g. by
using Express/Koa/Fastify/etc middleware you can implement CORS, sessions,
custom authentication flows, rate limiting, logging, routing,
liveness/readiness/health endpoints, statistics collection and much more - you
probably do not need to write PostGraphile server plugins for this kind of
functionality.

Server plugins are plain objects that implement `graphile-config` plugin
interfaces such as `grafserv.middleware.*`. Multiple plugins may register
middleware; the output of one middleware function is fed as input to the next.

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

Examples of server plugins include
[@grafserv/persisted](https://www.npmjs.com/package/@grafserv/persisted). Refer
to each plugin's documentation for configuration details.

If you need help writing your own PostGraphile server plugins,
[ask in #help-and-support in our Discord chat](http://discord.gg/graphile).
