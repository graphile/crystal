# graphile-build

graphile-build provides a framework to build high-performance extensible
GraphQL APIs by combining plugins and using advanced query look-ahead features.
Each plugin would typically have it's own small purpose (such as implementing
the Node interface, or adding `query: Query` to mutation payloads, or watching
an external source for schema changes) and by combining these plugins together
you get a large, powerful, and manageable GraphQL schema. Plugins enable you
to make broad changes to your GraphQL schema with minimal code and without
sacrificing performance.

An example of an application built on `graphile-build` is [PostGraphile
v4+](https://github.com/graphile/postgraphile) which allows you to run just one
command to instantly get a fully working and secure GraphQL API up and running
based on your PostgreSQL database schema. The `graphile-build-pg` module
contains the plugins that are specific to PostgreSQL support (`graphile-build`
itself does not know about databases).

**For in-depth documentation about `graphile-build`, please see [the graphile
documentation website](https://www.graphile.org/).** The below just serves as a
limited quick-reference for people already familiar with the library.

**Please note: rather than using the very raw plugin interface as shown below,
you may want to use the helpers in `graphile-utils`.**

## Usage

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
  builder.hook("GraphQLObjectType:fields", (fields, build) => {
    const {
      extend,
      graphql: { GraphQLInt },
    } = build;
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
  });
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
  const result = await graphql(
    schema,
    `
      query {
        random
      }
    `,
    null,
    {}
  );
  console.log(result); // { data: { random: 4 } }
})().catch(e => {
  console.error(e);
  process.exit(1);
});
```

## Plugins

Plugins can be asynchronous functions (simply define them as `async function MyPlugin(builder, options) {...}` or return a Promise object).

When a plugin first runs, it should do any of its asynchronous work, and then
return. Schema generation itself (i.e. firing of hooks) is synchronous
(deliberately).

Most plugins will be of the form:

```js
function MyRandomPlugin(builder) {
  builder.hook("HOOK_NAME_HERE", (
    // 'inputValue' - the value to replace with the return result
    inputValue,
    // 'build' - a frozen collection of utils and stores for this build,
    // not available during the 'build' event
    { extend /* ... */ },
    // 'context' - more information about the current object
    { scope: { isMyRandomObject /* ... */ } /* ... */ }
  ) => {
    if (!isMyRandomObject) {
      // Exit early if this doesn't have the scope we want
      return inputValue;
    }
    return extend(inputValue, {
      // add additional attributes here...
    });
  });
}
```

[runnable example]: examples/README-1.js
