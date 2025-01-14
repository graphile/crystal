---
title: Filtering
---

Out of the box, PostGraphile supports rudimentary filtering on
[connections](./connections) using a `condition` argument. This allows you to
filter for specific values (e.g. `username: "Alice"` or `category: ARTICLE`).

[See an example using the `connection` argument.](./examples/collections#relation-condition)

It's important when implementing filters to keep performance in mind, so
PostGraphile gives you the ability to omit certain fields from the list of
filters using the `@omit filter` [smart tag](./smart-tags#omit). You may
also use the `--no-ignore-indexes` option to try and automatically omit fields
that don't appear to be indexed.

## Advanced filtering

You can extend PostGraphile's schema with more advance filtering capabilities by
adding fields using [custom queries](./custom-queries),
[computed columns](./computed-columns) or by using
[makeExtendSchemaPlugin](./make-extend-schema-plugin).

You can also augment PostGraphile's existing connections using custom
[Graphile Engine plugins](./extending-raw), such as the following:

### Filter Plugin

:::warning BEWARE

Adding powerful generic filtering capabilities to your GraphQL
API is strongly discouraged, not just by Benjie (the maintainer of
PostGraphile) but also
[by Lee Byron](https://twitter.com/leeb/status/1004655619431731200) (one of
the inventors of GraphQL) and various other experts in the GraphQL ecosystem.
It is **strongly advised** that you add only very specific filters using one
of the techniques above (and that you make their inputs as simple as possible)
rather than using a generic filtering plugin like this. Not heeding this
advice may lead to very significant performance issues down the line that are
very hard for you to dig your way out of.
:::

A very popular plugin is Matt Bretl's connection-filter plugin, located at
[https://github.com/graphile-contrib/postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter).
This adds a `filter` argument to connections that enables you to use advanced
filters, including filtering on related records from other tables, using greater
than, less than and ranges for filtering, and even filtering against the output
of functions. If you need advanced filtering in your GraphQL API (and you can
use something like
[persisted queries](./production#simple-query-allowlist-persisted-queries--persisted-operations) to
prevent malicious parties issuing complex requests) then I recommend you check
it out!

Be aware that the connection-filter plugin has no live-query specific handling.
This means while [live queries](./live-queries) will work, the filters are not
taken into account when checking if the query result changed. This means that
you may get a subscription update every time something in the collection
changes, even if the result with the applied filter is still the same.

With the included `condition` filters live queries work as expected until you
start using `makeAddPgConditionPlugin` to add your own conditions.

### Other plugins

Some more of the community plugins relate to filtering, you can read more about
them on the [community plugins page](./community-plugins)
