---
layout: page
path: /postgraphile/tables/
title: PostgreSQL Tables
---

PostGraphile automatically adds a number of elements to the generated GraphQL
schema based on the tables and columns found in the inspected schema.

An example of a PostgreSQL table is:

```sql
CREATE TABLE app_public.users (
  id serial PRIMARY KEY,
  username citext NOT NULL unique,
  name text NOT NULL,
  about text,
  organization_id int NOT NULL
    REFERENCES app_public.organizations ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

For a table like this, PostGraphile will:

**TODO**: Are the inflectors up to date?

- Create a GraphQL type, `User`, for the table, named in UpperCamelCase &
  singularized
  ([inflector: `tableType`](https://github.com/graphile/graphile-engine/blob/f332cb11fc32c7b50428c8d19d88121ead00d95d/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L485-L487)).
  - Add fields to this type for the columns (e.g. `id`, `username`, `about`,
    `organizationId`, `isAdmin`, `createdAt`, `updatedAt`), named in camelCase
    ([inflector: `tableType`](https://github.com/graphile/graphile-engine/blob/f332cb11fc32c7b50428c8d19d88121ead00d95d/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L488-L490)).
  - Add a `nodeId` [globally unique identifier](./node-id/) field if the table
    has a primary key.
  - Add [fields for the relevant relations](./relations/) (e.g.
    `organizationByOrganizationId`\*).
- Add to related table types:
  - Reverse [relations for each forward relation](./relations/) (e.g.
    `Organization.usersByOrganizationId`\*).
- Add [CRUD Mutations](./crud-mutations/) to the root `Mutation` type.
- Add to the root `Query` type:
  - An `allUsers` [connection](./connections/) field with pagination, filtering,
    and ordering (inflector: `allRows`).
  - A number of `userByKey(key: ...)` fields (e.g. `userById`, `userByUsername`),
    one for each of the unique constraints on the table (inflector:
    `rowByUniqueKeys`).
  - A `foo(nodeId: ID!)` field to get the row by its `nodeId`.

```graphql
type Query implements Node {
  allUsers(
    first: Int
    last: Int
    offset: Int
    before: Cursor
    after: Cursor
    orderBy: [UsersOrderBy!] = [PRIMARY_KEY_ASC]
    condition: UserCondition
  ): UsersConnection

  userById(id: Int!): User

  userByUsername(username: String!): User

  user(nodeId: ID!): User
}
```

\* Remember these fields can be simplified by loading the
`@graphile/simplify-inflection` plugin.

Read more about [relations](./relations/), [connections](./connections/),
[filtering](./filtering/) and [CRUD Mutations](./crud-mutations/).

### Permissions

If you're using `PgRBACPlugin` (enabled by default if you're not using
`makeV4Preset()`) then PostGraphile will only expose the tables/columns/fields
you have access to. For example if you perform
`GRANT UPDATE (username, name) ON users TO graphql_visitor;` then the
`updateUser` mutations will only accept `username` and `name` fields - the
other columns will not be present.

Note that `PgRBACPlugin` inspects the RBAC (GRANT / REVOKE) privileges in the
database and reflects these in your GraphQL schema. As is GraphQL best
practices, this still only results in one GraphQL schema (not one per user), so
it takes the user account you connect to PostgreSQL with (from your connection
string) and walks all the roles that this user can become within the database,
and uses the union of all these permissions. You can influence the settings
used for this via the `pgService.pgSettingsForIntrospection` object. Using this
plugin is recommended as it results in a much leaner schema that doesn't
contain functionality that you can't actually use.

:::note

We strongly [advise against](./requirements.md) using column-based
`SELECT` grants with PostGraphile. Instead, split your permission concerns into
separate tables and join them with one-to-one relations.

:::
