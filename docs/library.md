# Using PostGraphQL as a Library

Some people may want to use PostGraphQL as a dependency of their current Node.js projects instead of as a CLI tool. If this is the approach you want to take then you may either use PostGraphQL as an HTTP middleware, or create and execute queries against a PostGraphQL schema using your own custom code. In this article we will go over both approaches.

## HTTP Middleware

To mount a PostGraphQL instance on your own web server there is an export from the `postgraphql` package that can be used as HTTP middleware for the following HTTP frameworks:

- [`connect`](http://npmjs.com/connect)
- [`express`](https://www.npmjs.com/package/express)
- [`koa` 2.0](https://www.npmjs.com/package/koa)
- [Vanilla `http`](https://nodejs.org/api/http.html)

To use PostGraphQL with `express`, for instance, just do the following:

```js
import express from 'express'
import postgraphql from 'postgraphql'

const app = express()

app.use(postgraphql('postgres://localhost:5432'))

app.listen(3000)
```

Middleware compatible with all of the HTTP frameworks listed above will be returned by `postgraphql`. So just use that return value in whichever way is appropriate for your HTTP framework of choice.

PostGraphQL can also be directly used with the HTTP module in the Node.JS standard library:

```js
import http from 'http'
import postgraphql from 'postgraphql'

http.createServer(postgraphql('postgres://localhost:5432')).listen(3000)
```

If you cannot use ES Modules then import the middleware with CommonJS like so:

```js
const postgraphql = require('postgraphql').postgraphql
```

The API for the `postgraphql` function is as follows:

### `postgraphql(pgConfig?, schemaName? = 'public', options?)`

Arguments include:

- **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend.
- **`schemaName`**: A string which specifies the PostgreSQL schema you will be serving with PostGraphQL. The default schema is the `public` schema. May be an array for multiple schemas.
- **`options`**: An object containing other miscellaneous options. Options could be:
  - `classicIds`: Enables classic ids for Relay 1 support. Instead of using the field name `nodeId` for globally unique ids, PostGraphQL will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  - `dynamicJson`: Setting this to `true` enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string.
  - `disableDefaultMutations`: Setting this to `true` will prevent the creation of the default mutation types & fields. Database mutation will only be possible through Postgres functions.
  - `graphiql`: Set this to `true` to enable the GraphiQL interface.
  - `graphqlRoute`: The endpoint the GraphQL executer will listen on. Defaults to `/graphql`.
  - `graphiqlRoute`: The endpoint the GraphiQL query interface will listen on (**NOTE:** GraphiQL will not be enabled unless the `graphiql` option is set to `true`). Defaults to `/graphiql`.
  - `pgDefaultRole`: The default Postgres role to use. If no role was provided in a provided JWT token, this role will be used.
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to verify tokens in the `Authorization` header, and signing JWT tokens you return in procedures.
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  - `watchPg`: When true, PostGraphQL will watch your database schemas and re-create the GraphQL API whenever your schema changes, notifying you as it does. This feature requires an event trigger to be added to the database by a superuser. When enabled PostGraphQL will try to add this trigger, if you did not connect as a superuser you will get a warning and the trigger won’t be added.
  - `disableQueryLog`: Turns off GraphQL query logging. By default PostGraphQL will log every GraphQL query it processes along with some other information. Set this to `true` to disable that feature.
  - `enableCors`: Enables some generous CORS settings for the GraphQL endpoint. There are some costs associated when enabling this, if at all possible try to put your API behind a reverse proxy.
  - `exportJsonSchemaPath`: Enables saving the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.
  - `exportGqlSchemaPath`: Enables saving the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.
  - `bodySizeLimit`: Set the maximum size of JSON bodies that can be parsed (default 100kB). The size can be given as a human-readable string, such as '200kB' or '5MB' (case insensitive).

[connect]: https://www.npmjs.com/connect
[express]: https://www.npmjs.com/express
[graphql/express-graphql#82]: https://github.com/graphql/express-graphql/pull/82
[`pg`]: https://www.npmjs.com/pg
[morgan]: https://www.npmjs.com/morgan

## Custom Execution

The PostGraphQL middleware gives you a lot of excellent features for running your own GraphQL server. However, if you want to execute a PostGraphQL query in Node.js without having to go through HTTP you can use some other exported functions that PostGraphQL provides.

The first function you will need is `createPostGraphQLSchema` whose purpose is to create your PostGraphQL schema. This function is asynchronous as it will need to run the Postgres introspection query in your database.

The function takes very similar arguments to the `postgraphql` middleware function we discussed above:

```js
createPostGraphQLSchema('postgres://localhost:5432')
  .then(schema => { ... })
  .catch(error => { ... })
```

Now that you have your schema, in order to execute a GraphQL query you will need to get a PostGraphQL context object with `withPostGraphQLContext`. The context object will contain a Postgres client which has its own transaction with the correct permission levels for the associated user.

You will also need a Postgres pool from the [`pg-pool`][] module.

`withPostGraphQLContext`, like `createPostGraphQLSchema`, will also return a promise.

```js
import { Pool } from 'pg-pool'
import { graphql } from 'graphql'
import { withPostGraphQLContext } from 'postgraphql'

const myPgPool = new Pool({ ... })

const result = await withPostGraphQLContext(
  {
    pgPool: myPgPool,
    jwtToken: '...',
    jwtSecret: '...',
    pgDefaultRole: '...',
  },
  async context => {
    // You execute your GraphQL query in this function with the provided `context` object.
    // The `context` object will not work for a GraphQL execution outside of this function.
    return await graphql(
      myPostGraphQLSchema, // This is the schema we created with `createPostGraphQLSchema`.
      query,
      null,
      { ...context }, // Here we use the `context` object that gets passed to this callback.
      variables,
      operationName,
    )
  },
)
```

The exact APIs for `createPostGraphQLSchema` and `withPostGraphQLContext` are as follows.

### `createPostGraphQLSchema(pgConfig?, schemaName? = 'public', options?): Promise<GraphQLSchema>`

Arguments include:

- **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend. If you already have a client or pool instance, when using this function you may also pass a `pg` client or a `pg-pool` instance directly instead of a config.
- **`schemaName`**: A string which specifies the PostgreSQL schema that PostGraphQL will use to create a GraphQL schema. The default schema is the `public` schema. May be an array for multiple schemas. For users who want to run the Postgres introspection query ahead of time, you may also pass in a `PgCatalog` instance directly.
- **`options`**: An object containing other miscellaneous options. Most options are shared with the `postgraphql` middleware function. Options could be:
  - `classicIds`: Enables classic ids for Relay 1 support. Instead of using the field name `nodeId` for globally unique ids, PostGraphQL will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  - `dynamicJson`: Setting this to `true` enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string.
  - `jwtSecret`: The JWT secret that will be used to sign tokens returned by the type created with the `jwtPgTypeIdentifier` option.
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  - `disableDefaultMutations`: Setting this to `true` will prevent the creation of the default mutation types & fields. Database mutation will only be possible through Postgres functions.

### `withPostGraphQLContext(options, callback): Promise<GraphQLExecutionResult>`

This function sets up a PostGraphQL context, calls (and resolves) the callback function within this context, and then tears the context back down again finally resolving to the result of your function. The callback is expected to return a promise which resolves to a GraphQL execution result. The context you get as an argument to `callback` will be invalid anywhere outside of the `callback` function.

- **`options`**: An object of options that are used to create the context object that gets passed into `callback`.
  - `pgPool`: A required instance of a Postgres pool from [`pg-pool`][]. A Postgres client will be connected from this pool.
  - `jwtToken`: An optional JWT token string. This JWT token represents the viewer of your PostGraphQL schema.
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to verify the `jwtToken`.
  - `pgDefaultRole`: The default Postgres role that will be used if no role was found in `jwtToken`. It is a best security practice to always have a value for this option even though it is optional.
- **`callback`**: The function which is called with the `context` object which was created. Whatever the return value of this function is will be the return value of `withPostGraphQLContext`.

[GraphQL-js]: https://www.npmjs.com/package/graphql
[`pg-pool`]: https://www.npmjs.com/package/pg-pool
