---
sidebar_position: 5
title: "sql.join()"
---

# `sql.join(frags, delimiter)`

Joins an array of SQL fragments together using a delimiter, useful for building
dynamic lists of columns, conditions, or other SQL elements.

Joins SQL fragments with a delimiter. For joining SQL fragments, NOT table
joins!

:::tip[PostgreSQL Parameter Limit]

For large bulk inserts, you may hit PostgreSQL's parameter limit (~65,535).
Consider using `json_populate_recordset()` or `json_array_elements()` instead.

:::

## Syntax

```typescript
sql.join(items: ReadonlyArray<SQL>, separator?: string): SQL
```

## Parameters

- `items` - Array of SQL fragments to join
- `separator` - String delimiter to insert between fragments (defaults to empty string)

## Return value

Returns a SQL fragment containing all joined elements joined by the separator.
Return empty fragment if array is empty.

## Examples

```js
import { sql } from "pg-sql2";

// WHERE conditions
const conditions = [sql`age > 18`, sql`status = 'active'`];
const query = sql`WHERE ${sql.join(conditions, " AND ")}`;

console.log(sql.compile(query).text);
// WHERE age > 18 AND status = 'active'

// Column lists
const columns = ["name", "email", "age"];
const query = sql`SELECT ${sql.join(
  columns.map((columnName) => sql.identifier(columnName)),
  ", ",
)} FROM users`;

console.log(sql.compile(query).text);
// SELECT "name", "email", "age" FROM users

// JSON objects
const fields = ["name", "email"];
const query = sql`json_build_object(${sql.join(
  fields.map((f) => sql`${sql.literal(f)}, ${sql.identifier(f)}`),
  ", ",
)})`;

console.log(sql.compile(query).text);
// json_build_object('name', "name", 'email', "email")
```
