---
sidebar_position: 6
title: "sql.compile()"
---

# `sql.compile(query, options?)`

Compiles a SQL fragment into executable SQL text with parameterized values, ready to be sent to the database.

## Syntax

```typescript
sql.compile(query: SQL, options?: {
  placeholderValues?: ReadonlyMap<symbol, SQL>
}): {
  text: string;
  values: SQLRawValue[];
}
```

## Parameters

- `query` - The SQL fragment to compile
- `options` - Optional compilation options
  - `placeholderValues` - Map of symbol placeholders to their replacement SQL fragments

## Return Value

An object with:

- `text: string` - The compiled SQL query string with placeholders (`$1`, `$2`, etc.)
- `values: SQLRawValue[]` - Array of parameter values corresponding to the placeholders in order
- private symbols you should ignore

## Usage

```js
const { text, values } = sql.compile(query);
await client.query(text, values);
```

## Examples

### Basic Usage

```js
import sql from "pg-sql2";

const userId = 123;
const status = "active";

const query = sql`
  SELECT id, name, email 
  FROM users 
  WHERE id = ${sql.value(userId)} 
    AND status = ${sql.value(status)}
`;

const { text, values } = sql.compile(query);

console.log(text);
// -> SELECT id, name, email FROM users WHERE id = $1 AND status = $2
console.log(values);
// -> [123, 'active']
```

### Complex Example

```js
const filters = {
  status: "active",
  minAge: 18,
  roles: ["admin", "user", "moderator"],
};

const columns = ["id", "name", "email", "role", "created_at"];

const query = sql`
  SELECT ${sql.join(
    columns.map((col) => sql.identifier(col)),
    ", ",
  )}
  FROM ${sql.identifier("users")}
  WHERE status = ${sql.value(filters.status)}
  AND age >= ${sql.value(filters.minAge)}
  AND role = ANY(${sql.value(filters.roles)})
  ORDER BY ${sql.identifier("created_at")} DESC
  LIMIT ${sql.literal(50)}
`;

const compiled = sql.compile(query);

console.log(compiled.text);
// -> SELECT "id", "name", "email", "role", "created_at"
//    FROM "users"
//    WHERE status = $1
//    AND age >= $2
//    AND role = ANY($3)
//    ORDER BY "created_at" DESC
//    LIMIT 50

console.log(compiled.values);
// -> ['active', 18, ['admin', 'user', 'moderator']]
```

### With Placeholders

```js
const $$table = Symbol("table");
const $$orderBy = Symbol("orderBy");

const sqlTable = sql.placeholder($$table, sql.identifier("default_table"));
const sqlOrderBy = sql.placeholder($$orderBy, sql`id ASC`);
const query = sql`
  SELECT * FROM ${sqlTable}
  ORDER BY ${sqlOrderBy}
`;

// Compile with defaults
const q1 = sql.compile(query);
console.log(q1.text);
// -> SELECT * FROM "default_table" ORDER BY id ASC

// Compile with placeholder values
const q2 = sql.compile(query, {
  placeholderValues: new Map([
    [$$table, sql.identifier("users")],
    [$$orderBy, sql`created_at DESC`],
  ]),
});
console.log(q2.text);
// -> SELECT * FROM "users" ORDER BY created_at DESC
```
