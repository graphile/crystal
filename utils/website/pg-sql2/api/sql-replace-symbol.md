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
