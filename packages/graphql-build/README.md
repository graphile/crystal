graphql-build
=============

Usage
-----

The following example creates a plugin that hooks the 'objectType:fields' event
in the system and adds a 'random' field to every object everywhere (including
the root Query).

```js
const { buildSchema, defaultPlugins } = require("graphql-build");
// or import { buildSchema, defaultPlugins } from 'graphql-build';
const { graphql, GraphQLInt } = require("graphql");

// Create a simple plugin that adds a random field to every GraphQLObject
function MyRandomFieldPlugin(
  builder,
  { myDefaultMin = 1, myDefaultMax = 100 }
) {
  builder.hook("objectType:fields", (fields, { extend }) => {
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
            Math.floor(Math.random() * (sides - myDefaultMin)) + myDefaultMin
          );
        },
      },
    });
  });
}

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
return. Schema generation itself is synchronous (deliberately).

Most plugins will be of the form:

```js
function MyRandomPlugin(builder) {
  builder.hook('...',
    (inputValue, { extend, /* ... */ }, { scope: { isMyRandomObject, /* ... */ } }) => {
      if (!isMyRandomObject) {
        // Exit early if this doesn't have the scope we want
        return inputValue;
      }
      return extend(inputValue, {
        // add additional properties here...
      });
    }
  );
}
```

Hooks
-----

[(See hooks)](https://github.com/benjie/graphql-build/blob/996e28f0af68f53e264170bd4528b6500ff3ef25/packages/graphql-build/SchemaBuilder.js#L11-L59)

- `build`: The build object represents the current schema build and is passed
  to all hooks, hook the 'build' event to extend this object.

- `init`: The init event is triggered after `build` (which should not generate
  any GraphQL objects) and can be used to build common object types that may be
  useful later. The argument to this is an empty object and should be passed
  through unmodified (it is ignored currently).

- `schema`: This event defines the root-level schema; hook it to add `query`,
  `mutation`, `subscription` or similar GraphQL fields.

- `objectType*`: When creating a GraphQLObjectType via
  `buildObjectWithHooks`, we'll execute, the following hooks:

  - `objectType` to add any root-level attributes, e.g. add a description
  - `objectType:interfaces` to add additional interfaces to this object type
  - `objectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)

- `inputObjectType*`: When creating a GraphQLInputObjectType via
  `buildObjectWithHooks`, we'll execute, the following hooks:

  - `inputObjectType` to add any root-level attributes, e.g. add a description
  - `inputObjectType:fields` to add additional fields to this object type (is
    ran asynchronously and gets a reference to the final GraphQL Object as
    `Self` in the context)

- `enumType*`: When creating a GraphQLEnumType via `buildObjectWithHooks`,
  we'll execute, the following hooks:

  - `enumType` to add any root-level attributes, e.g. add a description
  - `enumType:values` to add additional values

- `field*`: When you add a field to a GraphQLObjectType, wrap the call with
  `buildFieldWithHooks` in order to fire these hooks:

  - `field`: to add any root-level attributes, e.g. add a description
  - `field:args` to add arguments

- `inputField`: When you add a field to a GraphQLInputObjectType, wrap the call
  with `buildFieldWithHooks` in order to fire this hook


Conventions
-----------

If you extend the build object (in the `build` event) or add details to the
scope of a `buildObjectWithHooks` or `buildFieldWithHooks`, please prefix all
keys with a namespace; for example `graphql-build-pg` uses the `pg` namespace
prefix. Do not pollute other namespaces (unless you have their permission).
