---
title: CRUD mutations
---

CRUD, or "Create, Read, Update, Delete", is a common paradigm in data
manipulation APIs; "CRUD Mutations" refer to all but the "R". PostGraphile will
automatically add CRUD mutations to the schema for each table; this behaviour
can be disabled via the `--disable-default-mutations` CLI setting (or the
`disableDefaultMutations: true` library setting) if you prefer to define all of
your mutations yourself (e.g. with [custom mutations](./custom-mutations)).

Using the `users` table from the [parent article](./tables), depending on the
PostGraphile settings you use (and the permissions you've granted), you might
get the following mutations:

- createUser - Creates a single `User`.
  [See example](./examples/mutations#create).
- updateUser - Updates a single `User` using its globally unique id and a patch.
- updateUserById - Updates a single `User` using a unique key and a patch.
  [See example](./examples/mutations#update).
- updateUserByUsername - Updates a single `User` using a unique key and a patch.
- deleteUser - Deletes a single `User` using its globally unique id.
- deleteUserById - Deletes a single `User` using a unique key.
  [See example](./examples/mutations#delete).
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

- `--disable-default-mutations` (or `-M`) specified (or library equivalent)
- `@omit create,update,delete` smart comments on the tables
- Insufficient permissions on the tables and `--no-ignore-rbac` specified
- Tables not in an exposed schema
- Views instead of tables
- Missing primary keys (though 'create' mutations will still be added in this
  case)
- If you only see mutations using primary key: You might be using the
  `PrimaryKeyMutationsOnlyPlugin`

Don't forget to check any associated `.postgraphilerc` for these settings too!

If you're new to GraphQL, perhaps you're looking in the wrong place? In the
GraphiQL interface, open the docs on the right and go to the root. Select the
`Mutation` type to see the available mutations. If you try to execute a mutation
(e.g. using autocomplete) you must use the `mutation` operation type when
composing the request:

```graphql
mutation {
  createThing...
}
```

otherwise GraphiQL will interpret the request as a query.
