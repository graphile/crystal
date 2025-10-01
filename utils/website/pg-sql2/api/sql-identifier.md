---
sidebar_position: 6
title: "sql.identifier()"
---

# `sql.identifier(ident, ...)`

Creates a safely escaped SQL identifier for table names, column names, schema
names, and other database object names. If multiple arguments are passed, each
will be escaped individually and then joined with dots (e.g.
`"schema"."table"."column"`). This prevents SQL injection when using dynamic
table/column names.

Furthermore, symbols can be passed as identifiers to generate unique aliases,
which is useful if your SQL might include the same table multiple times, or
otherwise lead to alias confusion.

## Syntax

```typescript
sql.identifier(name: string | symbol): SQL
sql.identifier(name1: string | symbol, name2: string | symbol, ...): SQL
```

## Parameters

- `name` - A string or symbol representing an identifier name
- Multiple names can be passed to create qualified identifiers

## Return value

Returns a `SQL` fragment representing the escaped identifier that can be
embedded in other SQL expressions.

## Examples

### Basic identifiers

```js
import { sql } from "pg-sql2";

// Table name
const tableName = "users";
const query = sql`SELECT * FROM ${sql.identifier(tableName)}`;

console.log(sql.compile(query).text);
// SELECT * FROM "users"

// Column name
const columnName = "user_name";
const query = sql`SELECT ${sql.identifier(columnName)} FROM users`;

console.log(sql.compile(query).text);
// SELECT "user_name" FROM users
```

### Qualified identifiers

```js
import { sql } from "pg-sql2";

// schema.table
const schema = "public";
const table = "users";
const column = "name";
const query = sql`SELECT ${sql.identifier(column)} FROM ${sql.identifier(schema, table)}`;
console.log(sql.compile(query).text);
// SELECT * FROM "public"."users"

// table.column
const query = sql`SELECT ${sql.identifier(table, column)} FROM users`;
console.log(sql.compile(query).text);
// SELECT "users"."name" FROM users

// schema.table.column
const query = sql`COMMENT ON COLUMN ${sql.identifier(schema, table, column)} IS ''`;
console.log(sql.compile(query).text);
// COMMENT ON COLUMN "public"."users"."name" IS '';
```

### Using symbols

Symbols are automatically assigned unique identifiers:

```js
import { sql } from "pg-sql2";

const worker = sql.identifier(Symbol("worker"));
const boss = sql.identifier(Symbol("boss"));
const query = sql`
SELECT
  ${worker}.name,
  ${boss}.salary/${worker}.salary as boss_multiplier
FROM employees AS ${worker}
INNER JOIN employees AS ${boss}
ON ${worker}.manager_id = ${boss}.id
`;
console.log(sql.compile(query).text);
/* 
SELECT
     __worker__.name,
     __boss__.salary/__worker__.salary as boss_multiplier
   FROM employees AS __worker__
   INNER JOIN employees AS __boss__
   ON __worker__.manager_id = __boss__.id
*/
```

:::tip[Give symbols meaningful names]

The above would also work with naked symbols, but they'd be named `__local_0__`,
`__local_1__`, etc. in the compiled SQL:

```js
const worker = sql.identifier(Symbol());
const boss = sql.identifier(Symbol());
//    FROM employees AS __local_0__
//    INNER JOIN employees AS __local_1__
```

:::

### Handling special characters

```js
// Identifiers with spaces or special characters are safely escaped
sql`SELECT * FROM ${sql.identifier("user data")}`;
// -> SELECT * FROM "user data"

sql`SELECT * FROM ${sql.identifier('b"z')}`;
// -> SELECT * FROM "b""z"
```

## Notes

- `pg-sql2` intelligently determines when to use quoted identifiers (with double
  quotes) based on PostgreSQL rules
- Multiple arguments create dot-separated qualified identifiers
- Reserved SQL keywords are handled correctly through escaping
- Symbol identifiers are converted to unique string representations which will
  always be consistent within a single compiled query, but may differ from query
  to query if the same fragment is used in multiple queries
