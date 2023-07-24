---
layout: page
path: /postgraphile/testing-jest/
title: Testing with Jest
---

:::caution

This documentation is copied from Version 4 and has not been updated to Version
5 yet; it may not be valid.

:::

### Testing the database

Making sure your database functions, triggers, permissions, etc work correctly
is critical; there are many tools out there that you can use to do this, but if
you're already developing in a JavaScript environment it may feel natural to add
them to your Jest suite.

The pattern is effectively to spin up a transaction, set any relevant Postgres
settings (e.g. `role`, `jwt.claims.user_id`, etc), run the SQL you want to test,
check the results, and then rollback the transaction; i.e.:

```sql
-- start transaction
begin;

-- set relevant transaction settings; the `, true` means "local" - i.e. it'll
-- be rolled back with the transaction - do not forget to add this!
select
  set_config('role', 'YOUR_GRAPHQL_ROLE_HERE', true),
  set_config('jwt.claims.user_id', 27, true),
  set_config...;

-- run the SQL you want to test
select * from my_function();

-- rollback the transaction
rollback;
```

Each of the statements above would normally have to be issued via
`pgClient.query(...)` using a Postgres client that your retrieve from a
`pg.Pool` (and release afterwards); however that's a lot of boilerplate for our
tests, so it makes sense to extract the common patterns into helper functions.

<details>
<summary>(Click to expand.) Create some helpers in <tt>test_helpers.ts</tt>. </summary>

The following code is in TypeScript; you can convert it to JavaScript via
https://www.typescriptlang.org/play

```ts
import { Pool, PoolClient } from "pg";

if (!process.env.TEST_DATABASE_URL) {
  throw new Error("Cannot run tests without a TEST_DATABASE_URL");
}
export const TEST_DATABASE_URL: string = process.env.TEST_DATABASE_URL;

const pools = {};

// Make sure we release those pgPools so that our tests exit!
afterAll(() => {
  const keys = Object.keys(pools);
  return Promise.all(
    keys.map(async (key) => {
      try {
        const pool = pools[key];
        delete pools[key];
        await pool.end();
      } catch (e) {
        console.error("Failed to release connection!");
        console.error(e);
      }
    }),
  );
});

const withDbFromUrl = async <T>(url: string, fn: ClientCallback<T>) => {
  const pool = poolFromUrl(url);
  const client = await pool.connect();
  await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE;");

  try {
    await fn(client);
  } catch (e) {
    // Error logging can be helpful:
    if (typeof e.code === "string" && e.code.match(/^[0-9A-Z]{5}$/)) {
      console.error([e.message, e.code, e.detail, e.hint, e.where].join("\n"));
    }
    throw e;
  } finally {
    await client.query("ROLLBACK;");
    await client.query("RESET ALL;"); // Shouldn't be necessary, but just in case...
    await client.release();
  }
};

export const withRootDb = <T>(fn: ClientCallback<T>) =>
  withDbFromUrl(TEST_DATABASE_URL, fn);

export const becomeRoot = (client: PoolClient) => client.query("reset role");

/******************************************************************************
 **                                                                          **
 **     BELOW HERE, YOU'LL WANT TO CUSTOMISE FOR YOUR OWN DATABASE SCHEMA    **
 **                                                                          **
 ******************************************************************************/

export type User = {
  id: string;
  username: string;
  _password?: string;
  _email?: string;
};
export type Organization = { id: string; name: string };

export const becomeUser = async (
  client: PoolClient,
  userOrUserId: User | string | null,
) => {
  await becomeRoot(client);
  const session = userOrUserId
    ? await createSession(
        client,
        typeof userOrUserId === "object" ? userOrUserId.id : userOrUserId,
      )
    : null;
  await client.query(
    `select set_config('role', $1::text, true),
            set_config('jwt.claims.session_id', $2::text, true)`,
    [process.env.DATABASE_VISITOR, session ? session.uuid : ""],
  );
};

// Enables multiple calls to `createUsers` within the same test to still have
// deterministic results without conflicts.
let userCreationCounter = 0;
beforeEach(() => {
  userCreationCounter = 0;
});

export const createUsers = async function createUsers(
  client: PoolClient,
  count: number = 1,
  verified: boolean = true,
) {
  const users = [];
  if (userCreationCounter > 25) {
    throw new Error("Too many users created!");
  }
  for (let i = 0; i < count; i++) {
    const userLetter = "abcdefghijklmnopqrstuvwxyz"[userCreationCounter];
    userCreationCounter++;
    const password = userLetter.repeat(12);
    const email = `${userLetter}${i || ""}@b.c`;
    const user: User = (
      await client.query(
        `SELECT * FROM app_private.really_create_user(
          username := $1,
          email := $2,
          email_is_verified := $3,
          name := $4,
          avatar_url := $5,
          password := $6
        )`,
        [
          `testuser_${userLetter}`,
          email,
          verified,
          `User ${userLetter}`,
          null,
          password,
        ],
      )
    ).rows[0];
    expect(user.id).not.toBeNull();
    user._email = email;
    user._password = password;
    users.push(user);
  }
  return users;
};
```

</details>

Then a test file might look like:

```js {3-13}
import { becomeUser, createUsers, withRootDb } from "../test_helpers";

test("can delete self", () =>
  withRootDb(async pgClient => {
    const [user] = await createUsers(pgClient, 1);

    await becomeUser(pgClient, user);
    const {
      rows: [deletedUser],
    } = await pgClient.query(
      "delete from app_public.users where id = $1 returning *",
      [user.id]
    );
    expect(deletedUser).toBeTruthy();
  }));
```

For more thorough test helpers (and to see this working in practice), check out
[Graphile Starter](https://github.com/graphile/starter):

<!-- prettier-ignore -->
- [@app/db/\_\_tests\_\_/app\_public/functions/invite\_to\_organization.test.ts](https://github.com/graphile/starter/blob/main/@app/db/__tests__/app_public/functions/invite_to_organization.test.ts)
- [@app/db/\_\_tests\_\_/helpers.ts](https://github.com/graphile/starter/blob/main/@app/db/__tests__/helpers.ts)
- [@app/\_\_tests\_\_/helpers.ts](https://github.com/graphile/starter/blob/main/@app/__tests__/helpers.ts)

### Testing the GraphQL middleware

Whereas testing the database functionality can be thought of as unit tests,
testing the GraphQL middleware is more akin to integration tests - they pretend
to go through the middleware (exercising pgSettings / JWT / etc) and you can
place assertions on the results.

First, make sure that you've extracted your PostGraphile (library mode) options
into a function that you can import in your tests; for example your PostGraphile
server file might look like this:

```js {6-11,17}
const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

function postgraphileOptions() {
  return {
    dynamicJson: true,
  };
}
exports.postgraphileOptions = postgraphileOptions;

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres:///",
    ["app_public"],
    postgraphileOptions()
  )
);

app.listen(process.env.PORT || 3000);
```

<details>
<summary>(Click to expand.) Create a <tt>test_helper.ts</tt> file for running your queries,
responsible for importing this <tt>postgraphileOptions</tt> function and setting up/tearing down
the transaction. Don't forget to set the environment variables used by this file. </summary>

The following code is in TypeScript; you can convert it to JavaScript via
https://www.typescriptlang.org/play

```ts
import { Request, Response } from "express";
import { ExecutionResult, graphql, GraphQLSchema } from "graphql";
import { Pool, PoolClient } from "pg";
import {
  createPostGraphileSchema,
  PostGraphileOptions,
  withPostGraphileContext,
} from "postgraphile";

import { getPostGraphileOptions } from "../src/middleware/installPostGraphile";

const MockReq = require("mock-req");

let known: Record<string, { counter: number; values: Map<unknown, string> }> =
  {};
beforeEach(() => {
  known = {};
});
/*
 * This function replaces values that are expected to change with static
 * placeholders so that our snapshot testing doesn't throw an error
 * every time we run the tests because time has ticked on in it's inevitable
 * march toward the future.
 */
export function sanitize(json: any): any {
  /* This allows us to maintain stable references whilst dealing with variable values */
  function mask(value: unknown, type: string) {
    if (!known[type]) {
      known[type] = { counter: 0, values: new Map() };
    }
    const o = known[type];
    if (!o.values.has(value)) {
      o.values.set(value, `[${type}-${++o.counter}]`);
    }
    return o.values.get(value);
  }

  if (Array.isArray(json)) {
    return json.map((val) => sanitize(val));
  } else if (json && typeof json === "object") {
    const result = { ...json };
    for (const k in result) {
      if (k === "nodeId" && typeof result[k] === "string") {
        result[k] = mask(result[k], "nodeId");
      } else if (
        k === "id" ||
        k === "uuid" ||
        (k.endsWith("Id") &&
          (typeof json[k] === "number" || typeof json[k] === "string")) ||
        (k.endsWith("Uuid") && typeof k === "string")
      ) {
        result[k] = mask(result[k], "id");
      } else if (
        (k.endsWith("At") || k === "datetime") &&
        typeof json[k] === "string"
      ) {
        result[k] = mask(result[k], "timestamp");
      } else if (
        k.match(/^deleted[A-Za-z0-9]+Id$/) &&
        typeof json[k] === "string"
      ) {
        result[k] = mask(result[k], "nodeId");
      } else if (k === "email" && typeof json[k] === "string") {
        result[k] = mask(result[k], "email");
      } else if (k === "username" && typeof json[k] === "string") {
        result[k] = mask(result[k], "username");
      } else {
        result[k] = sanitize(json[k]);
      }
    }
    return result;
  } else {
    return json;
  }
}

// Contains the PostGraphile schema and rootPgPool
interface ICtx {
  rootPgPool: Pool;
  options: PostGraphileOptions<Request, Response>;
  schema: GraphQLSchema;
}
let ctx: ICtx | null = null;

export const setup = async () => {
  const rootPgPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  });

  const options = getPostGraphileOptions({ rootPgPool });
  const schema = await createPostGraphileSchema(
    rootPgPool,
    "app_public",
    options,
  );

  // Store the context
  ctx = {
    rootPgPool,
    options,
    schema,
  };
};

export const teardown = async () => {
  try {
    if (!ctx) {
      return null;
    }
    const { rootPgPool } = ctx;
    ctx = null;
    rootPgPool.end();
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const runGraphQLQuery = async function runGraphQLQuery(
  query: string, // The GraphQL query string
  variables: { [key: string]: any } | null, // The GraphQL variables
  reqOptions: { [key: string]: any } | null, // Any additional items to set on `req` (e.g. `{user: {id: 17}}`)
  checker: (
    result: ExecutionResult,
    context: { pgClient: PoolClient },
  ) => void | ExecutionResult | Promise<void | ExecutionResult> = () => {}, // Place test assertions in this function
) {
  if (!ctx) throw new Error("No ctx!");
  const { schema, rootPgPool, options } = ctx;
  const req = new MockReq({
    url: options.graphqlRoute || "/graphql",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...reqOptions,
  });
  const res: any = { req };
  req.res = res;

  const {
    pgSettings: pgSettingsGenerator,
    additionalGraphQLContextFromRequest,
  } = options;
  const pgSettings =
    (typeof pgSettingsGenerator === "function"
      ? await pgSettingsGenerator(req)
      : pgSettingsGenerator) || {};

  // Because we're connected as the database owner, we should manually switch to
  // the authenticator role
  if (!pgSettings.role) {
    pgSettings.role = process.env.DATABASE_AUTHENTICATOR;
  }

  await withPostGraphileContext(
    {
      ...options,
      pgPool: rootPgPool,
      pgSettings,
      pgForceTransaction: true,
    },
    async (context) => {
      let checkResult;
      const { pgClient } = context;
      try {
        // This runs our GraphQL query, passing the replacement client
        const additionalContext = additionalGraphQLContextFromRequest
          ? await additionalGraphQLContextFromRequest(req, res)
          : null;
        const result = await graphql(
          schema,
          query,
          null,
          {
            ...context,
            ...additionalContext,
            __TESTING: true,
          },
          variables,
        );
        // Expand errors
        if (result.errors) {
          if (options.handleErrors) {
            result.errors = options.handleErrors(result.errors);
          } else {
            // This does a similar transform that PostGraphile does to errors.
            // It's not the same. Sorry.
            result.errors = result.errors.map((rawErr) => {
              const e = Object.create(rawErr);
              Object.defineProperty(e, "originalError", {
                value: rawErr.originalError,
                enumerable: false,
              });

              if (e.originalError) {
                Object.keys(e.originalError).forEach((k) => {
                  try {
                    e[k] = e.originalError[k];
                  } catch (err) {
                    // Meh.
                  }
                });
              }
              return e;
            });
          }
        }

        // This is were we call the `checker` so you can do your assertions.
        // Also note that we pass the `replacementPgClient` so that you can
        // query the data in the database from within the transaction before it
        // gets rolled back.
        checkResult = await checker(result, {
          pgClient,
        });

        // You don't have to keep this, I just like knowing when things change!
        expect(sanitize(result)).toMatchSnapshot();

        return checkResult == null ? result : checkResult;
      } finally {
        // Rollback the transaction so no changes are written to the DB - this
        // makes our tests fairly deterministic.
        await pgClient.query("rollback");
      }
    },
  );
};
```

</details>

For more thorough test helpers (and to see this working in practice), check out
Graphile Starter:

- [@app/server/\_\_tests\_\_/queries/currentUser.test.ts](https://github.com/graphile/starter/blob/main/@app/server/__tests__/queries/currentUser.test.ts)
- [@app/server/\_\_tests\_\_/helpers.ts](https://github.com/graphile/starter/blob/main/@app/server/__tests__/helpers.ts)
- [@app/\_\_tests\_\_/helpers.ts](https://github.com/graphile/starter/blob/main/@app/__tests__/helpers.ts)

Your test might look something like this:

```js {9,24-25}
const { setup, teardown, runGraphQLQuery } = require("../test_helper");

beforeAll(setup);
afterAll(teardown);

test("GraphQL query nodeId", async () => {
  await runGraphQLQuery(
    // GraphQL query goes here:
    `{ __typename }`,

    // GraphQL variables go here:
    {},

    // Any additional properties you want `req` to have (e.g. if you're using
    // `pgSettings`) go here:
    {
      // Assuming you're using Passport.js / pgSettings, you could pretend
      // to be logged in by setting `req.user` to `{id: 17}`:
      user: { id: 17 },
    },

    // This function runs all your test assertions:
    async (json, { pgClient }) => {
      expect(json.errors).toBeFalsy();
      expect(json.data.__typename).toEqual("Query");

      // If you need to, you can query the DB within the context of this
      // function - e.g. to check that your mutation made the changes you'd
      // expect.
      const {
        rows,
      } = await pgClient.query(`SELECT * FROM app_public.users WHERE id = $1`, [
        17,
      ]);
      if (rows.length !== 1) {
        throw new Error("User not found!");
      }
    }
  );
});
```
