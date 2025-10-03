---
sidebar_position: 10
title: "sql.comment()"
---

# `sql.comment(text, always)`

Creates an SQL comment fragment that can be embedded in queries. Comments are
useful for documenting query logic, adding debugging information, or providing
context for complex operations.

Comments are ignored during SQL execution by default but
can be valuable for debugging and maintenance; comments only appear when
[`GRAPHILE_ENV=development`](../development-mode.md) is set or if `always` is `true`.

:::warning[Do not include user-generated content!]

We do our best to ensure comments are escaped properly, but be cautious to not
include user-generated content in comments, as this could lead to malformed or
vulnerable SQL.

:::

## Syntax

```typescript
sql.comment(text: string, always: true): SQL
```

## Parameters

- `text` - The comment text to include

## Return value

Returns a `SQL` fragment containing the properly formatted SQL comment.

## Examples

### Leading comment

```js
import { sql } from "pg-sql2";

const query = sql`
${sql.comment("Fetch active users with their order counts")}
SELECT u.id, COUNT(o.id) as order_count ...
`;

console.log(sql.compile(query).text);
// /* Fetch active users with their order counts */
// SELECT u.id, COUNT(o.id) as order_count ...
```

### Dynamic comment content

```js
function addDebugComments(query, debugInfo) {
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

### Inline comment

```js
import { sql } from "pg-sql2";

const taxPercentage = 20.0;
const deliveryCharge = 1.99;
const orderId = 123;

const complexCalculation = sql`
  ${sql.comment(`Calculate total with shipping and tax at ${parseFloat(taxPercentage)}%`)}
  (price + ${sql.value(deliveryCharge)}) * ${sql.value(1 + taxPercentage / 100)}
`;

const query = sql`
UPDATE orders 
SET total = ${complexCalculation}
WHERE id = ${sql.value(orderId)}
`;

console.log(sql.compile(query).text);
// UPDATE orders
// SET total =
//   /* Calculate total with shipping and tax at 20% */
//   (price + $1) * $2
// WHERE id = $3

console.log(sql.compile(query).values);
// The values of $1, $2 and $3:
// [1.99, 1.2, 123]
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
