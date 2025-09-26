---
sidebar_position: 1
---

# ``sql `...` ``

The core template literal function that builds SQL queries by safely interpreting embedded expressions. This is the primary way to construct SQL in pg-sql2.

## Syntax

```typescript
sql`template string with ${expressions}`;
```

## Description

The `sql` template literal builds part of (or the whole of) an SQL query, safely interpreting the embedded expressions. Only valid pg-sql2 SQL fragments can be embedded - if a raw value is passed in, an error will be thrown.

## Examples

### Basic Usage

```js
import sql from "pg-sql2";

// Simple query
const query = sql`SELECT * FROM users`;

// With safe value embedding
const userId = 123;
const userQuery = sql`SELECT * FROM users WHERE id = ${sql.value(userId)}`;

// With identifier
const tableName = "users";
const tableQuery = sql`SELECT * FROM ${sql.identifier(tableName)}`;
```

### Composing Fragments

```js
const conditions = sql`age > ${sql.literal(18)} AND status = ${sql.value("active")}`;
const fields = sql.join(
  ["name", "email", "age"].map((f) => sql.identifier(f)),
  ", ",
);

const query = sql`
  SELECT ${fields}
  FROM ${sql.identifier("users")}  
  WHERE ${conditions}
`;
```

### Error Prevention

```js
// ❌ This will throw an error - prevents SQL injection
sql`SELECT * FROM users WHERE name = ${"Bobby Tables"}`;

// ✅ This is safe - value is properly parameterized
sql`SELECT * FROM users WHERE name = ${sql.value("Bobby Tables")}`;
```

## Error Handling

If a non-SQL expression is passed in, e.g.:

```js
sql`select ${1}`;
```

then an error will be thrown. This prevents SQL injection, as all values must go through an allowed API like `sql.value()`, `sql.identifier()`, or other pg-sql2 functions.

## Return Value

Returns a `SQL` fragment that can be:

- Embedded in other `sql` template literals
- Compiled using `sql.compile()`
- Used with other pg-sql2 functions
