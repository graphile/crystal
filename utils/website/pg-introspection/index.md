---
sidebar_position: 1
---

# pg-introspection

A strongly typed PostgreSQL introspection library built automatically from the
[PostgreSQL system catalog documentation](https://www.postgresql.org/docs/current/catalogs.html).
TypeScript documentation for each catalog attribute is available directly in
your editor.

## Usage

Call `introspect(options, runQuery)`.

```ts
import { introspect } from "pg-introspection";
import { runQuery } from "./runQuery.ts";

const introspection = await introspect({}, runQuery);
console.log(introspection.database.getDba()?.rolname);
```

The result includes navigation helpers for following catalog relationships.
For raw, cacheable data, use `introspectRaw` with the same arguments, then call
`augmentIntrospectionData(options, data)` to add navigation helpers. Pass the
same options used for introspection and clone cached data before augmentation:
augmentation mutates its input and rejects already-augmented data.

See [Accessors](./accessors.md) for navigation helpers and
[Naming](./naming.md) for the relationship to PostgreSQL catalog names.

### V2 migration

If you were using the deprecated `makeIntrospectionQuery` and
`parseIntrospectionResults` functions, see [Migrating v1 to v2](./v1-to-v2.md)
for a migration guide.

## runQuery

This library does not make connections to PostgreSQL on its own, to do so you
pass a `runQuery` callback. This callback is given SQL text and parameter values
and, using your database driver of choice, should execute the query against the
database and return the `introspection` column from its single result row.
Here's an example `runQuery` using the `pg` module:

```ts
// runQuery.ts
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

export async function runQuery(text: string, values: unknown[]) {
  const { rows } = await pool.query<{ introspection: string }>(text, values);
  return rows[0].introspection;
}
```

## `options`

Out of the box pg-introspection sets the options it thinks are generally useful
for many applications; however you can pass various options to influence
pg-introspection's behaviors. For example, if you only need to know about
certain types of entities (tables and columns, for example) you can use
`onlyEntities`, or if you want to minimize the amount of data returned from
introspection (at the cost of potentially more than one query to the database)
you can use `multipass`.

Any SQL you pass via options is treated as trusted; it is simply interpolated so
do not feed any untrusted input into it or you risk SQL injection.

### `onlyEntites`

The experimental `onlyEntities` option selects which collections are returned;
if not provided a default set of collections that are useful for many
applications are selected, passing the option allows adding additional catalogs
such as `settings`, `triggers` and `foreign_servers`. TypeScript tracks the
selected collections, so the result you receive is type safe. Navigation helpers
that need an omitted collection throw an error when called.

In the default single-query mode, required collections must be explicitly
selected; for example, `classes` requires `namespaces`, and `attributes`
requires `classes`. Multipass automatically includes required collections
internally, but only returns the selected collections.

```ts
const options = {
  onlyEntities: ["namespaces", "classes", "attributes"],
};
```

### `filters`

These trusted SQL predicates apply to every fetch, strictly limiting what can be
returned. You should use them sparingly, it's more likely that you want
multipass introspection with `multipass.entrypointFilters`.

```ts
const options = {
  filters: { namespaces: "nspname in ('public', 'app')" },
};
```

### prune

`prune` can remove unwanted raw objects or hide resources while retaining their
dependency data; it's useful for limiting the size of the introspection object;
but more important for that is `multipass`.

### `multipass`

Set `multipass` to an options object to enable multipass introspection
(incremental dependency discovery). This is hugely impactful if minimizing the
amount of data returned from introspection is critical to your use case.

Multipass introspection works by selecting a very narrow set of data (limited
via `multipass.entrypointFilter`) and then "spidering out" from that starting
point (via `multipass.policies`) to select the required supporting data. If you
enable `multipass.onlyAccessible` it will even respect database permissions and
only return the details of things accessible to the given role (see caveats
below).

For example, you might wish to introspect your schema `app`, but there's a
`create function app.my_func() returns setof utils.some_type`. If you strictly only
introspect the `app` schema then you cannot fully understand `app.my_func`
because you have no details about its return type, but if you introspect the
`utils` schema too then you're pulling down a lot more information than you
need. Multipass solves this problem via a policy: when a function is returned,
make sure we also fetch its return type.

See the [multipass introspection guide](./multipass.md)
for a complete policy example, purposes, permission filtering and pruning.

#### `multipass.entrypointFilters`

`multipass.entrypointFilters` restrict initial discovery; unlike top-level
`filters`, they allow policies to fetch dependencies outside that selection. The
value for this setting is a string-string map from collection name to the
trusted SQL predicates to use when performing the initial query against this
collection.

#### `multipass.onlyAccessible`

`multipass.onlyAccessible` filters resources by role privileges; however
it tends to do this in a very lenient way. For example, if you do not have
access to the `private.some_table` table, but you do have access to a `function
app.best_some_tables() returns setof private.some_table`, then the details of
`private.some_table` may be selected nonetheless. Essentially this is an
optimization to help reduce unnecessary introspection data, not a hard-and-fast
permissions system.

#### `multipass.policies`

`multipass.policies` describes which relationships to follow after each
introspection pass. There are no default relationship policies.

See the [multipass introspection guide](./multipass.md)
for a complete policy example, purposes, permission filtering and pruning.

## Raw data and caching

`introspectRaw(options, runQuery)` returns plain data without navigation helpers.
Use it to cache introspection results, then augment a fresh clone for each
consumer:

```ts
import type { IntrospectionData, IntrospectOptions } from "pg-introspection";
import { augmentIntrospectionData, introspectRaw } from "pg-introspection";
import { runQuery } from "./runQuery.ts";

// You might cache elsewhere; WeakMap is just an example.
const cache = new WeakMap<IntrospectOptions, Promise<IntrospectionData>>();
async function introspectForCache(options) {
  let promise = cache.get(options);
  if (promise == null) {
    promise = introspectRaw(options);
    cache.set(options, promise);
  }
  const rawData = await promise;
  // Augmenting mutates the incoming data, so always clone the cached data
  // before augmenting
  const data = structuredClone(rawData);
  return augmentIntrospectionData(options, data);
}
```

Pass the same options to augmentation as to introspection. Augmentation mutates
the supplied data and cannot be applied twice to the same object.
