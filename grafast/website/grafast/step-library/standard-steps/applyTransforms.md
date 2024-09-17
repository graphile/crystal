# applyTransforms

Takes a step as the first argument and returns a step that guarantees all
`listItem` transforms (especially `each()`) have been applied.

## When to use

This step is designed for use when another step needs the full transformed
value of the step (which isn't normally the case when you're relying on Grafast
to resolve lists for you in your GraphQL operation). An example of this would
be if you want to transform a list of users into usernames to send to a remote
service:

```ts
// This step still represents a list of user objects until it is paginated by
// GraphQL; so if you pass it to another step as a dependency, that step will
// receive the untransformed user objects.
const $untransformed = each($users, ($user) => $user.get("username"));

// This step forces the `listItem` transforms to take place, so now it truly
// represents a list of usernames and is safe to pass as a dependency to other
// steps.
const $usernames = applyTransforms($untransformed);
```

## Type

```ts
function applyTransforms($step: ExecutableStep): ExecutableStep;
```

### Example

Imagine you want to generate a greeting string for all of the users
in a particular organization. Your first try might be something like:

```ts
// ❗ COUNTER-EXAMPLE!
const $users = usersResource.find();
$users.where(sql`${$users}.organization_name = 'Graphile'`);
const $usernames = each($users, ($user) => $user.get("username"));
return lambda(
  // UNSAFE! $usernames has not been transformed yet, it still represents the
  // same collection as $users.
  $usernames,
  (usernames) => `Hello ${usernames.join(", ")}!`,
  true,
);
```

This will output confusing data, since `$usernames` was not actually transformed yet
(it would only be transformed if we walked over it via a GraphQL list field) - you
might end up with `Hello [object Object], [object Object]!` or similar.

Instead, we must use `applyTransforms()` to force the tranforms to be applied
before passing the step as a dependency to `lambda()`:

```ts
const $users = usersResource.find();
$users.where(sql`${$users}.organization_name = 'Graphile'`);
const $untransformed = each($users, ($user) => $user.get("username"));

// Force the `listItem` transforms to be applied, so `lambda` can depend on the
// transformed values.
const $usernames = applyTransforms($untransformed);

return lambda(
  $usernames,
  (usernames) => `Hello ${usernames.join(", ")}!`,
  true,
);
```
