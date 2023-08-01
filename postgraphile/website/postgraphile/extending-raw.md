---
layout: page
path: /postgraphile/extending-raw/
title: Schema Plugins - Graphile Build
---

The PostGraphile GraphQL schema is constructed out of a number of Graphile
Build plugins. The core PG-related plugins can be found here:

https://github.com/benjie/crystal/tree/planning/graphile-build/graphile-build-pg/src/plugins

These plugins introduce small amounts of functionality, and build upon each
other. The default list of plugins can be found from the `defaultPlugins`
export in
[`src/preset.ts`](https://github.com/benjie/crystal/blob/planning/graphile-build/graphile-build-pg/src/preset.ts)
of the `graphile-build-pg` module.

You can extend PostGraphile's GraphQL schema by adding plugins or presets. You
may even opt to replace the entire list of plugins used to build the schema.
Graphile Build plugins are built on top of the [GraphQL reference JS
implementation](http://graphql.org/graphql-js/), so it is recommended that you
have familiarity with that before attempting to write your own plugins.

### Adding root query/mutation fields

A common request is to add additional root-level fields to your schema, for
example to integrate external services. The easiest way to do this is to
[use `makeExtendSchemaPlugin`](./make-extend-schema-plugin/) to generate a
plugin that will extend your schema (this can be used to add fields anywhere,
not just at the root-level):

```ts title="add-http-bin-plugin.js"
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import fetch from "node-fetch";

export default makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type Query {
      httpBinHeaders: JSON
    }
  `,
  resolvers: {
    Query: {
      async httpBinHeaders() {
        const response = await fetch("https://httpbin.org/headers");
        return response.json();
      },
    },
  },
});
```

If you need to do this using the low-level plugins API for some reason (for
example you're defining the fields in a more automated way) then you can use a
'GraphQLObjectType_fields' hook and to add our new field:

```ts title="add-http-bin-plugin-raw.js"
import fetch from "node-fetch";

const AddHttpBinPlugin = {
  name: "AddHttpBinPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      GraphQLObjectType_fields(
        fields, // Input object - the fields for this GraphQLObjectType
        build, // Build object - handy utils
        context, // Context object - used for filtering
      ) {
        const {
          extend,
          getTypeByName,
          options: { jsonScalarAsString },
        } = build;
        const {
          scope: { isRootQuery },
        } = context;
        if (!isRootQuery) {
          // This isn't the object we want to modify:
          // return the input object unmodified
          return fields;
        }

        // We don't want to introduce a new JSON type as that will clash,
        // so let's find the JSON type that other fields use:
        const JSONType = getTypeByName("JSON");

        return extend(fields, {
          httpBinHeaders: {
            type: JSONType,
            async resolve() {
              const response = await fetch("https://httpbin.org/headers");
              if (jsonScalarAsString) {
                // We've been told to provide JSON scalars in stringified format
                return response.text();
              } else {
                // By default, we can just return a dynamic "JSON" scalar
                return response.json();
              }
            },
          },
        });
      },
    },
  },
};

export default AddHttpBinPlugin;
```

(If you wanted to add a mutation you'd use `isRootMutation` rather than
`isRootQuery`.)

We can then load our plugin into PostGraphile by adding it to our preset:

```ts title="graphile.config.mjs"
import AddHttpBinPlugin from "./add-http-bin-plugin.js";

export default {
  // ...
  plugins: [AddHttpBinPlugin],
};
```

Note that the types of added fields can use standard GraphQL objects in
addition to types generated via the Graphile Build system. (However, if you do
not build your object types via Graphile Build's `registerObjectType` (or
similar) then the objects referenced cannot be extended via plugins.)

### Removing things from the schema

**If you're looking for an easy way to prevent certain tables, fields, functions
or relations being added to your GraphQL schema, check out
[smart comments](./smart-comments/).**

If you want to prevent a class of things from being added to the schema then
you can disable the plugin that adds them; for example if you didn't want
Postgres functions added you could disable `PgCustomTypeFieldPlugin`:

```ts title="graphile.config.mjs"
export default {
  // ...
  disabledPlugins: ["PgCustomTypeFieldPlugin"],
};
```

:::tip

For efficiency's sake, it's advised that rather than removing things from the
schema, you instead avoid them being generated in the first place using the
tips above.

:::

However, sometimes the above strategies don't allow you to make the changes you
desire. To remove something manually, you need to add a hook to the thing that
owns the thing you wish to remove - for example if you want to remove a field
`bar` from an object type `Foo` you could hook `GraphQLObjectType_fields` and
return the set of fields less the one you want removed.

Here's an example of a plugin generator you could use to generate plugins to
remove individual fields. This is just to demonstrate how a plugin to do this
might work, [smart comments](./smart-comments/) are likely a better approach.

```ts
function makeRemoveFieldPlugin(
  objectName: string,
  fieldName: string,
): GraphileConfig.Plugin {
  return {
    name: `RemoveField_${objectName}_${fieldName}_Plugin`,
    description: `Removes the ${objectName}.${fieldName} field from the GraphQL schema`,
    version: "0.0.0",

    schema: {
      hooks: {
        GraphQLObjectType_fields(fields, build, context) {
          if (context.Self.name !== objectName) return fields;
          delete fields[fieldName];
          return fields;
        },
      },
    },
  };
}

export const RemoveFooDotBarPlugin = makeRemoveFieldPlugin("Foo", "bar");
```
