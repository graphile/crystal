# pg-introspection

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/BSky-@Graphile.org-006aff.svg)](https://bsky.app/profile/graphile.org)
[![Follow](https://img.shields.io/badge/Mastodon-@Graphile.fosstodon.org-6364ff.svg)](https://fosstodon.org/@graphile)

A strongly-typed PostgreSQL introspection library for PostgreSQL built
automatically from the
[PostgreSQL system catalog documentation](https://www.postgresql.org/docs/current/catalogs.html),
with the TypeScript documentation for each attribute/type also pulled from the
PostgreSQL documentation for easy reference directly in your editor.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Usage

Use `introspect` with a query callback returning the first row's `introspection`
string. The library does not depend on a particular PostgreSQL client.

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

The result includes navigation helpers for following catalog relationships. For
raw, cacheable data, use `introspectRaw` with the same arguments, then call
`augmentIntrospectionData(options, data)` to add navigation helpers. Pass the
same options used for introspection and clone cached data before augmentation:
augmentation mutates its input and rejects already-augmented data.

### Collections and filters

The experimental `onlyEntities` option selects which collections are returned.
It supports additional catalogs such as `settings`, `triggers` and
`foreign_servers`. Required collections must also be selected; for example,
`classes` requires `namespaces`, and `attributes` requires `classes`.

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
after fetching in either mode, before navigation lookups are built.

See the
[multipass introspection guide](https://star.graphile.org/pg-introspection/multipass)
for a complete policy example, purposes, permission filtering and pruning.

### Migrating existing code

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated. Replace the manual query/parse sequence with the `introspect`
callback shown above. The legacy query builder retains its zero-argument
signature. Use the new APIs for `onlyEntities` and `filters`, and
`augmentIntrospectionData` when working with selected collections.

## Accessors

Navigation helpers make following catalog relationships easier. Augmentation
builds indexes for looking up related objects; some derived values are computed
lazily and cached for subsequent calls.

Examples:

```js
const myTable = introspection.classes.find((rel) => rel.relname === "my_table");
const myTableAttributes = myTable.getAttributes();
const myColumn = myTable.getAttribute({ name: "my_column" });
const myColumnDescription = myColumn.getDescription();
```

You can use the TypeScript autocompletion to see what accessors are available,
or look in the `index.ts` file.

## Naming

Using the PostgreSQL column names is _by design_, even though some are hard to
read if you're not familiar with the system catalog.

We use `_id` rather than `oid` because older versions of PostgreSQL did not
explicitly list the `oid` columns when you `select * from` so we explicitly list
them among the selection set.
