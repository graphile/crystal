---
sidebar_position: 17
title: "sql.indentIf()"
---

# `sql.indentIf(condition, fragment)`

Conditionally adds indentation to SQL fragments based on a boolean condition.
Useful for applying formatting only in certain environments or configurations.

**ONLY** indents when `GRAPHILE_ENV` envvar is set to `development` or `test`.

See also: [`sql.indent(fragment)`](./sql-indent.md)

## Syntax

```typescript
sql.indentIf(condition: boolean, fragment: SQL): SQL
```

## Parameters

- `condition` - Boolean condition that determines whether to apply indentation
- `fragment` - The SQL fragment to potentially indent

## Return Value

Returns the `fragment` wrapped with indentation if `condition` is `true`, otherwise returns the `fragment` unchanged.

## Examples

```js
const conditions = getSqlConditions();
const joinClause = sql`on ${sql.parens(
  sql.indentIf(conditions.length > 1, conditions),
)}`;
```
