---
title: nodeId / id
---

# Globally Unique Object Identification ("nodeId" / "id")

We implement the
[GraphQL Global Object Identification Specification](https://facebook.github.io/relay/graphql/objectidentification.htm),
so any table that has a primary key will automatically have a unique `nodeId`
field available for queries and mutations. This is commonly used as the cache
key for your client library, e.g. with Apollo Client's `dataIdFromObject`:

```js {6}
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  dataIdFromObject: (object) => object.nodeId || null,
});

export const client = new ApolloClient({
  link: new HttpLink(),
  cache,
});
```

:::caution warning
By default, we call the Global Object Identifier `nodeId` to avoid
clashing with the `id` field that's common practice in database design. If you
wish to call the Global Object Identifier field `id` instead (as is mandated by
the specification), you can do so with our `--classic-ids` CLI flag. In doing
so, any `id` column will automatically be renamed to `rowId`.
:::

### Disabling the Global Object Identifier

You can disable the global object identifier throughout your API by skipping the
`require('graphile-build').NodePlugin` plugin; e.g. from the CLI:

```
postgraphile --skip-plugins graphile-build:NodePlugin ...
```

Ensure that you have a good way of generating cache identifiers for your GraphQL
client though!

:::note

The GraphQL Global Object Identification Specification was previously
known as the Relay Global Object Identification Specification, but it's not
specific to Relay.
:::
