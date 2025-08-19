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

A `loadMany` step (technically a `LoadManyStep`) tracks:

- which attributes are accessed on returned records via `.get(attrName)`, and
- any parameters you set on the step via `.setParam(key, value)`.

Both are surfaced to your `load` callback (via `attributes` and `params`
respectively) so you can fetch only what you need.

### Input/output equivalence

If you (optionally) pass an `ioEquivalence` to `loadMany` you can declare which
output fields correspond to which input(s). This allows children to start
immediately when they only depend on those equivalent outputs.

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
        return loadMany($id, {
          load: batchGetUsersByOrganizationId,
        });
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

```diff {5-6}
 const objects = {
   Query: {
     plans: {
       usersByOrganizationId(_, { $id }) {
         return loadMany($id, {
           load: batchGetUsersByOrganizationId
+          ioEquivalence: "organization_id",
         });
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

Called as `loadMany($lookup, loader)`; `$lookup` is a step representing a
"lookup" value (identifying the records to look up) and `loader` is responsible
for loading the related records.

Here's a simplified form of the type signature:

```ts
/**
 * @template TLookup - type used to identify the record to look up (typically an
 * string/UUID/integer, but composite types are supported).
 * @template TItem - The type of each individual record returned.
 * @template TData - The type of the collection for one lookup (array or async
 * iterable of `TItem`, including nullability concerns).
 * @template TParams - The shape of the `params` object available in the `info`
 * argument - add params using `$loadMany.setParam(...)`, see below.
 * @template TShared - Optional shared data, typically API or database clients,
 * current user or session information, or other values shared by all entries in
 * the batch.
 */
function loadMany<TLookup, TItem, TData, TParams, TShared>(
  lookup: Step<TLookup> | Multistep,
  loader:
    | LoadManyLoader<TLookup, TItem, TData, TParams, TShared>
    | LoadManyCallback<TLookup, TItem, TData, TParams, undefined>,
): LoadManyStep<TLookup, TItem, TData, TParams, TShared>;

interface LoadManyLoader<TLookup, TItem, TData, TParams, TShared> {
  load: LoadManyCallback<TLookup, TItem, TData, TParams, TShared>;
  name?: string;
  shared?: Thunk<Step<TShared>>;
  ioEquivalence?: IOEquivalence<TLookup>;
  paginationSupport?: PaginationFeatures; // see "Pagination interop"
}

type LoadManyCallback<TLookup, TItem, TData, TParams, TShared> = (
  lookups: ReadonlyArray<TLookup>,
  info: LoadManyInfo<TItem, TParams, TShared>,
) => PromiseOrDirect<ReadonlyArray<TData>>;

interface LoadManyInfo<TItem, TParams, TShared> {
  attributes: ReadonlyArray<keyof TItem>;
  params: Partial<TParams>;
  shared: TShared;
}
```

:::tip Don't declare your `loader` inline

The `loader` function acts as a gateway between the Grafast plan execution and
your business logic; you should keep it in a centralized location so that it may
be used by multiple plan resolvers easily. This also allows for equivalent calls
to this same loader to be deduplicated for increased performance.

:::

Key points:

- **Arguments:** `loadMany($lookup, loader)` where `$lookup` is a **Multistep**
  (a `Step`, an array of `Step`s, or an object of `Step`s), and `loader` is
  either a function or an object `{ load, shared?, ioEquivalence?, paginationSupport?, name? }`.
- **Return type of `load`:** one result collection per lookup value. Each
  collection may be an array or an async iterable; items may be `null`:
  `PromiseOrDirect<ReadonlyArray<Maybe<ReadonlyArrayOrAsyncIterable<Maybe<TItem>>>>>`.
- **`info` arg for `load`:**
  - `shared`: resolved value from `loader.shared` (typically API/DB clients,
    current user/session details, etc)
  - `attributes`: the set of accessed keys (`keyof TItem`) that our children
    need
  - `params`: a **partial** map of params set via `.setParam(...)` (used to
    indicate pagination, filtering, etc)

### Simple usage

In our plan resolver we might load a user's friends like this:

```ts
const $userId = get($user, "id");
const $friends = loadMany($userId, friendsByUserId);
```

Where our `friendsByUserId` loader might be something like:

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

### Only requesting the required attributes

```ts
import { db } from "./db"; // Assume this is your database client

async function friendsByUserId(userIds, { attributes }) {
  // highlight-start
  // Only need to request the given `attributes` (being sure to avoid SQL
  // injection!)
  const sqlAttrs = attributes.map((attr) => sql`f.${sql.identifier(attr)}`);
  // highlight-end

  const rows = await db.query(sql`
    /* highlight-next-line */
    select u.id as _user_id, ${sql.join(sqlAttrs, ",")}
    from users u
    inner join friendships on (friendships.user_id = u.id)
    inner join users f on (f.id = friendships.friend_id)
    where u.id = any(${sql.value(userIds)})
  `);

  return userIds.map((id) => rows.filter((r) => r._user_id === id));
}
```

### Setting custom params

You can use `.setParam(key, value)` (where `value` may be a **unary** step, or a
static value) to pass parameters to your loader; this is typically used for
filtering, ordering, pagination and related concerns:

```ts
const $friends = loadMany($userId, friendsByUserId);
$friends.setParam("includeArchived", true); // appears in info.params.includeArchived
```

Your loader can access these params via the `info.params` object:

```ts
import { db } from "./db"; // Assume this is your database client

async function friendsByUserId(userIds, { attributes, params }) {
  const sqlAttrs = attributes.map((attr) => sql`f.${sql.identifier(attr)}`);

  const rows = await db.query(sql`
    select u.id as _user_id, ${sql.join(sqlAttrs, ",")}
    from users u
    inner join friendships on (friendships.user_id = u.id)
    inner join users f on (f.id = friendships.friend_id)
    where u.id = any(${sql.value(userIds)})
    /* highlight-next-line */
    and friendships.archived = ${sql.value(params.includeArchived ?? false)}
  `);

  return userIds.map((id) => rows.filter((r) => r._user_id === id));
}
```

### Shared step usage

You could use params to pass through things like a database client, user
credentials, etc - however since things like this are _always_ needed by your
loader, having to set them in each plan resolver is a chore. Instead, it makes
sense to centralize them alongside your loader. To do so, we'll change our
load callback into a loader object, and use the `shared` callback to
load the database client from the GraphQL context:

```ts
// NOTE: no longer need to import a global `db` client; we can get one with more
// specific permissions dedicated to this single GraphQL request.

const friendsByUserId = {
  name: "friendsByUserId",

  // Load the database client from the GraphQL context
  // highlight-next-line
  shared: () => context().get("dbClient"),

  // Our loader that batch loads all the friends for all the userIds
  // highlight-next-line
  async load(userIds, { attributes, params, shared: db }) {
    const sqlAttrs = attributes.map((attr) => sql`f.${sql.identifier(attr)}`);

    const rows = await db.query(sql`
      select u.id as _user_id, ${sql.join(sqlAttrs, ",")}
      from users u
      inner join friendships on (friendships.user_id = u.id)
      inner join users f on (f.id = friendships.friend_id)
      where u.id = any(${sql.value(userIds)})
      and friendships.archived = ${sql.value(params.includeArchived ?? false)}
    `);

    return userIds.map((id) => rows.filter((r) => r._user_id === id));
  },
};
```

## Callback details

```ts
const loader = {
  load: (lookups, info) => {
    // lookups: readonly array of resolved lookup values
    // info.shared: resolved shared value(s)
    // info.attributes: readonly array of accessed keys (keyof TItem)
    // info.params: Partial<TParams> including any `.setParam(...)` and pagination params
    return batch(lookups, info);
  },
  paginationSupport: { cursor: true, offset: true, reverse: true },
  shared: () => context().get("db"),
};
```

### ioEquivalence usage

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
const $posts = loadMany($userId, {
  load: friendshipsByUserIdCallback,

  // States that $post.get('user_id') should return $userId directly, since it
  // will have the same value.
  ioEquivalence: "user_id",
});
```

```ts title="Example for a list step"
const $posts = loadMany([$organizationId, $userId], {
  load: batchGetMemberPostsByOrganizationIdAndUserId,

  // States that:
  // - $post.get('organization_id') should return $organizationId directly, and
  // - $post.get('user_id') should return $userId directly
  ioEquivalence: ["organization_id", "user_id"],
});
```

```ts title="Example for an object step"
const $posts = loadMany(
  { oid: $organizationId, uid: $userId },
  {
    load: batchGetMemberPostsByOrganizationIdAndUserId,

    // States that:
    // - $post.get('organization_id') should return $organizationId directly (the value for the `oid` input), and
    // - $post.get('user_id') should return $userId directly (the value for the `uid` input
    ioEquivalence: { oid: "organization_id", uid: "user_id" },
  },
);
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
  - `info.params.limit`
  - `info.params.offset` (applied after `after` when cursors are used)
  - `info.params.after` (exclusive lower bound cursor; in reverse mode it behaves as “before”)
  - `info.params.reverse` (boolean)
- If you advertise `cursor: true` in `paginationSupport`, each returned item
  must include a stable `cursor: string` attribute which will be used verbatim
  by `connection()` to populate `edges { cursor }` and
  `pageInfo { startCursor endCursor }`.
- `fieldArgs` in `connection($step, { fieldArgs })` is the `fieldArgs` parameter
  from your plan resolver, and is assumed to represent arguments including the
  `first`, `last`, `before`, `after` and `offset` pagination arguments. This saves
  you from manually calling `$connection.setFirst(fieldArgs.getRaw('first'))` for
  each of the pagination arguments in turn.

:::warning Without `paginationSupport`, the entire list will be fetched

If you **don’t** set `paginationSupport`, `connection()` will handle cursors and
pagination for you, which requires the entire collection to be downloaded.

:::

## Attribute merging

`LoadManyStep`s that share the same `load` function **and** identical param
signatures automatically merge their `attributes` sets before execution to maximize
cache reuse (even if it means some requests will need to fetch more attributes
than strictly required).

[dataloader]: https://github.com/graphql/dataloader
