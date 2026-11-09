---
sidebar_position: 1
---

# pg-introspection

A strongly typed PostgreSQL introspection library built automatically from the
[PostgreSQL system catalog documentation](https://www.postgresql.org/docs/current/catalogs.html).
TypeScript documentation for each catalog attribute is available directly in
your editor.

## Usage

Call `introspect(options, runQuery)`. The callback receives SQL text and parameter
values, runs the query, and returns the `introspection` string from its single
result row. The library does not depend on a particular PostgreSQL client.

```js
import { introspect } from "pg-introspection";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://localhost:5432/my_database",
});

async function main() {
  try {
    const introspection = await introspect({}, async (text, values) => {
      const { rows } = await pool.query(text, values);
      return rows[0].introspection;
    });
    console.log(introspection.database.getDba()?.rolname);
  } finally {
    await pool.end();
  }
}

main();
```

The result includes navigation helpers for following catalog relationships.
For raw, cacheable data, use `introspectRaw` with the same arguments, then call
`augmentIntrospectionData(options, data)` to add navigation helpers. Pass the
same options used for introspection and clone cached data before augmentation:
augmentation mutates its input and rejects already-augmented data.

### Collections and filters

The experimental `onlyEntities` option selects which collections are returned.
It supports additional catalogs such as `settings`, `triggers` and
`foreign_servers`. In single-query mode, required collections must also be
selected; for example, `classes` requires `namespaces`, and `attributes` requires
`classes`. Multipass includes required collections internally when building its
initial query, but only returns the selected collections.
TypeScript tracks the selected collections in the result. Navigation helpers
that need an omitted collection throw an error when called.

Top-level `filters` apply to the single introspection query by default, or to
every query when multipass is enabled:

```js
const options = {
  onlyEntities: ["namespaces", "classes", "attributes"],
  filters: { namespaces: "nspname in ('app_public', 'app_private')" },
};
```

Filters are trusted SQL predicates keyed by collection name and combined with
the library's catalog predicates using AND. Never interpolate untrusted input.

### Multipass introspection

Set `multipass` to an options object to enable incremental dependency discovery.
`multipass.entrypointFilters` restrict initial discovery; unlike top-level
`filters`, they allow policies to fetch dependencies outside that selection.
`multipass.onlyAccessible` filters initial resources by role privileges, and
`multipass.policies` describes which relationships to follow. There are no
default relationship policies. Top-level `prune` can remove unwanted raw objects
or hide resources while retaining their dependency data, in either mode.

See the [multipass introspection guide](./multipass.md)
for a complete policy example, purposes, permission filtering and pruning.

## Raw data and caching

`introspectRaw(options, runQuery)` returns plain data without navigation helpers.
Use it to cache introspection results, then augment a fresh clone for each
consumer:

```js
import { augmentIntrospectionData, introspectRaw } from "pg-introspection";

async function introspectForCache(options, runQuery) {
  const data = await introspectRaw(options, runQuery);
  const introspection = augmentIntrospectionData(
    options,
    structuredClone(data),
  );
  return { data, introspection };
}
```

Pass the same options to augmentation as to introspection. Augmentation mutates
the supplied data and cannot be applied twice to the same object.

## Migrating the manual query pattern

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated in favour of `introspect` or `introspectRaw`. The legacy query
builder retains its zero-argument signature. Use the new APIs for
`onlyEntities` and `filters`.

Replace:

```js
const { rows } = await client.query(makeIntrospectionQuery());
const introspection = parseIntrospectionResults(rows[0].introspection);
```

with:

```js
const introspection = await introspect({}, async (text, values) => {
  const { rows } = await client.query(text, values);
  return rows[0].introspection;
});
```

For selected collections, use
`augmentIntrospectionData(options, JSON.parse(value))` to add helpers rather
than the legacy parser, which assumes the default collections.

To preserve the legacy parser's default extension exclusions, import
`pruneExtensionResources` and set `prune: pruneExtensionResources` in the
options. Omit `prune` or set it to `null` to match
`parseIntrospectionResults(value, true)`. With raw caching, pass the same options
to `introspectRaw` and `augmentIntrospectionData`; the retained dependency data
survives both JSON serialization and `structuredClone`.

See [Accessors](./accessors.md) for navigation helpers and
[Naming](./naming.md) for the relationship to PostgreSQL catalog names.
