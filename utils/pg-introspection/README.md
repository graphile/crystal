# pg-introspection

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

A strongly-typed PostgreSQL introspection library for PostgreSQL built
automatically from the
[PostgreSQL system catalog documentation](https://www.postgresql.org/docs/current/catalogs.html),
with the TypeScript documentation for each attribute/type also pulled from the
PostgreSQL documentation for easy reference directly in your editor.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://surge.io/"><img src="https://graphile.org/images/sponsors/surge.png" width="90" height="90" alt="Surge" /><br />Surge</a> *</td>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
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
  const introspection = parseIntrospectionResults(row[0].introspection);

  console.log(
    `The ${introspection.database.datname} DBA is ${
      introspection.database.getDba()?.rolname ?? "-"
    }`,
  );
}

main();
```

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
