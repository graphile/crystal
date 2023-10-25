---
layout: page
path: /postgraphile/make-extend-schema-plugin/
title: makeExtendSchemaPlugin
---

`makeExtendSchemaPlugin` is _the_ plugin generator you need to know about. It's
the "bread and butter" of customizing your PostGraphile schema, enabling you to
add new fields and types to your GraphQL schema in a convenient and concise
familiar syntax - GraphQL SDL.

:::info

Though the SDL syntax is used, it is not validated - if you define a type but
never use that type, that will likely not cause a schema validation error. If
you use a directive that does not exist (or pass the wrong arguments to a
directive), that's also unlikely to error. The SDL is just used as a convenient
syntax, it is converted under the hood into [schema
hooks](https://build.graphile.org/graphile-build/hooks) as if you had written
a Graphile Build plugin by hand.

:::

If you're already familiar with the `typeDefs`/`resolvers` pattern used by
systems such as `graphql-tools` then using `makeExtendSchemaPlugin` should feel
familiar for you.

## Signature

`makeExtendSchemaPlugin` is called with a single parameter: a callback
function. This function will be passed the `build` object, and it must return
(synchronously) an object defining `typeDefs`, and one or more of `plans`
and/or `resolvers`.

The `build` argument to the makeExtendSchemaPlugin callback contains lots of
information and helpers defined by various plugins, in particular the registry
(`build.input.pgRegistry`) which contains all the resources and codecs from
introspection, the inflection functions (`build.inflection`), and the SQL helper
(`build.sql`) which is an instance of
[pg-sql2](https://www.npmjs.com/package/pg-sql2).

The callback should return an object with the following keys:

- `typeDefs`: a GraphQL AST generated with the `gql` helper from
  `postgraphile/utils` (note this is NOT from the `graphql-tag` library, ours
  works in a slightly different way).
- `plans` (optional, recommended): an object keyed by GraphQL type name that you're adding
  or extending in `typeDefs`, the values of which are objects keyed by the
  fieldName you've added, and the value of which is typically a plan resolver
  function (although it can be an object that defines both this and other
  details)
- `resolvers` (optional, not recommended): like `plans`, except the functions are
  a traditional resolver functions rather than plan resolver functions

:::info

Unlike in PostGraphile v4, the fourth argument to the resolver functions in
`resolvers` does _not_ contain Graphile Build-related helpers. Since the
lookahead system from V4 has been replaced by Gra*fast* query planning, you
should use `plans` rather than `resolvers`.

:::

## Example

```ts
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { constant } from "postgraphile/grafast";

export const MyPlugin = makeExtendSchemaPlugin((build) => {
  // Get any helpers we need from `build`
  const { sql, inflection } = build;

  return {
    typeDefs: gql`
      extend type Query {
        meaningOfLife: Int
      }
    `,

    plans: {
      Query: {
        meaningOfLife() {
          return constant(42);
        },
      },
    },

    /*
    // Though makeExtendSchemaPlugin and Grafast both support traditional
    // resolvers, plan resolvers are preferred for a "pure" Grafast schema.
    // Here's what the above would look like with traditional resolvers:
    resolvers: {
      Query: {
        meaningOfLife() {
          return 42;
        },
      },
    },
    */
  };
});
```

## The `gql` helper

The `gql` helper is responsible for turning the human-readable GraphQL schema
language you write into an abstract syntax tree (AST) that the application can
understand. Our `gql` help differs slightly from the one you may be familiar
with in the `graphql-tag` npm module, namely in how the placeholders work. Ours
is designed to work with PostGraphile's [inflection system](./inflection/), so
you can embed strings directly. You may also embed other gql tags directly. For
example:

```ts
const nameOfType = "MyType"; // Or use the inflection system to generate a type

// This tag interpolates the string `nameOfType` to allow dynamic naming of the
// type.
const Type = gql`
  type ${nameOfType} {
    str: String
    int: Int
  }
`;

// This tag interpolates the entire definition in `Type` above.
const typeDefs = gql`
  ${Type}

  extend type Query {
    fieldName: Type
  }
`;
```

<!-- Embed was removed from V5. It may or may not return.

## The `embed` helper

The `embed` helper is for use with `gql` when you want to embed a raw JavaScript
value (anything: regexp, function, string, object, etc) into the document; for
example to pass it to a directive. We use this with the `@pgQuery` directive
further down this page. Here's a simple example of embedding an object.

```js
const meta = {
  // arbitrary data
  name: "fieldName",
  added: "2019-04-29T16:15:00Z",
};
const typeDefs = gql`
  extend type Query {
    fieldName: Int @scope(meta: ${embed(fieldNameMeta)})
  }
`;
```

-->

## Querying the database

You should read [the Gra*fast* introduction](https://grafast.org/grafast/) and
the [page on "plan resolvers"](https://grafast.org/grafast/plan-resolvers)
before reading further here.

:::info

During the early access period you'll need to enter `helping2test` to get into
the above website. You are helping to test, right?

:::

Gra*fast* operate based on "steps", instances of step classes, returned from
"plan resolvers". Though there are many different step classes, most will
accept as input any other step, no matter the class.

However, the plan resolvers attached to the fields on a GraphQL type will
typically expect the incoming step to be of the right class, otherwise it will
not have the expected methods on it. For example, all the fields on a GraphQL
object type that PostGraphile has generated from a database table will expect
the parent step to be a `PgSelectSingleStep` instance (or similar) so that they
may do things like `$row.get('avatar_url')` and have that access the relevant
column in the database.

Thus, what you do inside your plan resolver and what you return from your plan
resolver are two different concerns. It's essential that you return the right
class of step from your plan resolver, to be compatible with what the schema is
expecting, but you have a lot of freedom within your plan resolver as to how to
achieve that.

One common desire is to access the data in the GraphQL context. You can access
this in Grafast using the `context()` step; for example, you may have stored
the current user's ID on the GraphQL context via the `userId` property, to
retrieve these you might do this in your plan resolver function:

```ts
const $userId = context().get("userId");
```

Data from the database can be retrieved using "resources." Resources can be
found on `build.input.pgRegistry.pgResources`, keyed by their name. For
example, if you have `organizations`, `users` and `channels` tables, you can
get the resources for them via:

```ts
const { organizations, users, channels } = build.input.pgRegistry.pgResources;
```

Now that you have a reference to the `users` resource, inside a plan resolver
function you could get a step representing a set of rows using `resource.find`:

```ts
const $users = users.find();
//    ^ PgSelectStep - represents a set of rows
```

Or you could get a step representing just a single row via `resource.get` (the
filter argument is required, and must represent a combination of columns that
matches a unique constraint):

```ts
const $user = users.get({ id: $userId });
//    ^ PgSelectSingleStep - represents a single row
```

Now that you have a step representing a single row (`$user`) you can retrieve
its column values using `$row.get`:

```ts
const $organizationId = $user.get("organization_id");
```

You could then feed this into another step, for example:

```ts
const $channels = channels.find({ organization_id: $organizationId });
```

### Example

Pulling this all together, you could build a plugin that adds a `Query.myChannels` field returning all the channels just from your organization:

```ts
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { context } from "postgraphile/grafast";

export const MyChannelsPlugin = makeExtendSchemaPlugin((build) => {
  const { users, channels } = build.input.pgRegistry.pgResources;
  return {
    typeDefs: gql`
      extend type Query {
        myChannels: [Channel]
      }
    `,
    plans: {
      Query: {
        myChannels() {
          const $userId = context().get("userId");
          const $user = users.get({ id: $userId });
          const $orgId = $user.get("organization_id");
          const $channels = channels.find({ organization_id: $orgId });
          return $channels;
        },
      },
    },
  };
});
```

:::info

Notice `Channel` type used in the `typeDefs` for `channels` table, this is automatically created by `postgraphile` while introspecting the database. [Read more on the artifacts that are created for each database table here.](https://postgraphile.org/postgraphile/next/tables)

:::

:::info

Though you might be thinking that this would result in multiple requests being
issued to the database, thanks to the magic of Gra*fast* and `@dataplan/pg`,
this is not the case. During the optimization phase for the operation plan,
`@dataplan/pg` will recognize that all of these steps represent data coming
from the database, and will optimize this into something roughly equivalent to:

```sql
select ...
from channels
where organization_id = (
  select users.organization_id
  from users
  where users.id = $1
);
```

:::

## Running custom SQL

As mentioned above, though what we return from the plan resolver is critical,
how we get there is less so. If we want, we can replace some of the logic above
with our own custom logic, so long as the result of the plan resolver is still
a `PgSelectStep` representing a set of rows.

One way to issue arbitrary SQL queries against the database is to use the
`withPgClient` step, or its cousin `withPgClientTransaction`. These both accept
an "executor" as the first argument, a step representing arbitrary data as the
second argument, and an asynchronous callback as the third argument. The callback
will be called with a `PgClient` instance and the resolved data from the step
in the second argument.

:::info

The `PgClient` instance is an abstraction provided by `@dataplan/pg`, it
contains common functionality but also any helpers that the specific Postgres
adaptor you're using wishes to expose. [Read more about Postgres adaptors in
the @dataplan/pg
documentation](https://grafast.org/grafast/step-library/dataplan-pg/adaptors).

During the early access period you'll need to enter `helping2test` to get into
the above website. You are helping to test, right?

:::

### The executor

**What is an executor?**

It's the thing that tells Gra*fast* (or, more
specifically, `@dataplan/pg`) how to communicate with the database. Normally
it's embedded directly into the resources, but since we're doing arbitrary SQL
no resource is involved.

**Why is it explicit rather than implicit?**

The simple answer for that is that there can be more than one
executor, for example if your schema represents more than one PostgreSQL
database.

**How do I get an executor?**

You can get the executor from any resource representing the target database,
for example:

```ts
const { executor } = channels;
```

### Example

Here's the previous example again, this time rewritten to use `withPgClient` to
retrieve the `organization_id` rather than the user resource:

```ts
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { context } from "postgraphile/grafast";
// highlight-next-line
import { withPgClient } from "postgraphile/@dataplan/pg";

export const MyChannelsPlugin = makeExtendSchemaPlugin((build) => {
  const { channels } = build.input.pgRegistry.pgResources;
  const { executor } = channels;

  return {
    typeDefs: gql`
      extend type Query {
        myChannels: [Channel]
      }
    `,
    plans: {
      Query: {
        myChannels() {
          const $userId = context().get("userId");
          // highlight-start
          const $orgId = withPgClient(
            executor,
            $userId,
            async (
              // The PgClient instance, with all of the "claims" (if any) already set:
              pgClient,
              // This is the runtime data that the `$userId` step represented
              userId,
            ) => {
              if (!userId) return null;

              // Here we're using the standard `pgClient.query` function that
              // all adaptors must provide, but if you're using an adaptor
              // related to your ORM of choice, you could likely use its
              // various methods to retrieve this value instead.
              const result = await pgClient.query<{ id: number }>({
                text: `select id from get_organization_for_user_id($1)`,
                values: [userId],
              });

              // Return the 'id' value from the first (and only) row, if it exists:
              return result.rows[0]?.id;
            },
          );
          // highlight-end
          const $channels = channels.find({ organization_id: $orgId });
          return $channels;
        },
      },
    },
  };
});
```

<!-- TODO: update the above with an exitEarly once that functionality has been implemented -->

## Reading database column values

When extending a schema, it's often because you want to expose data from Node.js
that would be too difficult (or impossible) to access from PostgreSQL. When
defining a field on an existing table-backed type defined by PostGraphile, it's
useful to access data from the underlying table in the plan resolver.

To do this you can use the `$row.get(columnName)` method, where `$row` is the
first parameter passed to your plan resolver function (representing the current
record).

Here's an example to illustrate.

In the database you have a `product` table (imagine an online store), that
PostGraphile will include in the GraphQL schema by creating a type `Product`
with fields `id`, `name`, `price_in_us_cents`.

```sql
create table product (
  id uuid primary key,
  name text not null,
  price_in_us_cents integer not null
);
```

This may result in the following GraphQL type:

```graphql
type Product {
  id: UUID!
  name: String!
  priceInUsCents: Int!
}
```

However imagine you're selling internationally, and you want to expose the price
in other currencies directly from the `Product` type itself. This kind of
functionality is well suited to being performed in Node.js (e.g. by making a
REST call to a foreign exchange service over the internet) but might be a
struggle from with PostgreSQL.

We'll retrieve the `price_in_us_cents` value from the database, and then use
the [`loadOne`
step](https://grafast.org/grafast/step-library/standard-steps/loadOne) to
batch-convert these values from USD to AUD:

:::info

During the early access period you'll need to enter `helping2test` to get into
the above website. You are helping to test, right?

:::

```js
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { loadOne } from "postgraphile/grafast";
import { getExchangeRate } from "./myBusinessLogic.mjs";

// highlight-start
async function convertUsdToAud(values) {
  const usdToAud = await getExchangeRate("USD", "AUD");
  return values.map((usd) => usd * usdToAud);
}
// highlight-end

export const MyForeignExchangePlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Product {
        priceInAuCents: Int!
      }
    `,
    plans: {
      Product: {
        priceInAuCents($product) {
          // highlight-next-line
          const $cents = $product.get("price_in_us_cents");
          // highlight-next-line
          return loadOne($cents, convertUsdToAud);
        },
      },
    },
  };
});
```

## Mutation Example

You might want to add a custom `registerUser` mutation which inserts the new
user into the database and also sends them an email:

```ts
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { access, constant, object } from "postgraphile/grafast";
import { withPgClientTransaction } from "postgraphile/@dataplan/pg";

export const MyRegisterUserMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { sql } = build;
  const { users } = build.input.pgRegistry.pgResources;
  const { executor } = users;
  return {
    typeDefs: gql`
      input RegisterUserInput {
        name: String!
        email: String!
        bio: String
      }

      type RegisterUserPayload {
        user: User
        query: Query
      }

      extend type Mutation {
        registerUser(input: RegisterUserInput!): RegisterUserPayload
      }
    `,
    plans: {
      Mutation: {
        registerUser(_, fieldArgs) {
          const $input = fieldArgs.getRaw("input");
          const $user = withPgClientTransaction(
            executor,
            $input,
            async (pgClient, input) => {
              // Our custom logic to register the user:
              const {
                rows: [user],
              } = await pgClient.query({
                text: `
                  INSERT INTO app_public.users (name, email, bio)
                  VALUES ($1, $2, $3)
                  RETURNING *`,
                values: [input.name, input.email, input.bio],
              });

              // Send the email. If this fails then the error will be caught
              // and the transaction rolled back; it will be as if the user
              // never registered
              await mockSendEmail(
                input.email,
                "Welcome to my site",
                `You're user ${user.id} - thanks for being awesome`,
              );

              // Return the newly created user
              return user;
            },
          );

          // To allow for future expansion (and for the `clientMutationId`
          // field to work), we'll return an object step containing our data:
          return object({ user: $user });
        },
      },

      // The payload also needs plans detailing how to resolve its fields:
      RegisterUserPayload: {
        user($data) {
          const $user = $data.get("user");
          // It would be tempting to return $user here, but the step class
          // is not compatible with the auto-generated `User` type, so
          // errors will occur. We must ensure that we return a compatible
          // step, so we will retrieve the relevant record from the database:

          // Get the '.id' property from $user:
          const $userId = access($user, "id");

          // Return a step representing this row in the database.
          return users.get({ id: $userId });
        },
        query($user) {
          // Anything truthy should work for the `query: Query` field.
          return constant(true);
        },
      },
    },
  };
});
```

## Mutation Example with Node ID

In this example we'll use a GraphQL Global Object Identifier (aka Node ID) to
soft-delete an entry from our `app_public.items` table. We're also going to
check that the user performing the soft-delete is the owner of the record.

**Aside**: if you're interested in soft-deletes, check out
[@graphile-contrib/pg-omit-archived](https://github.com/graphile-contrib/pg-omit-archived)

```ts
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { context, list, specFromNodeId } from "postgraphile/grafast";
import { withPgClientTransaction } from "postgraphile/@dataplan/pg";

const DeleteItemByNodeIdPlugin = makeExtendSchemaPlugin((build) => {
  // We need the nodeId handler for the Item type so that we can decode the ID.
  const handler = build.getNodeIdHandler("Item")!;

  // Extract the executor from the items resource
  const { items } = build.input.pgRegistry.pgResources;
  const { executor } = items;

  return {
    typeDefs: gql`
      input DeleteItemInput {
        id: ID!
      }
      type DeleteItemPayload {
        success: Boolean
      }
      extend type Mutation {
        deleteItem(input: DeleteItemInput!): DeleteItemPayload
      }
    `,

    plans: {
      Mutation: {
        deleteItem(_, fieldArgs) {
          // jwtClaims is decrypted jwt token data
          const $jwtClaims = context().get("jwtClaims");

          // Read the input.id value from the arguments
          const $nodeId = fieldArgs.getRaw(["input", "id"]);

          // Decode the node ID, to something like: `{ id: $someStep }`
          const spec = specFromNodeId(handler, $nodeId);
          const $itemId = spec.id;

          const $success = withPgClientTransaction(
            executor,
            // Passing a `list` step allows us to pass more than one dependency
            // through to our callback:
            list([$jwtClaims, $itemId]),
            async (pgClient, [jwtClaims, itemId]) => {
              if (!itemId || !jwtClaims?.user_id) {
                return false;
              }
              const {
                rows: [row],
              } = await pgClient.query(
                ` UPDATE app_public.items
                  SET is_archived = true
                  WHERE id = $1
                  AND user_id = $2
                  RETURNING *;`,
                [itemId, jwtClaims.user_id],
              );
              return !!row;
            },
          );

          // Since we're returning this data in the same shape as the payload
          // and the payload's fields don't need specific step classes, we don't
          // need to implement plan resolvers on the payload.
          return object({ success: $success });
        },
      },
    },
  };
});
```

## Plugin SQL Privileges

Plugins access the database with the same privileges as everything else - they
are subject to RLS/RBAC/etc. If your database user does not have privileges to
perform the action your plugin is attempting to achieve then you may need to
create a companion database function that is marked as `SECURITY DEFINER` in
order to perform the action with elevated privileges; alternatively you could
use this database function directly - see [Custom
Mutations](./custom-mutations/) for more details.
