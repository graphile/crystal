---
title: nodeID / id
---

# Globally Unique Object Identification ("id" / "nodeId")

The [GraphQL Global Object Identification
Specification](https://facebook.github.io/relay/graphql/objectidentification.htm)
is one of the best practices in GraphQL, it gives clients a way to uniquely identify
each object in the schema and to fetch these objects by their IDs.

By default, the `postgraphile/presets/amber` preset implements this specification.
The amber preset assigns the unique identifier to every table with a primary key.
The preset exposes the unique identifier as an attribute named `id`.

It is common in database design to use the column name `id` for primary keys. For
this reason, if there is an attribute named `id` that is already on the GraphQL type,
the amber preset renames that attribute to `rowId`. If you want to use the amber
preset but you do not like this behavior, you have several options:

1. You can use the `postgraphile/presets/relay` preset which makes several changes
   including removing `rowId` entirely.
2. You can use a V4 preset that mimics the behavior and settings of PostGraphile V4
   which used `nodeId` to represent the unique identifier.
3. You can create your plugin similar to the following:

```ts
const IdToNodeIdPlugin: GraphileConfig.Plugin = {
  name: "IdToNodeIdPlugin",
  version: "1.0.0",
  inflection: {
    replace: {
      nodeIdFieldName() {
        return "nodeId";
      },
      _attributeName(previous, options, details) {
        const attribute = codec.attributes[attributeName];
        const name = attribute.extensions?.tags?.name || attributeName;
        return this.coerceToGraphQLName(name);
      },
    },
  },
};
```

One common use case for the unique `id` field is as the cache key for your client
library, e.g. with Apollo Client's `dataIdFromObject`:

```ts
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  // highlight-next-line
  dataIdFromObject: (object) => object.id || null,
  // Or if you renamed 'id' to 'nodeId' then:
  //   dataIdFromObject: (object) => object.nodeId || null,
});

export const client = new ApolloClient({
  link: new HttpLink(),
  cache,
});
```

### Using the Global Object Identifier in Function Arguments

The global object identifier can be accepted as a function argument using
[`@argNvariant nodeId`](./smart-tags/#arg0variant-arg1variant-).

```sql
create table entity_a(
  id uuid primary key
);

create table entity_b(
  id uuid primary key
);

create table junction(
  a_id uuid REFERENCES entity_a(id),
  b_id uuid REFERENCES entity_b(id),
  primary key (a_id, b_id)
);

create function add_junction_entry(a entity_a, b entity_b) returns junction as $$
  insert into junction values (a.id, b.id) returning *;
$$ language sql volatile;

comment on function add_junction_entry(a entity_a, b entity_b) is $$
  @arg0variant nodeId
  @arg1variant nodeId
$$;
```

### Disabling the Global Object Identifier

The global object identifier is added by the amber preset. If you use the amber
preset but you want to disable the global object identifier throughout your API,
you can do so by disabling `NodePlugin`:

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
known as the Relay Global Object Identification Specification, but it is not
specific to Relay and is a general best practice for GraphQL APIs.)

### More On the Relay Preset

If having both `id: ID!` and `rowId: Int!` in your schema bothers you (as it
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

### Globally Unique ID Structure

In GraphQL a globally unique ID should be treated as an "opaque" value: you should
not extract values from inside it in your application. Though the globally unique
ID is stable for the same object, when new objects are created there is no guarantee
that their new ID will conform to the same encoding.

That said, it is generally easy to extract details from PostGraphile's globally
unique IDs. Take for example the unique ID `WyJQb3N0IiwxXQ==`. By base64 decoding
this value, we can see the data in it is `["Post",1]`. This states that it is for
the `Post` GraphQL type, and the associated primary key value is `1`. (If you are
using the V4 preset then `nodeId`s will use the table name (or a derivative thereof)
rather than the GraphQL type name.)

Thus, using globally unique IDs **does not** make your primary keys unobtainable, and
doing so is not a goal of globally unique IDs. Should you need your primary keys to
be meaningless, you should use an approach like UUIDv4 or a Feistel cipher.
