---
sidebar_position: 7
title: "sql.parens()"
---

# `sql.parens(fragment, force?)`

Wraps SQL fragments in parentheses if it might be needed to prevent ambiguity, or
forces parentheses when needed for subqueries or stylistic reasons. Use this
method instead of literal parenthesis to avoid excessive parentheses while
ensuring syntactic correctness.

## Syntax

```typescript
sql.parens(fragment: SQL, force?: boolean): SQL
```

## Parameters

- `fragment` - The SQL fragment to potentially wrap in parentheses
- `force` - Optional boolean to force parentheses even if not strictly needed

## Return value

Returns a `SQL` fragment that is wrapped in parentheses if `force` is true, or
if it might be needed to avoid syntactic ambiguity.

## Examples

### Basic usage

```js
import sql from "pg-sql2";

// Simple values don't need parentheses
// No parentheses are added to these outputs
const numberQuery = sql.parens(sql.value(123));
console.log(sql.compile(numberQuery).text);
// [123]

const textQuery = sql.parens(sql.identifier("users"));
console.log(sql.compile(textQuery).text);
/// "users"
```

```js
// Expressions that could be ambiguous get parentheses
const condition = sql`age > 18 AND status = 'active'`;
const query = sql`SELECT * FROM users WHERE ${sql.parens(condition)} OR admin = true`;
console.log(sql.compile(query).text);
// SELECT * FROM users WHERE (age > 18 AND status = 'active') OR admin = true
```

```js
// Works with nested conditions
const conditions = [sql`age > 18`];
const sqlConditions = sql.join(conditions.map(sql.parens), " AND ");
const query = sql`SELECT * FROM users WHERE ${sql.parens(sqlConditions)} OR admin = true`;
console.log(sql.compile(query).text);
// SELECT * FROM users WHERE (age > 18) OR admin = true
```

```js
// Changing the conditions to be more complex
// introduces more parentheses to reduce ambiguity
const conditions = [sql`age > 18`, sql`status = 'active'`];
const sqlConditions = sql.join(conditions.map(sql.parens), " AND ");
const query = sql`SELECT * FROM users WHERE ${sql.parens(sqlConditions)} OR admin = true`;
console.log(sql.compile(query).text);
// SELECT * FROM users WHERE ((age > 18) AND (status = 'active')) OR admin = true
```

### Forced parentheses

```js
import sql from "pg-sql2";

// Force parentheses for subqueries
const subquery = sql`SELECT id FROM users WHERE active = true`;
const query = sql`SELECT * FROM orders WHERE user_id IN ${sql.parens(subquery, true)}`;
console.log(sql.compile(query).text);
// SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE active = true)
```
