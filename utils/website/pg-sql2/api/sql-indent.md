---
sidebar_position: 10
title: "sql.indent()"
---

# `sql.indent(fragment)`

Adds indentation to SQL fragments for better readability when pretty-printing queries.

## Syntax

```typescript
sql.indent(fragment: SQL): SQL
sql.indent(strings: TemplateStringsArray, ...values: Array<SQL>): SQL
```

## Parameters

- `fragment` - SQL fragment to indent
- Alternative: Template literal form with `strings` and `values`

## Description

Wraps the given SQL fragment so that it will be indented when the query is compiled and formatted. This is primarily useful for improving the readability of complex, nested SQL queries.

## Examples

### Basic Indentation

```js
import sql from "pg-sql2";

const innerSelect = sql.indent(sql`
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  WHERE created_at > NOW() - interval '1 year'
  GROUP BY user_id
`);

const query = sql`
WITH recent_orders AS (
${innerSelect}
)
SELECT u.name, ro.order_count
FROM users u
JOIN recent_orders ro ON u.id = ro.user_id
`;

console.log(sql.compile(query).text);
// The inner SELECT will be indented relative to the WITH clause
```

### Template Literal Form

```js
// You can also use sql.indent as a template literal
const conditions = sql`status = ${sql.value("active")} AND age > ${sql.value(18)}`;

const query = sql`
SELECT * FROM users
WHERE ${sql.indent`
  ${conditions}
  AND (
    premium_member = true
    OR trial_expires > NOW()
  )
`}
`;
```

### Nested Indentation

```js
const deeplyNestedQuery = sql`
SELECT *
FROM users u
WHERE EXISTS (
${sql.indent(sql`
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id
  AND EXISTS (
  ${sql.indent(sql`
    SELECT 1 FROM order_items oi
    WHERE oi.order_id = o.id
    AND oi.product_id IN (${sql.value([1, 2, 3])})
  `)}
  )
`)}
)
`;
```

### Conditional Indentation

```js
// Use sql.indentIf for conditional indentation
const shouldIndent = process.env.NODE_ENV === "development";

const query = sql`
SELECT * FROM users
${sql.indentIf(
  shouldIndent,
  sql`
  WHERE status = ${sql.value("active")}
  AND created_at > ${sql.value(new Date())}
`,
)}
`;
```

### Complex Query Building

```js
function buildComplexReport(filters) {
  const userFilters = [];
  if (filters.status) {
    userFilters.push(sql`u.status = ${sql.value(filters.status)}`);
  }
  if (filters.minAge) {
    userFilters.push(sql`u.age >= ${sql.value(filters.minAge)}`);
  }

  const orderFilters = [];
  if (filters.minAmount) {
    orderFilters.push(sql`o.total >= ${sql.value(filters.minAmount)}`);
  }
  if (filters.dateRange) {
    orderFilters.push(
      sql`o.created_at BETWEEN ${sql.value(filters.dateRange.start)} AND ${sql.value(filters.dateRange.end)}`,
    );
  }

  const userWhereClause =
    userFilters.length > 0
      ? sql.indent(sql`WHERE ${sql.join(userFilters, " AND ")}`)
      : sql``;

  const orderWhereClause =
    orderFilters.length > 0
      ? sql.indent(sql`WHERE ${sql.join(orderFilters, " AND ")}`)
      : sql``;

  return sql`
WITH filtered_users AS (
${sql.indent(sql`
  SELECT id, name, email 
  FROM users u
  ${userWhereClause}
`)}
),
user_orders AS (
${sql.indent(sql`
  SELECT 
    fu.id as user_id,
    fu.name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
  FROM filtered_users fu
  LEFT JOIN orders o ON fu.id = o.user_id
  ${orderWhereClause}
  GROUP BY fu.id, fu.name
`)}
)
SELECT * FROM user_orders
ORDER BY total_spent DESC
`;
}
```

### Pretty Printing Configuration

```js
// The actual indentation behavior depends on how you display the compiled SQL
const query = sql`
SELECT name,
${sql.indent(sql`
  email,
  phone,
  address
`)}
FROM users
`;

// When pretty-printed (implementation dependent):
// SELECT name,
//   email,
//   phone,
//   address
// FROM users
```

## Use with sql.indentIf()

For conditional indentation based on runtime conditions:

```js
const isDevelopment = process.env.NODE_ENV === "development";

const query = sql`
SELECT u.name,
${sql.indentIf(
  isDevelopment,
  sql`
  u.email,
  u.created_at,
  u.last_login
`,
)}
FROM users u
WHERE u.active = true
`;

// In development: includes indented extra fields
// In production: simpler query without extra indentation
```

## Return Value

Returns a `SQL` fragment that will be indented when compiled with pretty-printing enabled.

## Notes

- Indentation is primarily cosmetic and doesn't affect query execution
- The actual indentation rendering depends on the SQL formatter you use
- Nested `sql.indent()` calls create deeper indentation levels
- Indentation can make debugging and logging much easier to read

## Best Practices

1. **Use for readability** - Indent complex subqueries and nested structures
2. **Consistent style** - Apply indentation consistently across your codebase
3. **Development vs Production** - Consider using `sql.indentIf()` to add formatting only in development
4. **Don't over-indent** - Too much indentation can make queries harder to read

## Related Functions

- [`sql.indentIf(condition, fragment)`](./sql-indent-if.md) - Conditional indentation
- [`sql.comment(text)`](./sql-comment.md) - Add explanatory comments to queries
