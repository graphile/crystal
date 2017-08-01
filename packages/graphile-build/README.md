graphile-build
=============

Usage
-----

The following [runnable example][] creates a plugin that hooks the
'GraphQLObjectType:fields' event in the system and adds a 'random' field to every
object everywhere (including the root Query).

```js
const { buildSchema, defaultPlugins } = require("graphile-build");
// or import { buildSchema, defaultPlugins } from 'graphile-build';

// Create a simple plugin that adds a random field to every GraphQLObject
function MyRandomFieldPlugin(
  builder,
  { myDefaultMin = 1, myDefaultMax = 100 }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, { extend, graphql: { GraphQLInt } }) => {
      return extend(fields, {
        random: {
          type: GraphQLInt,
          args: {
            sides: {
              type: GraphQLInt,
            },
          },
          resolve(_, { sides = myDefaultMax }) {
            return (
              Math.floor(Math.random() * (sides + 1 - myDefaultMin)) +
              myDefaultMin
            );
          },
        },
      });
    }
  );
}

// ----------------------------------------

const { graphql } = require("graphql");

(async function() {
  // Create our GraphQL schema by applying all the plugins
  const schema = await buildSchema([...defaultPlugins, MyRandomFieldPlugin], {
    // ... options
    myDefaultMin: 1,
    myDefaultMax: 6,
  });

  // Run our query
  const result = await graphql(schema, `query { random }`, null, {});
  console.log(result); // { data: { random: 4 } }
})().catch(e => {
  console.error(e);
  process.exit(1);
});
```

Plugins
-------

Plugins can be asynchronous functions (simply define them as `async function
MyPlugin(builder, options) {...}` or return a Promise object).

When a plugin first runs, it should do any of its asynchronous work, and then
return. Schema generation itself (i.e. firing of hooks) is synchronous
(deliberately).

Most plugins will be of the form:

```js
function MyRandomPlugin(builder) {
  builder.hook('HOOK_NAME_HERE',
    (
      // 'inputValue' - the value to replace with the return result
      inputValue,

      // 'build' - a frozen collection of utils and stores for this build,
      // not available during the 'build' event
      { extend, /* ... */ },

      // 'context' - more information about the current object
      { scope: { isMyRandomObject, /* ... */ }, /* ... */ },
    ) => {
      if (!isMyRandomObject) {
        // Exit early if this doesn't have the scope we want
        return inputValue;
      }
      return extend(inputValue, {
        // add additional attributes here...
      });
    }
  );
}
```

Hooks
-----

[(See hooks in the source)](https://github.com/graphile/graphile-build/blob/996e28f0af68f53e264170bd4528b6500ff3ef25/packages/graphile-build/SchemaBuilder.js#L11-L59)

- `build`: The build object represents the current schema build and is passed
  to all hooks, hook the 'build' event to extend this object.

- `init`: The init event is triggered after `build` (which should not generate
  any GraphQL objects) and can be used to build common object types that may be
  useful later. The argument to this is an empty object and should be passed
  through unmodified (it is ignored currently).

- `GraphQLSchema`: This event defines the root-level schema; hook it to add `query`,
  `mutation`, `subscription` or similar GraphQL fields.

- `GraphQLObjectType*`: When creating a GraphQLObjectType via
  `newWithHooks`, we'll execute, the following hooks:

  - `GraphQLObjectType` to add any root-level attributes, e.g. add a description
  - `GraphQLObjectType:interfaces` to add additional interfaces to this object type
  - `GraphQLObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)
  - `GraphQLObjectType:fields:field`: to add any root-level attributes to an
    individual field, e.g. add a description
  - `GraphQLObjectType:fields:field:args` to add arguments to an individual field

- `GraphQLInputObjectType*`: When creating a GraphQLInputObjectType via
  `newWithHooks`, we'll execute, the following hooks:

  - `GraphQLInputObjectType` to add any root-level attributes, e.g. add a description
  - `GraphQLInputObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)
  - `GraphQLInputObjectType:fields:field`: to customize an individual field from above

- `GraphQLEnumType*`: When creating a GraphQLEnumType via `newWithHooks`,
  we'll execute, the following hooks:

  - `GraphQLEnumType` to add any root-level attributes, e.g. add a description
  - `GraphQLEnumType:values` to add additional values


Conventions
-----------

If you extend the build object (in the `build` event) or add details to the
scope of a `newWithHooks` or `fieldWithHooks`, please prefix all
keys with a namespace; for example `graphile-build-pg` uses the `pg` namespace
prefix. Do not pollute other namespaces (unless you have their permission).

[runnable example]: examples/README-1.js
