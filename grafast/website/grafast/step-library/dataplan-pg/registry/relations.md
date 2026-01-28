---
sidebar_position: 3
---

# Relations

In `@dataplan/pg`, a relation is a uni-directional link from a
[codec](./codecs) to a [resource](./resources), detailing how to get records
from the resource given that you already have data for the given codec.

:::info

Do not confuse this with the standard RDBMS term "relation" which effectively
means a "table" (or table-like thing). To avoid confusion, we will not refer to
a table as a "relation."

:::

## From codec to resource

The relation starts at a _codec_ rather than a _resource_ because you should be
able to traverse it no matter where the data came from - even if you got the
current user by calling the `current_user()` function you've defined in your
database (rather than selecting from the `users` table), you should still be
able to navigate from the resulting user data to the resources related to
users.

## Uni-directional

Relations are uni-directional; if you want the relationship to go
both ways you must add both forward and backward relations. In a database, a
relationship is normally represented by a "foreign key" constraint which only
exists on one side of the relationship (the "referencing" table), and it
references a remote table (the "referencee" table). In `@dataplan/pg` the
"forward" relation goes from the referencing codec to the referencee table and
is unique; the backward relation goes from the referencee codec to the
referencing table and should be flagged `isReferencee: true`. The forward
relation is always unique, the backward relation may or may not be unique
depending on if the remote attributes have a unique constraint on them or not.

## Defining relations

Relations are typically added via the registry builder:

```ts
// on users table: foreign_key ("organization_id") references organizations ("id")
builder.addRelation(userCodec, "organization", organizationResourceOptions, {
  localAttributes: ["organization_id"],
  remoteAttributes: ["id"],
  isUnique: true, // organizations.id is the primary key; so at most 1 match
  isReferencee: false, // userCodec references organizations
});

// The inverse of the above relation - all the users in this org.
builder.addRelation(organizationCodec, "users", userResourceOptions, {
  localAttributes: ["id"],
  remoteAttributes: ["organization_id"],
  isUnique: false, // Many users per org_id
  isReferencee: true, // organizationCodec is referenced by users
});
```

The forward relation (`user -> organization`) is unique; the backward relation
(`organization -> users`) is not.

## Using relations in plans

From a single-row step (`PgSelectSingleStep`) you can traverse to related rows:

```ts
const $user = users.get({ id: $id });
const $org = $user.singleRelation("organization");
const $team = $org.manyRelation("users");
```

From a collection step (`PgSelectStep`), `singleRelation` gives you an SQL alias
to use in conditions:

```ts
const $users = users.find();
const orgAlias = $users.singleRelation("organization");
$users.where((sql) => sql`${orgAlias}.is_active = true`);
```
