---
sidebar_position: 1
---

# pg-introspection

A strongly-typed PostgreSQL introspection library for PostgreSQL built
automatically from the
[PostgreSQL system catalog documentation](https://www.postgresql.org/docs/current/catalogs.html),
with the TypeScript documentation for each attribute/type also pulled from the
PostgreSQL documentation for easy reference directly in your editor.

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
