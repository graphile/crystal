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

Similar to [`sql.value`](./sql-value.md), but for simple values, writes them directly to the SQL statement rather than using a placeholder when it's safe to do so. This makes the generated SQL more readable for debugging and provides performance benefits by reducing the number of parameters.

If pg-sql2 determines that the value is unsafe to use as a literal, it will automatically fall back to using `sql.value()` instead, ensuring your queries remain secure.

**Recommended for constant values** - Use this for known constants rather than consuming placeholders unnecessarily.

- Not sensitive
- Known to be safe at development time

## Examples

### Safe Usage with Known Values

```js
import sql from "pg-sql2";

// Building JSON objects with known keys
const fields = ["name", "email", "age"];
const jsonQuery = sql`
  SELECT json_build_object(
    ${sql.join(
      fields.map(
        (field) =>
          sql`${sql.literal(field)}, ${sql.identifier("users", field)}`,
      ),
      ", ",
    )}
  ) FROM users
`;
// Generates more readable SQL:
// SELECT json_build_object('name', "users"."name", 'email', "users"."email", 'age', "users"."age") FROM users

// vs with sql.value (less readable):
// SELECT json_build_object($1, "users"."name", $2, "users"."email", $3, "users"."age") FROM users
```

### Constants and Known Values

```js
// Boolean constants
sql`SELECT * FROM users WHERE active = ${sql.literal(true)}`;
// -> SELECT * FROM users WHERE active = TRUE

// Numeric constants - no need to waste a placeholder
sql`SELECT * FROM posts LIMIT ${sql.literal(50)}`;
// -> SELECT * FROM posts LIMIT 50

// String constants for known values
sql`SELECT ${sql.literal("admin")} as role FROM users`;
// -> SELECT 'admin' as role FROM users

// Null constants
sql`UPDATE users SET deleted_at = ${sql.literal(null)} WHERE id = 1`;
// -> UPDATE users SET deleted_at = NULL WHERE id = 1
```

### JSON Building

```js
const reportConfig = {
  title: "User Report",
  format: "pdf",
  includeCharts: true,
};

// Safe because these are application-controlled values
const configSql = sql`
  json_build_object(
    ${sql.literal("title")}, ${sql.value(reportConfig.title)},
    ${sql.literal("format")}, ${sql.value(reportConfig.format)}, 
    ${sql.literal("includeCharts")}, ${sql.literal(reportConfig.includeCharts)}
  )
`;
```

## Comparison with sql.value()

| Aspect          | `sql.literal()`                             | `sql.value()`                |
| --------------- | ------------------------------------------- | ---------------------------- |
| **Security**    | ✅ Safe - falls back to sql.value if unsafe | ✅ Always safe               |
| **Performance** | Better (fewer parameters)                   | Standard                     |
| **Debugging**   | More readable SQL output                    | Less readable (placeholders) |
| **Use Case**    | Constants and known values                  | Dynamic/user values          |

## When to Use

### ✅ Recommended Uses

- Constant numbers: `LIMIT ${sql.literal(50)}`, `OFFSET ${sql.literal(0)}`
- Hard-coded string keys for `json_build_object()`
- Application constants and enums
- Boolean flags: `sql.literal(true)`, `sql.literal(false)`
- Known null values: `sql.literal(null)`

### ❌ Not Recommended

```js
// Use sql.value() for user input instead
const userInput = getUserInput();
sql`SELECT * FROM users WHERE name = ${sql.value(userInput)}`; // Recommended

// ✅ Always use sql.value() for user data
sql`SELECT * FROM users WHERE name = ${sql.value(userInput)}`;

// ❌ NEVER with sensitive data
const password = getPassword();
sql`SELECT * FROM users WHERE password = ${sql.literal(password)}`; // Exposes password in logs!

// ✅ Use sql.value() to keep sensitive data in parameters
sql`SELECT * FROM users WHERE password = ${sql.value(password)}`;
```

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
