# pgUpdateSingle

Updates a single row within the given `resource` identified by the given spec and setting the given attributes (if any).

```ts
const $updatedUser = pgUpdateSingle(
  usersResource,

  // Find record by:
  { id: $id },

  // Update these attributes:
  { username: $username },
);
```

## $pgUpdateSingle.set(attr, $value)

Adds another attribute to be updated:

```ts
const $updatedUser = pgUpdateSingle(usersResource, { id: $id });
$updatedUser.set("username", $username);
$updatedUser.set("bio", $bio);

// Roughly equivalent to:
// `UPDATE users SET username = $1, bio = $2 WHERE id = $3;`
```

## $pgUpdateSingle.setPlan()

Returns a `SetterStep` (a "modifier step", rather than an `ExecutableStep`)
that can be useful when combined with `applyPlan` plan resolvers in arguments
and input fields to build up the attributes to set on the updated row bit by
bit.

## $pgUpdateSingle.get(attr)

Returns a PgClassExpressionStep representing the given attribute from the
updated row. This is achieved by selecting the value using the
`UPDATE ... RETURNING ...` syntax.

```ts
const $updatedAt = $updatedUser.get("updated_at");
```

## $pgUpdateSingle.record()

Returns a PgClassExpressionStep representing the full record that was updated.
