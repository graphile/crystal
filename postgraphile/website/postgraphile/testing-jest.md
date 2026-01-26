---
title: Testing with Jest
---

Graphile Starter has been ported to V5, so we recommend digging into the
testing there.

---

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
  withRootDb(async (pgClient) => {
    const [user] = await createUsers(pgClient, 1);

    await becomeUser(pgClient, user);
    const {
      rows: [deletedUser],
    } = await pgClient.query(
      "delete from app_public.users where id = $1 returning *",
      [user.id],
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
testing the GraphQL layer is more akin to integration tests — they simulate
requests through your Grafserv adaptor (exercising pgSettings / JWT / etc) and
you can place assertions on the results.

First, make sure that your PostGraphile preset lives in
`graphile.config.js` (or `.ts`) so both your server and tests can import it.
The helper below reuses that preset to build a schema, then runs queries via
Gra*fast* while supplying a `requestContext` that looks like the one Grafserv
would provide. It also uses
`makeWithPgClientViaPgClientAlreadyInTransaction()` so the GraphQL operation
and any assertions can run inside the same transaction. This helper is only
appropriate for tests.

<details>
<summary>(Click to expand.) Create a <tt>test_helper.ts</tt> file for running
your queries, responsible for importing your preset and setting up/tearing down
the PostGraphile instance. Don't forget to set the environment variables used
by this file. </summary>

The following code is in TypeScript; you can convert it to JavaScript via
https://www.typescriptlang.org/play

**WARNING**: This code has been ported from v4 to v5 in syntax, but has not yet
been tested. Please let us know if it works for you!

```ts
import { makeWithPgClientViaPgClientAlreadyInTransaction } from "@dataplan/pg/adaptors/pg";
import { execute, hookArgs } from "grafast";
import { parse, validate } from "graphql";
import type { ExecutionResult, GraphQLSchema } from "graphql";
import { Pool } from "pg";
import { postgraphile } from "postgraphile";
import preset from "../src/graphile.config.js";

const MockReq = require("mock-req");

type Maskable = "nodeId" | "id" | "timestamp" | "email" | "username";
type MaskCache = { counter: number; values: Map<unknown, string> };

let maskCacheByType: Record<Maskable, MaskCache> = {};
// Reset the cache before each test
beforeEach(() => {
  maskCacheByType = {};
});

/**
 * Replaces values that are expected to change between test runs with static
 * placeholders so that our snapshot testing doesn't throw an error
 * every time we run the tests because time has ticked on in it's inevitable
 * march toward the future.
 */
export function sanitize(json: any): any {
  /** Maintain stable references whilst dealing with variable values */
  function mask(value: unknown, type: Maskable) {
    if (!maskCacheByType[type]) {
      maskCacheByType[type] = { counter: 0, values: new Map() };
    }
    const maskCache = maskCacheByType[type];
    if (!maskCache.values.has(value)) {
      maskCache.values.set(value, `[${type}-${++maskCache.counter}]`);
    }
    return maskCache.values.get(value);
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

interface ICtx {
  pgl: ReturnType<typeof postgraphile>;
  schema: GraphQLSchema;
  resolvedPreset: GraphileConfig.ResolvedPreset;
  pgPool: Pool;
}
let ctx: ICtx | null = null;

export const setup = async () => {
  if (!process.env.TEST_DATABASE_URL) {
    throw new Error("Cannot run tests without a TEST_DATABASE_URL");
  }
  const pgl = postgraphile(preset);
  const { schema, resolvedPreset } = await pgl.getSchemaResult();
  const pgPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  });

  ctx = { pgl, schema, resolvedPreset, pgPool };
};

export const teardown = async () => {
  try {
    if (!ctx) {
      return null;
    }
    const { pgl, pgPool } = ctx;
    ctx = null;
    await pgl.release();
    await pgPool.end();
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
    context: { contextValue: Record<string, any> },
  ) => void | ExecutionResult | Promise<void | ExecutionResult> = () => {}, // Place test assertions in this function
) {
  if (!ctx) throw new Error("No ctx!");
  const { schema, resolvedPreset, pgPool } = ctx;

  const document = parse(query);
  const validationErrors = validate(schema, document);
  if (validationErrors.length > 0) {
    throw validationErrors[0];
  }

  const req = new MockReq({
    url: resolvedPreset.grafserv?.graphqlPath ?? "/graphql",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...reqOptions,
  });
  const res: any = { req };
  req.res = res;

  const contextValue: Record<string, any> = {
    __TESTING: true,
  };

  const args = await hookArgs({
    schema,
    document,
    variableValues: variables ?? {},
    contextValue,
    resolvedPreset,
    requestContext: {
      node: { req, res },
      expressv4: { req, res },
    },
  });

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query("begin");

    // Test-only helper: reuse a client that's already in a transaction.
    const withPgClient = makeWithPgClientViaPgClientAlreadyInTransaction(
      pgClient,
      true,
    );
    // Overwrite `withPgClient` with our test version
    args.contextValue.withPgClient = withPgClient;

    const result = await execute(args);

    // This is where we call the `checker` so you can do your assertions.
    const checkResult = await checker(result as ExecutionResult, {
      contextValue: args.contextValue,
    });

    // You don't have to keep this, I just like knowing when things change!
    expect(sanitize(result)).toMatchSnapshot();

    return checkResult == null ? result : checkResult;
  } finally {
    try {
      await pgClient.query("rollback");
    } finally {
      pgClient.release();
    }
  }
};
```

</details>

For more thorough test helpers (and to see this working in practice), check out
Graphile Starter:

- [@app/server/\_\_tests\_\_/queries/currentUser.test.ts](https://github.com/graphile/starter/blob/main/@app/server/__tests__/queries/currentUser.test.ts)
- [@app/server/\_\_tests\_\_/helpers.ts](https://github.com/graphile/starter/blob/main/@app/server/__tests__/helpers.ts)
- [@app/\_\_tests\_\_/helpers.ts](https://github.com/graphile/starter/blob/main/@app/__tests__/helpers.ts)

Your test might look something like this:

```ts
import type { PgClient } from "postgraphile/@dataplan/pg";
import { setup, teardown, runGraphQLQuery } from "../test_helper.js";

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
    async (json, { contextValue }) => {
      expect(json.errors).toBeFalsy();
      expect(json.data.__typename).toEqual("Query");

      // If you need to, you can query the DB here; for example, using the
      // `withPgClient` helper added to the context by PostGraphile.
      if (typeof contextValue.withPgClient === "function") {
        await contextValue.withPgClient(
          contextValue.pgSettings ?? null,
          async (pgClient: PgClient) => {
            const { rows } = await pgClient.query({
              text: `select * from app_public.users where id = $1`,
              values: [17],
            });
            if (rows.length !== 1) {
              throw new Error("User not found!");
            }
          },
        );
      }
    },
  );
});
```
