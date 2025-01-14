---
title: Schema-only Usage
---

# Usage - Schema Only

The PostGraphile middleware gives you a lot of excellent features for running
your own GraphQL server. However, if you want to execute a PostGraphile query in
Node.js without having to go through HTTP you can use some other exported
functions that PostGraphile provides.

**To see an example, check out the
[Graphile Cookbook Schema Only Example](https://github.com/graphile/cookbook/tree/master/examples/schema_only).**

**If you're looking for Apollo Client SSR support for PostGraphile without a
network roundtrip, check out
[GraphileApolloLink in Graphile Starter](https://github.com/graphile/starter/blob/93a887cc87ea8b19eb048b72e9fb3308bc1d5a82/%40app/lib/src/GraphileApolloLink.ts).**

The first function you will need is `createPostGraphileSchema` (or
`watchPostGraphileSchema` if you want to get a new schema each time the database
is updated) which creates your PostGraphile GraphQL schema by introspecting your
database.

The function takes very similar arguments to
[the `postgraphile` middleware](./usage-library).

```js
createPostGraphileSchema(
  process.env.DATABASE_URL || 'postgres:///'
)
  .then(schema => { ... })
  .catch(error => { ... })
```

Now that you have your schema, in order to execute a GraphQL query you must
supply an (authenticated) `pgClient` on the context object. The preferred way to
do this is via the asynchronous `withPostGraphileContext` function. The context
object will contain a PostgreSQL client which has its own transaction with the
correct permission levels for the associated user.

```js
const { Pool } = require('pg');
const { graphql } = require('graphql');
const { withPostGraphileContext } = require('postgraphile');

const myPgPool = new Pool({ ... });

export async function performQuery(
  schema,
  query,
  variables,
  jwtToken,
  operationName
) {
  return await withPostGraphileContext(
    {
      pgPool: myPgPool,
      jwtToken: jwtToken,
      jwtSecret: "...",
      pgDefaultRole: "..."
    },
    async context => {
      // Execute your GraphQL query in this function with the provided
      // `context` object, which should NOT be used outside of this
      // function.
      return await graphql(
        schema, // The schema from `createPostGraphileSchema`
        query,
        null,
        { ...context }, // You can add more to context if you like
        variables,
        operationName
      );
    }
  );
}
```

(The `await` keywords after the `return` statements aren't required, they're
just there to clarify the results are promises.)

### API: `createPostGraphileSchema(pgConfig, schemaName, options)`

This function takes three arguments (all are optional) and returns a promise to
a GraphQLSchema object.

The returned GraphQLSchema will **not** be updated when your database changes -
if you require "watch" functionality, please use `watchPostGraphileSchema`
instead (see below). The below options are valid
for <tt>`postgraphile@4.12.3`</tt>.

- **`pgConfig`**: An object or string that will be passed to the [`pg`][]
  library and used to connect to a PostgreSQL backend. If you already have a
  pool client or a pool instance, when using this function you may pass that
  pool client or a `pg-pool` instance directly instead of a config.
- **`schemaName`**: A string which specifies the PostgreSQL schema that
  PostGraphile will use to create a GraphQL schema. The default schema is the
  `public` schema. May be an array for multiple schemas.
- **`options`**: An object containing other miscellaneous options. Most options
  are shared with the `postgraphile` middleware function. Options could be:
  - `ownerConnectionString`: Connection string to use to connect to the database
    as a privileged user (e.g. for setting up watch fixtures, logical decoding,
    etc).
  - `subscriptions`: Enable GraphQL websocket transport support for
    subscriptions (you still need a subscriptions plugin currently)
  - `live`: [EXPERIMENTAL] Enables live-query support via GraphQL subscriptions
    (sends updated payload any time nested collections/records change)
  - `websockets`: Choose which websocket transport libraries to use. Use commas
    to define multiple. Defaults to `['v0', 'v1']` if `subscriptions` or `live`
    are true, `[]` otherwise
  - `websocketOperations`: Toggle which GraphQL websocket transport operations
    are supported: 'subscriptions' or 'all'. Defaults to `subscriptions`
  - `pgDefaultRole`: The default Postgres role to use. If no role was provided
    in a provided JWT token, this role will be used.
  - `dynamicJson`: By default, JSON and JSONB fields are presented as strings
    (JSON encoded) from the GraphQL schema. Setting this to `true` (recommended)
    enables raw JSON input and output, saving the need to parse / stringify JSON
    manually.
  - `setofFunctionsContainNulls`: If none of your `RETURNS SETOF compound_type`
    functions mix NULLs with the results then you may set this false to reduce
    the nullables in the GraphQL schema.
  - `classicIds`: Enables classic ids for Relay support. Instead of using the
    field name `nodeId` for globally unique ids, PostGraphile will instead use
    the field name `id` for its globally unique ids. This means that table `id`
    columns will also get renamed to `rowId`.
  - `disableDefaultMutations`: Setting this to `true` will prevent the creation
    of the default mutation types & fields. Database mutation will only be
    possible through Postgres functions.
  - `ignoreRBAC`: Set false (recommended) to exclude fields, queries and
    mutations that are not available to any possible user (determined from the
    user in connection string and any role they can become); set this option
    true to skip these checks and create GraphQL fields and types for
    everything. The default is `true`, in v5 the default will change to `false`.
  - `ignoreIndexes`: Set false (recommended) to exclude filters, orderBy, and
    relations that would be expensive to access due to missing indexes. Changing
    this from true to false is a breaking change, but false to true is not, so
    we recommend you start with it set to `false`. The default is `true`, in v5
    the default may change to `false`.
  - `includeExtensionResources`: By default, tables and functions that come from
    extensions are excluded from the generated GraphQL schema as general
    applications don't need them to be exposed to the end user. You can use this
    flag to include them in the generated schema (not recommended).
  - `appendPlugins`: An array of
    [Graphile Engine](https://build.graphile.org/graphile-build/plugins) schema
    plugins to load after the default plugins.
  - `prependPlugins`: An array of
    [Graphile Engine](https://build.graphile.org/graphile-build/plugins) schema
    plugins to load before the default plugins (you probably don't want this).
  - `replaceAllPlugins`: The full array of
    [Graphile Engine](https://build.graphile.org/graphile-build/plugins) schema
    plugins to use for schema generation (you almost definitely don't want
    this!).
  - `skipPlugins`: An array of
    [Graphile Engine](https://build.graphile.org/graphile-build/plugins) schema
    plugins to skip.
  - `readCache`: A file path string or an object. Reads cached values to improve
    startup time (you may want to do this in production).
  - `writeCache`: A file path string. Writes computed values to local cache file
    so startup can be faster (do this during the build phase).
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to
    verify tokens in the `Authorization` header, and signing JWT tokens you
    return in procedures.
  - `jwtPublicKey`: The public key to verify the JWT when signed with RS265 or
    ES256 algorithms.
  - `jwtSignOptions`: Options with which to perform JWT signing - see
    https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type
    which will be signed as a JWT token if ever found as the return type of a
    procedure. Can be of the form: `my_schema.my_type`. You may use quotes as
    needed: `"my-special-schema".my_type`.
  - `legacyRelations`: Some one-to-one relations were previously detected as
    one-to-many - should we export 'only' the old relation shapes, both new and
    old but mark the old ones as 'deprecated' (default), or 'omit' (recommended)
    the old relation shapes entirely.
  - `legacyJsonUuid`: ONLY use this option if you require the v3 typenames
    'Json' and 'Uuid' over 'JSON' and 'UUID'.
  - `simpleCollections`: Should we use relay pagination, or simple collections?
    "omit" (default) - relay connections only, "only" (not recommended) - simple
    collections only (no Relay connections), "both" - both.

### API: `watchPostGraphileSchema(pgConfig, schemaName, options, onNewSchema)`

This function takes the same options as `createPostGraphileSchema`; but with one
addition: a function `onNewSchema` that is called every time a new schema is
generated, passing the new schema as the first argument. `onNewSchema` is
guaranteed to be called before the `watchPostGraphileSchema` promise resolves.
It resolves to an asynchronus function that can be called to stop listening for
schema changes.

```js
async function main() {
  let graphqlSchema;
  const releaseWatcher = await watchPostGraphileSchema(
    pgPool,
    pgSchemas,
    options,
    (newSchema) => {
      console.log("Generated new GraphQL schema");
      graphqlSchema = newSchema;
    },
  );
  // graphqlSchema is **guaranteed** to be set here.

  // ... do stuff with graphqlSchema

  await releaseWatcher();
}
```

### API: `withPostGraphileContext(options, callback)`

This function sets up a PostGraphile context, calls (and resolves) the callback
function within this context, and then tears the context back down again finally
resolving to the result of your function (which should be a
GraphQLExecutionResult from executing a `graphql()` query).

- **`options`**: An object of options that are used to create the context object
  that gets passed into `callback`.
  - `pgPool`: A required instance of a Postgres pool from [`pg-pool`][]. A
    Postgres client will be connected from this pool.
  - `jwtToken`: An optional JWT token string. This JWT token represents the
    viewer of your PostGraphile schema. You might get this from the
    Authorization header.
  - `jwtSecret`: see 'jwtSecret' above
  - `jwtAudiences`: see 'jwtAudiences' above
  - `jwtRole`: see 'jwtRole' in the library documentation
  - `jwtVerifyOptions`: see 'jwtVerifyOptions' in the library documentation
  - `pgDefaultRole`: see 'pgDefaultRole' in the library documentation
  - `pgSettings`: A plain object specifying custom config values to set in the
    PostgreSQL transaction (accessed via
    `current_setting('my.custom.setting')`) - do _NOT_ provide a function unlike
    with the library options
- **`callback`**: The function which is called with the `context` object which
  was created. Whatever the return value of this function is will be the return
  value of `withPostGraphileContext`.

### Even lower level access

If you really want to get into the nitty-gritty of what's going on, then take a
look at the `postgraphile-core` and `graphile-build-pg` modules.

[graphql-js]: https://www.npmjs.com/package/graphql
[`pg-pool`]: https://www.npmjs.com/package/pg-pool

### Calling a resolver from a resolver

You can issue GraphQL requests from various contexts, including within a
resolver. To do so you need the following:

- Access to the `graphql` function from the `graphql` module
  - In a PostGraphile plugin, if you have access to the build object (which you
    usually will), you should get this from `build.graphql.graphql`
  - Failing that, you can `import { graphql } from 'graphql'` or
    `const { graphql } = require('graphql')`, but this has caveats.
- A reference to the GraphQL schema object. You can get this from many sources:
  - in a resolver, you should extract it from `info.schema`
  - if you have access to the PostGraphile middleware, you can issue
    `await postgraphileMiddleware.getGqlSchema()`
  - if you don't need the PostGraphile middleware, you can use
    `await createPostGraphileSchema(...)` - see
    [schema only usage](./usage-schema) - do this once and cache it because
    it's expensive to compute
- A GraphQL operation (aka query, but includes mutations, subscriptions) to
  execute; this can be a string or an AST
- The variables to feed to the operation (if necessary)
- A valid GraphQL context for PostGraphile
  - inside a resolver, you can just pass the resolver's context straight through
  - in other situations, have a look at `withPostGraphileContext` in the
    [schema only usage](./usage-schema)

Issuing a GraphQL operation from inside a resolver example:

```js
/*
 * Assuming you have access to a `build` object, e.g. inside a
 * `makeExtendSchemaPlugin`, you can extract the `graphql` function
 * from the `graphql` library here like so:
 */
const {
  graphql: { graphql },
} = build;
/*
 * Failing the above: `import { graphql } from 'graphql';` but beware of
 * duplicate `graphql` modules in your `node_modules` causing issues.
 */

async function myResolver(parent, args, context, info) {
  // Whatever GraphQL query you wish to issue:
  const document = /* GraphQL */ `
    query MyQuery($userId: Int!) {
      userById(id: $userId) {
        username
      }
    }
  `;
  // The name of the operation in your query document (optional)
  const operationName = "MyQuery";
  // The variables for the query
  const variables = { userId: args.userId };

  const { data, errors } = await graphql(
    info.schema,
    document,
    null,
    context,
    variables,
    operationName,
  );

  // TODO: error handling

  return data.userById.username;
}
```

## Server-side TypeScript support

PostGraphile takes care of building and serving a GraphQL API for various
clients to use. But it is not only possible to use the API from external
clients, it is also possible to use the GraphQL API from within its own backend.

High-level overview:

- use graphql-code-generator to create TypeScript types for our GraphQL schema
- use the generated types to query/mutate your data
- optional: use a Visual Studio Code extension to get IntelliSense

### TypeScript code generation

We use the [GraphQL code generator](https://graphql-code-generator.com/) tools
to create the TypeScript types in our backend code.

The following `npm` packages will create TypeScript types:

- `@graphql-codegen/cli` - the CLI tool to create the types
- `@graphql-codegen/typescript` - create the TypeScript types. This is the main
  package that we need
- `@graphql-codegen/typescript-operations` - generates types for
  queries/mutations/fragments
- optionally add a client specific generator: e.g.
  `@graphql-codegen/typescript-urql`

Steps to get the backend typing support:

1. Start the development like described in the above section. Follow all the
   steps to create your GraphQL API with all needed schemas, tables, roles, etc.
2. Configure PostGraphile to export the GraphQL schema:  
   `exportGqlSchemaPath: './src/generated/schema.graphql'`
3. Start the project to let PostGraphile create the initial `schema.graphql`
   file. Since it's generated you can exclude this file from source control if
   you want to, but it is handy to see differences in the schema during
   check-ins and is useful for other tooling such as `eslint-plugin-graphql`.
4. Import the mentioned `npm` packages. You can find more plugins on their
   website in the
   [Plugins](https://graphql-code-generator.com/docs/plugins/index/) section.
5. Create a file `codegen.yml` in the root of your workspace.
   ```yaml
   overwrite: true
   schema: "./src/generated/schema.graphql"
   generates:
     # Creates the TypeScript types from the schema and any .graphql file
     src/generated/types.ts:
       documents: "src/**/*.graphql"
       plugins:
         - typescript
         - typescript-operations
         - typescript-urql
       config:
         withHOC: false
         withComponent: false
         withMutationFn: false
   config:
     scalars:
       DateTime: "string"
       JSON: "{ [key: string]: any }"
   ```
6. Run `graphql-codegen --config codegen.yml` to generate the types.
7. The generated types can now be used in your custom business logic code.

#### Example

We have a movie table that we want to query from our backend system.

We can write a small GraphQL query file similar to this. It could be stored in
`./src/graphql/getMovies.graphql`. (NOTE: this example uses the
`@graphile-contrib/pg-simplify-inflector` plugin, your query might need to
differ.)

```graphql
query GetMovies($top: Int!) {
  movies(first: $top) {
    nodes {
      id
      title
    }
  }
}
```

Save the file and run the code generation task.

Alternatively we can create some inline query directly in code like this:

```js
import { makeExtendSchemaPlugin, gql } from "graphile-utils";

// inside some function:

const GetMoviesDocument = gql`
  query Query {
    __typename
    movies(first: 3) {
      nodes {
        id
        title
      }
    }
  }
`;
```

The query can then be used in your code via the generated types or inline.
Please see further down on why there is a need for `gql as gqlExtend`.

```js
import { makeExtendSchemaPlugin, gql, gql as gqlExtend } from 'graphile-utils';
import { Build } from 'postgraphile';
import {
  GetMoviesQuery,
  GetMoviesDocument,
  GetMoviesQueryVariables,
} from '../../generated/types';

// doc: https://www.graphile.org/postgraphile/make-extend-schema-plugin/
export const BusinessLogicPlugin = makeExtendSchemaPlugin((build: Build) => {
  const { graphql } = build;
  return {
    typeDefs: gqlExtend`
      extend type Query {
        topMovieTitles: [String!]
      }
    `,
    resolvers: {
      Query: {
        topMovieTitles: async (query, args, context, resolveInfo) => {
          // Alternatively defined the query inline with intellisense support:
          const inlineGetMoviesDocument = gql`
            query Query {
              __typename
              movies(first: 3) {
                nodes {
                  id
                  title
                }
              }
            }
          `;
          const variables: GetMoviesQueryVariables = {
            top: 3,
          };

          // execute the query
          const queryResult = await graphql.execute<GetMoviesQuery>(
            resolveInfo.schema,
            GetMoviesDocument, // or: inlineGetMoviesDocument,
            undefined,
            context,
            variables,
          );

          if (queryResult.errors) {
            // do something in error case
            throw queryResult.errors[0];
          } else {
            // the result can then be used to get the returned data
            const allTitles = queryResult.data?.movies?.nodes.map(
              movie => movie?.title,
            );

            return allTitles;
          }
        },
      },
    },
  };
});
```

### GraphQL IntelliSense

The above mentioned steps provide strong typing support. If you are developing
your code with VisualStudio Code you can get IntelliSense support both in
.graphql files and in inline defined gql\` template strings.

There are multiple extensions in the VSCode marketplace but this guide is
written for the Apollo GraphQL extension.

Install the extension and if needed reload VSCode.

Add a file "apollo.config.js" into the root of your workspace with the following
content:

```js
module.exports = {
  client: {
    excludes: [
      "**/node_modules",
      "**/__tests__",
      "**/generated/**/*.{ts,tsx,js,jsx,graphql,gql}",
    ],
    includes: ["src/**/*.{ts,tsx,js,jsx,graphql,gql}"],
    service: {
      name: "client",
      localSchemaFile: "./src/generated/schema.graphql",
    },
  },
};
```

- `localSchemaFile`: this must point to the schema created by PostGraphile
- `excludes`: this must exclude the `node_modules` folder and any tests. It must
  also exclude the generated `schema.graphql` and any code that was generated
  based on that schema.
- `includes`: it should include any file for which you want to have
  IntelliSense. That is at least `.ts` and `.graphql` but potentially more.

This will support syntax highlighting in your files. BUT - we have a problem. If
we adjust our schema e.g. via `makeExtendSchemaPlugin` we define some custom
extension to the automatically generated GraphQL schema. That means that the
Apollo extension will find this extension both in the generated schema.graphql
file as well as in the file with your `makeExtendSchemaPlugin`. Then it
complains that this is not unique and will stop working. So we have to find a
solution for that.

We should exclude our type extensions from IntelliSense. To do this we can
create a custom mapping to have the gql template string available as the normal
"gql" but also as a second custom variable like "gql as gqlExtend". Then we can
write our GraphQL schema extension by using the "gqlExtend" template string and
any inline query by using the normal "gql" template string.

An example could look like this:

```js
// get gql as two different variables
import { makeExtendSchemaPlugin, gql, gql as gqlExtend } from "graphile-utils";
import { Build } from "postgraphile";

export const MyPlugin = makeExtendSchemaPlugin((build: Build) => {
  const { graphql } = build;
  return {
    // use the "gqlExtend" template string here to extend your GraphQL API:
    typeDefs: gqlExtend`
      extend type Query {
        myExtension: [String!]
      }
    `,
    resolvers: {
      Query: {
        myExtension: async (query, args, context, resolveInfo) => {
          // use the normal "gql" template string to define your query inline:
          const inlineDocument = gql`
            query Query {
              __typename
              movies(first: 3) {
                nodes {
                  id
                  title
                }
              }
            }
          `;

          // continue with your code
        },
      },
    },
  };
});
```

:::tip Tips and tricks

This VS code extension was not super stable as of the time of writing. It
would crash sometimes if it thought to find conflicting definitions. This
happens often when committing code and comparing it side by side or when
having a "bad" graphql file/definition.

If it stops working then reload the VSCode extension host by typing
`Developer: Restart Extension Host` in the actions "CTRL+SHIFT+P" field.

:::
