graphile-build
==============

graphile-build provides you with a framework to build high-performance
extensible GraphQL APIs by combining plugins and using advanced look-ahead
features. Plugins may implement best practices (such as the Node interface) or
might build parts of your schema automatically (e.g. `graphile-build-pg` which
will automatically generate types and fields based on your PostgreSQL database
schema).

An example of an application built on `graphile-build` is [PostGraphQL
v4+](https://github.com/postgraphql/postgraphql) which allows you to run just
one command to instantly get a fully working and secure GraphQL API up and
running based on your PostgreSQL database schema.

**For in-depth documentation about `graphile-build`, please see [the graphile
documentation website](https://www.graphile.org/).**

The below just serves as a limited quick-reference for people already familiar
with the library.

Usage
-----

The following [runnable example][] creates a plugin that hooks the
'GraphQLObjectType:fields' event in the system and adds a 'random' field to
every object everywhere (including the root Query).

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

[runnable example]: examples/README-1.js
