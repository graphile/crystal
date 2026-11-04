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
for unselected collections are ignored. Select required collections too, as
described in [Usage](./index.md#collections-and-filters).

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
  purposes: ["initial", "procedureReturnType"],
  select(proc, details) {
    if (!details.hasPurpose("initial")) {
      return [];
    }
    return [
      {
        entity: "types",
        match: { _id: proc.prorettype },
        purposes: ["procedureReturnType"],
      },
    ];
  },
});

const pool = new Pool({
  connectionString: "postgres://localhost/my_database",
});

async function main() {
  try {
    const data = await introspectRaw(
      {
        onlyEntities: ["namespaces", "procs", "types"],
        multipass: {
          entrypointFilters: { namespaces: "nspname = 'app_public'" },
          policies: [returnTypes],
        },
      },
      async (text, values) => {
        const { rows } = await pool.query(text, values);
        return rows[0].introspection;
      },
    );
    console.log(data.procs.length, data.types.length);
  } finally {
    await pool.end();
  }
}

main();
```

`defineIntrospectionPolicy` infers the source row's type from `entity`. Every
policy has a unique, non-empty `name`, a source collection, a list of declared
purposes and a synchronous `select` function. Return an array of requests,
`[]` or `undefined`.

Each request specifies a target `entity`, a non-empty `match` object of catalog
column equalities, and a non-empty `purposes` list. Values in `match` are
strings or numbers and are sent as query parameters. Use `_id` to request an
object by OID, or a catalog column such as `attrelid` to request a group of rows:

```ts
const tableAttributes = defineIntrospectionPolicy({
  name: "tableAttributes",
  entity: "classes",
  purposes: ["initial"],
  select(table) {
    return [
      {
        entity: "attributes",
        match: { attrelid: table._id },
        purposes: ["initial"],
      },
    ];
  },
});
```

Include `attributes` in `onlyEntities` when using this policy. The initial query
already includes attributes for initial tables when that collection is selected;
the policy also requests attributes for tables discovered later.

## Purposes and predictable expansion

Extend `PgIntrospection.PurposeRegistry` to name the reasons your application
needs objects. A row can be needed for several reasons: for example, a table
used as a procedure's return type can require different information from a table
exposed as a queryable resource.

A policy must declare every purpose it reads through `details.hasPurpose` or
emits in requests. Reading or emitting an undeclared purpose throws an error
identifying the policy. The built-in `initial` purpose must also be declared
when used.

Policies run once when a row is first discovered, even if none of their declared
purposes is present. Use `hasPurpose` guards when behaviour depends on a reason
for discovery. Subsequently, a policy reruns only when one of its declared
purposes is added. Requests for already fetched rows still propagate new
purposes without fetching those rows again.

Purposes only accumulate. A new purpose must add requirements rather than revoke
earlier ones. Policy output must depend only on its row, declared purposes and
fixed configuration. Do not mutate rows or use mutable closure state to decide
what to request. `details.catalogByOid` contains immutable catalog metadata for
policies that need catalog OIDs.

To make a request terminal, emit a purpose for which the target policies request
no further dependencies. In the return-type example, no policy follows types,
so the requested return types do not cause further expansion.

## Global filters and entrypoint filters

| Option                        | Initial query | Dependency queries |
| ----------------------------- | ------------- | ------------------ |
| `filters`                     | Applied       | Applied            |
| `multipass.entrypointFilters` | Applied       | Not applied        |

Both accept trusted SQL predicates keyed by collection name. Predicates use the
underlying catalog's column names; use `oid` in SQL and `_id` in request
selectors. Never interpolate untrusted input into SQL predicates.

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

The deprecated `parseIntrospectionResults(value, includeExtensionResources)`
API retains its legacy behaviour: it removes extension-owned resources from
the result arrays by default, after building navigation lookups. Pass `true`
to retain them. This compatibility filtering differs from SQL filters, which
exclude rows before navigation lookups are built.

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

`multipass.prune(data)` receives raw discovered data after expansion. It can
remove objects that are incomplete or unwanted. It runs repeatedly until the
number of retained objects stops decreasing, so it must only remove objects,
must not add or replace them, and must terminate.

Neither pruning nor augmentation automatically makes your application's
relationships complete. Supply policies for the relationships you need, and
ensure pruning preserves the dependencies your navigation code uses.

`introspect` adds navigation helpers after discovery and pruning.
`introspectRaw` returns plain data; call `augmentIntrospectionData` separately.
Helpers navigate only the fetched and retained data: `table.getConstraints()`
therefore returns the discovered constraints, not necessarily every constraint
on the table. Helpers that require an omitted collection throw when called.
