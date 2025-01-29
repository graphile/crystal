---
title: Security
---

### Example

```js
const { createPostGraphileSchema } = require("postgraphile");
const pg = require("pg");

const pgPool = new pg.Pool(process.env.DATABASE_URL);

async function runQuery(query, variables) {
  const schema = await createPostGraphileSchema(
    process.env.DATABASE_URL,
    ["users_schema", "posts_schema"],
    {
      dynamicJson: true,
      jwtSecret: process.env.JWT_SECRET,
      jwtPgTypeIdentifier: "users_schema.jwt_type",
    },
  );

  // Fetch a postgres client from the pool
  const pgClient = await pgPool.connect();

  // Start a transaction so we can apply settings local to the transaction
  /* highlight-next-line */
  await pgClient.query("begin");

  try {
    // The following statement is equivalent to (but faster than):
    //    await pgClient.query("set local role to 'postgraphile_user'");
    //    await pgClient.query("set local jwt.claims.user_id to '27'");
    await pgClient.query(`select
      /* highlight-start */
      set_config('role', 'postgraphile_user', true),
      set_config('jwt.claims.user_id', '27', true)
      /* highlight-end */
    `);
    return await graphql(
      schema,
      query,
      null,
      /* highlight-start */
      /* CONTEXT > */ {
        pgClient: pgClient,
      } /* < CONTEXT */,
      /* highlight-end */
      variables,
    );
  } finally {
    // commit the transaction (or rollback if there was an error) to clear the local settings
    /* highlight-next-line */
    await pgClient.query("commit");

    // Release the pgClient back to the pool.
    await pgClient.release();
  }
}

runQuery(
  "query MyQuery { allPosts { nodes { id, title, author: userByAuthorId { username } } } }",
)
  .then((result) => {
    console.dir(result);
    pgPool.release();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
```

<!-- TODO: ensure this example works. -->

To see how this works in a real application, check out
[`withPostGraphileContext` in PostGraphile](https://github.com/graphile/postgraphile/blob/v4/src/postgraphile/withPostGraphileContext.ts)
