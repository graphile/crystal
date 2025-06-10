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

## $pgInsertSingle.setPlan()

:::warning OUT OF DATE

This method no longer exists! There's a runtime equivalent now via `.apply()`.

Help documenting this is welcome!

:::

<!-- TODO: I think the explanation below still needs a bit of an update -->

Returns a `Setter` (a Modifier, rather than an Step)
that can be useful when combined with `applyPlan` plan resolvers in arguments
and input fields to build up the attributes to set on the inserted row bit by
bit.

## $pgInsertSingle.get(attr)

Returns a PgClassExpressionStep representing the given attribute from the
inserted row. This is achieved by selecting the value using the
`INSERT INTO ... RETURNING ...` syntax.

```ts
const $id = $insertedUser.get("id");
```

## $pgInsertSingle.record()

Returns a PgClassExpressionStep representing the full record that was inserted.
