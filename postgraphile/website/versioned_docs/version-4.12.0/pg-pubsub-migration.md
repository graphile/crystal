---
layout: page
path: /postgraphile/pg-pubsub-migration/
title: Migrating from the Supporter Plugin to @graphile/pg-pubsub
---

Before April 2019, PostGraphile had rudimentary support for GraphQL
subscriptions available only to
[Patreon supporters](https://graphile.org/sponsor/) via "the supporter plugin"
which was originally only available over a custom `git` URL, but later was moved
to `npm` for easier installation. **If you were not one of these users then this
article isn't for you.**

With v4.4.0, PostGraphile's subscriptions support was extended and open-sourced.
Users of `@graphile/supporter` are encouraged to move to using the open source
subscriptions plugin, which should only take a few minutes.

### Step 1: uninstall the outdated module

For the npm module:

```
yarn remove @graphile/supporter
```

For the `git` module, edit your `package.json` and remove the relevant line and
then run `yarn` or `npm install`

### Step 2: install the new module

```
yarn add @graphile/pg-pubsub
```

### Step 3: switch to using the new module

#### Library

- Your `makePluginHook` line should now reference the `@graphile/pg-pubsub`
  plugin rather than the supporter plugin
- Add the `subscriptions: true` PostGraphile option
- **If** you use `enhanceHttpServerWithSubscriptions` then instead of importing
  it from the supporter plugin, now import it from `postgraphile` directly. The
  call signature is now
  `enhanceHttpServerWithSubscriptions(httpServer, postgraphileMiddleware)` - see
  [Subscriptions Advanced Setup](./subscriptions/#advanced-setup).
- **If** you were passing `middlewares` to `enhanceHttpServerWithSubscriptions`;
  you should instead pass these middlewares as `websocketMiddlewares` via the
  `postgraphile` options.

#### CLI

Change `--plugins @graphile/supporter` to `--plugins @graphile/pg-pubsub` and
add the `--subscriptions` flag.

### Additional information

Now PostGraphile natively supports subscriptions, our built in GraphiQL
(http://localhost:5000/graphiql by default) now supports subscriptions too, so
it's easier than ever to try out a subscription. Also note we have experimental
support for [live queries](./live-queries/).
