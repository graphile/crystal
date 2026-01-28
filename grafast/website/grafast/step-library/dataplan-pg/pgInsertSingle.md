# pgInsertSingle

Inserts a single row into the given `resource`, setting the given attributes (if any).

```ts
const $insertedUser = pgInsertSingle(usersResource, {
  username: $username,
});
```

## $pgInsertSingle.set(attr, $value)

Adds another attribute to be inserted:

```ts
const $insertedUser = pgInsertSingle(usersResource);
$insertedUser.set("username", $username);
$insertedUser.set("bio", $bio);

// Roughly equivalent to:
// `INSERT INTO users (username, bio) VALUES ($1, $2);`
```

## $pgInsertSingle.apply($step)

Registers a callback (or list of callbacks) that will be applied to the insert
query builder at execution-time. The `$step` represents the callback at
plan-time and yields it at execution-time. Each callback receives a
`PgInsertSingleQueryBuilder` and can call `set` or `setBuilder` to add
attributes.

```ts
const $insertedUser = pgInsertSingle(usersResource);
const $apply = constant((qb) => {
  qb.set("username", "reese");
});
$insertedUser.apply($apply);
```

## $pgInsertSingle.get(attr)

Returns a PgClassExpressionStep representing the given attribute from the
inserted row. This is achieved by selecting the value using the
`INSERT INTO ... RETURNING ...` syntax.

```ts
const $id = $insertedUser.get("id");
```

## $pgInsertSingle.record()

Returns a PgClassExpressionStep representing the full record that was inserted.
