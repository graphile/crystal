---
sidebar_position: 1
title: "sql`...`"
---

# ``sql`...` ``

The core template literal function that builds SQL queries by safely
interpreting embedded expressions. This is the primary way to construct SQL in
pg-sql2. Only valid pg-sql2 SQL fragments can be embedded - if a raw value is
passed in, an error will be thrown (unless you're using
[transformers](./sql-with-transformer.md)).

## Syntax

```ts
sql`SQL template string with ${sqlExpressions}`;
```

### Deprecated aliases

These are identical to the SQL tagged template literal function, above, and exist for compatibility for legacy versions.

```ts
sql.fragment`SQL template string with ${sqlExpressions}`;
sql.query`SQL template string with ${sqlExpressions}`;
```

## Return value

Returns a `SQL` fragment that can be:

- Embedded in other `sql` template literals
- Compiled using `sql.compile()`
- Used with other pg-sql2 functions

## Examples

### Simple query

```js
import { sql } from "pg-sql2";

// Simple query
const query = sql`
  SELECT *
  FROM users
  WHERE id = 123
`;

// Many of the examples in this documentation will show a
// console.log statement with the compiled query:
console.log(sql.compile(query).text);
/*
  SELECT *
  FROM users
  WHERE id = 123
*/
```

### Embedding identifiers and values

This example uses [`sql.identifier`](./sql-identifier.md) and [`sql.value`](./sql-value.md),
during compile the `columnValue` is replaced by the placeholder `$1`.

```ts
import { sql } from "pg-sql2";

// With safe value embedding
const tableName = "users";
const columnName = "id";
const columnValue = 123;

const userQuery = sql`
  SELECT *
  FROM ${sql.identifier(tableName)}
  WHERE ${sql.identifier(tableName, columnName)} = ${sql.value(columnValue)}
`;

const { text, values } = sql.compile(userQuery);
console.log(text, values);
/*
  SELECT *
  FROM "users"
  WHERE "users"."id" = $1
*/
```

### Composing fragments

This example uses `sql.identifier`, [`sql.literal`](./sql-literal), `sql.value` and [`sql.join`](./sql-join).
During compile, the value of `status` is replaced with the placeholder `$1`.

```js
import { sql } from "pg-sql2";

const fields = ["name", "email", "age"];
const sqlFields = fields.map((f) => sql.identifier(f));
const sqlWhere = sql`age > ${sql.literal(18)} AND status = ${sql.value("active")}`;

const query = sql`
  SELECT ${sql.join(sqlFields, ", ")}
  FROM ${sql.identifier("users")}  
  WHERE ${sqlWhere}
`;

console.log(sql.compile(query).text);
/*
  SELECT "name", "email", "age"
  FROM "users"
  WHERE age > 18 AND status = $1
*/
```

## SQL fragments only

```js
// ❌ This will throw an error - prevents accidental inclusion of user-input
// (thereby preventing SQL injection)
sql`SELECT * FROM users WHERE name = ${"Bobby Tables"}`;

// ✅ This is safe - value is properly parameterized
sql`SELECT * FROM users WHERE name = ${sql.value("Bobby Tables")}`;
```
