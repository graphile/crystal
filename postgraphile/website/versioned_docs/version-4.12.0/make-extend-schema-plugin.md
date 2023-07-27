---
layout: page
path: /postgraphile/make-extend-schema-plugin/
title: makeExtendSchemaPlugin (graphile-utils)
---

**NOTE: this documentation applies to PostGraphile v4.1.0+**

The `graphile-utils` module contains some helpers for extending your
PostGraphile (or Graphile Engine) GraphQL schema without having to understand
the complex plugin system.

The main one you'll care about to start with is `makeExtendSchemaPlugin`.

Using `makeExtendSchemaPlugin` you can write a plugin that will merge additional
GraphQL types and resolvers into your schema using a similar syntax to
`graphql-tools`. You need to provide the `typeDefs` schema definition and
`resolvers` function to use. Your plugin will likely take a shape like this:

```js
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const MyPlugin = makeExtendSchemaPlugin((build) => {
  // Get any helpers we need from `build`
  const { pgSql: sql, inflection } = build;

  return {
    typeDefs: gql`...`,
    resolvers: {
      /*...*/
    },
  };
});

module.exports = MyPlugin;
```

And would be added to your PostGraphile instance via

- CLI: `` --append-plugins `pwd`/MySchemaExtensionPlugin.js ``
- Library: `appendPlugins: [require('./MySchemaExtensionPlugin')]`

The `build` argument to the makeExtendSchemaPlugin callback contains lots of
information and helpers defined by various plugins, most importantly it includes
the introspection results (`build.pgIntrospectionResultsByKind`), inflection
functions (`build.inflection`), and SQL helper (`build.pgSql`, which is an
instance of [pg-sql2](https://www.npmjs.com/package/pg-sql2)).

The callback should return an object with two keys:

- `typeDefs`: a GraphQL AST generated with the `gql` helper from
  `graphile-utils` (note this is NOT from the `graphql-tag` library, ours works
  in a slightly different way).
- `resolvers`: an object that's keyed by the GraphQL type names of types defined
  (or extended) in `typeDefs`, the values of which are objects keyed by the
  field names with values that are resolver functions.

For a larger example of how typeDefs and resolvers work, have a look at the
[graphql-tools docs](https://www.graphql-tools.com/docs/generate-schema) - ours
work in a similar way.

Note that the resolve functions defined in `resolvers` will be sent the standard
4 GraphQL resolve arguments (`parent`, `args`, `context`, `resolveInfo`); but
the 4th argument (`resolveInfo`) will also contain graphile-specific helpers.

### The `gql` and `embed` helpers

The `gql` helper is responsible for turning the human-readable GraphQL schema
language you write into an abstract syntax tree (AST) that the application can
understand. Our `gql` help differs slightly from the one you may be familiar
with in the `graphql-tag` npm module, namely in how the placeholders work. Ours
is designed to work with PostGraphile's [inflection system](./inflection/), so
you can embed strings directly. You may also embed other gql tags directly. For
example:

```js
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

The `embed` helper is for use with `gql` when you want to embed a raw JavaScript
value (anything: regexp, function, string, object, etc) into the document; for
example to pass it to a directive. We use this with the `@pgQuery` directive
further down this page. Here's a simple example of embedding an object.

```js
const meta = {
  /* arbitrary data */
  name: "fieldName",
  added: "2019-04-29T16:15:00Z",
};
const typeDefs = gql`
  extend type Query {
    fieldName: Int @scope(meta: ${embed(fieldNameMeta)})
  }
`;
```

### Querying the database inside a resolver

PostGraphile provisions, sets up and tears down a PostgreSQL client
automatically for each GraphQL query. Setup involves beginning a transaction and
setting the relevant session variables, e.g. using your JWT or the `pgSettings`
function. You can access this client on `context.pgClient`; it's currently an
instance of
[`pg.Client` from the `pg` module](https://node-postgres.com/api/client);
however you should only use it like this to maintain future compatibility:

```js
const { rows } = await context.pgClient.query(
  sqlText, // e.g. "select * from users where id = $1"
  optionalVariables, // e.g. [27]
);
```

NOTE: `context` is the third argument passed to a GraphQL resolver
(`function myResolver(parentObject, args, context, info) { /* ... */ }`).

Since you're already in a transaction, issuing `BEGIN;` or `COMMIT;` inside your
resolver is a Really Bad Idea™. Should you need a sub-transaction,
[use a SAVEPOINT](https://www.postgresql.org/docs/current/sql-savepoint.html).
However, please be aware that PostGraphile only sets up a transaction when it
needs to (e.g. when it's a mutation, or when there are config variables or a
role to set); so you cannot rely on SAVEPOINT working inside of queries unless
you know these conditions are met.

Because the entire GraphQL operation is executed within a single transaction, be
very wary that you don't cause an SQL error which causes the entire transaction
to fail. This could leave things in a very odd state - particularly for
mutations - e.g. where you return a partial success to the user, but actually
roll back the results. It's recommended that all mutations are wrapped in
`SAVEPOINT` / `RELEASE SAVEPOINT` / `ROLLBACK TO SAVEPOINT` calls.

When your resolver returns results that will be used by autogenerated types and
fields, you must not return query results such as these directly. Instead use
[the `selectGraphQLResultFromTable` helper](#the-selectgraphqlresultfromtable-helper)
documented below. The results of your `pgClient.query` should be used within the
resolver only, and should not "leak" (in general).

### Reading database column values

When extending a schema, it's often because you want to expose data from Node.js
that would be too difficult (or impossible) to access from PostgreSQL. When
defining a field on an existing table-backed type defined by PostGraphile, it's
useful to access data from the underlying table in the resolver.

To do this you can use the `@requires(columns: […])` field directive to declare
the data dependencies of your resolver. This guarantees that when the resolver
is executed, the data is immediately available.

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

```js {2,4,6-25,30}
const { postgraphile } = require("postgraphile");
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const express = require("express");
const { convertUsdToAud } = require("ficticious-npm-library");

const MyForeignExchangePlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Product {
        priceInAuCents: Int! @requires(columns: ["price_in_us_cents"])
      }
    `,
    resolvers: {
      Product: {
        priceInAuCents: async (product) => {
          // Note that the columns are converted to fields, so the case changes
          // from `price_in_us_cents` to `priceInUsCents`
          const { priceInUsCents } = product;
          return await convertUsdToAud(priceInUsCents);
        },
      },
    },
  };
});

const app = express();
app.use(
  postgraphile(process.env.DATABASE_URL, ["app_public"], {
    graphiql: true,
    appendPlugins: [MyForeignExchangePlugin],
  }),
);
app.listen(3030);
```

### The `selectGraphQLResultFromTable` helper

**IMPORTANT**: this helper is for populating data you return from your
\*resolver; you _should not_ use `selectGraphQLResultFromTable` to retrieve data
for your resolver to process. Instead use `context.pgClient` directly.

**IMPORTANT**: `selectGraphQLResultFromTable` should only be called once per
resolver; it doesn't make sense to call it multiple times, and attempting to
combine the results is liable to cause issues. If you feel the need to call it
multiple times, please read the IMPORTANT note above, and/or consider
implementing your requirement via multiple fields/resolvers rather than trying
to do it all in one.

Resolvers are passed 4 arguments: `parent, args, context, resolveInfo`. In the
`context.pgClient` is an instance of a database client from the `pg` module
that's already in a transaction configured with the settings for this particular
GraphQL request. You can use this client to make requests to the database within
this transaction.

However, because PostGraphile uses Graphile Engine's look-ahead features, you
will not be able to easily build a query that will return the data PostGraphile
requires to represent nested relations/etc using `pgClient` directly. That is
why `resolveInfo.graphile.selectGraphQLResultFromTable` exists.

The `resolveInfo.graphile.selectGraphQLResultFromTable` function is vital if you
want to return PostGraphile database table/view/function/etc-related types from
your GraphQL field. It is responsible for hooking into the query look-ahead
features of Graphile Engine to inspect the incoming GraphQL query and pull down
the relevant data from the database (including nested relations). You are then
expected to return the result of this fetch via your resolver. You can use the
`queryBuilder` object to customize the generated query, changing the order,
adding `where` clauses, `limit`s, etc (see below). Note that if you are not
returning a record type directly (for example you're returning a mutation
payload, or a connection interface), you should use the `@pgField` directive as
shown below so that the Look Ahead feature continues to work.

#### Usage for non-tables

Despite the (unfortunate) name; `selectGraphQLResultFromTable` can be used with
any table-like source, including a table-defining sub-query, however it should
only be used where the type perfectly matches the expected return type of the
GraphQL field.

This non-table support is particularly useful when it comes to calling
functions; for example if you had a function `match_user()` that returns a
`users` record, you could define a `makeExtendSchemaPlugin` resolver that
queries it like this:

```js
// type Query { matchingUser(searchText: String!): User }
const matchingUserResolver = async (parent, args, context, resolveInfo) => {
  const [row] = await resolveInfo.graphile.selectGraphQLResultFromTable(
    sql.fragment`(select * from match_user(${sql.value(args.searchText)}))`,
    () => {}, // no-op
  );
  return row;
};
```

#### QueryBuilder

`queryBuilder` is an instance of `QueryBuilder`, a helper that uses an SQL AST
constructed via [`pg-sql2` methods](https://www.npmjs.com/package/pg-sql2#api)
to dynamically create powerful SQL queries without risking SQL injection
attacks. The `queryBuilder` has a number of methods which affect the query which
will be generated. The main ones you're likely to want are:

- `where(sqlFragment)`; e.g.
  `` queryBuilder.where(build.pgSql.fragment`is_admin is true`) ``
- `orderBy(() => sqlFragment, ascending)`; e.g.
  `` queryBuilder.orderBy(() => build.pgSql.fragment`created_at`, false) ``
- `limit(number)`; e.g. `queryBuilder.limit(1)`
- `offset(number)`; e.g. `queryBuilder.offset(1)`
- `select(() => sqlFragment, alias)`; e.g.
  `` queryBuilder.select(() => build.pgSql.fragment`gen_random_uuid()`, '__my_random_uuid') `` -
  it's advised to start your alias with two underscores to prevent it clashing
  with any potential columns exposed as GraphQL fields.

On top of these methods, `QueryBuilder` has the following useful properties:

- `parentQueryBuilder`: gives access to the parent QueryBuilder instance;
  primarily (and possibly only) useful for executing
  `queryBuilder.parentQueryBuilder.getTableAlias()` so you can reference a field
  on the parent record (e.g. to perform filtering based on a relation).

There are many other internal properties and methods, but you probably shouldn't
call them. Only rely on the methods and properties documented above.

##### QueryBuilder named children

In very rare circumstances you might also need to use the following methods:

- `buildChild()`; builds a child query builder, automatically passing through
  the relevant options and setting `parentQueryBuilder` for you - useful for
  constructing subqueries (normally you'd use `build.pgQueryFromResolveData`
  rather than using the `buildChild` method directly)
- `buildNamedChildSelecting(name, from, selectExpression)`; creates a child
  query builder that's named `name`, selecting only `selectExpression` using the
  table (or subquery) described in `from`.
- `getNamedChild(name)`; gets the named child created by
  `buildNamedChildSelecting`

An example of these methods being used can be found here:
https://github.com/singingwolfboy/graphile-engine/blob/44a2496102267ce664c1286860b6368283463063/packages/postgraphile-core/__tests__/integration/ToyCategoriesPlugin.js

In this example we have a many-to-many relationship with three tables: `toys`,
`categories` and the join table between them: `toy_categories`. We add a
`categories` field onto the `Toy` type, which constructs a subquery called
`toyCategoriesSubquery` to determine the categories the current toy is in from
the join table `toy_categories`. Later, in a different plugin (just a different
hook in this example), we want to be able to filter this list of `categories` to
only the list of categories where the join table's `toy_categories.approved`
field is true; to do so we need to be able to get access to this "named"
subquery so that we can add conditions to it's `WHERE` clause.

In most cases you're only dealing with one or two tables so you won't need this
level of complexity.

#### Query Example

The below is a simple example which would have been better served by
[Custom Query SQL Procedures](./custom-queries/#custom-query-sql-procedures);
however it demonstrates using `makeExtendSchemaPlugin` with a database record,
table connection, and list of database records.

You can also use this system to define mutations or to call out to external
services — see below.

```js
const { postgraphile } = require("postgraphile");
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const express = require("express");

const app = express();

const MyRandomUserPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Query {
        # Individual record
        randomUser: User

        # Connection record
        randomUsersConnection: UsersConnection

        # List record
        randomUsersList: [User!]
      }
    `,
    resolvers: {
      Query: {
        /*
         * Individual record needs to return just one row but
         * `selectGraphQLResultFromTable` always returns an array; so the
         * resolver is responsible for turning the array into a single record.
         */
        randomUser: async (_query, args, context, resolveInfo) => {
          // Remember: resolveInfo.graphile.selectGraphQLResultFromTable is where the PostGraphile
          // look-ahead magic happens!
          const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`app_public.users`,
            (tableAlias, queryBuilder) => {
              queryBuilder.orderBy(sql.fragment`random()`);
              queryBuilder.limit(1);
            },
          );
          return rows[0];
        },

        /*
         * Connection and list resolvers are identical; PostGraphile handles
         * the complexities for you. We've simplified these down to a direct
         * call to `selectGraphQLResultFromTable` but you may wish to wrap this
         * with additional logic.
         */
        randomUsersConnection: (_query, args, context, resolveInfo) =>
          resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`app_public.users`,
            (tableAlias, queryBuilder) => {
              queryBuilder.orderBy(sql.fragment`random()`);
            },
          ),
        randomUsersList: (_query, args, context, resolveInfo) =>
          resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`app_public.users`,
            (tableAlias, queryBuilder) => {
              queryBuilder.orderBy(sql.fragment`random()`);
            },
          ),
      },
    },
  };
});

app.use(
  postgraphile(process.env.DATABASE_URL, ["app_public"], {
    graphiql: true,
    appendPlugins: [MyRandomUserPlugin],
  }),
);
app.listen(3030);
```

#### Mutation Example

For example, you might want to add a custom `registerUser` mutation which
inserts the new user into the database and also sends them an email:

```js {17,23-91}
const MyRegisterUserMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input RegisterUserInput {
        name: String!
        email: String!
        bio: String
      }

      type RegisterUserPayload {
        user: User @pgField
        query: Query
      }

      extend type Mutation {
        registerUser(input: RegisterUserInput!): RegisterUserPayload
      }
    `,
    resolvers: {
      Mutation: {
        registerUser: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // Our custom logic to register the user:
            const {
              rows: [user],
            } = await pgClient.query(
              `INSERT INTO app_public.users(
                name, email, bio
              ) VALUES ($1, $2, $3)
              RETURNING *`,
              [args.input.name, args.input.email, args.input.bio],
            );

            // Now we fetch the result that the GraphQL
            // client requested, using the new user
            // account as the source of the data. You
            // should always use
            // `resolveInfo.graphile.selectGraphQLResultFromTable` if you return database
            // data from your custom field.
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`app_public.users`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(user.id)}`,
                  );
                },
              );

            // Finally we send the email. If this
            // fails then we'll catch the error
            // and roll back the transaction, and
            // it will be as if the user never
            // registered
            await mockSendEmail(
              args.input.email,
              "Welcome to my site",
              `You're user ${user.id} - thanks for being awesome`,
            );

            // If the return type is a database record type, like User, then
            // you would return `row` directly. However if it's an indirect
            // interface such as a connection or mutation payload then
            // you return an object with a `data` property. You can add
            // additional properties too, that can be used by other fields
            // on the result type.
            return {
              data: row,
              query: build.$$isQuery,
            };
          } catch (e) {
            // Oh noes! If at first you don't succeed,
            // destroy all evidence you ever tried.
            await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
            throw e;
          } finally {
            // Release our savepoint so it doesn't conflict with other mutations
            await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
          }
        },
      },
    },
  };
});
```

Note that the `@pgField` directive here is necessary for PostGraphile to "look
ahead" and determine what to request from the database.

### Mutation Example with Node ID

In this example we'll use a GraphQL Global Object Identifier (aka Node ID) to
soft-delete an entry from our `app_public.items` table. We're also going to
check that the user performing the soft-delete is the owner of the record.

**Aside**: if you're interested in soft-deletes, check out
[@graphile-contrib/pg-omit-archived](https://github.com/graphile-contrib/pg-omit-archived)

```js
const DeleteItemByNodeIdPlugin = makeExtendSchemaPlugin((build) => {
  const typeDefs = gql`
    input DeleteItemInput {
      nodeId: ID!
    }
    type DeleteItemPayload {
      success: Boolean
    }
    extend type Mutation {
      deleteItem(input: DeleteItemInput!): DeleteItemPayload
    }
  `;

  const resolvers = {
    Mutation: {
      deleteItem: async (_query, args, context) => {
        // jwtClaims is decrypted jwt token data
        const { pgClient, jwtClaims } = context;

        // Decode the node ID
        const { Type, identifiers } = build.getTypeAndIdentifiersFromNodeId(
          args.input.nodeId,
        );

        // Check it applies to our type
        if (Type !== build.getTypeByName("Item")) {
          throw new Error("Invalid nodeId for Item");
        }

        // Assuming there's a single primary-key column, the PK will
        // be the first and only entry in identifiers.
        const itemId = identifiers[0];

        // All mutations that issue SQL must be wrapped in savepoints
        await pgClient.query("SAVEPOINT graphql_mutation");

        try {
          const { rowCount } = await pgClient.query(
            `UPDATE app_public.items SET is_archived = true
              WHERE id = $1
              AND user_id = $2;`,
            [itemId, jwtClaims.user_id],
          );

          return {
            success: rowCount === 1,
          };
        } catch (e) {
          await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
          throw e;
        } finally {
          await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
        }
      },
    },
  };

  return {
    typeDefs,
    resolvers,
  };
});
```

### Using the `@pgQuery` directive for non-root queries and better performance

If your field is not defined on the `Query`/`Mutation` type directly (i.e. it's
not defined at the root level) then for performance reasons you should hook into
the "look-ahead" system when adding a custom connection/list/record, rather than
using a resolver. You can achieve this with the `@pgQuery` directive, as shown
below. Alternative approaches you may wish to consider are
[Smart Comments](./smart-comments/) and [Computed Columns](./computed-columns/).

#### @pgQuery with an object type

**NOTE: this section applies to PostGraphile v4.4.0+**

When returning an object type (e.g. a table/composite type, connection, etc),
the `@pgQuery` directive accepts the following inputs:

- `source`: the source of the row(s) used in the result; can be a table name,
  subquery, or function call (but must always return the relevant table type and
  nothing more); currently this requires the boilerplate syntax below, but this
  may be simplified in future
- `withQueryBuilder(queryBuilder, args)`: this optional callback function is how
  you customise which rows will be returned from the `source`; you may add
  `where`, `orderBy`, `limit` and `offset` constraints. The `args` argument
  contains the arguments that the field was passed, if any. This may be useful
  when constructing the query constraints.

The `@pgQuery` directive may be used with connections, lists of table records,
or individual table records. (When used with individual records you must ensure
that at most one row is returned; you can do so with the `queryBuilder.limit`
constraint.) You can see examples of these three use cases
[in the tests](https://github.com/graphile/graphile-engine/blob/5211758b7a48191ffd7600f9f5ae572672ffd221/packages/graphile-utils/__tests__/ExtendSchemaPlugin-pg.test.js#L507-L720).

```js
const { makeExtendSchemaPlugin, gql, embed } = require("graphile-utils");

module.exports = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type User {
        pets: PetsConnection @pgQuery(
          source: ${embed(sql.fragment`app_public.pets`)}
          withQueryBuilder: ${embed((queryBuilder, args) => {
            queryBuilder.where(
              sql.fragment`${queryBuilder.getTableAlias()}.user_id = ${queryBuilder.parentQueryBuilder.getTableAlias()}.id`,
            );
          })}
        )
      }
    `,
  };
});
```

Notes:

- `PetsConnection` is just one type from the schema, as an example
- `queryBuilder.getTableAlias()` refers to the `app_public.pets` referenced in
  the `source` field
- `queryBuilder.parentQueryBuilder.getTableAlias()` refers to the
  table/function/view/etc from which the `User` (the parent type) was retrieved
- Regular connection arguments are added automatically thanks to the plugin
  system

#### @pgQuery with a leaf type

**NOTE: this section applies to PostGraphile v4.4.6+**

**BUG: it seems `@pgQuery` only supports _scalars_ (not _enums_) right now:
https://github.com/graphile/postgraphile/issues/1601**

The @pgQuery directive can also be used with leaf fields (those returning a
scalar or list thereof). To do so, we pass `@pgQuery` a `fragment:` argument.
This argument can take two forms:

1. an `sql.fragment`
2. a function `f(queryBuilder, args)` that returns a `sql.fragment`.
   `queryBuilder` is a `QueryBuilder` instance, and `args` is the arguments that
   were passed to the GraphQL field.

```js
const { makeExtendSchemaPlugin, gql, embed } = require("graphile-utils");

module.exports = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type User {
        nameWithSuffix(suffix: String!): String! @pgQuery(
          fragment: ${embed(
            (queryBuilder, args) =>
              sql.fragment`(${queryBuilder.getTableAlias()}.name || ' ' || ${sql.value(
                args.suffix,
              )}::text)`,
          )}
        )
      }
    `,
  };
});
```

Notes:

- `queryBuilder.getTableAlias()` refers to the table/function/view/etc from
  which the `User` (the parent type) was retrieved
- there is no `queryBuilder.parentQueryBuilder`

You can see more examples of these use cases
[in the tests](https://github.com/graphile/graphile-engine/blob/49259c291d651ab8b70d1f1785cf273bdd97fcf1/packages/graphile-utils/__tests__/ExtendSchemaPlugin-pg.test.js#L713-L832).

### Plugin SQL Privileges

Plugins access the database with the same privileges as everything else - they
are subject to RLS/RBAC/etc. If your user does not have privileges to perform
the action your plugin is attempting to achieve then you may need to create a
companion database function that is marked as `SECURITY DEFINER` in order to
perform the action with elevated privileges; alternatively you could use this
database function directly - see [Custom Mutations](./custom-mutations/) for
more details.
