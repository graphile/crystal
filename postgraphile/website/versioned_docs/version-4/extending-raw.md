---
title: Graphile Engine
---

# Schema plugins — Graphile Engine

The PostGraphile GraphQL schema is constructed out of a number of Graphile
Engine plugins. The core PG-related plugins can be found here:

https://github.com/graphile/graphile-engine/tree/master/packages/graphile-build-pg/src/plugins

These plugins introduce small amounts of functionality, and build upon each
other. The order in which the plugins are loaded is significant, and can be
found from the `defaultPlugins` export in
[`src/index.ts`](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/src/index.ts)
of the `graphile-build-pg` module.

You can extend PostGraphile's GraphQL schema by adding plugins before or after
the default plugins. You may even opt to replace the entire list of plugins used
to build the schema. Graphile Engine plugins are built on top of the
[GraphQL reference JS implementation](http://graphql.org/graphql-js/), so it is
recommended that you have familiarity with that before attempting to write your
own plugins.

### Adding root query/mutation fields

A common request is to add additional root-level fields to your schema, for
example to integrate external services. The easiest way to do this is to
[use `makeExtendSchemaPlugin`](./make-extend-schema-plugin) to generate a
plugin that will extend your schema (this can be used to add fields anywhere,
not just at the root-level):

```js
// add-http-bin-plugin.js
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const fetch = require("node-fetch");

module.exports = makeExtendSchemaPlugin({
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
example you want access to the look-ahead features, or you're defining the
fields in a more automated way) then you can use a 'GraphQLObjectType:fields'
hook and to add our new field:

```js
// add-http-bin-plugin-raw.js
const fetch = require("node-fetch");

function AddHttpBinPlugin(builder, { pgExtendedTypes }) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields, // Input object - the fields for this GraphQLObjectType
      { extend, getTypeByName }, // Build object - handy utils
      { scope: { isRootQuery } }, // Context object - used for filtering
    ) => {
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
            if (pgExtendedTypes) {
              // This setting is enabled through postgraphile's
              // `--dynamic-json` option, if enabled return JSON:
              return response.json();
            } else {
              // If Dynamic JSON is not enabled, we want a JSON string instead
              return response.text();
            }
          },
        },
      });
    },
  );
}

module.exports = AddHttpBinPlugin;
```

(If you wanted to add a mutation you'd use `isRootMutation` rather than
`isRootQuery`.)

We can then load our plugin into PostGraphile via:

```
postgraphile --append-plugins `pwd`/add-http-bin-plugin.js -c postgres:///mydb
```

Note that the types of added fields do not need to be implemented via Graphile
Engine's
[`newWithHooks`](https://graphile.org/graphile-build/build-object/#newwithhookstype-spec-scope) -
you can use standard GraphQL objects too, as we have demonstrated with the
`JSONType` above. (However, if you do not use `newWithHooks` then the objects
referenced cannot be extended via plugins.)

### Wrapping an existing resolver

Sometimes you might want to override what an existing field does. Due to the way
that PostGraphile works (where the root Query field resolvers are the only ones
who perform SQL queries) this is generally most useful at the top level.

In PostGraphile version 4.1 and above, you can
[use `makeWrapResolversPlugin`](./make-wrap-resolvers-plugin) to easily wrap a
resolver:

```js
module.exports = makeWrapResolversPlugin({
  User: {
    async email(resolve, source, args, context, resolveInfo) {
      const result = await resolve();
      return result.toLowerCase();
    },
  },
});
```

If you need to process the resolvers in a more powerful way than possible via
`makeWrapResolversPlugin`, then you can drop down to the raw plugin API. The
following example modifies the 'createLink' mutation so that it performs some
additional validation (thrown an error if the link's `title` is too short) and
performs an action after the link has been saved. You could use a plugin like
this to achieve many different tasks, including emailing a user after their
account is created or logging failed authentication attempts.

Previously we used `GraphQLObjectType:fields` to add a field, as that
manipulates the list of fields. This time we are manipulating an individual
field, so we will use the `GraphQLObjectType:fields:field` hook. This makes our
intent clear, and also grants us access to
[the `addArgDataGenerator`](https://build.graphile.org/graphile-build/4/look-ahead#when-processing-arguments-addargdatagenerator)
function which we need to request the record id. The following example also uses
an instance of [`queryBuilder.`](./make-extend-schema-plugin/#querybuilder)
(Read more about the different hooks
[in the Graphile Engine docs](https://build.graphile.org/graphile-build/4/all-hooks).)

```js
function performAnotherTask(linkId) {
  console.log(`We created link ${linkId}!`);
}

module.exports = function CreateLinkWrapPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field",
    (
      field,
      { pgSql: sql },
      { scope: { isRootMutation, fieldName }, addArgDataGenerator },
    ) => {
      if (!isRootMutation || fieldName !== "createLink") {
        // The 'GraphQLObjectType:fields:field' hook runs for every field on
        // every object type in the schema. If it's not a field in the root
        // mutation type, or the field isn't named 'createLink', we don't want
        // to modify it in this hook - so return the input object unmodified.
        return field;
      }

      // We're going to need link.id for our `performAnotherTask`; so we're going
      // to abuse addArgDataGenerator to make sure that this field is ALWAYS
      // requested, even if the user doesn't specify it. We're careful to alias
      // the result to a field that begins with `__` as that's forbidden by
      // GraphQL and thus cannot clash with a user's fields.
      addArgDataGenerator(() => ({
        pgQuery: (queryBuilder) => {
          queryBuilder.select(
            // Select this value from the result of the INSERT:
            sql.query`${queryBuilder.getTableAlias()}.id`,
            // And give it this name in the result data:
            "__createdRecordId",
          );
        },
      }));

      // It's possible that `resolve` isn't specified on a field, so in that case
      // we fall back to a default resolver.
      const defaultResolver = (obj) => obj[fieldName];

      // Extract the old resolver from `field`
      const { resolve: oldResolve = defaultResolver, ...rest } = field;

      return {
        // Copy over everything except 'resolve'
        ...rest,

        // Add our new resolver which wraps the old resolver
        async resolve(...resolveParams) {
          // Perform some validation (or any other action you want to do before
          // calling the old resolver)
          const RESOLVE_ARGS_INDEX = 1;
          const {
            input: {
              link: { title },
            },
          } = resolveParams[RESOLVE_ARGS_INDEX];
          if (title.length < 3) {
            throw new Error("Title is too short!");
          }

          // Call the old resolver (you SHOULD NOT modify the arguments it
          // receives unless you also manipulate the AST it gets passed as the
          // 4th argument; which is quite a lot of effort) and store the result.
          const oldResolveResult = await oldResolve(...resolveParams);

          // Perform any tasks we want to do after the record is created.
          await performAnotherTask(oldResolveResult.data.__createdRecordId);

          // Finally return the result.
          return oldResolveResult;
        },
      };
    },
  );
};
```

### Removing things from the schema

:::warning warning
Removing things from your GraphQL schema this way may have
unintended consequences - especially if you add back a field or type with the
same name as that which you removed. It's advised that rather than removing
things, you instead avoid them being generated in the first place.
:::

:::tip
**If you're looking for an easy way to prevent certain tables, fields, functions
or relations being added to your GraphQL schema, check out
[smart comments](./smart-comments).**
:::

If you want to remove a class of things from the schema then you can remove the
plugin that adds them; for example if you no longer wanted to allow ordering by
all the columns of a table (i.e. only allow ordering by the primary key) you
could omit
[PgOrderAllColumnsPlugin](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/src/plugins/PgOrderAllColumnsPlugin.ts).
If you didn't want computed columns added you could omit
[PgComputedColumnsPlugin](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/src/plugins/PgComputedColumnsPlugin.ts).

However, sometimes you need more surgical precision, and you only want to remove
one specific type of thing. To achieve this you need to add a hook to the thing
that owns the thing you wish to remove - for example if you want to remove a
field `bar` from an object type `Foo` you could hook `GraphQLObjectType:fields`
and return the set of fields less the one you want removed.

Here's an example of a plugin generator you could use to generate plugins to
remove individual fields. This is just to demonstrate how a plugin to do this
might work, [smart comments](./smart-comments) are likely a better approach.

```js
const omit = require("lodash/omit");

function removeFieldPluginGenerator(objectName, fieldName) {
  const fn = function (builder) {
    builder.hook("GraphQLObjectType:fields", (fields, _, { Self }) => {
      if (Self.name !== objectName) return fields;
      return omit(fields, [fieldName]);
    });
  };
  // For debugging:
  fn.displayName = `RemoveFieldPlugin:${objectName}.${fieldName}`;
  return fn;
}

const RemoveFooDotBarPlugin = removeFieldPluginGenerator("Foo", "bar");

module.exports = RemoveFooDotBarPlugin;
```
