# applyTransforms

Takes a step as the first argument and returns a step that guarantees all `listItem` transforms have occurred.

This step is useful for when you need all of:

- the `listItem` transforms to have already taken place (e.g. you're going to
- send the result to an external service) rather than processing them through
- the GraphQL response

This is very useful for modifying the values of an opaque step!

## Type

```ts
function applyTransforms($step: ExecutableStep): ExecutableStep<any>;
```

### Example

Let's say you have a `PgSelect` step and you want to apply logic to the values of said step. You may be inclined to do something like this:

```ts
const $users = usersResource.find();
const tbl = $users.alias;
$users.where(sql`${tbl}.username = 'Benjie'`);
// Options that could be used here include: loadOne, loadMany, lambda
return lambda(
  $users,
  (users) => {
    return users.map((user) => ({
      username: "USER-" + user.username,
      ...user,
    }));
  },
  true,
);
```

Due to `PgSelect` being an opaque step, this will not work! The values of `$users` will not be loaded by the time the `lambda` step is run. In order to guarantee that those values are available, you can wrap the `$users` step in an `applyTransforms`!

```ts
const $users = usersResource.find();
const tbl = $users.alias;
$users.where(sql`${tbl}.username = 'Benjie'`);
// By using applyTransforms, it guarantees these values will be available
return lambda(
  applyTransforms($users),
  (users) => {
    return users.map((user) => ({
      username: "USER-" + user.username,
      ...user,
    }));
  },
  true,
);
```
