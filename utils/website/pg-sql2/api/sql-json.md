---
sidebar_position: 2.5
title: "sql.json()"
---

# `sql.json(val)`

A simple shorthand for ``sql`${JSON.stringify(val)}::json` ``.

See [sql.value](./sql-value.md).

## Syntax

```ts
sql.json(val: any): SQL
```

## Return value

Returns a `SQL` fragment representing the given JSON value.

## Examples

### Scalars

```js
import { sql } from "pg-sql2";

const lookups = [{ orgId: 42, num: 67 }];
const query = sql`
  SELECT *
  FROM people
  WHERE (organization_id, membership_number) IN (
    SELECT el->>'orgId', el->>'num'
    FROM json_array_elements(${sql.json(lookups)}) el
  )
`;

const { text, values } = sql.compile(query);

console.log(text);
/*
SELECT *
FROM people
WHERE (organization_id, membership_number) IN (
  SELECT el->>'orgId', el->>'num'
  FROM json_array_elements($1::json) el
)
*/

console.log(values);
// ['[{"orgId":42,"num":67}]']
```
