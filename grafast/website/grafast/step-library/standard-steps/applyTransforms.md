# applyTransforms

Takes a step as the first argument and returns a step that guarantees all
`listItem` transforms (especially `each()`) have been applied.

## When to use

It is rare that you need `applyTransforms()`; it is designed for use when
another step needs to depend on the full transformed value of the step.
Normally this kind of dependency wouldn't exist - you'd return your
(transformed) list step from your plan resolver, and Grafast would handle the
transforms when iterating over the resulting list.

An example of where you might need `applyTransforms()` is transforming a list
of users into usernames to send to a remote service:

```ts
// This step still represents a list of user objects until it is paginated by
// GraphQL; so if you pass it to another step as a dependency, that step will
// receive the untransformed user objects.
const $untransformed = each($users, ($user) => $user.get("username"));

// This step forces the `listItem` transforms to take place, so now it truly
// represents a list of usernames and is safe to pass as a dependency to other
// steps.
const $usernames = applyTransforms($untransformed);

return performRemoteRequestWithUsernames($usernames);
```

You should **not** use `applyTransforms()` when returning a list step from a
plan resolver for a list field. Grafast will automatically apply the transforms
when it iterates over the list, to `applyTransforms()` beforehand would force
this iteration to execute twice, which is inefficient.

```ts
const typeDefs = gql`
  type Organization {
    usernames: [String!]
  }
`;
const plans = {
  Organization: {
    usernames($org) {
      const $users = users.find({ organization_id: $org.get("id") });
      // No need to transform here:
      return each($users, ($user) => $user.get("username"));
    },
  },
};
```

## Type

```ts
function applyTransforms($step: ExecutableStep): ExecutableStep;
```

## Example

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
