---
sidebar_position: 4
---

# Multipass introspection

Multipass introspection discovers an initial set of catalog objects, then follows
consumer-defined dependency policies. It reduces the amount of data fetched and
retained when only part of a database is relevant, such as selected schemas or
resources accessible to a particular role.

Enable it by passing an options object as `multipass` to `introspect` or
`introspectRaw`. Omit `multipass` or set it to `false` for a single query.

## Discovery and dependencies

1. The initial query discovers objects using the selected collections, catalog
   predicates, filters and optional privilege checks. Each initial row receives
   the built-in `initial` purpose.
2. Policies inspect those rows and request other catalog objects, recording why
   each dependency is needed with one or more purposes.
3. Requests are batched into further queries. Matching objects are deduplicated
   and their purposes accumulate. Policies run on newly discovered rows and
   rerun when relevant purposes are added.
4. Discovery finishes when there are no outstanding requests or new purposes.
   An optional pruning callback then removes unwanted objects.

There are no default relationship policies. `multipass: {}` performs initial
discovery without following additional relationships. `onlyEntities` controls
both returned collections and which collections policies can request; requests
for unselected collections are ignored. Include any collections needed by your
navigation helpers, as described in [Usage](./index.md#collections-and-filters).

## A policy example

This example discovers procedures and types in `app_public` and fetches their
return types even when those types belong to other schemas. It intentionally
follows only procedure return types; applications needing composite attributes,
domains, arrays or other relationships must supply policies for those too.

```ts
import { defineIntrospectionPolicy, introspectRaw } from "pg-introspection";
import { Pool } from "pg";

declare global {
  namespace PgIntrospection {
    interface PurposeRegistry {
      procedureReturnType: true;
    }
  }
}

const returnTypes = defineIntrospectionPolicy({
  name: "procedureReturnTypes",
  entity: "procs",
  select(proc, details) {
    if (!details.hasPurpose("initial")) {
      return;
    }
    details.request("types", { _id: proc.prorettype }, ["procedureReturnType"]);
  },
});

const pool = new Pool({
  connectionString: "postgres://localhost/my_database",
});

async function main() {
  try {
    const data = await introspectRaw({
      runQuery,
      onlyEntities: ["namespaces", "procs", "types"],
      multipass: {
        entrypointFilters: { namespaces: "nspname = 'app_public'" },
        policies: [returnTypes],
      },
    });
    console.log(data.procs.length, data.types.length);
  } finally {
    await pool.end();
  }
}

main();
```

`defineIntrospectionPolicy` infers the source row's type from `entity`. Every
policy has a unique, non-empty `name`, a source collection and a synchronous
`select` function. Call `details.request(entity, match, purposes)` to request
dependencies; the return value of `select` is ignored.

Each request specifies a target `entity`, a non-empty `match` object of catalogue
column equalities, and a non-empty `purposes` list. Values in `match` must match
the selected columns' types, must not be null, and are sent as query parameters.
Use `_id` to request an object whose OID has that alias, or a catalog column such
as `attrelid` to request a group of rows:

```ts
const tableAttributes = defineIntrospectionPolicy({
  name: "tableAttributes",
  entity: "classes",
  select(table, details) {
    details.request("attributes", { attrelid: table._id }, ["initial"]);
  },
});
```

Include `attributes` in `onlyEntities` when using this policy. The initial query
already includes attributes for initial tables when that collection is selected;
the policy also requests attributes for tables discovered later.

Requests for OID zero are ignored where zero means there is no referenced
object. Zero remains valid for columns where it has another meaning, such as
`descriptions.objsubid` for a description of the object itself.

## Purposes and predictable expansion

Extend `PgIntrospection.PurposeRegistry` to name the reasons your application
needs objects. A row can be needed for several reasons: for example, a table
used as a procedure's return type can require different information from a table
exposed as a queryable resource.

Custom purposes must be registered in `PgIntrospection.PurposeRegistry` for
TypeScript to accept them. The built-in `initial` purpose is already registered.
Policies do not declare a list of purposes: calls to `details.hasPurpose` track
which missing purposes would cause a policy to run again.

Policies run once when a row is first discovered. Use `hasPurpose` guards when
behaviour depends on a reason for discovery. Whenever `hasPurpose` returns
`false`, the policy subscribes to that missing purpose for the row. Subsequently,
the policy reruns only when a subscribed purpose becomes available. Requests
immediately propagate purposes to matching rows already in memory. A query is
still needed if the selector could match additional rows that have not yet been
fetched; complete selectors and unique selectors with a known match need no
further query.

Purposes only accumulate. A new purpose must add requirements rather than revoke
earlier ones. Policy output must depend only on its row, inspected purposes and
fixed configuration. Do not mutate rows or use mutable closure state to decide
what to request. `details.catalogByOid` maps catalogue OIDs to catalogue names
such as `pg_class`. Treat this shared metadata as read-only.

To make a request terminal, emit a purpose for which the target policies request
no further dependencies. In the return-type example, no policy follows types,
so the requested return types do not cause further expansion.

## Global filters and entrypoint filters

| Option                        | Initial query | Dependency queries |
| ----------------------------- | ------------- | ------------------ |
| `filters`                     | Applied       | Applied            |
| `multipass.entrypointFilters` | Applied       | Not applied        |

Both accept trusted SQL predicates keyed by collection name. Predicates use the
underlying catalogue's column names; use `oid` in SQL and the collection's OID
field (`_id` for most collections) in request selectors. Never interpolate
untrusted input into SQL predicates.

Use top-level `filters` for restrictions that must hold for every fetched row.
They also work in single-pass mode with `introspect` and `introspectRaw`. Use
`entrypointFilters` for the initial scope, such as selecting schemas, while
allowing policies to request dependencies outside it. When both specify the
same collection, the initial query combines their predicates with AND.

An entrypoint-filtered collection is not treated as complete when a dependency
policy requests matching rows. Other complete initial collections retain their
optimisation, so following a relationship already covered by the initial query
does not require fetching it again.

### Extension-owned resources

The new introspection APIs retain extension-owned resources. Applications that
exclude them from initial discovery can supply entrypoint filters while allowing
policies to fetch extension objects needed by user resources:

```js
const notExtension = (catalog, oid) =>
  `not exists (
    select 1 from pg_catalog.pg_depend d
    where d.classid = 'pg_catalog.${catalog}'::regclass
      and d.objid = ${oid}
      and d.refclassid = 'pg_catalog.pg_extension'::regclass
      and d.deptype = 'e'
  )`;

const extensionFilters = {
  classes: notExtension("pg_class", "pg_class.oid"),
  procs: notExtension("pg_proc", "pg_proc.oid"),
  types: `(typrelid = 0 or ${notExtension("pg_class", "typrelid")})`,
};

const options = {
  multipass: {
    entrypointFilters: extensionFilters,
    policies: [
      /* application relationship policies */
    ],
  },
};
```

The helper's arguments must be trusted catalog identifiers and expressions.
To apply these restrictions to a single query, pass `extensionFilters` as
top-level `filters` instead. Top-level filters also prevent multipass dependency
queries from fetching excluded objects, so use entrypoint filters when those
dependencies must remain available.

Filtering initial discovery does not distinguish exposed resources from
dependencies in the returned collections. Consumers must decide which fetched
objects to expose.

Use the shared pruning callback to preserve the legacy distinction between
exposed resources and dependency metadata:

```js
import { pruneExtensionResources } from "pg-introspection";

const options = {
  prune: pruneExtensionResources,
};
```

Pass these options to `introspect`, or to both `introspectRaw` and
`augmentIntrospectionData` when caching raw data. The callback hides
extension-owned functions, tables and views, together with their attributes,
constraints and row types. It does not hide standalone extension types such as
`citext` or `geometry`. It uses the `depends` collection to identify extension
ownership. Include `depends` when specifying `onlyEntities`. In multipass mode,
your policies must also fetch extension-ownership dependencies for resources
discovered after the initial query if those resources need to be hidden.

Hidden rows move into the raw result's `hidden` section. They survive JSON
serialization and `structuredClone`. Augmentation uses both sections to build
navigation helpers, but only the exposed collections appear in the augmented
result's arrays. There is no extra post-augmentation filtering step.

The deprecated `parseIntrospectionResults(value, includeExtensionResources)`
API uses this same callback by default. Passing `true` corresponds to omitting
`prune` or setting it to `null`. Its existing exposed arrays and navigation
behaviour are preserved.

## Privilege filtering

`multipass.onlyAccessible: {}` limits initial classes, procedures and types to
objects accessible to the current database role. Specify another role with:

```js
const multipass = {
  onlyAccessible: {
    role: "app_reader",
    includeNoInherit: false,
  },
  policies: [
    /* application relationship policies */
  ],
};
```

The check includes schema USAGE plus relevant object privileges: table or column
privileges for relations, sequence privileges for sequences, EXECUTE for
procedures and USAGE for types. The role is passed as a query parameter.
`includeNoInherit: true` also considers roles reachable through memberships
that do not inherit privileges.

These checks restrict initial discovery. Policies can still fetch otherwise
inaccessible objects when required as dependencies. Apply top-level filters for
restrictions that must also hold during dependency fetching.

## Pruning and navigation

Top-level `prune(data, details)` runs after fetching in either mode. A callback
can remove raw rows entirely, or use `details.hide(collection, predicate)` to
retain matching rows only for navigation:

```js
const options = {
  prune(data, { hide }) {
    hide("classes", (row) => row.relname === "internal_helper");
  },
};
```

| Operation                | Exposed collection | Available through navigation | Cached data       |
| ------------------------ | ------------------ | ---------------------------- | ----------------- |
| Remove a row from `data` | Removed            | Removed                      | Discarded         |
| `details.hide`           | Removed            | Retained                     | Moved to `hidden` |

Hiding is an exposure decision; it does not reclaim the hidden objects' memory.
Multipass reduces memory by avoiding discovery of unrelated extension helpers.
Removing unwanted rows entirely during pruning also reduces the cached data.
Rows needed as dependencies must still be retained.

### Combining prune callbacks

Use a wrapper callback to apply extension pruning and your own pruning rules:

```js
import { pruneExtensionResources } from "pg-introspection";

function pruneInternalProcedures(_data, { hide }) {
  hide("procs", (proc) => proc.proname.startsWith("internal_"));
}

const options = {
  prune(data, details) {
    pruneExtensionResources(data, details);
    pruneInternalProcedures(data, details);
  },
};
```

Each callback receives the same data and helpers. You can call additional
callbacks in the same way, including callbacks that remove unwanted rows
entirely. All callbacks in the wrapper run on each pruning pass.

Pruning runs repeatedly until the exposed row count stops decreasing. Callbacks
must only remove or hide objects, must not add or replace them, and must
terminate. Augmentation also applies the callback before building navigation
lookups, so the same options work with fresh raw input and previously pruned
cached data. Callbacks must tolerate rows already being hidden or removed.

Neither pruning nor augmentation automatically makes your application's
relationships complete. Supply policies for the relationships you need, and
retain the dependencies your navigation code uses.

`introspect` adds navigation helpers after discovery and pruning.
`introspectRaw` returns plain data, including any `hidden` section; call
`augmentIntrospectionData` separately to build navigation from it. Helpers
navigate only the fetched and retained data: `table.getConstraints()` therefore
returns the discovered constraints, not necessarily every constraint on the
table. Helpers that require an omitted collection throw when called.
