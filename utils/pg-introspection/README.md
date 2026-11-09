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

Call `introspect` passing options including the required `runQuery` adaptor that
should run the given text/values using a database adaptor of your choice and
return the value of the `introspection` column of the first (and only) row
returned.

```ts
import { introspect } from "pg-introspection";
import { runQuery } from "./runQuery.ts";

const introspection = await introspect({ runQuery });
console.log(introspection.database.getDba()?.rolname);
```

Here's an example of a `runQuery` function for the `pg` module:

```ts
// runQuery.ts
import type { RunQuery } from "pg-introspection";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

export const runQuery: RunQuery = async (text, values) => {
  const { rows } = await pool.query(text, values);
  return rows[0].introspection;
};
```

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

## View the docs

For details of the options and advanced usage instructions (including how to
cache the results), see the full documentation:

https://star.graphile.org/pg-introspection/
