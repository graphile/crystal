---
sidebar_position: 9
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

## Return Value

Returns a `SQL` fragment that is wrapped in parentheses if `force` is true, or
if it might be needed to avoid syntactic ambiguity.

## Examples

### Basic Usage

```js
import sql from "pg-sql2";

// Simple values don't need parentheses
sql.parens(sql.value(123)); // -> 123 (no parentheses added)
sql.parens(sql.identifier("users")); // -> "users" (no parentheses added)

// Expressions that could be ambiguous get parentheses
const condition = sql`age > 18 AND status = 'active'`;
sql`SELECT * FROM users WHERE ${sql.parens(condition)} OR admin = true`;
// -> SELECT * FROM users WHERE (age > 18 AND status = 'active') OR admin = true

const conditions = [sql`age > 18`];
const sqlConditions = sql.join(conditions.map(sql.parens), " AND ");
sql`SELECT * FROM users WHERE ${sql.parens(sqlConditions)} OR admin = true`;
// -> SELECT * FROM users WHERE (age > 18) OR admin = true
// But: conditions = [sql`age > 18`, sql`status = 'active'`]
// -> SELECT * FROM users WHERE ((age > 18) AND (status = 'active')) OR admin = true
```

### Forced Parentheses

```js
// Force parentheses for subqueries
const subquery = sql`SELECT id FROM users WHERE active = true`;
sql`SELECT * FROM orders WHERE user_id IN ${sql.parens(subquery, true)}`;
// -> SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE active = true)
```
