---
sidebar_position: 13
title: "sql.isSQL()"
---

# `sql.isSQL(value)`

Type guard function that checks whether a value is a valid SQL fragment. Useful
for type checking and validation when building dynamic queries.

## Syntax

```typescript
sql.isSQL(value: unknown): value is SQL
```

## Parameters

- `value` - Any value to check

## Return value

Returns `true` if the value is a valid SQL fragment, `false` otherwise.

## Example

```js
import sql from "pg-sql2";

// Valid SQL fragments
console.log(sql.isSQL(sql`SELECT * FROM users`)); // true
console.log(sql.isSQL(sql.value(123))); // true
console.log(sql.isSQL(sql.identifier("table"))); // true
console.log(sql.isSQL(sql.raw("ORDER BY id"))); // true

// Invalid values
console.log(sql.isSQL("plain string")); // false
console.log(sql.isSQL(123)); // false
console.log(sql.isSQL({})); // false
console.log(sql.isSQL(null)); // false
```

## Notes

This function only checks if the value is structurally a SQL fragment. It
doesn't validate that the SQL is syntactically correct.
