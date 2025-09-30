---
sidebar_position: 3
title: "sql.value()"
---

# `sql.value(val)`

Represents an SQL value that will be replaced with a placeholder (e.g., `$1`,
`$2`) in the compiled SQL statement. During [compile](./sql-compile.md), the
`text` will include these placeholders, and `values` will contain the values,
thereby preventing SQL injection.

## Syntax

```typescript
sql.value(val: SQLRawValue): SQL
```

Where:

```ts
export type SQLRawValue =
  | string
  | number
  | boolean
  | null
  | ReadonlyArray<SQLRawValue>;
```

## Parameters

- `val` - The value to embed. Supported types:
  - `string`
  - `number`
  - `boolean`
  - `null`
  - `ReadonlyArray<SQLRawValue>` (for arrays)

:::warning[Parameter is not validated!]

We deliberately do not validate the parameter. We will use a placeholder in the
compile SQL to represent it in the `text`, and it will be output it in the
`values` list in the relevant position, but it's down to you to ensure that your
PostgreSQL driver will not misinterpret the value. For example, the `pg` driver
has special behavior when it receives an object in `values`.

:::

## Return Value

Returns a `SQL` fragment representing the parameterized value that can be embedded in other SQL expressions.

## Examples

### Scalars

```js
import sql from "pg-sql2";

const name = "Alice";
const age = 25;
const active = true;
const query = sql`
  SELECT *
  FROM users
  WHERE name = ${sql.value(name)}
  AND age > ${sql.value(age)}
  AND active = ${sql.value(active)}
  AND deleted_at = ${sql.value(null)}
`;
const { text, values } = sql.compile(query);
// text:
//   SELECT *
//   FROM users
//   WHERE name = $1
//   AND age > $2
//   AND active = $3
//   AND deleted_at = $4
// values: ['Alice', 25, true, null]
```

### Array Values

```js
// Array of values (useful for IN clauses)
const ids = [1, 2, 3, 4];
sql`SELECT * FROM users WHERE id = ANY(${sql.value(ids)})`;
// Compiles to: SELECT * FROM users WHERE id = ANY($1)
// Values: [[1, 2, 3, 4]]

// Nested arrays
const coordinates = [
  [1, 2],
  [3, 4],
];
sql`SELECT * FROM locations WHERE coords = ${sql.value(coordinates)}`;
```

## Notes

Values are output verbatim, make sure that they are encoded correctly before
being passed to your database driver. Typically **objects are NOT valid values**
and you must instead serialize them first.

Values are completely isolated from the SQL text, preventing injection

## Advanced Usage

Since values are passed through as-is, you can use symbols to represent values that will be provided later.

```js
const organizationId = 10;
const $$username = Symbol("username");
const query = sql`
  SELECT *
  FROM users
  WHERE organization_id = ${sql.value(organizationId)}
  AND username = ${sql.value($$username)}
`;
const { text, values: valuesIncludingSymbols } = sql.compile(query);

// When it's time to run the query, you can replace the symbol with an actual value:
const values = valuesIncludingSymbols.map((v) =>
  v === $$username ? "benjie" : v,
);

const results = await pgClient.query({ text, values });
```
