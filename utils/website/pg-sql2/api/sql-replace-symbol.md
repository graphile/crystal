---
sidebar_position: 16
title: "sql.replaceSymbol()"
---

# `sql.replaceSymbol(fragment, needle, replacement)`

**ADVANCED** - most users will not need this function.

Creates a new SQL fragment with all instances of the `needle` symbol replaced
with the `replacement` symbol. This is useful for query transformation, template
instantiation, and dynamic query building where symbol references need to be
updated.

:::info[Use of placeholders]

pg-sql2 uses [stable placeholders wrapped in double underscores](./sql-symbol-alias#symbol-placeholders-and-underscores) when using `Symbol`.

:::

## Syntax

```ts
sql.replaceSymbol(
  fragment: SQL,
  needle: symbol,
  replacement: symbol
): SQL
```

## Parameters

- `fragment` - The SQL fragment to modify
- `needle` - The symbol to find and replace
- `replacement` - The symbol to replace with

## Return value

Returns a new `SQL` fragment with all occurrences of the `needle` symbol
replaced with the `replacement` symbol. The original fragment is not modified.

## Examples

### Replacing a table alias

```js
import { sql } from "pg-sql2";

const userFragment = sql.fragment`SELECT * FROM ${sql.identifier(Symbol.for("user"))}`;

const replaced = sql.replaceSymbol(
  userFragment,
  Symbol.for("user"),
  Symbol.for("u"),
);

console.log(sql.compile(replaced).text);
// SELECT * FROM "__u__"
```

### Transforming nested fragments

```js
import { sql } from "pg-sql2";

const tableSym = Symbol("table");
const base = sql.fragment`
  SELECT id FROM ${sql.identifier(tableSym)} WHERE active = true
`;

const ordersQuery = sql.replaceSymbol(base, tableSym, Symbol.for("orders"));
console.log(sql.compile(ordersQuery).text);
// SELECT id FROM __orders__ WHERE active = true

const usersQuery = sql.replaceSymbol(base, tableSym, Symbol.for("users"));
console.log(sql.compile(usersQuery).text);
// SELECT id FROM "__users__" WHERE active = true
```

### Parameterized reuse of fragments

```js
import { sql } from "pg-sql2";

function buildCountQuery(baseFragment, aliasSym) {
  const countSym = Symbol("count_alias");

  const replaced = sql.replaceSymbol(baseFragment, aliasSym, countSym);

  return sql.fragment`
    SELECT COUNT(*) FROM (${replaced}) ${sql.identifier(countSym)}
  `;
}

const aliasSym = Symbol("my_alias");
const baseFragment = sql.fragment`
  SELECT id FROM ${sql.identifier(aliasSym)} WHERE active = true
`;

const query = buildCountQuery(baseFragment, aliasSym);

console.log(sql.compile(query).text);
/*
SELECT COUNT(*) FROM (
SELECT id FROM __count_alias__ WHERE active = true
) __count_alias__
*/
```
