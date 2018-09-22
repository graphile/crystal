# postgraphile-core

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/donate-via%20Patreon-orange.svg" alt="Patreon donate button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/postgraphile-core.svg?style=flat)](https://www.npmjs.com/package/postgraphile-core)
![MIT license](https://img.shields.io/npm/l/postgraphile-core.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

This module is the compatibility between the web layer of
[PostGraphile](https://graphile.org/postgraphile/) and the GraphQL schema
built with Graphile Engine. It loads the relevant `graphile-build-pg` plugins
and augments the inflector depending on the PostGraphile options provided.

Unless you want to use the low-level API you probably want to go to the
PostGraphile (previously 'PostGraphQL') repository instead:
[https://github.com/graphile/postgraphile](https://github.com/graphile/postgraphile)

It's suitable to use this module in your own application, but please be aware you
need to bring your own security in the form of an authenticated `pgClient` (see
below).

For more information about PostGraphile and Graphile Engine please see the
documentation at [graphile.org](https://www.graphile.org/).

## `createPostGraphileSchema(pgConfig, schemas, options)`

This is the function you're most likely to use in production, it will return
a promise to a GraphQL schema. You are responsible in for implementing
security by passing a pre-authenticated `pgClient` inside the GraphQL
`context` when you resolve a GraphQL query or mutation.

Example:

```js
const schema = await createPostGraphileSchema(
  process.env.DATABASE_URL,
  ["users_schema", "posts_schema"],
  {
    dynamicJson: true,
    pgJwtSecret: process.env.JWT_SECRET,
    pgJwtTypeIdentifier: "users_schema.jwt_type",
  }
);
```

Full example:

```js
const { createPostGraphileSchema } = require("postgraphile-core");
const { graphql } = require("graphql");
const pg = require("pg");

// Create a postgres pool for efficiency
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runQuery(query, variables) {
  // Generate our schema using the default plugins against DATABASE_URL,
  // introspecting the two schemas specified with the options provided.
  //
  // Normally for performance you'd only do this once for your entire
  // application run, not once per query as it is here.
  const schema = await createPostGraphileSchema(
    process.env.DATABASE_URL,
    ["app_public"],
    {
      dynamicJson: true,
      pgJwtSecret: process.env.JWT_SECRET,
      pgJwtTypeIdentifier: "users_schema.jwt_type",
    }
  );

  // Fetch a postgres client from the pool
  const pgClient = await pgPool.connect();

  // Start a transaction so we can apply settings local to the transaction
  await pgClient.query("begin");

  try {
    // The following statement is equivalent to (but faster than):
    //    await pgClient.query("set local role to 'postgraphile_user'");
    //    await pgClient.query("set local jwt.claims.user_id to '27'");
    await pgClient.query(`select
      set_config('role', 'postgraphile_user', true),
      set_config('jwt.claims.user_id', '27', true)
    `);
    return await graphql(
      schema,
      query,
      null,
      /* CONTEXT > */ {
        pgClient: pgClient,
      } /* < CONTEXT */,
      variables
    );
  } finally {
    // commit the transaction (or rollback if there was an error) to clear the local settings
    await pgClient.query("commit");

    // Release the pgClient back to the pool.
    await pgClient.release();
  }
}

// Normally you'd execute a query in response to an HTTP request or similar
runQuery(
  // This query obviously depends on your database schema
  "query MyQuery { allPosts { nodes { id, title, author: userByAuthorId { username } } } }"
)
  .then(result => {
    console.dir(result);
    pgPool.end();
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
```

To see how this works in a real application, check out
[`withPostGraphileContext` in
PostGraphile](https://github.com/graphile/postgraphile/blob/master/src/postgraphile/withPostGraphileContext.ts)

## `watchPostGraphileSchema(pgConfig, schemas, options, onNewSchema)`

This function is useful in development; it returns a promise that resolves to a
`release` function that you can call to stop watching. The `onNewSchema`
callback will be called every time a new schema is generated, and it is
guaranteed to be called before the returned promise resolves. Other than the
additional `onNewSchema` option, the options are identical to that of
`createPostGraphileSchema` above.
