---
sidebar_position: 11
title: "sql.placeholder()"
---

# `sql.placeholder(symbol, fallback?)`

**ADVANCED** - most users will not need this function.

Creates replaceable placeholders in SQL queries that can be substituted at
compile time. Useful for creating reusable query templates where certain parts
need to be dynamically substituted.

## Syntax

```ts
sql.placeholder(symbol: symbol, fallback?: SQL): SQL
```

## Parameters

- `symbol` - A unique symbol to identify this placeholder
- `fallback` - Optional SQL fragment to use if no replacement is provided

## Return value

Returns a `SQL` fragment that will be replaced during compilation if a
replacement is provided, or will use the fallback if no replacement is given (or
throw an error if no replacement and no fallback is given).

## Example

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
