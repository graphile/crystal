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
  [$$symbolToIdentifier]: Map<symbol, string>;
}
```

## Parameters

- `query` - The SQL fragment to compile
- `options` - Optional compilation options
  - `placeholderValues` - Map of symbol placeholders to their replacement SQL fragments

## Description

Compiles the query into an SQL statement and a list of values, ready to be executed with a PostgreSQL client. This function converts the pg-sql2 internal representation into the format expected by database drivers.

## Basic Usage

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

## Using with Database Clients

### With node-postgres (pg)

```js
import { Client } from "pg";

const client = new Client(/* connection config */);

const query = sql`SELECT * FROM users WHERE age > ${sql.value(21)}`;
const { text, values } = sql.compile(query);

const result = await client.query(text, values);
console.log(result.rows);
```

### With a Query Helper

```js
async function executeQuery(sqlFragment) {
  const { text, values } = sql.compile(sqlFragment);
  return await client.query(text, values);
}

// Usage
const users = await executeQuery(
  sql`SELECT * FROM users WHERE status = ${sql.value("active")}`,
);
```

## Advanced Usage with Placeholders

The advanced form of `sql.compile` accepts options for replacing placeholders:

```js
import sql from "pg-sql2";

// Define placeholder symbols
const TABLE_NAME = Symbol("tableName");
const ORDER_BY = Symbol("orderBy");

// Create query with placeholders
const baseQuery = sql`
  SELECT * FROM ${sql.placeholder(TABLE_NAME)}
  ${sql.placeholder(ORDER_BY, sql`ORDER BY id`)}
`;

// Compile with placeholder values
const { text, values } = sql.compile(baseQuery, {
  placeholderValues: new Map([
    [TABLE_NAME, sql.identifier("users")],
    [ORDER_BY, sql`ORDER BY created_at DESC`],
  ]),
});

console.log(text);
// -> SELECT * FROM "users" ORDER BY created_at DESC
```

## Return Value

The `compile` function returns an object with:

### `text: string`

The compiled SQL query string with placeholders (`$1`, `$2`, etc.)

### `values: SQLRawValue[]`

Array of parameter values corresponding to the placeholders in order

### `[$$symbolToIdentifier]: Map<symbol, string>`

**Internal use only** - mapping of symbols to their generated identifiers. This is for internal pg-sql2 use and should not be used in application code.

## Complex Example

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
//    WHERE status = $1 AND age >= $2 AND role = ANY($3)
//    ORDER BY "created_at" DESC
//    LIMIT 50

console.log(compiled.values);
// -> ['active', 18, ['admin', 'user', 'moderator']]
```

## Error Handling

```js
try {
  const query = sql`SELECT * FROM ${sql.value("invalid_table_name")}`;
  const { text, values } = sql.compile(query);
} catch (error) {
  // Handle compilation errors (e.g., invalid SQL fragments)
  console.error("Compilation failed:", error.message);
}
```

## Performance Notes

- Compilation is generally fast, but you may want to cache compiled queries for frequently-used patterns
- The `values` array maintains parameter order, which is crucial for database execution
- Symbol identifiers are generated deterministically during compilation

## Integration Patterns

### Query Builder Function

```js
function createUserQuery(filters = {}) {
  const conditions = [];

  if (filters.status) {
    conditions.push(sql`status = ${sql.value(filters.status)}`);
  }

  if (filters.minAge) {
    conditions.push(sql`age >= ${sql.value(filters.minAge)}`);
  }

  const whereClause =
    conditions.length > 0 ? sql`WHERE ${sql.join(conditions, " AND ")}` : sql``;

  return sql`SELECT * FROM users ${whereClause}`;
}

// Compile and execute
const query = createUserQuery({ status: "active", minAge: 21 });
const { text, values } = sql.compile(query);
const result = await client.query(text, values);
```

### Transaction Helper

```js
async function executeTransaction(queries) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const results = [];
    for (const query of queries) {
      const { text, values } = sql.compile(query);
      const result = await client.query(text, values);
      results.push(result);
    }

    await client.query("COMMIT");
    return results;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
```
