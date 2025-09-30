---
sidebar_position: 10
title: "sql.comment()"
---

# `sql.comment(text)`

Creates an SQL comment fragment that can be embedded in queries. Comments are
useful for documenting query logic, adding debugging information, or providing
context for complex operations. Comments are ignored during SQL execution but
can be valuable for debugging and maintenance.

:::warning[Do not include user-generated content!]

We do our best to ensure comments are escaped properly, but be cautious to not
include user-generated content in comments, as this could lead to malformed or
vulnerable SQL.

:::

## Syntax

```typescript
sql.comment(text: string): SQL
```

## Parameters

- `text` - The comment text to include

## Return value

Returns a `SQL` fragment containing the properly formatted SQL comment.

## Examples

### Document query

```js
import { sql } from "pg-sql2";

const query = sql`
${sql.comment("Fetch active users with their order counts")}
SELECT u.id, COUNT(o.id) as order_count ...
`;

// `sql.compile(query).text` will be something like:
// /* Fetch active users with their order counts */
// SELECT u.id, COUNT(o.id) as order_count ...
```

### Inline comment

```js
const complexCalculation = sql`
  ${sql.comment(`Calculate total with shipping and tax at ${parseFloat(taxPercentage)}%`)}
  (price + ${sql.value(deliveryCharge)}) * ${sql.value(1 + taxPercentage / 100)}
`;

sql`
UPDATE orders 
SET total = ${complexCalculation}
WHERE id = ${sql.value(orderId)}
`;
```

### Conditional comments

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

### Comment formatting

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
