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

Issue the `makeIntrospectionQuery()` SQL query to your database, then feed the
first row's `introspection` field into `parseIntrospectionResults()` to get your
strongly typed introspection results.

Example usage with `pg` module:

```js
import {
  makeIntrospectionQuery,
  parseIntrospectionResults,
} from "pg-introspection";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://localhost:5432/my_database",
});

async function main() {
  const sql = makeIntrospectionQuery();
  const { rows } = await pool.query(sql);
  const introspection = parseIntrospectionResults(rows[0].introspection);

  console.log(
    `The ${introspection.database.datname} DBA is ${
      introspection.database.getDba()?.rolname ?? "-"
    }`,
  );
}

main();
```

## Multipass introspection

`introspect` and `introspectRaw` accept an optional `multipass` configuration.
When enabled, `schemas` selects the initial schemas, and `onlyAccessible`
restricts initial resources to those accessible to a role. The role defaults to
the current database role. Set `includeNoInherit` to include roles reachable
through memberships that do not inherit privileges.

Consumers supply relationship `policies` to discover additional objects. A
policy receives a raw source row and returns requests with a target collection
and a `match` object containing catalog column values. Every request must carry
non-empty `purposes`, explaining why its matching rows are needed. Policies have
unique names and declare every purpose they read or emit. Purposes accumulate;
adding a declared purpose reruns the affected policy, even on an already-fetched
row. Repeating a purpose does not repeat expansion or fetching. For example:

```ts
import { defineIntrospectionPolicy, introspectRaw } from "pg-introspection";
import { Pool } from "pg";

const client = new Pool({
  connectionString: "postgres://localhost/my_database",
});

declare global {
  namespace PgIntrospection {
    interface PurposeRegistry {
      returnType: true;
    }
  }
}

const returnTypes = defineIntrospectionPolicy({
  name: "procedureReturnTypes",
  purposes: ["returnType"],
  entity: "procs",
  select(proc) {
    return [
      {
        entity: "types",
        match: { _id: proc.prorettype },
        purposes: ["returnType"],
      },
    ];
  },
});

const data = await introspectRaw(
  {
    schemas: ["app_public"],
    multipass: { onlyAccessible: {}, policies: [returnTypes] },
  },
  async (text, values) => {
    const { rows } = await client.query({ text, values });
    return rows[0].introspection;
  },
);
console.log(data.procs.length);
await client.end();
```

There are no default relationship policies. `onlyEntities` limits both returned
collections and the collections that policies can follow. Multipass results are
a filtered representation of the database: for example, the constraints of a
table contain only those fetched and retained, not necessarily every database
constraint. Optional consumer-supplied filters and pruning can further restrict
the result. Filters are trusted SQL predicates keyed by collection; do not
construct them from untrusted input. A `prune` callback receives the raw result
and removes unwanted objects. It is called until no further objects are removed,
so it must not add objects.

## Accessors

Into the introspection results we mix "accessor" functions to make following
relationships easier. Note that these functions are typically evaluated lazily -
the first time you call them they may need to do an expensive lookup (e.g.
finding the relevant record from the list of records) but they cache the result
so that the next call will be near-instant.

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

Initial rows receive the built-in `initial` purpose. A policy can inspect its
row's purposes using `details.hasPurpose("initial")`, provided it declares
`initial`. Reading or emitting undeclared purposes throws an error identifying
the policy. `details.catalogByOid` contains immutable catalog metadata.

Policy output must depend only on its row, declared purposes and immutable
configuration. Do not use mutable closure state or interpret new purposes as
revoking earlier requirements. A policy runs once initially and subsequently
only when one of its declared purposes is added. To make a request terminal, use
a purpose that does not activate further requests in the target policies.

`filters` apply to every query. `entrypointFilters` apply only to initial
discovery, allowing dependency requests beyond the initial selection. An
entrypoint-filtered collection is not assumed complete; other collections keep
their completeness optimisation. A satisfied selector still propagates newly
requested purposes to its matching rows without issuing another query.
