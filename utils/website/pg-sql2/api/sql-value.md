---
sidebar_position: 3
title: "sql.value()"
---

# `sql.value(val)`

Safely embeds values in SQL queries using parameterized placeholders to prevent SQL injection.

## Syntax

```typescript
sql.value(val: SQLRawValue): SQL
```

## Parameters

- `val` - The value to embed. Supported types:
  - `string`
  - `number`
  - `boolean`
  - `null`
  - `ReadonlyArray<SQLRawValue>` (for arrays)

## Description

Represents an SQL value that will be replaced with a placeholder (e.g., `$1`, `$2`) in the compiled SQL statement. The actual values are collected separately and passed to the database driver, preventing SQL injection attacks.

## Examples

### Basic Values

```js
import sql from "pg-sql2";

// String values
const name = "Alice";
sql`SELECT * FROM users WHERE name = ${sql.value(name)}`;
// Compiles to: SELECT * FROM users WHERE name = $1
// Values: ['Alice']

// Numbers
const age = 25;
sql`SELECT * FROM users WHERE age > ${sql.value(age)}`;
// Compiles to: SELECT * FROM users WHERE age > $1
// Values: [25]

// Booleans
const active = true;
sql`SELECT * FROM users WHERE active = ${sql.value(active)}`;
// Compiles to: SELECT * FROM users WHERE active = $1
// Values: [true]

// Null values
sql`SELECT * FROM users WHERE deleted_at = ${sql.value(null)}`;
// Compiles to: SELECT * FROM users WHERE deleted_at = $1
// Values: [null]
```

### Array Values

```js
// Array of values (useful for IN clauses)
const ids = [1, 2, 3, 4];
sql`SELECT * FROM users WHERE id = ANY(${sql.value(ids)})`;
// Compiles to: SELECT * FROM users WHERE id = ANY($1)
// Values: [[1, 2, 3, 4]]

// Nested arrays
const coordinates = [
  [1, 2],
  [3, 4],
];
sql`SELECT * FROM locations WHERE coords = ${sql.value(coordinates)}`;
```

### Complex Queries

```js
const filters = {
  minAge: 18,
  status: "active",
  roles: ["admin", "user"],
};

const query = sql`
  SELECT * FROM users 
  WHERE age >= ${sql.value(filters.minAge)}
    AND status = ${sql.value(filters.status)}
    AND role = ANY(${sql.value(filters.roles)})
`;
// Compiles to:
// SELECT * FROM users
// WHERE age >= $1 AND status = $2 AND role = ANY($3)
// Values: [18, 'active', ['admin', 'user']]
```

### Compilation Example

```js
const userId = 123;
const status = "active";

const query = sql`
  UPDATE users 
  SET status = ${sql.value(status)}
  WHERE id = ${sql.value(userId)}
`;

const { text, values } = sql.compile(query);
console.log(text);
// -> UPDATE users SET status = $1 WHERE id = $2

console.log(values);
// -> ['active', 123]

// Use with your PostgreSQL client
// const result = await client.query(text, values);
```

## Return Value

Returns a `SQL` fragment representing the parameterized value that can be embedded in other SQL expressions.

## Safety Notes

- **Objects are NOT valid values** - you must serialize them first (e.g., `JSON.stringify(obj)`)
- Values are completely isolated from the SQL text, preventing injection
- Arrays are properly handled for PostgreSQL array operations
- All values are type-checked at runtime for safety

## Invalid Usage

```js
// ❌ Objects are not allowed
const user = { name: "Alice", age: 25 };
sql`INSERT INTO users VALUES (${sql.value(user)})`; // Will throw error

// ✅ Serialize objects first
sql`INSERT INTO users (data) VALUES (${sql.value(JSON.stringify(user))})`;

// ❌ Functions are not allowed
sql`SELECT ${sql.value(() => "hello")} FROM users`; // Will throw error
```
