import Mermaid from "@theme/Mermaid";

# loadMany

Similar to [DataLoader][]'s load method, uses the given callback function to
read many results from your business logic layer. To load just one, see
[`loadOne`](./loadOne.md).

## Enhancements over DataLoader

Thanks to the planning system in Gra*fast*, `loadOne` can expose features that
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

In it's current state the system doesn't know that the
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
`organization_id` property (`$user.get("organization_id")`) is equivalent to it's input
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

```ts
const $userId = $user.get("id");
const $friendships = loadMany($userId, getFriendshipsByUserIds);
```

`loadMany` accepts two or three arguments, the first is the step that specifies
which records to load, and the last is the callback function called with these
specs responsible for loading them.

The callback function is called with two arguments, the first is a list of the
values from the specifier step and the second is options that may affect the
fetching of the records.

:::tip

For optimal results, we strongly recommend that the callback function is defined
in a common location so that it can be reused over and over again, rather than
defined inline. This will allow LoadManyStep to optimise calls to this function.

:::

An example of the callback function might be:

```ts
const friendshipsByUserIdCallback = (ids, { attributes }) => {
  // Your business logic would be called here; e.g. this might be the same
  // function that your DataLoaders would call, except we can pass additional
  // information to it:
  return getFriendshipsByUserIds(ids, { attributes });
};
```

[dataloader]: https://github.com/graphql/dataloader

Optionally a middle argument can indicate the input/output equivalence - this can be:

- `null` to indicate no input/output equivalence
- a string to indicate that the same named property on the output is equivalent
  to the entire input plan
- if the step is a `list()` (or similar) plan, an array containing a list of
  keys (or null for no relation) on the output that are equivalent to the same
  entry in the input
- if the step is a `object()` (or similar) plan, an object that maps between
  the attributes of the object and the key(s) in the output that are equivalent
  to the given entry on the input

```ts title="Example for a list step"
const $posts = loadMany(
  list([$organizationId, $userId]),
  ["organization_id", "user_id"],
  batchGetMemberPostsByOrganizationIdAndUserId,
);
```

```ts title="Example for an object step"
const $posts = loadMany(
  list({ oid: $organizationId, uid: $userId }),
  { oid: "organization_id", uid: "user_id" },
  batchGetMemberPostsByOrganizationIdAndUserId,
);
```

## Multiple steps

The [`list()`](./list) step can be used if you need to pass the value of more
than one step into your callback:

```ts
const $result = loadMany(list([$a, $b, $c]), callback);
```

The first argument to `callback` will then be an array of all the tuples of
values from these plans: `ReadonlyArray<[a: AValue, b: BValue, c: CValue]>`.
