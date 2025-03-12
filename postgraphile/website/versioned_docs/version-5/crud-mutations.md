---
layout: page
path: /postgraphile/crud-mutations/
title: CRUD mutations
---

CRUD, or "Create, Read, Update, Delete", is a common paradigm in data
manipulation APIs; "CRUD Mutations" refer to all but the "R". PostGraphile will
automatically add CRUD mutations to the schema for each table that has the
relevant database permissions.

### Designing mutations

CRUD mutations can easily be disabled by disabling the `insert`,
`update` and `delete` behaviors in your preset:

```js title="graphile.config.mjs"
export default {
  // ...
  schema: {
    defaultBehavior: "-insert -update -delete",
  },
};
```

You might do this if you prefer to define all of your mutations yourself (e.g.
with [custom mutations](./custom-mutations)).

It's a common misconception for people unfamiliar with PostGraphile that its
main feature is the CRUD mutations. In actuality, a very significant portion of
users (including the maintainer) hardly ever use the CRUD mutations.
PostGraphile encourages you to write the best GraphQL API that you can, so
before designing your mutations we strongly recommend that you read Marc-André
Giroux's excellent [GraphQL Mutation Design: Anemic
Mutations](https://xuorig.medium.com/graphql-mutation-design-anemic-mutations-dd107ba70496)
article.

PostGraphile gives you a lot of ways to define your own mutations (from
[database functions](./custom-mutations), to [schema
extensions](./make-extend-schema-plugin), to [custom plugins](./extending)),
so you can pick whichever pattern you and your team are most comfortable with.

:::note

You might be wondering, &quot;What value do users see in PostGraphile if not the
CRUD mutations?&quot; These users typically recognize PostGraphile's significant
efficiency gains in the query schema &mdash; meaning they can handle larger
amounts of traffic and don't need to concern themselves with the complexities
of caches and cache invalidation for a lot longer. There's also the consistency afforded
through (and time saved by) autogeneration; the GraphQL best practices enabled
by the out-of-the box schema; and the easy schema-wide changes via the plugin
and behavior systems. These are just some of the well-known key features of PostGraphile.

:::

### CRUD mutation fields

Using the `users` table from the [parent article](./tables), depending on the
PostGraphile settings you use (and the permissions you've granted), you might
get the following mutations:

- createUser - Creates a single `User`.
  [See example](./examples/#Mutations__Create).
- updateUser - Updates a single `User` using its globally unique id and a patch.
- updateUserById - Updates a single `User` using a unique key and a patch.
  [See example](./examples/#Mutations__Update).
- updateUserByUsername - Updates a single `User` using a unique key and a patch.
- deleteUser - Deletes a single `User` using its globally unique id.
- deleteUserById - Deletes a single `User` using a unique key.
  [See example](./examples/#Mutations__Delete).
- deleteUserByUsername - Deletes a single `User` using a unique key.

**The `update` and `delete` mutations are created only if the table contains a
`primary key` column.**

You also get the following query fields ("Read"):

- user - Returns a single `User` using its globally unique `ID`.
- userById - Reads a single `User` using its globally unique `ID`.
- userByUsername - Reads a single `User` using its unique `username`.
- allUsers - Returns a [connection](./connections) enabling pagination through
  a set of (visible) `User`.

### Examples

```graphql
# Create a User and get back details of the record we created
mutation {
  createUser(
    input: { user: { id: 1, name: "Bilbo Baggins", username: "bilbo" } }
  ) {
    user {
      id
      name
      username
      createdAt
    }
  }
}

# Update Bilbo using the user.id primary key
mutation {
  updateUserById(
    input: { id: 1, userPatch: { about: "An adventurous hobbit" } }
  ) {
    user {
      id
      name
      username
      about
      createdAt
    }
  }
}

# Delete Bilbo using the unique user.username column and return the mutation ID
mutation {
  deleteUserByUsername(input: { username: "bilbo" }) {
    deletedUserId
  }
}
```

### If mutations don't show up...

First of all, check for errors being output from your PostGraphile server. If
there are no errors, here's some reasons that mutations might not show up in the
generated schema:

- Your behaviors (e.g. `defaultBehavior: "-insert -update -delete"` or `@behavior -insert -update -delete` smart comments on the tables) may be disabling them
- Insufficient permissions on the tables
- Tables not in an exposed schema
- Views instead of tables
- Missing primary keys (though 'create' mutations will still be added in this
  case)
- If you only see mutations using primary key: You might be using the
  `PrimaryKeyMutationsOnlyPlugin`

If you're new to GraphQL, perhaps you're looking in the wrong place? In Ruru (the
Graph*i*QL interface), open the docs on the right and go to the root. Select the
`Mutation` type to see the available mutations. If you try to execute a mutation
(e.g. using autocomplete) you must use the `mutation` operation type when
composing the request:

```graphql
mutation {
  createThing...
}
```

otherwise GraphQL will interpret the request as a `query`.
