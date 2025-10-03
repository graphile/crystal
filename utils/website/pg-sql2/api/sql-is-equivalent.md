---
sidebar_position: 14
title: "sql.isEquivalent()"
---

# `sql.isEquivalent(sql1, sql2, options?)`

Compares two SQL fragments to determine if they are functionally equivalent,
meaning they would generate equivalent SQL when compiled. This is useful for
query optimization, caching, testing, and deduplication.

## Syntax

```typescript
sql.isEquivalent(
  sql1: SQL,
  sql2: SQL,
  options?: {
    symbolSubstitutes?: ReadonlyMap<symbol, symbol>;
  }
): boolean
```

## Parameters

- `sql1` - First SQL fragment to compare
- `sql2` - Second SQL fragment to compare
- `options` - Optional comparison options:
  - `symbolSubstitutes` - Map of symbol substitutions for comparison

## Return value

Returns `true` if the SQL fragments are functionally equivalent, `false` otherwise.

## Examples

### Basic equivalence

```js
import { sql } from "pg-sql2";

const query1 = sql`SELECT * FROM users WHERE id = ${sql.value(123)}`;
const query2 = sql`SELECT * FROM users WHERE id = ${sql.value(123)}`;

console.log(sql.isEquivalent(query1, query2)); // true

// Different values make queries non-equivalent
const query3 = sql`SELECT * FROM users WHERE id = ${sql.value(456)}`;
console.log(sql.isEquivalent(query1, query3)); // false
```

### Identifier comparison

```js
import { sql } from "pg-sql2";

const table1 = sql.identifier("users");
const table2 = sql.identifier("users");
const table3 = sql.identifier("orders");

console.log(sql.isEquivalent(table1, table2)); // true
console.log(sql.isEquivalent(table1, table3)); // false
```

### Symbol equivalence

```js
import { sql } from "pg-sql2";

const sym1 = Symbol("table");
const sym2 = Symbol("table"); // Different symbol, same description

const id1 = sql.identifier(sym1);
const id2 = sql.identifier(sym2);

console.log(sql.isEquivalent(id1, id2)); // false (different symbols)

// But with symbol substitutes...
console.log(
  sql.isEquivalent(id1, id2, {
    symbolSubstitutes: new Map([[sym1, sym2]]),
  }),
); // true
```
