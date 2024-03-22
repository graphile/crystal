---
layout: page
path: /postgraphile/node-id/
title: Globally Unique Object Identification ("nodeId" / "id")
---

The [GraphQL Global Object Identification
Specification](https://facebook.github.io/relay/graphql/objectidentification.htm)
is one of the best practices in GraphQL, it gives clients a way to uniquely identify each object in the schema
and to fetch these objects by their IDs.

By default, PostGraphile implements this specification, assigning the unique
identifier to every table with a primary key, but with a minor tweak - it uses
the field name `nodeId` rather than the specified `id`. This change is to avoid
clashing with the `id` field that is commonly the name of primary keys in
database design. If you wish to call the Global Object Identifier field `id`
instead (as is mandated by the specification), you can do so by overriding the
`nodeIdFieldName` inflector, or you can use the `postgraphile/presets/relay`
preset which does this (and a lot more) for you.

If you choose to override the `nodeIdFieldName` inflector and you have database
fields called `id` then you may want to override the `attribute` inflector too:

```ts {7-9,12}
const IdPlugin: GraphileConfig.Plugin = {
  name: "IdPlugin",
  version: "0.0.0",

  inflection: {
    replace: {
      nodeIdFieldName() {
        return "id";
      },
      attribute(previous, options, details) {
        const name = previous!.call(this, details);
        if (name === "id") return "rowId";
        return name;
      },
    },
  },
};
```

Similarly to the `postgraphile/presets/relay` preset, the
`postgraphile/presets/amber` preset also sets nodeIdFieldName to `id` with
`graphile-build`'s `NodePlugin`. The amber preset also mirrors the relay preset
in renaming `id` columns in database tables to `rowId` with `graphile-build-pg`'s
`PgAttributesPlugin`. If you are using the amber preset and you want to revert to
using `nodeId` for the unique identifier and `id` attribute name for any `id`
columns in your database, you can add something like the following plugin:

```ts
const RevertToNodeIdPlugin: GraphileConfig.Plugin = {
    name: 'RevertToNodeIdPlugin',
    version: '1.0.0',
    inflection: {
        replace: {
            nodeIdFieldName: (): string => 'nodeId',
            attribute: (previous: any, options: any, details: any) => {
                const name = previous!.call(this, details)
                if (name === 'rowId') {
                    return 'id'
                }
                return name
            },
        },
    },
}
```

One common use case for the `nodeId` (or `id`) field is as the cache key for
your client library, e.g. with Apollo Client's `dataIdFromObject`:

```ts
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  // highlight-next-line
  dataIdFromObject: (object) => object.nodeId || null,
});

export const client = new ApolloClient({
  link: new HttpLink(),
  cache,
});
```

### Disabling the Global Object Identifier

You can disable the global object identifier throughout your API by disabling `NodePlugin`:

```ts title="graphile.config.mjs"
export default {
  // ...
  // highlight-next-line
  disablePlugins: ["NodePlugin"],
};
```

Ensure that you have a good way of generating cache identifiers for your GraphQL
client though!

(Note: the GraphQL Global Object Identification Specification was previously
known as the Relay Global Object Identification Specification, but it's not
specific to Relay and is a general best practice for GraphQL APIs.)

### Recommended: remove redundant fields

If having both `nodeId: ID!` and `id: Int!` in your schema bothers you (as it
should!), you should consider using the `postgraphile/presets/relay` preset.
This preset will hide raw primary keys from most of the schema, and will use
global object identifiers instead - not just in the query schema but also in
mutations and filtering (and, with a little guidance, in function inputs).

```js title="graphile.config.mjs"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
// highlight-next-line
import { PostGraphileRelayPreset } from "postgraphile/presets/relay";

export default {
  extends: [
    PostGraphileAmberPreset,
    // highlight-next-line
    PostGraphileRelayPreset,
    //...
  ],
  // ...
};
```

### Node ID structure

In GraphQL an `ID` should be treated as an "opaque" value - you should not
extract values from inside it in your application. Though the Node ID is stable
for the same object, when new objects are created there's no guarantee that
their new ID will conform to the same encoding.

That said, it's generally easy to extract details from PostGraphile's IDs. Take
for example the Node ID `WyJQb3N0IiwxXQ==`, by base64 decoding this value we
can see the data in it is `["Post",1]`. This states that it's for the `Post`
GraphQL type, and the associated primary key value is `1`. (If you're using the
V4 preset then node IDs will use the table name (or a derivative thereof)
rather than the GraphQL type name.)

Thus using node IDs **does not** make your primary keys unobtainable, and doing
so is not a goal of Node IDs. Should you need your primary keys to be
meaningless, one choice is UUIDv4, and another is to use something like a
Feistel cipher.
