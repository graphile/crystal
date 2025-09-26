---
sidebar_position: 16
title: "sql.replaceSymbol()"
---

# `sql.replaceSymbol(fragment, needle, replacement)`

Replaces all occurrences of a symbol with another symbol in a SQL fragment.

## Syntax

```typescript
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

## Description

Creates a new SQL fragment with all instances of the `needle` symbol replaced with the `replacement` symbol. This is useful for query transformation, template instantiation, and dynamic query building where symbol references need to be updated.

## Examples

### Basic Symbol Replacement

```js
import sql from "pg-sql2";

const oldTable = Symbol("users");
const newTable = Symbol("active_users");

const originalQuery = sql`
  SELECT ${sql.identifier(oldTable, "name")}
  FROM ${sql.identifier(oldTable)}
  WHERE ${sql.identifier(oldTable, "status")} = ${sql.value("active")}
`;

const updatedQuery = sql.replaceSymbol(originalQuery, oldTable, newTable);

// Now all references to oldTable use newTable instead
const { text } = sql.compile(updatedQuery);
console.log(text);
// SELECT "active_users"."name" FROM "active_users" WHERE "active_users"."status" = $1
```

### Query Template Instantiation

```js
const TABLE_PLACEHOLDER = Symbol("TABLE");
const ID_COLUMN = Symbol("ID");

// Create a reusable query template
const queryTemplate = sql`
  SELECT COUNT(*) as total
  FROM ${sql.identifier(TABLE_PLACEHOLDER)}
  WHERE ${sql.identifier(TABLE_PLACEHOLDER, ID_COLUMN)} > ${sql.value(0)}
`;

function instantiateTemplate(tableName, idColumn = "id") {
  const tableSymbol = Symbol(tableName);
  const idSymbol = Symbol(idColumn);

  let query = sql.replaceSymbol(queryTemplate, TABLE_PLACEHOLDER, tableSymbol);
  query = sql.replaceSymbol(query, ID_COLUMN, idSymbol);

  return query;
}

// Create specific queries from the template
const userCountQuery = instantiateTemplate("users");
const orderCountQuery = instantiateTemplate("orders");
const productCountQuery = instantiateTemplate("products", "product_id");
```

### Dynamic Table Switching

```js
class DatabaseQuery {
  constructor(tableName) {
    this.tableSymbol = Symbol("table");
    this.baseQuery = sql`
      SELECT * FROM ${sql.identifier(this.tableSymbol)}
      WHERE ${sql.identifier(this.tableSymbol, "active")} = true
    `;
  }

  withTable(newTableName) {
    const newTableSymbol = Symbol(newTableName);
    const newQuery = sql.replaceSymbol(
      this.baseQuery,
      this.tableSymbol,
      newTableSymbol,
    );

    const newInstance = Object.create(this.constructor.prototype);
    newInstance.tableSymbol = newTableSymbol;
    newInstance.baseQuery = newQuery;
    return newInstance;
  }

  compile() {
    return sql.compile(this.baseQuery);
  }
}

// Usage
const baseQuery = new DatabaseQuery("users");
const orderQuery = baseQuery.withTable("orders");
const productQuery = baseQuery.withTable("products");
```

### Multi-tenant Query Transformation

```js
const TENANT_TABLE = Symbol("tenant_table");
const MAIN_TABLE = Symbol("main_table");

const multiTenantTemplate = sql`
  SELECT 
    ${sql.identifier(MAIN_TABLE, "id")},
    ${sql.identifier(MAIN_TABLE, "name")},
    ${sql.identifier(TENANT_TABLE, "tenant_specific_data")}
  FROM ${sql.identifier(MAIN_TABLE)}
  LEFT JOIN ${sql.identifier(TENANT_TABLE)} 
    ON ${sql.identifier(MAIN_TABLE, "id")} = ${sql.identifier(TENANT_TABLE, "main_id")}
`;

function createTenantQuery(mainTable, tenantTable) {
  const mainSymbol = Symbol(mainTable);
  const tenantSymbol = Symbol(tenantTable);

  let query = sql.replaceSymbol(multiTenantTemplate, MAIN_TABLE, mainSymbol);
  query = sql.replaceSymbol(query, TENANT_TABLE, tenantSymbol);

  return query;
}

// Create tenant-specific queries
const userTenantQuery = createTenantQuery("users", "user_tenant_data");
const orderTenantQuery = createTenantQuery("orders", "order_tenant_data");
```

### Query Versioning and Migration

```js
const V1_TABLE = Symbol("v1_table");
const V2_TABLE = Symbol("v2_table");

const legacyQuery = sql`
  SELECT 
    ${sql.identifier(V1_TABLE, "user_name")} as name,
    ${sql.identifier(V1_TABLE, "user_email")} as email
  FROM ${sql.identifier(V1_TABLE)}
  WHERE ${sql.identifier(V1_TABLE, "is_active")} = true
`;

function migrateToV2Schema(query) {
  // Replace old table references with new ones
  return sql.replaceSymbol(query, V1_TABLE, V2_TABLE);
}

const modernQuery = migrateToV2Schema(legacyQuery);
```

### Parameterized Query Builder

```js
class ParameterizedQueryBuilder {
  constructor() {
    this.symbolMap = new Map();
    this.nextId = 0;
  }

  createSymbol(name) {
    const symbol = Symbol(`param_${this.nextId++}`);
    this.symbolMap.set(name, symbol);
    return symbol;
  }

  buildQuery(template, parameters) {
    let query = template;

    for (const [name, value] of Object.entries(parameters)) {
      const placeholder = this.symbolMap.get(name);
      if (placeholder && typeof value === "symbol") {
        query = sql.replaceSymbol(query, placeholder, value);
      }
    }

    return query;
  }
}

// Usage
const builder = new ParameterizedQueryBuilder();
const tableParam = builder.createSymbol("table");
const aliasParam = builder.createSymbol("alias");

const template = sql`
  SELECT * FROM ${sql.identifier(tableParam)} AS ${sql.identifier(aliasParam)}
  WHERE ${sql.identifier(aliasParam, "status")} = ${sql.value("active")}
`;

const userTable = Symbol("users");
const userAlias = Symbol("u");

const finalQuery = builder.buildQuery(template, {
  table: userTable,
  alias: userAlias,
});
```

### Recursive Symbol Replacement

```js
function replaceMultipleSymbols(fragment, replacementMap) {
  let result = fragment;

  for (const [needle, replacement] of replacementMap) {
    result = sql.replaceSymbol(result, needle, replacement);
  }

  return result;
}

const template = sql`
  SELECT ${sql.identifier(Symbol("col1"))}, ${sql.identifier(Symbol("col2"))}
  FROM ${sql.identifier(Symbol("table1"))}
  JOIN ${sql.identifier(Symbol("table2"))} ON condition
`;

const replacements = new Map([
  [Symbol("col1"), Symbol("name")],
  [Symbol("col2"), Symbol("email")],
  [Symbol("table1"), Symbol("users")],
  [Symbol("table2"), Symbol("profiles")],
]);

const instantiated = replaceMultipleSymbols(template, replacements);
```

### Query Composition with Symbol Management

```js
class QueryComposer {
  constructor() {
    this.symbolRegistry = new Map();
  }

  registerSymbol(name, symbol) {
    this.symbolRegistry.set(name, symbol);
  }

  composeQueries(baseQuery, ...modifications) {
    let result = baseQuery;

    for (const modification of modifications) {
      if (modification.replaceSymbol) {
        const { from, to } = modification.replaceSymbol;
        result = sql.replaceSymbol(result, from, to);
      }
    }

    return result;
  }
}

// Usage
const composer = new QueryComposer();
const oldTable = Symbol("old");
const newTable = Symbol("new");

const baseQuery = sql`SELECT * FROM ${sql.identifier(oldTable)}`;

const modifiedQuery = composer.composeQueries(baseQuery, {
  replaceSymbol: { from: oldTable, to: newTable },
});
```

### Testing Query Transformations

```js
describe("Query Symbol Replacement", () => {
  test("should replace all symbol occurrences", () => {
    const oldSym = Symbol("old");
    const newSym = Symbol("new");

    const query = sql`
      SELECT ${sql.identifier(oldSym, "name")}
      FROM ${sql.identifier(oldSym)}
      WHERE ${sql.identifier(oldSym, "id")} = ${sql.value(1)}
    `;

    const replaced = sql.replaceSymbol(query, oldSym, newSym);
    const { text } = sql.compile(replaced);

    // Should contain new symbol identifier multiple times
    expect(text).toContain('"new"');
    expect(text).not.toContain('"old"');
  });

  test("should not affect unrelated symbols", () => {
    const target = Symbol("target");
    const other = Symbol("other");
    const replacement = Symbol("replacement");

    const query = sql`
      SELECT * FROM ${sql.identifier(target)}, ${sql.identifier(other)}
    `;

    const replaced = sql.replaceSymbol(query, target, replacement);
    const { text } = sql.compile(replaced);

    expect(text).toContain('"replacement"');
    expect(text).toContain('"other"');
    expect(text).not.toContain('"target"');
  });
});
```

## Return Value

Returns a new `SQL` fragment with all occurrences of the `needle` symbol replaced with the `replacement` symbol. The original fragment is not modified.

## Behavior

- **Immutable** - Creates a new fragment, doesn't modify the original
- **Deep replacement** - Replaces symbols in nested fragments
- **Type preservation** - Maintains the structure and types of SQL nodes
- **Complete replacement** - Replaces ALL occurrences of the needle symbol

## Use Cases

1. **Template instantiation** - Replace placeholder symbols with actual table/column symbols
2. **Query transformation** - Modify existing queries for different contexts
3. **Multi-tenancy** - Switch table references for different tenants
4. **Schema migration** - Update queries to use new table names
5. **Dynamic query building** - Build queries with runtime-determined symbols
6. **Testing** - Create test variants of production queries

## Best Practices

1. **Use descriptive symbols** - Make symbol purposes clear through naming
2. **Document replacements** - Comment what symbols are being replaced and why
3. **Validate replacements** - Ensure replacement symbols are appropriate
4. **Consider performance** - Symbol replacement creates new objects
5. **Test thoroughly** - Verify all symbol occurrences are replaced correctly

## Notes

- Only replaces exact symbol matches (not symbol descriptions)
- Replacement is recursive through the entire fragment tree
- Creates new SQL fragment objects, original is unchanged
- Symbols are compared by reference, not by description
- Useful for creating flexible, reusable query templates

## Related Functions

- [`sql.symbolAlias(symbol1, symbol2)`](./sql-symbol-alias.md) - Create symbol aliases
- [`sql.isEquivalent(sql1, sql2, options)`](./sql-is-equivalent.md) - Compare fragments with symbol substitution
