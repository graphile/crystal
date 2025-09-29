---
sidebar_position: 4
title: "sql.literal()"
---

# `sql.literal(val)`

Embeds simple values directly into SQL text, falling back to `sql.value(val)`
for more complex values. More readable and efficient than placeholders for
constants.

## Syntax

```typescript
sql.literal(val: string | number | boolean | null): SQL
```

## Parameters

- `val` - A simple value to embed directly. Supported types:
  - `string` - Will be properly escaped with single quotes
  - `number` - Must be finite
  - `boolean` - Converted to `TRUE`/`FALSE`
  - `null` - Converted to `NULL`

## Return Value

Returns a `SQL` fragment with the value embedded directly in the SQL text.

## Examples

```js
// Constants - more efficient than sql.value()
sql`LIMIT ${sql.literal(50)}`; // -> LIMIT 50
sql`WHERE active = ${sql.literal(true)}`; // -> WHERE active = TRUE

// JSON object keys
const fields = ["name", "email"];
sql`json_build_object(${sql.join(
  fields.map((f) => sql`${sql.literal(f)}, ${sql.identifier(f)}`),
  ", ",
)})`;
```

## Notes

`sql.literal(val)` _should_ be perfectly safe to use with scalars and arrays
thereof since it performs its own checks and falls back to `sql.value(val)` if
it doesn't think they're safe. That said, you should only use it in positions
where you're using somewhat validated user input (e.g. pagination limits), it's
generally safer to default to `sql.value(val)` for arbitrary data.

`sql.literal(val)` may compile to different SQL for different values, making the
compiled SQL less cacheable (particularly important for prepared statements).
Use for constants and small lists of values, use `sql.value(val)` for values
with high cardinality so that placeholders can be reused.
