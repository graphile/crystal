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

const lookups = [{ org: 42, num: 67 }];
const query = sql`
  SELECT people.*
  FROM people
  INNER JOIN json_to_recordset(${sql.json(lookups)}) AS lookups(org int, num int)
  ON (
    people.organization_id = lookups.org
    AND people.membership_number = lookups.num
  )
`;

const { text, values } = sql.compile(query);

console.log(text);
/*
SELECT *
FROM people
INNER JOIN json_to_recordset($1::json) AS lookups(org int, num int)
ON (
  people.organization_id = lookups.org
  AND people.membership_number = lookups.num
)
*/

console.log(values);
// ['[{"org":42,"num":67}]']
```
