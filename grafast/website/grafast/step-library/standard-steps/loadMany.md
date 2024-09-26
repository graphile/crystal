---
toc_max_heading_level: 4
---

import Mermaid from "@theme/Mermaid";

# loadMany

Similar to [DataLoader][]'s load method, uses the given callback function to
read many results from your business logic layer. To load just one, see
[`loadOne`](./loadOne.md).

## Enhancements over DataLoader

Thanks to the planning system in Gra*fast*, `loadMany` can expose features that
are not possible in DataLoader.

### Attribute and parameter tracking

A `loadMany` step (technically a `LoadStep`) keeps track of the
attribute names accessed on each of the records returned via
`.get(attrName)` and any parameters set via `.setParam(key, value)`. This
information will be passed through to your callback function such that you may
make more optimal calls to your backend business logic, only retrieving the
data you need.

### Input/output equivalence

If you (optionally) pass an `ioEquivalence` parameter to `loadMany` (the second
parameter) then you can use it to indicate which field(s) on each record in the
output are equivalent to the input(s). This enables an optimization where a
chained fetch can instead be performed in parallel if the child only depends on
an output which is equivalent to an input. Hopefully an example will make this
clearer...

Imagine you're loading the users within a given organization:

```graphql
{
  usersByOrganizationId(id: Int!) {
    id
    name
    organization {
      id
      name
    }
  }
}
```

You might have plan resolvers such as:

```ts
const plans = {
  Query: {
    usersByOrganizationId(_, { $id }) {
      return loadMany($id, batchGetUsersByOrganizationId);
    },
  },
  User: {
    organization($user) {
      const $orgId = $user.get("organization_id");
      return loadOne($orgId, batchGetOrganizationById);
    },
  },
};
```

In its current state the system doesn't know that the
`$user.get("organization_id")` is equivalent to the `id` argument to our
`usersByOrganizationId` field, so this would result in a chained fetch:

<Mermaid chart={`\
stateDiagram
  direction LR
  state "batchGetUsersByOrganizationId" as A
  state "batchGetOrganizationById" as B
  [*] --> A
  A --> B
`} />

However, we can indicate that the output of the `loadMany` step's records'
`organization_id` property (`$user.get("organization_id")`) is equivalent to its input
(`$id`):

```diff {4-5}
 const plans = {
   Query: {
     usersByOrganizationId(_, { $id }) {
-      return loadMany($id, batchGetUsersByOrganizationId);
+      return loadMany($id, 'organization_id', batchGetUsersByOrganizationId);
     },
   },
   User: {
     organization($user) {
       const $orgId = $user.get("organization_id");
       return loadOne($orgId, batchGetOrganizationById);
     },
   },
 };
```

Now the access to `$user.get("organization_id")` will be equivalent to the 'id'
argument on the `usersByOrganizationId` field - we no longer need to wait for
the users to load in order to fetch their organization:

<Mermaid chart={`\
stateDiagram
  direction LR
  state "batchGetUsersByOrganizationId" as A
  state "batchGetOrganizationById" as B
  [*] --> A
  [*] --> B
`} />

## Usage

```
loadMany($spec, [$unaryStep,] [ioEquivalence,] callback)
```

`loadMany` accepts two to four arguments, the first is the step that specifies
which records to load (the _specifier step_), and the last is the callback
function called with these specs responsible for loading them.

```ts
// Basic usage:
const $records = loadMany($spec, callback);

// Advanced usage:
const $records = loadMany($spec, $unaryStep, ioEquivalence, callback);
const $records = loadMany($spec, $unaryStep, callback);
const $records = loadMany($spec, ioEquivalence, callback);
```

Where:

- `$spec` is any step
- `$unaryStep` is any _unary_ step - see [Unary step usage](#unary-step-usage) below
- `ioEquivalence` is either `null`, a string, an array of strings, or a string-string object map - see [ioEquivalence usage](#ioequivalence-usage) below
- and `callback` is a callback function responsible for fetching the data.

### Callback

The `callback` function is called with two arguments, the first is
a list of the values from the _specifier step_ `$spec` and the second is options that
may affect the fetching of the records.

```ts
function callback(
  specs: ReadonlyArray<unknown>,
  options: {
    unary: unknown;
    attributes: ReadonlyArray<string>;
    params: Record<string, unknown>;
  },
): PromiseOrDirect<ReadonlyArray<unknown>>;
```

:::tip

For optimal results, we strongly recommend that the callback function is defined
in a common location so that it can be reused over and over again, rather than
defined inline. This will allow the underlying steps to optimize calls to this function.

:::

Within this definition of `callback`:

- `specs` is the runtime values of each value that `$spec` represented
- `options` is an object containing:
  - `unary`: the runtime value that `$unaryStep` (if any) represented
  - `attributes`: the list of keys that have been accessed via
    `$record.get('<key>')` for each of the records in `$records`
  - `params`: the params set via `$records.setParam('<key>', <value>)`

`specs` is deduplicated using strict equality; so it is best to keep `$spec`
simple - typically it should only represent a single scalar value - which is
why `$unaryStep` exists.

`options.unary` is very useful to keep specs simple (so that fetch
deduplication can work optimally) whilst passing in global values that you may
need such as a database or API client.

`options.attributes` is useful for optimizing your fetch - e.g. if the user
only ever requested `$record.get('id')` and `$record.get('avatarUrl')` then
there's no need to fetch all the other attributes from your datasource.

`options.params` can be used to pass additional context to your callback
function, perhaps options like "should we include archived records" or "should
we expand 'customer' into a full object rather than just returning the
identifier".

### Basic usage

```ts
const $userId = $user.get("id");
const $friendships = loadMany($userId, getFriendshipsByUserIds);
```

An example of the callback function might be:

```ts
const friendshipsByUserIdCallback = (ids, { attributes }) => {
  // Your business logic would be called here; e.g. this might be the same
  // function that your DataLoaders would call, except additional information
  // can be passed to it:
  return getFriendshipsByUserIds(ids, { attributes });
};
```

### Unary step usage

(a step that only ever represents one value, e.g. simple derivatives of `context()`, `fieldArgs`, or `constant()`)

In addition to the forms seen in "Basic usage" above, you can pass a second
step to `loadMany`. This second step must be a [**unary
step**](../../step-classes.md#addUnaryDependency), meaning that it must represent
exactly one value across the entire request (not a batch of values like most
steps).

```ts
const $userId = $user.get("id");
const $dbClient = context().get("dbClient");
const $friendships = loadMany($userId, $dbClient, getFriendshipsByUserIds);
```

Since we know it will have exactly one value, we can pass it into the
callback as a single value and our callback will be able to use it directly
without having to perform any manual grouping.

This unary dependency is useful for fixed values (for example, those from
GraphQL field arguments) and values on the GraphQL context such as clients to
various APIs and other data sources.

### ioEquivalence usage

The `ioEquivalence` optional parameter can accept the following values:

- `null` to indicate no input/output equivalence
- a string to indicate that the same named property on the output is equivalent
  to the entire input plan
- if the step is a `list()` (or similar) plan, an array containing a list of
  keys (or null for no relation) on the output that are equivalent to the same
  entry in the input
- if the step is a `object()` (or similar) plan, an object that maps between
  the attributes of the object and the key(s) in the output that are equivalent
  to the given entry on the input

```ts title="Example for a scalar step"
const $posts = loadMany(
  $userId,

  // States that $post.get('user_id') should return $userId directly, since it
  // will have the same value.
  "user_id",

  friendshipsByUserIdCallback,
);
```

```ts title="Example for a list step"
const $posts = loadMany(
  list([$organizationId, $userId]),

  // States that:
  // - $post.get('organization_id') should return $organizationId directly, and
  // - $post.get('user_id') should return $userId directly
  ["organization_id", "user_id"],

  batchGetMemberPostsByOrganizationIdAndUserId,
);
```

```ts title="Example for an object step"
const $posts = loadMany(
  object({ oid: $organizationId, uid: $userId }),

  // States that:
  // - $post.get('organization_id') should return $organizationId directly (the value for the `oid` input), and
  // - $post.get('user_id') should return $userId directly (the value for the `uid` input
  { oid: "organization_id", uid: "user_id" },

  batchGetMemberPostsByOrganizationIdAndUserId,
);
```

### Passing multiple steps

The [`list()`](./list) or [`object()`](./object) step can be used if you need
to pass the value of more than one step into your callback:

```ts
const $result = loadMany(list([$a, $b, $c]), callback);
```

The first argument to `callback` will then be an array of all the tuples of
values from these plans: `ReadonlyArray<[a: AValue, b: BValue, c: CValue]>`.

:::tip Performance impact from using list/object

Using `list()` / `object()` like this will likely reduce the effectiveness of
`loadMany`'s built in deduplication; to address this a stable object/list is
required - please track this issue:
https://github.com/graphile/crystal/issues/2170

:::

[dataloader]: https://github.com/graphql/dataloader
