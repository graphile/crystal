# pgDeleteSingle

Deletes a single row from the given `resource`, identified by the given unique
spec (similar to the spec you'd pass to `resource.get(...)`).

```ts
const $deletedUser = pgDeleteSingle(usersResource, {
  id: $id,
});
```

## $pgDeleteSingle.get(attr)

Returns a PgClassExpressionStep representing the given attribute from the
deleted row. This is achieved by selecting the value using the
`DELETE FROM ... WHERE ... RETURNING ...` syntax.

```ts
const $username = $deletedUser.get("username");
```

## $pgDeleteSingle.record()

Returns a PgClassExpressionStep representing the full record that was deleted.
