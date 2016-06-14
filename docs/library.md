# Using PostGraphQL as a Library
Some people may want to use PostGraphQL as a dependency of their current node projects. This is a functionality PostGraphQL intends to support. As long as you are using a server framework that supports [connect][]-styled middleware, you can use PostGraphQL as a dependency.

To use PostGraphQL as a library just do the following:

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

To import the function with CommonJS:

```js
var postgraphql = require('postgraphql').default
```

The API for creating handlers is as follows:

## postgraphql(pgConfig, schemaName? = 'public', options)
Arguments include:

- **`pgConfig`**: An object or string that will be passed to the [`pg`][] library and used to connect to a PostgreSQL backend.
- **`schemaName`**: A string which specifies the PostgreSQL schema you will be serving with PostGraphQL. The default schema is the `public` schema.
- **`options`**: An object containing other miscellaneous options. Options could be:
  - `secret`: The secret for your application. This enables PostGraphQL’s authorization features. Make it something secure and obscure!
  - `development`: Enables development features like GraphiQL and more descriptive error formatting.
  - `log`: If true, PostGraphQL will log every request using the dev style of [morgan][].

[connect]: https://www.npmjs.com/connect
[express]: https://www.npmjs.com/express
[graphql/express-graphql#82]: https://github.com/graphql/express-graphql/pull/82
[`pg`]: https://www.npmjs.com/pg
[morgan]: https://www.npmjs.com/morgan
