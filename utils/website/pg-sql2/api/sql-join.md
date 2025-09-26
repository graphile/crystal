---
sidebar_position: 5
title: "sql.join()"
---

# `sql.join(arrayOfFragments, delimiter)`

Joins an array of SQL fragments together using a delimiter, useful for building dynamic lists of columns, conditions, or other SQL elements.

## Syntax

```typescript
sql.join(items: ReadonlyArray<SQL>, separator?: string): SQL
```

## Parameters

- `items` - Array of SQL fragments to join
- `separator` - String delimiter to insert between fragments (defaults to empty string)

## Description

Joins an array of `sql` values using the delimiter (which is treated as a raw SQL string). This is essential for building dynamic queries where the number of elements isn't known at compile time.

**Note**: This is for joining SQL fragments, NOT for SQL table joins!

## Examples

### Column Lists

```js
import sql from "pg-sql2";

// Dynamic column selection
const columns = ["name", "email", "age", "status"];
const columnList = sql.join(
  columns.map((col) => sql.identifier(col)),
  ", ",
);

sql`SELECT ${columnList} FROM users`;
// -> SELECT "name", "email", "age", "status" FROM users
```

### WHERE Conditions

```js
const conditions = [
  sql.parens`age > ${sql.value(18)}`,
  sql`status = ${sql.value("active")}`,
  sql`created_at > NOW() - interval '1 year'`,
];

sql`SELECT * FROM users WHERE ${sql.join(conditions, " AND ")}`;
// -> SELECT * FROM users WHERE age > $1 AND status = $2 AND created_at > NOW() - interval '1 year'
```

### Complex Condition Groups

```js
const arrayOfSqlConditions = [sql`a = 1`, sql`b = 2`, sql`c = 3`];

// Better: map conditions and use proper parentheses
sql`WHERE ${sql.join(
  arrayOfSqlConditions.map((c) => sql.parens(c)),
  " AND ",
)}`;
// -> WHERE (a = 1) AND (b = 2) AND (c = 3)

// For OR conditions with parentheses
sql`WHERE ${sql.join(
  arrayOfSqlConditions.map((c) => sql.parens(c)),
  " OR ",
)}`;
// -> WHERE (a = 1) OR (b = 2) OR (c = 3)
```

### JSON Object Construction

```js
const fields = [
  { alias: "userName", column: sql.identifier("user", "name") },
  { alias: "userEmail", column: sql.identifier("user", "email") },
  { alias: "userAge", column: sql.identifier("user", "age") },
];

sql`
  SELECT json_build_object(
    ${sql.join(
      fields.map(({ alias, column }) => sql`${sql.literal(alias)}, ${column}`),
      ",\n    ",
    )}
  ) FROM users
`;
// Generates:
// SELECT json_build_object(
//   'userName', "user"."name",
//   'userEmail', "user"."email",
//   'userAge', "user"."age"
// ) FROM users
```

### INSERT Values

```js
const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

const valueRows = sql.join(
  users.map((user) => sql`(${sql.value(user.name)}, ${sql.value(user.email)})`),
  ", ",
);

sql`INSERT INTO users (name, email) VALUES ${valueRows}`;
// -> INSERT INTO users (name, email) VALUES ($1, $2), ($3, $4)
```

**⚠️ PostgreSQL Parameter Limit:** For large numbers of rows/columns, you may hit PostgreSQL's parameter limit (~65,535). For bulk inserts, consider using PostgreSQL's `json_populate_recordset()`, `json_array_elements()`, or similar JSON-based approaches instead of `sql.join()`.

### JOIN Clauses

```js
const joins = [
  sql`INNER JOIN profiles ON profiles.user_id = users.id`,
  sql`LEFT JOIN orders ON orders.user_id = users.id`,
  sql`LEFT JOIN addresses ON addresses.user_id = users.id`,
];

sql`
  SELECT * FROM users 
  ${sql.join(joins, " ")}
  WHERE users.active = true
`;
// -> SELECT * FROM users
//    INNER JOIN profiles ON profiles.user_id = users.id
//    LEFT JOIN orders ON orders.user_id = users.id
//    LEFT JOIN addresses ON addresses.user_id = users.id
//    WHERE users.active = true
```

### UPDATE SET Clauses

```js
const updates = [
  sql`name = ${sql.value("New Name")}`,
  sql`email = ${sql.value("new@example.com")}`,
  sql`updated_at = NOW()`,
];

sql`UPDATE users SET ${sql.join(updates, ", ")} WHERE id = ${sql.value(123)}`;
// -> UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3

// Note: For constant values, prefer sql.literal() to avoid wasting parameters:
// WHERE id = ${sql.literal(123)} -> WHERE id = 123 (no parameter used)
```

### Empty Arrays

```js
// Handles empty arrays gracefully
const emptyConditions = [];
sql`SELECT * FROM users ${sql.join(emptyConditions, " AND ")}`;
// -> SELECT * FROM users

// Conditional joining
const conditions = [];
if (filters.age) {
  conditions.push(sql`age >= ${sql.value(filters.age)}`);
}
if (filters.status) {
  conditions.push(sql`status = ${sql.value(filters.status)}`);
}

const whereClause =
  conditions.length > 0 ? sql`WHERE ${sql.join(conditions, " AND ")}` : sql``;

sql`SELECT * FROM users ${whereClause}`;
```

## Return Value

Returns a `SQL` fragment containing all the joined elements, or an empty fragment if the array is empty.

## Common Patterns

### Building Dynamic Filters

```js
function buildUserQuery(filters) {
  const conditions = [];

  if (filters.minAge) {
    conditions.push(sql`age >= ${sql.value(filters.minAge)}`);
  }
  if (filters.status) {
    conditions.push(sql`status = ${sql.value(filters.status)}`);
  }
  if (filters.searchTerm) {
    conditions.push(sql`name ILIKE ${sql.value(`%${filters.searchTerm}%`)}`);
  }

  const whereClause =
    conditions.length > 0 ? sql`WHERE ${sql.join(conditions, " AND ")}` : sql``;

  return sql`SELECT * FROM users ${whereClause}`;
}
```

### Bulk Operations

```js
// Bulk insert with multiple value sets
function insertMultipleUsers(users) {
  const valueRows = sql.join(
    users.map(
      (user) => sql`(
      ${sql.value(user.name)}, 
      ${sql.value(user.email)}, 
      ${sql.value(user.role)}
    )`,
    ),
    ", ",
  );

  return sql`
    INSERT INTO users (name, email, role) 
    VALUES ${valueRows}
  `;
}
```
