---
sidebar_position: 14
title: "sql.isSQL()"
---

# `sql.isSQL(value)`

Type guard function that checks whether a value is a valid SQL fragment.

## Syntax

```typescript
sql.isSQL(value: unknown): value is SQL
```

## Parameters

- `value` - Any value to check

## Description

Returns `true` if the provided value is a valid pg-sql2 SQL fragment (`SQLNode` or `SQLQuery`), `false` otherwise. This is useful for type checking and validation when building dynamic queries.

## Examples

### Basic Type Checking

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

### Validating Dynamic Input

```js
function buildQuery(fragments) {
  // Validate all fragments before using them
  for (const fragment of fragments) {
    if (!sql.isSQL(fragment)) {
      throw new Error(`Invalid SQL fragment: ${typeof fragment}`);
    }
  }

  return sql`
    SELECT * FROM users
    WHERE ${sql.join(fragments, " AND ")}
  `;
}

// Safe usage
const validFragments = [
  sql`status = ${sql.value("active")}`,
  sql`age > ${sql.value(18)}`,
];

const query = buildQuery(validFragments); // Works fine

// This would throw an error
try {
  buildQuery(["invalid", 123, null]);
} catch (error) {
  console.error(error.message); // "Invalid SQL fragment: string"
}
```

### Conditional Query Building

```js
function addOptionalCondition(baseQuery, condition) {
  if (condition && sql.isSQL(condition)) {
    return sql`${baseQuery} AND ${condition}`;
  }
  return baseQuery;
}

const baseQuery = sql`SELECT * FROM users WHERE active = true`;

// Add condition if it's valid SQL
const withCondition = addOptionalCondition(
  baseQuery,
  sql`role = ${sql.value("admin")}`,
);

// Ignore invalid conditions
const unchanged = addOptionalCondition(baseQuery, "invalid string");
```

### Array Processing

```js
function combineConditions(conditions) {
  // Filter to only valid SQL fragments
  const validConditions = conditions.filter(sql.isSQL);

  if (validConditions.length === 0) {
    return sql``; // Empty fragment
  }

  return sql`WHERE ${sql.join(validConditions, " AND ")}`;
}

const mixedInput = [
  sql`status = ${sql.value("active")}`,
  "invalid string", // Will be filtered out
  sql`age >= ${sql.value(21)}`,
  null, // Will be filtered out
  sql`verified = true`,
];

const whereClause = combineConditions(mixedInput);
// Results in: WHERE status = $1 AND age >= $2 AND verified = true
```

### Plugin System Validation

```js
class QueryBuilder {
  constructor() {
    this.plugins = [];
  }

  addPlugin(plugin) {
    if (typeof plugin.transform !== "function") {
      throw new Error("Plugin must have a transform function");
    }
    this.plugins.push(plugin);
  }

  buildQuery(baseQuery) {
    if (!sql.isSQL(baseQuery)) {
      throw new Error("Base query must be valid SQL");
    }

    let query = baseQuery;

    for (const plugin of this.plugins) {
      const transformed = plugin.transform(query);

      if (!sql.isSQL(transformed)) {
        throw new Error(`Plugin ${plugin.name} returned invalid SQL`);
      }

      query = transformed;
    }

    return query;
  }
}

// Usage
const builder = new QueryBuilder();

builder.addPlugin({
  name: "audit",
  transform: (query) => sql`
    ${query}
    -- Added by audit plugin
  `,
});

const result = builder.buildQuery(sql`SELECT * FROM users`);
```

### Type-Safe Function Parameters

```js
function executeQuery(queryOrString) {
  let query;

  if (sql.isSQL(queryOrString)) {
    // It's already a SQL fragment
    query = queryOrString;
  } else if (typeof queryOrString === "string") {
    // Convert string to raw SQL (dangerous!)
    console.warn("Using raw string as SQL - consider using sql`` instead");
    query = sql.raw(queryOrString);
  } else {
    throw new Error("Query must be SQL fragment or string");
  }

  const { text, values } = sql.compile(query);
  return database.query(text, values);
}

// Safe usage
executeQuery(sql`SELECT * FROM users WHERE id = ${sql.value(123)}`);

// Less safe but handled
executeQuery("SELECT * FROM users");
```

### Debugging and Development

```js
function debugQuery(query, label = "Query") {
  if (!sql.isSQL(query)) {
    console.error(`${label} is not valid SQL:`, query);
    return;
  }

  try {
    const { text, values } = sql.compile(query);
    console.log(`${label}:`);
    console.log("  SQL:", text);
    console.log("  Values:", values);
  } catch (error) {
    console.error(`${label} compilation failed:`, error.message);
  }
}

// Debug various query types
debugQuery(sql`SELECT * FROM users`, "User query");
debugQuery("invalid", "Invalid input"); // Will show error
```

### Form Data Processing

```js
function buildSearchQuery(formData) {
  const conditions = [];

  if (formData.name) {
    const nameCondition = sql`name ILIKE ${sql.value(`%${formData.name}%`)}`;
    if (sql.isSQL(nameCondition)) {
      conditions.push(nameCondition);
    }
  }

  if (formData.status) {
    const statusCondition = sql`status = ${sql.value(formData.status)}`;
    if (sql.isSQL(statusCondition)) {
      conditions.push(statusCondition);
    }
  }

  // Custom conditions from advanced users (be careful!)
  if (
    formData.customCondition &&
    typeof formData.customCondition === "object"
  ) {
    if (sql.isSQL(formData.customCondition)) {
      conditions.push(formData.customCondition);
    }
  }

  const whereClause =
    conditions.length > 0 ? sql`WHERE ${sql.join(conditions, " AND ")}` : sql``;

  return sql`SELECT * FROM users ${whereClause}`;
}
```

### Testing Utilities

```js
function assertValidSQL(value, message = "Expected valid SQL") {
  if (!sql.isSQL(value)) {
    throw new Error(`${message}: got ${typeof value}`);
  }
  return value;
}

function createTestQuery() {
  const query = sql`SELECT * FROM test_table WHERE id = ${sql.value(1)}`;

  // Ensure we're returning valid SQL in tests
  return assertValidSQL(query, "Test query should be valid");
}

// In tests
test("should create valid SQL query", () => {
  const query = createTestQuery();
  expect(sql.isSQL(query)).toBe(true);

  const { text, values } = sql.compile(query);
  expect(text).toContain("SELECT * FROM test_table");
  expect(values).toEqual([1]);
});
```

## Return Value

Returns `true` if the value is a valid SQL fragment, `false` otherwise.

## Use Cases

1. **Type Guards** - Validate input parameters in functions
2. **Dynamic Query Building** - Filter valid SQL fragments from mixed arrays
3. **Plugin Systems** - Validate plugin outputs
4. **Debugging** - Check if query building succeeded
5. **Form Processing** - Validate user-provided query fragments
6. **Testing** - Assert that functions return valid SQL

## Best Practices

1. **Validate Early** - Check inputs as soon as possible
2. **Fail Fast** - Throw errors immediately for invalid SQL
3. **Use in Filters** - Filter arrays to only include valid SQL
4. **Document Expectations** - Make it clear when functions expect SQL
5. **Combine with TypeScript** - Use as type guard for better type safety

## Notes

- This function only checks if the value is structurally a SQL fragment
- It doesn't validate that the SQL is syntactically correct
- Use this for type checking, not SQL validation
- Very lightweight operation suitable for frequent use
- Essential for building robust dynamic query systems
