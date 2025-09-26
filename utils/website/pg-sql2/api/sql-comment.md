---
sidebar_position: 11
title: "sql.comment()"
---

# `sql.comment(text)`

Adds SQL comments to queries for documentation and debugging purposes.

## Syntax

```typescript
sql.comment(text: string): SQLCommentNode | SQLRawNode
```

## Parameters

- `text` - The comment text to include

## Description

Creates an SQL comment fragment that can be embedded in queries. Comments are useful for documenting query logic, adding debugging information, or providing context for complex operations. Comments are ignored during SQL execution but can be valuable for debugging and maintenance.

## Examples

### Basic Comments

```js
import sql from "pg-sql2";

const query = sql`
${sql.comment("Fetch active users with their order counts")}
SELECT 
  u.id,
  u.name,
  COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = ${sql.value("active")}
GROUP BY u.id, u.name
`;

// Generates SQL like:
// /* Fetch active users with their order counts */
// SELECT u.id, u.name, COUNT(o.id) as order_count...
```

### Inline Comments

```js
const complexCalculation = sql`
  ${sql.comment("Calculate total with tax and shipping")}
  (price + ${sql.value(5.99)}) * ${sql.value(1.08)}
`;

sql`
UPDATE orders 
SET total = ${complexCalculation}
WHERE id = ${sql.value(orderId)}
`;
```

### Debugging Comments

```js
function buildUserQuery(filters) {
  const conditions = [];

  if (filters.status) {
    conditions.push(sql`
      ${sql.comment(`Filter by status: ${filters.status}`)}
      status = ${sql.value(filters.status)}
    `);
  }

  if (filters.ageRange) {
    conditions.push(sql`
      ${sql.comment(`Age range: ${filters.ageRange.min}-${filters.ageRange.max}`)}
      age BETWEEN ${sql.value(filters.ageRange.min)} AND ${sql.value(filters.ageRange.max)}
    `);
  }

  const whereClause =
    conditions.length > 0 ? sql`WHERE ${sql.join(conditions, " AND ")}` : sql``;

  return sql`
    ${sql.comment("Dynamic user query with filters")}
    SELECT * FROM users
    ${whereClause}
  `;
}
```

### Section Comments

```js
const reportQuery = sql`
${sql.comment("=== USER DEMOGRAPHICS REPORT ===")}

${sql.comment("1. Base user data")}
WITH user_base AS (
  SELECT 
    id, name, age, status, created_at
  FROM users 
  WHERE active = true
),

${sql.comment("2. Order statistics per user")}
user_orders AS (
  SELECT 
    ub.id,
    COUNT(o.id) as total_orders,
    SUM(o.amount) as total_spent,
    MAX(o.created_at) as last_order_date
  FROM user_base ub
  LEFT JOIN orders o ON ub.id = o.user_id
  GROUP BY ub.id
),

${sql.comment("3. Final aggregation by age group")}
SELECT 
  CASE 
    WHEN age < 25 THEN '18-24'
    WHEN age < 35 THEN '25-34'
    WHEN age < 50 THEN '35-49'
    ELSE '50+'
  END as age_group,
  COUNT(*) as user_count,
  AVG(uo.total_orders) as avg_orders,
  AVG(uo.total_spent) as avg_spent
FROM user_base ub
JOIN user_orders uo ON ub.id = uo.id
GROUP BY age_group
ORDER BY age_group
`;
```

### Conditional Comments

```js
const isDevelopment = process.env.NODE_ENV === "development";

function addDebugComments(query, debugInfo) {
  if (!isDevelopment) {
    return query;
  }

  return sql`
    ${sql.comment(`DEBUG: Query generated at ${new Date().toISOString()}`)}
    ${sql.comment(`DEBUG: Filters applied - ${JSON.stringify(debugInfo)}`)}
    ${query}
  `;
}

const query = addDebugComments(
  sql`SELECT * FROM users WHERE status = ${sql.value("active")}`,
  { status: "active", timestamp: Date.now() },
);
```

### Multi-line Comments

```js
const complexQuery = sql`
${sql.comment(`
  This query performs a complex analysis of user engagement:
  1. Calculates user activity scores based on various metrics
  2. Groups users into engagement tiers
  3. Provides summary statistics for each tier
  
  Created by: Data Team
  Last modified: 2024-01-15
  Performance: ~2-3 seconds on production dataset
`)}

WITH user_activity AS (
  -- Implementation details...
  SELECT * FROM users
)
SELECT * FROM user_activity
`;
```

### Performance Annotations

```js
const optimizedQuery = sql`
${sql.comment("PERFORMANCE: This query uses the user_status_created_idx index")}
SELECT u.id, u.name, u.email
FROM users u
${sql.comment("PERFORMANCE: Index scan expected for status + created_at filter")}
WHERE u.status = ${sql.value("premium")}
  AND u.created_at > ${sql.value(thirtyDaysAgo)}
${sql.comment("PERFORMANCE: Consider adding LIMIT if result set is large")}
ORDER BY u.created_at DESC
`;
```

### Version and Change Comments

```js
function buildLegacyCompatibleQuery(useNewFormat = false) {
  return sql`
    ${sql.comment(
      useNewFormat
        ? "v2.1: Using new normalized schema format"
        : "v1.x: Legacy schema format for backward compatibility",
    )}
    
    SELECT 
      ${
        useNewFormat
          ? sql`u.full_name as name`
          : sql`CONCAT(u.first_name, ' ', u.last_name) as name`
      },
      u.email
    FROM ${sql.identifier(useNewFormat ? "users_v2" : "users")} u
  `;
}
```

## Comment Formatting

Comments are automatically formatted with proper SQL comment syntax:

```js
// Single line comments become /* comment */
sql.comment("Single line comment");
// -> /* Single line comment */

// Multi-line comments preserve formatting
sql.comment(`
  Line 1
  Line 2
  Line 3
`);
// -> /*
//      Line 1
//      Line 2
//      Line 3
//    */
```

## Return Value

Returns a `SQLCommentNode` or `SQLRawNode` containing the properly formatted SQL comment.

## Best Practices

1. **Document complex logic** - Explain non-obvious query patterns
2. **Add debugging info** - Include context for troubleshooting
3. **Performance notes** - Document expected performance characteristics
4. **Version information** - Track query changes over time
5. **Remove in production** - Consider stripping comments in production builds for smaller queries

## Notes

- Comments don't affect query execution performance
- Comments are preserved in compiled SQL output
- Multi-line comments are properly escaped
- Comments can be conditionally included based on environment
- Useful for query debugging and maintenance

## Environment-Specific Usage

```js
const includeComments = process.env.INCLUDE_SQL_COMMENTS === "true";

function maybeComment(text) {
  return includeComments ? sql.comment(text) : sql``;
}

const query = sql`
${maybeComment("Development query with debugging enabled")}
SELECT * FROM users 
WHERE status = ${sql.value("active")}
`;
```
