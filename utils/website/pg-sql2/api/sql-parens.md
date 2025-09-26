---
sidebar_position: 9
title: "sql.parens()"
---

# `sql.parens(fragment, force?)`

Wraps SQL fragments in parentheses when necessary to prevent ambiguity, or forces parentheses when needed for subqueries or stylistic reasons.

## Syntax

```typescript
sql.parens(fragment: SQL, force?: boolean): SQL
```

## Parameters

- `fragment` - The SQL fragment to potentially wrap in parentheses
- `force` - Optional boolean to force parentheses even if not strictly needed

## Description

Returns the input SQL fragment if it doesn't need parentheses to be safely inserted into another expression, otherwise returns a parenthesized fragment. The function is smart about when parentheses are needed to prevent SQL syntax ambiguity.

## Examples

### Automatic Parentheses Detection

```js
import sql from "pg-sql2";

// Simple values don't need parentheses
sql.parens(sql.value(123)); // -> 123 (no parentheses added)
sql.parens(sql.identifier("users")); // -> "users" (no parentheses added)

// Expressions that could be ambiguous get parentheses
const condition = sql`age > 18 AND status = 'active'`;
sql`SELECT * FROM users WHERE ${sql.parens(condition)} OR admin = true`;
// -> SELECT * FROM users WHERE (age > 18 AND status = 'active') OR admin = true
```

### Function Calls and Complex Expressions

```js
// Function calls need parentheses for property access
const userCount = sql`COUNT(*)`;
sql`SELECT ${sql.parens(userCount)}.some_property`; // Hypothetical example
// -> SELECT (COUNT(*)).some_property

// Mathematical expressions
const calculation = sql`price * ${sql.value(1.1)}`;
sql`SELECT ${sql.parens(calculation)} as total_with_tax FROM products`;
// -> SELECT (price * $1) as total_with_tax FROM products
```

### Forced Parentheses

```js
// Force parentheses for subqueries
const subquery = sql`SELECT id FROM users WHERE active = true`;
sql`SELECT * FROM orders WHERE user_id IN ${sql.parens(subquery, true)}`;
// -> SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE active = true)

// Force parentheses for clarity in complex expressions
const condition = sql`status = 'active'`;
sql`SELECT * FROM users WHERE ${sql.parens(condition, true)} AND age > 18`;
// -> SELECT * FROM users WHERE (status = 'active') AND age > 18
```

### JOIN Conditions

```js
const joinCondition = sql`u.id = p.user_id AND p.active = true`;
sql`
  SELECT * FROM users u
  JOIN profiles p ON ${sql.parens(joinCondition)}
`;
// -> SELECT * FROM users u JOIN profiles p ON (u.id = p.user_id AND p.active = true)
```

### Complex WHERE Clauses

```js
const filters = {
  ageRange: sql`age BETWEEN ${sql.value(18)} AND ${sql.value(65)}`,
  locationFilter: sql`city = ${sql.value("New York")} OR state = ${sql.value("NY")}`,
  statusFilter: sql`status IN (${sql.value(["active", "pending"])})`,
};

sql`
  SELECT * FROM users 
  WHERE ${sql.parens(filters.ageRange)} 
    AND ${sql.parens(filters.locationFilter)}
    AND ${sql.parens(filters.statusFilter)}
`;
// Ensures proper grouping of each filter condition
```

## What Gets Parentheses Automatically

The function automatically adds parentheses for:

- **Complex expressions**: `1 = 2 = false` becomes `(1 = 2) = false`
- **Function calls with property access**: `func().property` becomes `(func()).property`
- **Expressions with operators**: Mathematical or logical operations
- **Multi-part conditions**: AND/OR combinations that could be ambiguous

## What Doesn't Need Parentheses

These are considered "parentheses-safe" and won't get wrapped:

- **Simple placeholders**: `$1`, `$2`, etc.
- **Numbers**: `123`, `45.67`
- **Strings**: `'Hello'`, `'User name'`
- **Simple identifiers**: `"table"."column"`
- **Single function calls**: `COUNT(*)` (unless accessing properties)

## Use Cases

### Subquery Embedding

```js
function buildExistsCondition(table, condition) {
  const subquery = sql`SELECT 1 FROM ${sql.identifier(table)} WHERE ${condition}`;
  return sql`EXISTS ${sql.parens(subquery, true)}`;
}

const hasActiveOrders = buildExistsCondition(
  "orders",
  sql`user_id = users.id AND status = ${sql.value("active")}`,
);

sql`SELECT * FROM users WHERE ${hasActiveOrders}`;
// -> SELECT * FROM users WHERE EXISTS (SELECT 1 FROM "orders" WHERE user_id = users.id AND status = $1)
```

### Mathematical Expressions

```js
const taxRate = 0.08;
const shippingCost = 5.99;

const totalCalculation = sql`
  ${sql.parens(sql`price + ${sql.value(shippingCost)}`)} * 
  ${sql.parens(sql`1 + ${sql.value(taxRate)}`)}
`;

sql`SELECT ${totalCalculation} as total FROM products`;
// -> SELECT (price + $1) * (1 + $2) as total FROM products
```

### Dynamic Filter Building

```js
function buildDynamicWhere(filters) {
  const conditions = [];

  if (filters.name) {
    conditions.push(sql`name ILIKE ${sql.value(`%${filters.name}%`)}`);
  }

  if (filters.status) {
    conditions.push(sql`status = ${sql.value(filters.status)}`);
  }

  if (filters.age) {
    const ageCondition = sql`age >= ${sql.value(filters.age.min)} AND age <= ${sql.value(filters.age.max)}`;
    conditions.push(sql.parens(ageCondition)); // Ensure proper grouping
  }

  return conditions.length > 0
    ? sql`WHERE ${sql.join(conditions, " AND ")}`
    : sql``;
}
```

### CASE Expressions

```js
const caseExpression = sql`
  CASE 
    WHEN age < ${sql.value(18)} THEN ${sql.value("Minor")}
    WHEN age < ${sql.value(65)} THEN ${sql.value("Adult")}
    ELSE ${sql.value("Senior")}
  END
`;

sql`SELECT name, ${sql.parens(caseExpression, true)} as age_group FROM users`;
// Forces parentheses around complex CASE expression for clarity
```

## Return Value

Returns a `SQL` fragment that may or may not be wrapped in parentheses, depending on whether they're needed for syntactic correctness or explicitly forced.

## Performance Notes

- The parentheses detection is lightweight and happens at compile time
- Unnecessary parentheses are avoided when possible for cleaner SQL
- Forced parentheses don't impact performance but may improve readability

## Best Practices

1. **Let the function decide** - Usually you don't need to call `sql.parens()` manually
2. **Force for subqueries** - Always use `force: true` for subqueries in IN, EXISTS, etc.
3. **Use for complex expressions** - When building mathematical or logical expressions dynamically
4. **Consider readability** - Sometimes forced parentheses make SQL easier to understand
