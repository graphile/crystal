---
sidebar_position: 15
title: "sql.isEquivalent()"
---

# `sql.isEquivalent(sql1, sql2, options?)`

Compares two SQL fragments to determine if they are functionally equivalent.

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
- `options` - Optional comparison options
  - `symbolSubstitutes` - Map of symbol substitutions for comparison

## Description

Returns `true` if two SQL fragments are functionally equivalent, meaning they would generate the same SQL when compiled. This is useful for query optimization, caching, testing, and deduplication.

## Examples

### Basic Equivalence

```js
import sql from "pg-sql2";

const query1 = sql`SELECT * FROM users WHERE id = ${sql.value(123)}`;
const query2 = sql`SELECT * FROM users WHERE id = ${sql.value(123)}`;

console.log(sql.isEquivalent(query1, query2)); // true

// Different values make queries non-equivalent
const query3 = sql`SELECT * FROM users WHERE id = ${sql.value(456)}`;
console.log(sql.isEquivalent(query1, query3)); // false
```

### Identifier Comparison

```js
const table1 = sql.identifier("users");
const table2 = sql.identifier("users");
const table3 = sql.identifier("orders");

console.log(sql.isEquivalent(table1, table2)); // true
console.log(sql.isEquivalent(table1, table3)); // false
```

### Symbol Equivalence

```js
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

### Query Deduplication

```js
class QueryCache {
  constructor() {
    this.cache = new Map();
    this.queries = [];
  }

  addQuery(query) {
    // Check if we already have an equivalent query
    for (const [existingQuery, result] of this.cache) {
      if (sql.isEquivalent(query, existingQuery)) {
        console.log("Found equivalent query in cache");
        return result;
      }
    }

    // New unique query - compile and cache it
    const compiled = sql.compile(query);
    this.cache.set(query, compiled);
    return compiled;
  }
}

const cache = new QueryCache();

// These are equivalent and will hit the cache
const query1 = sql`SELECT name FROM users WHERE id = ${sql.value(1)}`;
const query2 = sql`SELECT name FROM users WHERE id = ${sql.value(1)}`;

cache.addQuery(query1); // Compiles and caches
cache.addQuery(query2); // Cache hit!
```

### Template Comparison

```js
function createUserQuery(userId) {
  return sql`SELECT * FROM users WHERE id = ${sql.value(userId)}`;
}

const userQuery1 = createUserQuery(123);
const userQuery2 = createUserQuery(123);
const userQuery3 = createUserQuery(456);

console.log(sql.isEquivalent(userQuery1, userQuery2)); // true
console.log(sql.isEquivalent(userQuery1, userQuery3)); // false
```

### Testing Query Generation

```js
describe("Query Builder", () => {
  test("should generate equivalent queries for same input", () => {
    const filters = { status: "active", age: 25 };

    const query1 = buildUserQuery(filters);
    const query2 = buildUserQuery(filters);

    expect(sql.isEquivalent(query1, query2)).toBe(true);
  });

  test("should generate different queries for different input", () => {
    const filters1 = { status: "active" };
    const filters2 = { status: "inactive" };

    const query1 = buildUserQuery(filters1);
    const query2 = buildUserQuery(filters2);

    expect(sql.isEquivalent(query1, query2)).toBe(false);
  });
});
```

### Symbol Substitution

```js
// When comparing queries that use different symbols but represent the same thing
const table1 = Symbol("users");
const table2 = Symbol("users");

const query1 = sql`SELECT * FROM ${sql.identifier(table1)}`;
const query2 = sql`SELECT * FROM ${sql.identifier(table2)}`;

// Different symbols, so not equivalent by default
console.log(sql.isEquivalent(query1, query2)); // false

// But equivalent when we map the symbols
console.log(
  sql.isEquivalent(query1, query2, {
    symbolSubstitutes: new Map([[table1, table2]]),
  }),
); // true
```

### Query Optimization

```js
class QueryOptimizer {
  constructor() {
    this.optimizedQueries = new Map();
  }

  optimize(query) {
    // Check if we've already optimized an equivalent query
    for (const [original, optimized] of this.optimizedQueries) {
      if (sql.isEquivalent(query, original)) {
        return optimized;
      }
    }

    // Perform expensive optimization
    const optimized = this.performOptimization(query);
    this.optimizedQueries.set(query, optimized);

    return optimized;
  }

  performOptimization(query) {
    // Expensive optimization logic here
    return query; // Simplified for example
  }
}
```

### Conditional Query Building

```js
function buildConditionalQuery(includeExtra = false) {
  const baseQuery = sql`SELECT id, name FROM users`;

  if (includeExtra) {
    return sql`${baseQuery}, email, created_at FROM users`;
  }

  return baseQuery;
}

const query1 = buildConditionalQuery(false);
const query2 = buildConditionalQuery(false);
const query3 = buildConditionalQuery(true);

console.log(sql.isEquivalent(query1, query2)); // true
console.log(sql.isEquivalent(query1, query3)); // false
```

### Memoization

```js
const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    // Create a query to represent the function call
    const key = sql`${sql.value(fn.name)}(${sql.join(args.map(sql.value), ", ")})`;

    // Check if we have an equivalent cached result
    for (const [cachedKey, result] of cache) {
      if (sql.isEquivalent(key, cachedKey)) {
        return result;
      }
    }

    // Compute and cache result
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveQueryBuilder = memoize((userId, includeOrders) => {
  // Expensive query building logic
  return sql`SELECT * FROM users WHERE id = ${sql.value(userId)}`;
});
```

### Array Deduplication

```js
function deduplicateQueries(queries) {
  const unique = [];

  for (const query of queries) {
    const isUnique = !unique.some((existing) =>
      sql.isEquivalent(query, existing),
    );

    if (isUnique) {
      unique.push(query);
    }
  }

  return unique;
}

const queries = [
  sql`SELECT * FROM users WHERE id = ${sql.value(1)}`,
  sql`SELECT * FROM users WHERE id = ${sql.value(2)}`,
  sql`SELECT * FROM users WHERE id = ${sql.value(1)}`, // Duplicate
  sql`SELECT * FROM orders WHERE id = ${sql.value(1)}`,
];

const uniqueQueries = deduplicateQueries(queries);
console.log(uniqueQueries.length); // 3 (one duplicate removed)
```

## Return Value

Returns `true` if the SQL fragments are functionally equivalent, `false` otherwise.

## What Makes Queries Equivalent?

Queries are considered equivalent when they have:

1. **Same structure** - Same SQL node types in the same order
2. **Same values** - Identical parameter values
3. **Same identifiers** - Same table/column names (accounting for symbol substitutes)
4. **Same raw SQL** - Identical raw SQL text

## What Makes Queries Different?

Queries are different when they have:

1. **Different values** - Different parameter values
2. **Different structure** - Different SQL fragments or order
3. **Different identifiers** - Different table/column names
4. **Different symbols** - Unless mapped via `symbolSubstitutes`

## Use Cases

1. **Query Caching** - Avoid recompiling equivalent queries
2. **Testing** - Verify query builders produce expected results
3. **Optimization** - Cache expensive optimizations for equivalent queries
4. **Deduplication** - Remove duplicate queries from batches
5. **Memoization** - Cache function results based on query equivalence

## Performance Notes

- Comparison is structural, not string-based
- Fast for simple queries, slower for complex nested structures
- Consider caching comparison results for frequently-compared queries
- Symbol substitution adds overhead - use sparingly

## Best Practices

1. **Use for caching** - Cache compiled queries for equivalent fragments
2. **Test query builders** - Verify functions produce expected equivalent queries
3. **Optimize judiciously** - Don't over-optimize - measure first
4. **Document symbol mappings** - Make symbol substitution rules clear
5. **Consider alternatives** - Sometimes string comparison of compiled SQL is simpler
