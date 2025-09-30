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

```typescript
sql`SQL template string with ${sqlExpressions}`;
```

## Return Value

Returns a `SQL` fragment that can be:

- Embedded in other `sql` template literals
- Compiled using `sql.compile()`
- Used with other pg-sql2 functions

## Examples

### Simple Query

```js
import sql from "pg-sql2";

// Simple query
const query = sql`
  SELECT *
  FROM users
  WHERE id = 123
`;
```

### Embedding Identifiers and Values

```ts
// With safe value embedding
const tableName = "users";
const columnName = "id";
const columnValue = 123;

const userQuery = sql`
  SELECT *
  FROM ${sql.identifier(tableName)}
  WHERE ${sql.identifier(tableName, columnName)} = ${sql.value(columnValue)}
`;
```

### Composing Fragments

```js
const sqlWhere = sql`age > ${sql.literal(18)} AND status = ${sql.value("active")}`;
const fields = ["name", "email", "age"];
const sqlFields = fields.map((f) => sql.identifier(f));

const query = sql`
  SELECT ${sql.join(sqlFields, ", ")}
  FROM ${sql.identifier("users")}  
  WHERE ${sqlWhere}
`;
```

## SQL Fragments Only

```js
// ❌ This will throw an error - prevents accidental inclusion of user-input
// (thereby preventing SQL injection)
sql`SELECT * FROM users WHERE name = ${"Bobby Tables"}`;

// ✅ This is safe - value is properly parameterized
sql`SELECT * FROM users WHERE name = ${sql.value("Bobby Tables")}`;
```
