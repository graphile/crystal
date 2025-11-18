---
toc_max_heading_level: 4
---

import Mermaid from "@theme/Mermaid";

# loadOne

Similar to [DataLoader][]'s load method, uses the given callback function to
read a single result (e.g. a user) from your business logic layer. To load a
list (e.g. a user's friends), see [`loadMany`](./loadMany.md).

## Enhancements over DataLoader

Thanks to the planning system in Gra*fast*, `loadOne` can expose features that
are not possible in DataLoader.

### Attribute and parameter tracking

A `loadOne` step keeps track of the attribute names accessed via
`.get(attrName)` and any parameters set via `.setParam(key, value)`. This
information will be passed through to your callback function such that you may
make more optimal calls to your backend business logic, only retrieving the data
you need.

### Input/output equivalence

If you (optionally) pass an `ioEquivalence` parameter to `loadOne` then you can
use it to indicate which field(s) on the output is equivalent to the input(s).
This enables an optimization where a chained fetch can instead be performed in
parallel if the child only depends on an output which is equivalent to an input.
Hopefully an example will make this clearer...

Imagine you're loading a user and their organization:

```graphql
{
  currentUser {
    id
    name
    friends {
      id
      name
    }
  }
}
```

You might have plan resolvers such as:

```ts
const objects = {
  Query: {
    plans: {
      currentUser() {
        const $currentUserId = context().get("userId");
        return loadOne($currentUserId, {
          load: batchGetUserById,
        });
      },
    },
  },
  User: {
    plans: {
      friends($user) {
        const $userId = $user.get("id");
        return loadMany($userId, batchGetFriendsByUserId);
      },
    },
  },
};
```

In its current state the system doesn't know that the `$user.get("id")` is
equivalent to the `context().get("userId")`, so this would result in a chained
fetch:

<Mermaid chart={`\
stateDiagram
  direction LR
  state "batchGetUserById" as currentUser
  state "batchGetFriendsByUserId" as friends
  [*] --> currentUser
  currentUser --> friends
`} />

However, we can indicate that the output of the `loadOne` step's `id` property
(`$user.get("id")`) is equivalent to its input (`context().get("userId")`):

```diff {6-7}
 const objects = {
   Query: {
     plans: {
       currentUser() {
         const $currentUserId = context().get("userId");
         return loadOne($currentUserId, {
           load: batchGetUserById,
+          ioEquivalence: "id",
         });
       },
     },
   },
   User: {
     plans: {
       friends($user) {
         const $userId = $user.get("id");
         return loadMany($userId, batchGetFriendsByUserId);
       },
     },
   },
 };
```

Now the access to `$user.get("id")` will be equivalent to
`context().get("userId")` - we no longer need to wait for the `$user` to load
in order to fetch the friends:

<Mermaid chart={`\
stateDiagram
  direction LR
  state "batchGetUserById" as currentUser
  state "batchGetFriendsByUserId" as friends
  [*] --> currentUser
  [*] --> friends
`} />

## Usage

```ts
// Simplified types
function loadOne(
  $lookup: Multistep,
  loader: LoadOneCallback | LoadOneLoader,
): Step;
```

`loadOne` accepts two arguments (both required):

- `$lookup` – the step (or [multistep](./multistep.md)) that specifies which
  records to load, or `null` if no data is required.
- `loader` – either a callback function or an object containing the callback and
  optional properties - see "Loader object" below.

:::info[`loader` should be defined in the root scope]

The `loader` argument (either a callback function or a loader object) should be
defined in the root scope (i.e. a "global" variable, such as an import), rather
than being defined inline at the callsite. This is important for several
reasons:

1. **Optimization via reference equality:** Gra*fast* uses `===` checks to
   optimize and deduplicate calls. If you define the `load` function inline,
   each call will have a different function reference, preventing optimization.
   By referencing a global function, multiple `loadOne` steps using the same
   loader can be optimized together.
2. **Configuration belongs with the loader:** The `ioEquivalence` property is a
   feature of the loader function itself, not of the callsite. It should hold
   for all `loadOne` calls using that function, so it makes sense to configure
   it alongside the function, rather than duplicating configuration inline each
   time. Similarly, the function typically needs the same `shared` information.
3. **Separation of concerns:** Keeping loader functions and their configuration
   separate from plan definitions helps maintain a clear distinction between
   planning (which relates to data flow and happens at planning time) and
   loading (which fetches data at execution time).

:::

### Passing multiple steps

There are three ways to input steps to loadOne:

- `$lookup` specifies the record to look up, e.g. via database identifiers
- `loader.shared` specifies resources common across all lookups, for example details
  of the currently logged in user, database or API clients, etc (these must be
  [unary steps](../index.mdx#unary-steps))
- `$loadOne.setParam(key, $value)` allows you to pass additional data to the
  load, such as filtering or ordering logic (`$value` must be a [unary step](../index.mdx#unary-steps))

Both `$lookup` and `loader.shared` support [multistep](./multistep.md), so if
they need multiple resources, you may pass them as a tuple or object of steps:

```ts
const $organizationId = $org.get("id");
const $membershipNumber = fieldArgs.get("membershipNumber");
const $person = loadOne(
  { orgId: $organizationId, num: $membershipNumber },
  getPersonByOrganizationIdAndMembershipNumber,
);
```

The callback might look something like:

```ts
async function getPersonByOrganizationIdAndMembershipNumber(lookups) {
  // Batch fetch all results
  const rows = await db.query(sql`
    select *
    from people
    where (organization_id, membership_number) in (
      select el->>'orgId', el->>'num'
      from json_array_elements(${sql.value(JSON.stringify(lookups))}) el
    )
  `);
  // Return the matching result for each tuple
  return lookups.map((lookup) =>
    rows.find(
      (record) =>
        record.organization_id === lookup.orgId &&
        record.membership_number === lookup.num,
    ),
  );
}
```

Params does not have multistep support (currently) but you can specify multiple
parameters so it shouldn't be needed.

:::tip[Use multistep, not `list()` and `object()` steps]

Rather than calling `loadOne(list([$a, $b]), loader)`, it's better to remove
the `list()` wrapper and pass the [multistep](./multistep.md) tuple directly:
`loadOne([$a, $b], loader)`. This multistep form is more ergonomic and concise,
but more importantly the runtime lookup values are deduplicated using exact
equality; loadOne's multistep support makes sure to return the same tuple for
the same list of runtime values, enabling more thorough deduplication and less
work for your business logic. The same goes for objects: prefer
`{ a: $a, b: $b }` over `object({ a: $a, b: $b })`.

:::

## Loader object

```ts
// Simplified types
interface LoadOneLoader<TLookup> {
  load: LoadOneCallback<TLookup>;
  name?: string;
  shared?: Thunk<TShared>;
  ioEquivalence?: IOEquivalence<TLookup>;
}
```

The loader object contains a `load` callback function and additional properties
that augment its behavior in Gra*fast*:

- `load` (required) – the callback function called with the values from lookup
  responsible for loading the associated records
- `shared` (optional) – a callback yielding a step or multistep to provide
  shared data/utilities to use across all inputs (e.g. database client, API
  credentials, etc). See [Shared step usage](#shared-step-usage) below
- `ioEquivalence` (optional, advanced) – a string, an array of strings, or a
  string-string object map used to indicate which attributes on output are
  equivalent to those on input; see [ioEquivalence usage](#ioequivalence-usage)
  below

### Shared

:::info

A unary step is a step that only ever represents one value, e.g. simple derivatives of `context()`, `fieldArgs`, or `constant()`.

:::

In addition to the forms seen in "Basic usage" above, you can pass an additional
`shared` step to `loadOne`. This step must be a [**unary
step**](../step-classes.mdx#addunarydependency), meaning that it must
represent exactly one value across the entire request (not a batch of values
like most steps), and is useful for representing values from the GraphQL context
or from input values (arguments, variables, etc).

```ts
const $userId = $post.get("author_id");
const $dbClient = context().get("dbClient");
const $user = loadOne($userId, {
  load: batchGetUserFromDbById,
  shared: $dbClient,
  // optional:
  ioEquivalence: "id",
});
```

Since we know it will have exactly one value, we can pass it into the
callback as a single value and our callback will be able to use it directly
without having to perform any manual grouping.

This shared dependency is useful for fixed values (for example, those from
GraphQL field arguments) and values on the GraphQL context such as clients to
various APIs and other data sources.

An example of the callback function might be:

```ts
async function batchGetUserFromDbById(ids, { attributes, shared }) {
  const dbClient = shared;

  const rows = await dbClient.query(
    sql`SELECT id, ${columnsToSql(attributes)} FROM users WHERE id = ANY($1);`,
    [ids],
  );

  return ids.map((id) => rows.find((row) => row.id === id));
}
```

### ioEquivalence

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

```ts title="Example for a list step"
const $member = loadOne([$organizationId, $userId], {
  load: batchGetMemberByOrganizationIdAndUserId,
  ioEquivalence: ["organization_id", "user_id"],
});

// - batchGetMemberByOrganizationIdAndUserId will be called with a list of
//   2-tuples, the first value in each tuple being the organizationId and the
//   second the userId.
// - Due to the io equivalence (2nd argument):
//   - `$member.get("organization_id")` will return `$organizationId` directly
//   - `$member.get("user_id")` will return `$userId` directly
```

```ts title="Example for an object step"
const $member = loadOne(
  { oid: $organizationId, uid: $userId },
  {
    load: batchGetMemberByOrganizationIdAndUserId,
    ioEquivalence: { oid: "organization_id", uid: "user_id" },
  },
);

// - batchGetMemberByOrganizationIdAndUserId will be called with a list of
//   objects; each object will have the key `oid` set to an organization id,
//   and the key `uid` set to the user ID.
// - Due to the io equivalence (2nd argument):
//   - `$member.get("organization_id")` will return the step used for `oid`
//     (i.e. `$organizationId`) directly
//   - Similarly `$member.get("user_id")` will return `$userId` directly
```

## Load callback

```ts
// Simplified types
type LoadOneCallback<TLookup, TItem> = (
  lookups: TLookup[],
  info: LoadOneInfo,
) => PromiseOrDirect<TData[]>;

interface LoadOneInfo {
  shared: UnwrapMultistep<TShared>;
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;
}
```

The `load` callback function is called with two arguments, the first is a list
of the values from the _specifier step_ `$lookup` and the second is options that
may affect the fetching of the records.

:::tip

For optimal results, we strongly recommend that the callback function is defined
in a common location so that it can be reused over and over again, rather than
defined inline. This will allow the underlying steps to optimize calls to this function.

:::

Within this definition of `callback`:

- `lookups` is the runtime values of each value that `$lookup` represented
- `options` is an object containing:
  - `shared`: the runtime value of the unary step that the `shared` callback
    returned (if any)
  - `attributes`: the list of keys that have been accessed via
    `$record.get('<key>')`
  - `params`: the params set via `$record.setParam('<key>', <value>)`

`lookups` is deduplicated using strict equality; the tuple and object forms of
[multistep](./multistep.md) will automatically generate the same lists/objects
from the same input values, so deduplication should work with these forms. (Any
unary values your load callback depends on should typically instead be passed
via `loader.shared` or `$loadOne.setParams(key, $unary)` as appropriate.)

`options.shared` is very useful to keep lookups simple (so that fetch
deduplication can work optimally) whilst passing in global values that you may
need such as a database or API client.

`options.attributes` is useful for optimizing your fetch - e.g. if the user
only ever requested `$record.get('id')` and `$record.get('avatarUrl')` then
there's no need to fetch all the other attributes from your datasource.

`options.params` can be used to pass additional context to your callback
function, perhaps options like "should we include archived records" or "should
we expand 'customer' into a full object rather than just returning the
identifier".

## Example

```ts title="plan.ts"
import { batchGetUserById } from "./businessLogic";

export function Post_author($post) {
  const $userId = get($post, "author_id");
  return loadOne($userId, batchGetUserById);
}
```

An example of the callback function might be:

```ts title="businessLogic.ts"
export const batchGetUserById = {
  name: "batchGetUserById",

  shared: () => ({ db: context().get("db") }),

  // Your business logic would be called here; e.g. this might be the same
  // function that your DataLoaders would call, except we can pass additional
  // information to it.
  async load(ids, { attributes, shared: { db } }) {
    // loadOne knows which columns are needed:
    const sqlColumns = columnsToSql(["id", ...attributes]);
    // DataLoader would have to select everything
    //  const sqlColumns = sql`*`

    const rows = await db.query(
      sql`
        SELECT ${sqlColumns}
        FROM users
        WHERE id = ANY($1);
      `,
      [ids],
    );

    // Ensure you return the same number of results, and in the same order!
    return ids.map((id) => rows.find((row) => row.id === id));
  },
};
```

[dataloader]: https://github.com/graphql/dataloader
