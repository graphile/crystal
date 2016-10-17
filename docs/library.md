# Using PostGraphQL as a Library
Some people may want to use PostGraphQL as a dependency of their current node projects and mount the PostGraphQL instance on their own web server. For this usecase PostGraphQL exports itself as a HTTP middleware for the following HTTP frameworks:

- [`connect`](http://npmjs.com/connect)
- [`express`](https://www.npmjs.com/package/express)
- [`koa` 2.0](https://www.npmjs.com/package/koa)
- [Vanilla `http`](https://nodejs.org/api/http.html)

To use PostGraphQL with `express` just do the following:

```js
import express from 'express'
import postgraphql from 'postgraphql'

const app = express()

app.use(postgraphql('postgres://localhost:5432'))

app.listen(3000)
```

PostGraphQL can also be directly used with the HTTP module in the Node.JS standard library:

```js
import http from 'http'
import postgraphql from 'postgraphql'

http.createServer(postgraphql('postgres://localhost:5432')).listen(3000)
```

To import the middleware with CommonJS:

```js
var postgraphql = require('postgraphql').postgraphql
```

The `postgraphql` function can take the following arguments:

## postgraphql(pgConfig?, schemaName? = 'public', options?)
Arguments include:

- **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend.
- **`schemaName`**: A string which specifies the PostgreSQL schema you will be serving with PostGraphQL. The default schema is the `public` schema. May be an array for multiple schemas.
- **`options`**: An object containing other miscellaneous options. Options could be:
  - `classicIds`: Enables classic ids for Relay 1 support. Instead of using the field name `__id` for globally unique ids, PostGraphQL will instead use the field name `id` for its globally unique ids. This means that table `id` columns will also get renamed to `rowId`.
  - `dynamicJson`: Setting this to `true` enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string.
  - `graphiql`: Set this to `true` to enable the GraphiQL interface.
  - `graphqlRoute`: The endpoint the GraphQL executer will listen on. Defaults to `/graphql`.
  - `graphiqlRoute`: The endpoint the GraphiQL query interface will listen on (**NOTE:** GraphiQL will not be enabled unless the `graphiql` option is set to `true`). Defaults to `/graphiql`.
  - `pgDefaultRole`: The default Postgres role to use. If no role was provided in a provided JWT token, this role will be used.
  - `jwtSecret`: The secret for your JSON web tokens. This will be used to verify tokens in the `Authorization` header, and signing JWT tokens you return in procedures.
  - `jwtPgTypeIdentifier`: The Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: `my_schema.my_type`. You may use quotes as needed: `"my-special-schema".my_type`.
  - `disableQueryLog`: Turns off GraphQL query logging. By default PostGraphQL will log every GraphQL query it processes along with some other information. Set this to `true` to disable that feature.
  - `enableCors`: Enables some generous CORS settings for the GraphQL endpoint. There are some costs associated when enabling this, if at all possible try to put your API behind a reverse proxy.

[connect]: https://www.npmjs.com/connect
[express]: https://www.npmjs.com/express
[graphql/express-graphql#82]: https://github.com/graphql/express-graphql/pull/82
[`pg`]: https://www.npmjs.com/pg
[morgan]: https://www.npmjs.com/morgan
