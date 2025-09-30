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

## Return Value

Returns a SQL fragment containing all joined elements joined by the separator.
Return empty fragment if array is empty.

## Examples

```js
// Column lists
const columns = ["name", "email", "age"];
sql`SELECT ${sql.join(columns.map(sql.identifier), ", ")} FROM users`;
// -> SELECT "name", "email", "age" FROM users

// WHERE conditions
const conditions = [sql`age > 18`, sql`status = 'active'`];
sql`WHERE ${sql.join(conditions.map(sql.parens), " AND ")}`;
// -> WHERE (age > 18) AND (status = 'active')

// JSON objects
const fields = ["name", "email"];
sql`json_build_object(${sql.join(
  fields.map((f) => sql`${sql.literal(f)}, ${sql.identifier(f)}`),
  ", ",
)})`;
```
