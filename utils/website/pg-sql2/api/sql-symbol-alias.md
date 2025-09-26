---
sidebar_position: 13
title: "sql.symbolAlias()"
---

# `sql.symbolAlias(symbol1, symbol2)`

Creates an alias relationship between two symbols, making them equivalent in SQL generation.

## Syntax

```typescript
sql.symbolAlias(symbol1: symbol, symbol2: symbol): SQL
```

## Parameters

- `symbol1` - The primary symbol
- `symbol2` - The symbol that should be treated as equivalent to `symbol1`

## Description

Informs pg-sql2 to treat `symbol2` as if it were the same as `symbol1` when generating SQL identifiers. This is useful when you need multiple references to the same logical entity but want them to resolve to the same SQL identifier.

## Examples

### Basic Symbol Aliasing

```js
import sql from "pg-sql2";

const userTable = Symbol("users");
const u = Symbol("u"); // Alias for shorter reference

const aliasDeclaration = sql.symbolAlias(userTable, u);

const query = sql`
  ${aliasDeclaration}
  SELECT ${sql.identifier(u, "name")}, ${sql.identifier(u, "email")}
  FROM ${sql.identifier(userTable)} AS ${sql.identifier(u)}
  WHERE ${sql.identifier(u, "status")} = ${sql.value("active")}
`;

// Both userTable and u will resolve to the same identifier
```

### Join Aliases

```js
const users = Symbol("users");
const orders = Symbol("orders");
const u = Symbol("u");
const o = Symbol("o");

const query = sql`
  ${sql.symbolAlias(users, u)}
  ${sql.symbolAlias(orders, o)}
  
  SELECT 
    ${sql.identifier(u, "name")},
    COUNT(${sql.identifier(o, "id")}) as order_count
  FROM ${sql.identifier(users)} ${sql.identifier(u)}
  LEFT JOIN ${sql.identifier(orders)} ${sql.identifier(o)} 
    ON ${sql.identifier(u, "id")} = ${sql.identifier(o, "user_id")}
  GROUP BY ${sql.identifier(u, "id")}, ${sql.identifier(u, "name")}
`;
```

### Complex Query Building

```js
function createJoinQuery(tableConfigs) {
  const aliases = [];
  const joins = [];

  tableConfigs.forEach((config) => {
    const alias = Symbol(config.alias);
    aliases.push(sql.symbolAlias(config.table, alias));

    if (config.joinCondition) {
      joins.push(sql`
        LEFT JOIN ${sql.identifier(config.table)} ${sql.identifier(alias)}
        ON ${config.joinCondition}
      `);
    }
  });

  return sql`
    ${sql.join(aliases, "")}
    
    SELECT * FROM ${sql.identifier(tableConfigs[0].table)} ${sql.identifier(Symbol(tableConfigs[0].alias))}
    ${sql.join(joins, " ")}
  `;
}

// Usage
const query = createJoinQuery([
  { table: Symbol("users"), alias: "u" },
  {
    table: Symbol("profiles"),
    alias: "p",
    joinCondition: sql`${sql.identifier(Symbol("u"), "id")} = ${sql.identifier(Symbol("p"), "user_id")}`,
  },
]);
```

### Reusable Query Components

```js
class TableRef {
  constructor(tableName, alias) {
    this.table = Symbol(tableName);
    this.alias = Symbol(alias);
    this.aliasDeclaration = sql.symbolAlias(this.table, this.alias);
  }

  field(fieldName) {
    return sql.identifier(this.alias, fieldName);
  }

  tableWithAlias() {
    return sql`${sql.identifier(this.table)} ${sql.identifier(this.alias)}`;
  }
}

// Usage
const users = new TableRef("users", "u");
const orders = new TableRef("orders", "o");

const query = sql`
  ${users.aliasDeclaration}
  ${orders.aliasDeclaration}
  
  SELECT 
    ${users.field("name")},
    ${users.field("email")},
    COUNT(${orders.field("id")}) as order_count
  FROM ${users.tableWithAlias()}
  LEFT JOIN ${orders.tableWithAlias()} 
    ON ${users.field("id")} = ${orders.field("user_id")}
  GROUP BY ${users.field("id")}, ${users.field("name")}, ${users.field("email")}
`;
```

### Conditional Table References

```js
function buildDynamicQuery(useOrdersTable = false) {
  const users = Symbol("users");
  const u = Symbol("u");

  const aliases = [sql.symbolAlias(users, u)];

  if (useOrdersTable) {
    const orders = Symbol("orders");
    const o = Symbol("o");
    aliases.push(sql.symbolAlias(orders, o));

    return sql`
      ${sql.join(aliases, "")}
      
      SELECT 
        ${sql.identifier(u, "name")},
        COUNT(${sql.identifier(o, "id")}) as order_count
      FROM ${sql.identifier(users)} ${sql.identifier(u)}
      LEFT JOIN ${sql.identifier(orders)} ${sql.identifier(o)}
        ON ${sql.identifier(u, "id")} = ${sql.identifier(o, "user_id")}
      GROUP BY ${sql.identifier(u, "id")}, ${sql.identifier(u, "name")}
    `;
  } else {
    return sql`
      ${sql.join(aliases, "")}
      
      SELECT ${sql.identifier(u, "name")}
      FROM ${sql.identifier(users)} ${sql.identifier(u)}
    `;
  }
}
```

### Hierarchical Queries

```js
const categories = Symbol("categories");
const parent = Symbol("parent");
const child = Symbol("child");

const query = sql`
  ${sql.symbolAlias(categories, parent)}
  ${sql.symbolAlias(categories, child)}
  
  WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT 
      ${sql.identifier(parent, "id")},
      ${sql.identifier(parent, "name")},
      ${sql.identifier(parent, "parent_id")},
      0 as level
    FROM ${sql.identifier(categories)} ${sql.identifier(parent)}
    WHERE ${sql.identifier(parent, "parent_id")} IS NULL
    
    UNION ALL
    
    -- Recursive case: child categories  
    SELECT 
      ${sql.identifier(child, "id")},
      ${sql.identifier(child, "name")},
      ${sql.identifier(child, "parent_id")},
      ct.level + 1
    FROM ${sql.identifier(categories)} ${sql.identifier(child)}
    JOIN category_tree ct ON ${sql.identifier(child, "parent_id")} = ct.id
  )
  SELECT * FROM category_tree
  ORDER BY level, name
`;
```

## Return Value

Returns a `SQL` fragment that establishes the symbol alias relationship. This fragment should typically be included at the beginning of your query.

## Use Cases

1. **Table Aliases** - Create shorter references to table symbols
2. **Self-Joins** - Reference the same table multiple times with different aliases
3. **Code Organization** - Keep symbol definitions separate from usage
4. **Dynamic Queries** - Build queries where table references are determined at runtime

## Best Practices

1. **Include at query start** - Place alias declarations at the beginning of queries
2. **Use meaningful names** - Choose descriptive names for both symbols and aliases
3. **Document relationships** - Comment the purpose of each alias
4. **Avoid conflicts** - Ensure alias symbols don't conflict with other uses
5. **Group related aliases** - Keep related alias declarations together

## Notes

- Symbol aliases must be declared before the symbols are used in the query
- Each symbol can have multiple aliases pointing to it
- Aliases are resolved during SQL compilation
- Useful for creating more readable and maintainable query code
- Helps when building queries programmatically with dynamic table references

## Common Patterns

### Query Builder with Aliases

```js
class QueryContext {
  constructor() {
    this.tables = new Map();
    this.aliases = [];
  }

  addTable(tableName, alias) {
    const tableSymbol = Symbol(tableName);
    const aliasSymbol = Symbol(alias);

    this.tables.set(alias, { table: tableSymbol, alias: aliasSymbol });
    this.aliases.push(sql.symbolAlias(tableSymbol, aliasSymbol));

    return aliasSymbol;
  }

  getTable(alias) {
    return this.tables.get(alias);
  }

  field(tableAlias, fieldName) {
    const table = this.getTable(tableAlias);
    return sql.identifier(table.alias, fieldName);
  }

  buildQuery(selectFields, conditions) {
    const fieldList = sql.join(
      selectFields.map((f) => this.field(f.table, f.field)),
      ", ",
    );

    return sql`
      ${sql.join(this.aliases, "")}
      
      SELECT ${fieldList}
      FROM /* ... build FROM and WHERE clauses ... */
      ${conditions ? sql`WHERE ${conditions}` : sql``}
    `;
  }
}
```
