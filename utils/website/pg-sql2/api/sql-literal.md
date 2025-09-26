---
sidebar_position: 4
title: "sql.literal()"
---

# `sql.literal(val)`

Embeds simple, trusted values directly into SQL text rather than using placeholders, for debugging convenience and performance.

## Syntax

```typescript
sql.literal(val: string | number | boolean | null): SQL
```

## Parameters

- `val` - A simple, trusted value to embed directly. Supported types:
  - `string` - Will be properly escaped with single quotes
  - `number` - Must be finite
  - `boolean` - Converted to `TRUE`/`FALSE`
  - `null` - Converted to `NULL`

## Description

Embeds simple values directly in SQL instead of using placeholders when safe. Automatically falls back to `sql.value()` if unsafe. More readable and efficient than placeholders for constants.

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

## Use Cases

- **Constants:** `LIMIT ${sql.literal(50)}`, `OFFSET ${sql.literal(0)}`
- **JSON keys:** `json_build_object(${sql.literal("key")}, value)`
- **Known booleans:** `${sql.literal(true)}`, `${sql.literal(false)}`
- **Application constants and enums**

For user input or sensitive data, use `sql.value()` instead.

## Return Value

Returns a `SQL` fragment with the value embedded directly in the SQL text.

## Error Handling

```js
// Throws error for infinite numbers
sql.literal(Infinity); // Error: Infinite numbers not allowed

// Throws error for unsupported types
sql.literal({}); // Error: Objects not supported
sql.literal([]); // Error: Arrays not supported
```

## Security Warning

Remember: `sql.literal()` bypasses the parameterization that makes pg-sql2 safe. Only use it when you're absolutely certain the data is trusted and not user-controlled.
