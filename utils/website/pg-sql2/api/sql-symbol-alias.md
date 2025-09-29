---
sidebar_position: 13
title: "sql.symbolAlias()"
---

# `sql.symbolAlias(symbol1, symbol2)`

**ADVANCED** - most users will not need this function.

Creates a "blank" SQL fragment to include into a query to inform pg-sql2 to
treat `symbol2` as if it were the same as `symbol1` when generating SQL
identifiers. Useful in deduplication when you find out two symbols are
equivalent.

## Syntax

```typescript
sql.symbolAlias(symbol1: symbol, symbol2: symbol): SQL
```

## Parameters

- `symbol1` - The primary symbol
- `symbol2` - The symbol that should be treated as equivalent to `symbol1`

## Return Value

Returns a `SQL` fragment that establishes the symbol alias relationship. This
fragment needs to be included in the final query to take effect, typically at
the beginning of the query.

## Examples

### Basic Symbol Aliasing

```js
import sql from "pg-sql2";

const userTable = Symbol("users");
const u = Symbol("u"); // Alias for shorter reference

const aliasDeclaration = sql.symbolAlias(userTable, u);

const query = sql`
  ${aliasDeclaration}
  SELECT ${sql.identifier(u, "name")}, ${sql.identifier(userTable, "email")}
  FROM users AS ${sql.identifier(u)}
`;

// Both userTable and u will resolve to the same identifier
```

## Notes

- Symbol aliases must be declared before the symbols are used in the query
- Each symbol can have multiple aliases pointing to it
- Aliases are resolved during SQL compilation
