---
toc_max_heading_level: 4
---

import Mermaid from "@theme/Mermaid";

# loadMany

Similar to [DataLoader][]'s load method, uses the given callback function to
read many results from your business logic layer. To load just one, see
[`loadOne`](./loadOne.md).

## Simple usage

In our plan resolver we might load a user's friends like this:

```ts
function User_friends($user) {
  const $userId = get($user, "id");
  return loadMany($userId, friendsByUserId);
}
```

Where our `friendsByUserId` loader might be the same one that we would use with
DataLoader; here's a fictional example of how it might look:

```ts
import { db } from "./db"; // Assume this is your database client

// This could be the same callback you use with DataLoader!
async function friendsByUserId(userIds) {
  const rows = await db.query(sql`
    select u.id as _user_id, f.*
    from users u
    inner join friendships on (friendships.user_id = u.id)
    inner join users f on (f.id = friendships.friend_id)
    where u.id = any(${sql.value(userIds)})
  `);

  // Return an array of arrays, where each inner array contains the friends
  // for the respective userId we were passed.
  return userIds.map((id) => rows.filter((r) => r._user_id === id));
}
```

:::tip[Don't declare your `loader` inline]

The `loader` function acts as a gateway between the Grafast plan execution and
your business logic; you should keep it in a centralized location so that it may
be used by multiple plan resolvers easily. This also allows for equivalent calls
to this same loader to be deduplicated for increased performance.

:::

## Enhancements over DataLoader

Thanks to the planning system in Gra*fast*, `loadMany` can expose features that
are not possible in DataLoader.

### Only requesting the required attributes

One such feature is the ability to only request the attributes that are read
by our downstream consumers. The list of requested attributes are automatically
passed to your `load` callback via `attributes` property of the `info` object
passed as the second argument to your load callback.

Here's the previous example modified so we only request the needed attributes:

```ts
import { db } from "./db"; // Assume this is your database client

async function friendsByUserId(userIds, info) {
  // Only request the required columns (and avoid SQL injection!)
  // highlight-next-line
  const columns = info.attributes.map((attr) => sql.identifier("f", attr));
  const rows = await db.query(sql`
    /* highlight-next-line */
    select u.id as _user_id, ${sql.join(columns, ",")}
    from users u
    inner join friendships on (friendships.user_id = u.id)
    inner join users f on (f.id = friendships.friend_id)
    where u.id = any(${sql.value(userIds)})
  `);

  return userIds.map((id) => rows.filter((r) => r._user_id === id));
}
```

### Setting custom params

Another feature that we can do easily with Gra*fast* is to pass parameters to
our loader via `.setParam(key, value)` (where `value` may be a **unary** step,
or a static value) in order to handle common concerns such as filtering,
ordering, pagination and so on:

```ts
function User_friends($user, fieldArgs) {
  const $userId = get($user, "id");
  const $friends = loadMany($userId, friendsByUserId);
  // highlight-start
  // Appears in info.params.includeArchived
  $friends.setParam("includeArchived", fieldArgs.$includeArchived);
  // highlight-end
  return $friends;
}
```

Your loader can access these params via the `info.params` object:

```ts
import { db } from "./db"; // Assume this is your database client

async function friendsByUserId(userIds, info) {
  const columns = info.attributes.map((attr) => sql.identifier("f", attr));
  const rows = await db.query(sql`
    select u.id as _user_id, ${sql.join(columns, ",")}
    from users u
    inner join friendships on (friendships.user_id = u.id)
    inner join users f on (f.id = friendships.friend_id)
    where u.id = any(${sql.value(userIds)})
    /* highlight-next-line */
    and friendships.archived = ${sql.value(info.params.includeArchived ?? false)}
  `);

  return userIds.map((id) => rows.filter((r) => r._user_id === id));
}
```

### Shared step usage

You could use params to pass through things like a database client, user
credentials, etc - however since things like this are _always_ needed by your
loader, having to set them in each plan resolver is a chore. Instead, it makes
sense to centralize them alongside your loader. To do so, we can change our load
callback into a loader object, and use the `shared` callback to retrieve the
database client from the GraphQL context:

```ts
const friendsByUserId = {
  name: "friendsByUserId",

  // Load the request-specific database client from the GraphQL context
  // highlight-next-line
  shared: () => context().get("dbClient"),

  async load(userIds, info) {
    // highlight-next-line
    const db = info.shared;

    const columns = info.attributes.map((attr) => sql.identifier("f", attr));
    const rows = await db.query(sql`
      select u.id as _user_id, ${sql.join(columns, ",")}
      from users u
      inner join friendships on (friendships.user_id = u.id)
      inner join users f on (f.id = friendships.friend_id)
      where u.id = any(${sql.value(userIds)})
      and friendships.archived = ${sql.value(info.params.includeArchived ?? false)}
    `);

    return userIds.map((id) => rows.filter((r) => r._user_id === id));
  },
};
```

### Input/output equivalence

Another attribute you may add to the loader object is `ioEquivalence`. This
allows you to declare which output fields correspond to which input(s). This
allows children to start immediately when they only depend on those equivalent
outputs, rather than having to wait for the parent step to finish loading.

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
const objects = {
  Query: {
    plans: {
      usersByOrganizationId(_, { $id }) {
        return loadMany($id, batchGetUsersByOrganizationId);
      },
    },
  },
  User: {
    plans: {
      organization($user) {
        const $orgId = $user.get("organization_id");
        return loadOne($orgId, batchGetOrganizationById);
      },
    },
  },
};

const batchGetUsersByOrganizationId = {
  async load(organizationIds) {
    /* your fetch logic here */
  },
};
```

In its current state the system doesn't know that the
`$user.get("organization_id")` is equivalent to the `id` argument to our
`usersByOrganizationId` field, so this would result in a chained fetch:

<Mermaid chart={`\
stateDiagram
  direction LR
  state "$id" as Z
  state "batchGetUsersByOrganizationId" as A
  state "batchGetOrganizationById" as B
  Z --> A
  A --> B: .get("organizationId")
`} />

However, we can indicate that the output of the `loadMany` step's records'
`organization_id` property (`$user.get("organization_id")`) is equivalent to its input
(`$id`):

```ts
const batchGetUsersByOrganizationId = {
  // highlight-next-line
  ioEquivalence: "organization_id",
  async load(organizationIds) {
    /* your fetch logic here */
  },
};
```

Now the access to `$user.get("organization_id")` will return a step equivalent
to the `Query.usersByOrganizationId(id:)` argument (the `id` argument on the
`usersByOrganizationId` field on the `Query` type); thus Gra*fast* does not need
to load the users in order to fetch their organization - it can fetch both in
parallel:

<Mermaid chart={`\
stateDiagram
  direction LR
  state "$id" as Z
  state "batchGetUsersByOrganizationId" as A
  state "batchGetOrganizationById" as B
  Z --> A
  Z --> B
`} />

## Usage

```ts
function loadMany(
  lookup: TLookup,
  loader: LoadManyCallback | LoadManyLoader,
): Step;
```

`loadMany` accepts two arguments (both required):

- `lookup` – the step (or multistep) that specifies which records to look up, or
  `null` if no data is required.
- `loader` – either a callback function or an object containing the callback and
  optional properties - see "Loader object" below.

:::info[`loader` should be a global variable]

The `loader` argument (either a callback function or a loader object) should be
passed as a reference from a global variable (such as an import), rather than
being defined inline at the callsite. This is important for several reasons:

1. **Optimization via reference equality:** Grafast uses `===` checks to
   optimize and deduplicate calls. If you define the `load` function inline,
   each call will have a different function reference, preventing optimization.
   By referencing a global function, multiple `loadMany` steps using the same
   loader can be optimized together.
2. **Configuration belongs with the loader:** The `ioEquivalence` property is a
   feature of the loader function itself, not of the callsite. It should hold
   for all `loadMany` calls using that function, so it makes sense to configure
   it alongside the function, rather than duplicating configuration inline each
   time. Similarly, the function typically needs the same `shared` information
   and pagination support.
3. **Separation of concerns:** Keeping loader functions and their configuration
   separate from plan definitions helps maintain a clear distinction between
   planning (which relates to data flow and happens at planning time) and
   loading (which fetches data at execution time).

:::

### Loader object

```ts
interface LoadManyLoader {
  load: LoadManyCallback;
  name?: string;
  shared?: Thunk<TShared>;
  ioEquivalence?: IOEquivalence<TLookup>;
  paginationSupport?: PaginationFeatures; // see "Pagination interop"
}
```

The loader object contains a `load` callback function and additional properties
that augment its behavior in Grafast:

- `load` (required) – the callback function called with the values from lookup
  responsible for loading the associated records
- `shared` (optional) – a thunk (callback) yielding a step or multistep to
  provide shared data/utilities to use across all inputs (e.g. database client,
  API credentials, etc)
- `ioEquivalence` (optional, advanced) – a string, an array of strings, or a
  string-string object map used to indicate which attributes on output are
  equivalent to those on input
- `paginationSupport` (optional) – enables pagination interop with
  `connection()`

## Load callback

```ts
type LoadManyCallback = (
  lookups: TLookup[],
  info: LoadManyInfo,
) => PromiseOrDirect<TResult[]>;

interface LoadManyInfo {
  shared: UnwrapMultistep<TShared>;
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;
}
```

Whether passed directly or specified in a loader object, the `load` callback
will be passed two arguments: `lookups` and `info`, and it must return
one result collection per lookup value. Each
collection may be an array or an async iterable; items may be `null`:
`PromiseOrDirect<ReadonlyArray<Maybe<ReadonlyArrayOrAsyncIterable<Maybe<TItem>>>>>`.

The lookups argument is a readonly array of resolved lookup values.

The `info` argument contains additional metadata about the request:

- `attributes`: the set of accessed keys (`keyof TItem`) that our children
  need
- `params`: a map of params set via `.setParam(...)` (used to indicate
  pagination, filtering, etc)
- `shared`: the resolved value from `loader.shared` (typically API/DB clients,
  current user/session details, etc) - can only be populated if specified via a
  loader object

## Loader object

```ts
const loader = {
  // Purely cosmetic, for plan diagrams/debugging.
  name: "myLoaderName",

  // Optimization: if you know that parts of the output will be equivalent to
  // parts of the input
  ioEquivalence: null,

  // Get access to any shared values your loader will need
  shared: () => context().get("db"),

  // Only set this if you actually support these features!
  // paginationSupport: { cursor: true, offset: true, reverse: true },

  async load(lookups, info) {
    // lookups: readonly array of resolved lookup values

    // info.attributes: readonly array of accessed keys (keyof TItem)
    const attributes = info.attributes;

    // info.params: Partial<TParams> including any `.setParam(...)` and pagination params
    // Extract `paginationSupport`-related parameters:
    const { reverse, limit, offset, after } = info.params;

    // info.shared: resolved shared value(s)
    const db = info.shared;

    const resultsByLookup = await db.lookUpTheThings(lookups, {
      attributes,
      pagination: {
        reverse,
        limit,
        offset,
        after,
      },
    });

    return lookups.map((lookup) => resultsByLookup.get(lookup));
  },
};
```

### ioEquivalence

```ts
type IOEquivalence<TSpec> =
  | null
  | string
  | { [key in Exclude<keyof TSpec, keyof any[]>]?: string | null };
```

The `ioEquivalence` optional parameter can accept the following values:

- `null` to indicate no input/output equivalence
- a string to indicate that the same named property on the output is equivalent
  to the lookup value
- if the lookup was an array, an array containing a list of keys (or
  null for no relation) on the output that are equivalent to the same entry in the
  input
- if the lookup was an object, an object that maps between the attributes of the
  object and the key(s) in the output that are equivalent to the given entry on
  the input

```ts title="Example for a scalar step"
const $posts = loadMany($userId, friendshipsByUserId);
const friendshipsByUserId = {
  load: batchGetFriendshipsByUserId,

  // States that $post.get('user_id') should return $userId directly, since it
  // will have the same value.
  ioEquivalence: "user_id",
};
```

```ts title="Example for a list step"
const $posts = loadMany(
  [$organizationId, $userId],
  memberPostsByOrganizationIdAndUserId,
);
const memberPostsByOrganizationIdAndUserId = {
  load: batchGetMemberPostsByOrganizationIdAndUserId,

  // States that:
  // - $post.get('organization_id') should return $organizationId directly, and
  // - $post.get('user_id') should return $userId directly
  ioEquivalence: ["organization_id", "user_id"],
};
```

```ts title="Example for an object step"
const $posts = loadMany(
  { oid: $organizationId, uid: $userId },
  memberPostsByOrganizationIdAndUserId,
);
const memberPostsByOrganizationIdAndUserId = {
  load: batchGetMemberPostsByOrganizationIdAndUserId,

  // States that:
  // - $post.get('organization_id') should return $organizationId directly (the value for the `oid` input), and
  // - $post.get('user_id') should return $userId directly (the value for the `uid` input
  ioEquivalence: { oid: "organization_id", uid: "user_id" },
};
```

## Pagination interop with `connection()`

You can combine `loadMany` with `connection()`:

```ts
function User_friends($user, fieldArgs) {
  const $userId = $user.get("id");
  const $friends = loadMany($userId, friendsByUserId);
  return connection($friends, { fieldArgs });
}
```

- If your loader object includes `paginationSupport` (even `{}`), the
  `LoadManyStep` exposes GraphQL pagination to your `load` via `info.params`,
  thereby setting:
  - `info.params.limit`: number of records to fetch, or null for no limit
  - `info.params.offset`: number of records to skip past, or null to not skip (applied after `after` when cursors are used)
  - `info.params.after`: exclusive lower bound cursor normally, or exclusive upper bound cursor in reverse mode, if specified
  - `info.params.reverse`: whether the other parameters should be applied
    backwards from the end rather than forwards from the start of the collection
- If you advertise `cursor: true` in `paginationSupport`, each returned item
  must include a stable `cursor: string` attribute which will be used verbatim
  by `connection()` to populate `edges { cursor }` and
  `pageInfo { startCursor endCursor }`.
- `fieldArgs` in `connection($step, { fieldArgs })` is the `fieldArgs` parameter
  from your plan resolver, and is assumed to represent arguments including the
  `first`, `last`, `before`, `after` and `offset` pagination arguments. This saves
  you from manually calling `$connection.setFirst(fieldArgs.getRaw('first'))` for
  each of the pagination arguments in turn.

:::warning[Without `paginationSupport`, the entire list will be fetched]

If you **don’t** set `paginationSupport`, `connection()` will handle cursors and
pagination for you, which requires the entire collection to be downloaded.

:::

## Attribute merging

`LoadManyStep`s that share the same `load` function **and** identical param
signatures automatically merge their `attributes` sets before execution to maximize
cache reuse (even if it means some requests will need to fetch more attributes
than strictly required).

[dataloader]: https://github.com/graphql/dataloader
