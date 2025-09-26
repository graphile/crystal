---
sidebar_position: 2
title: "sql.identifier()"
---

# `sql.identifier(ident, ...)`

Creates a safely escaped SQL identifier for table names, column names, schema names, and other database object names.

## Syntax

```typescript
sql.identifier(name: string | symbol): SQL
sql.identifier(name1: string | symbol, name2: string | symbol, ...): SQL
```

## Parameters

- `name` - A string or symbol representing an identifier name
- Multiple names can be passed to create qualified identifiers

## Description

Represents a safely escaped SQL identifier. If multiple arguments are passed, each will be escaped individually and then joined with dots (e.g. `"schema"."table"."column"`). This prevents SQL injection when using dynamic table/column names.

## Examples

### Basic Identifiers

```js
import sql from 'pg-sql2';

// Table name
const tableName = 'users';
sql`SELECT * FROM ${sql.identifier(tableName)}`;
// -> SELECT * FROM "users"

// Column name  
const columnName = 'user_name';
sql`SELECT ${sql.identifier(columnName)} FROM users`;
// -> SELECT "user_name" FROM users
```

### Qualified Identifiers

```js
// Schema.table
const schema = 'public';
const table = 'users';
sql`SELECT * FROM ${sql.identifier(schema, table)}`;
// -> SELECT * FROM "public"."users"

// Table.column
sql`SELECT ${sql.identifier('users', 'name')} FROM users`;
// -> SELECT "users"."name" FROM users

// Schema.table.column
sql`SELECT ${sql.identifier('public', 'users', 'email')} FROM public.users`;
// -> SELECT "public"."users"."email" FROM public.users
```

### Using Symbols

Symbols are automatically assigned unique identifiers, useful for aliases:

```js
const alias = Symbol('user_alias');
sql`SELECT u.name FROM users AS ${sql.identifier(alias)}`;
// -> SELECT u.name FROM users AS "__local_0__"
```

### Dynamic Column Selection

```js
const columns = ['id', 'name', 'email', 'created_at'];
const columnList = sql.join(
  columns.map(col => sql.identifier(col)),
  ', '
);

sql`SELECT ${columnList} FROM users`;
// -> SELECT "id", "name", "email", "created_at" FROM users
```

### Handling Special Characters

```js
// Identifiers with spaces or special characters are safely escaped
sql`SELECT * FROM ${sql.identifier('user data')}`;
// -> SELECT * FROM "user data"

sql`SELECT * FROM ${sql.identifier('users-table')}`;  
// -> SELECT * FROM "users-table"
```

## Return Value

Returns a `SQL` fragment representing the escaped identifier that can be embedded in other SQL expressions.

## Notes

- Identifiers are always double-quoted in the output SQL for safety
- Reserved SQL keywords are handled correctly through escaping
- Symbol identifiers are converted to unique string representations
- Multiple arguments create dot-separated qualified identifiers
