---
sidebar_position: 8
title: "sql.indent()"
---

# `sql.indent(fragment)`

Adds indentation to SQL fragments for better readability when pretty-printing
queries. Useful for improving the readability of complex, nested SQL queries.

**ONLY** indents when `GRAPHILE_ENV` envvar is set to `development` or `test`.

## Syntax

```ts
sql.indent(fragment: SQL): SQL
sql.indent`...`
```

## Parameters

- `fragment` - SQL fragment to indent
- Alternative: Template literal form with `strings` and `values`

## Return value

Returns a `SQL` fragment that will be indented when compiled with
pretty-printing enabled.

## Examples

### Basic indentation

```js
import { sql } from "pg-sql2";

const innerSelect = sql`
SELECT user_id, COUNT(*) as order_count
FROM orders
WHERE created_at > NOW() - interval '1 year'
GROUP BY user_id
`;

const query = sql`
WITH recent_orders AS (${sql.indent(innerSelect)})
SELECT u.name, ro.order_count
FROM users u
JOIN recent_orders ro ON u.id = ro.user_id
`;

console.log(sql.compile(query).text);
/*
WITH recent_orders AS (
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  WHERE created_at > NOW() - interval '1 year'
  GROUP BY user_id
)
SELECT u.name, ro.order_count
FROM users u
JOIN recent_orders ro ON u.id = ro.user_id
*/
```

### Template literal form

```js
// You can also use sql.indent as a template literal
const profileConditions = sql.indent`status = ${sql.value("active")} AND age > ${sql.value(18)}`;

const where = sql.indent`
(${profileConditions}) AND (
  premium_member = true
  OR trial_expires > NOW()
)
`;
const query = sql`
SELECT * FROM users
WHERE ${where}
`;

console.log(sql.compile(query).text);
/*
SELECT * FROM users
WHERE 
  (
    status = $1 AND age > $2
  ) AND (
    premium_member = true
    OR trial_expires > NOW()
  )
*/
```

### Nested indentation

```js
const orderItems = sql`
SELECT 1 FROM order_items oi
WHERE oi.order_id = o.id
AND oi.product_id IN (${sql.value([1, 2, 3])})`;

const middle = sql`
SELECT 1 FROM orders o
WHERE o.user_id = u.id
AND EXISTS (${sql.indent(orderItems)})`;

const deeplyNestedQuery = sql`
SELECT *
FROM users u
WHERE EXISTS (${sql.indent(middle)})`;

console.log(sql.compile(deeplyNestedQuery).text);
/*
SELECT *
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id
  AND EXISTS (
    SELECT 1 FROM order_items oi
    WHERE oi.order_id = o.id
    AND oi.product_id IN ($1)
  )
)
*/
```

## Notes

- Indentation is primarily cosmetic and doesn't affect query execution
- The actual indentation rendering depends on the SQL formatter you use
- Nested `sql.indent()` calls create deeper indentation levels
- Indentation can make debugging and logging much easier to read
- There is an extremely small overhead in the PostgreSQL parser for ignoring
  deep indentation, hence removal in production environments
