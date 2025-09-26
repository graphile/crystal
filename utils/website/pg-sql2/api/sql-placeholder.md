---
sidebar_position: 12
title: "sql.placeholder()"
---

# `sql.placeholder(symbol, fallback?)`

Creates replaceable placeholders in SQL queries that can be substituted at compile time.

## Syntax

```typescript
sql.placeholder(symbol: symbol, fallback?: SQL): SQLPlaceholderNode
```

## Parameters

- `symbol` - A unique symbol to identify this placeholder
- `fallback` - Optional SQL fragment to use if no replacement is provided

## Description

Creates a placeholder that can be replaced with actual SQL fragments when compiling the query. This is useful for creating reusable query templates where certain parts need to be dynamically substituted.

## Examples

### Basic Placeholder Usage

```js
import sql from "pg-sql2";

// Define placeholder symbols
const TABLE_NAME = Symbol("tableName");
const WHERE_CLAUSE = Symbol("whereClause");

// Create a query template with placeholders
const queryTemplate = sql`
  SELECT * FROM ${sql.placeholder(TABLE_NAME)}
  ${sql.placeholder(WHERE_CLAUSE)}
`;

// Compile with specific replacements
const { text, values } = sql.compile(queryTemplate, {
  placeholderValues: new Map([
    [TABLE_NAME, sql.identifier("users")],
    [WHERE_CLAUSE, sql`WHERE status = ${sql.value("active")}`],
  ]),
});

console.log(text);
// -> SELECT * FROM "users" WHERE status = $1
console.log(values);
// -> ['active']
```

### Placeholder with Fallback

```js
const ORDER_BY = Symbol("orderBy");

// Template with fallback ordering
const queryTemplate = sql`
  SELECT * FROM users
  WHERE status = ${sql.value("active")}
  ${sql.placeholder(ORDER_BY, sql`ORDER BY created_at DESC`)}
`;

// Compile without providing ORDER_BY replacement - uses fallback
const defaultQuery = sql.compile(queryTemplate);
console.log(defaultQuery.text);
// -> SELECT * FROM users WHERE status = $1 ORDER BY created_at DESC

// Compile with custom ordering
const customQuery = sql.compile(queryTemplate, {
  placeholderValues: new Map([[ORDER_BY, sql`ORDER BY name ASC`]]),
});
console.log(customQuery.text);
// -> SELECT * FROM users WHERE status = $1 ORDER BY name ASC
```

### Reusable Query Builder

```js
class QueryBuilder {
  constructor() {
    this.TABLE = Symbol("table");
    this.SELECT = Symbol("select");
    this.WHERE = Symbol("where");
    this.ORDER = Symbol("order");
    this.LIMIT = Symbol("limit");
  }

  buildTemplate() {
    return sql`
      SELECT ${sql.placeholder(this.SELECT, sql`*`)}
      FROM ${sql.placeholder(this.TABLE)}
      ${sql.placeholder(this.WHERE, sql``)}
      ${sql.placeholder(this.ORDER, sql``)}
      ${sql.placeholder(this.LIMIT, sql``)}
    `;
  }

  compile(options) {
    const placeholderValues = new Map();

    if (options.table) {
      placeholderValues.set(this.TABLE, sql.identifier(options.table));
    }

    if (options.select) {
      const selectList = sql.join(
        options.select.map((col) => sql.identifier(col)),
        ", ",
      );
      placeholderValues.set(this.SELECT, selectList);
    }

    if (options.where) {
      placeholderValues.set(this.WHERE, sql`WHERE ${options.where}`);
    }

    if (options.orderBy) {
      placeholderValues.set(
        this.ORDER,
        sql`ORDER BY ${sql.identifier(options.orderBy.column)} ${sql.raw(options.orderBy.direction)}`,
      );
    }

    if (options.limit) {
      placeholderValues.set(this.LIMIT, sql`LIMIT ${sql.value(options.limit)}`);
    }

    return sql.compile(this.buildTemplate(), { placeholderValues });
  }
}

// Usage
const builder = new QueryBuilder();
const query = builder.compile({
  table: "users",
  select: ["name", "email"],
  where: sql`status = ${sql.value("active")}`,
  orderBy: { column: "created_at", direction: "DESC" },
  limit: 10,
});
```

### Conditional Query Parts

```js
const FILTERS = Symbol("filters");
const PAGINATION = Symbol("pagination");

function createUserQuery(options) {
  const template = sql`
    SELECT id, name, email FROM users
    ${sql.placeholder(FILTERS, sql``)}
    ORDER BY created_at DESC
    ${sql.placeholder(PAGINATION, sql``)}
  `;

  const placeholderValues = new Map();

  // Add filters if provided
  if (options.filters) {
    const conditions = [];

    if (options.filters.status) {
      conditions.push(sql`status = ${sql.value(options.filters.status)}`);
    }

    if (options.filters.minAge) {
      conditions.push(sql`age >= ${sql.value(options.filters.minAge)}`);
    }

    if (conditions.length > 0) {
      placeholderValues.set(
        FILTERS,
        sql`WHERE ${sql.join(conditions, " AND ")}`,
      );
    }
  }

  // Add pagination if provided
  if (options.page && options.pageSize) {
    const offset = (options.page - 1) * options.pageSize;
    placeholderValues.set(
      PAGINATION,
      sql`LIMIT ${sql.value(options.pageSize)} OFFSET ${sql.value(offset)}`,
    );
  }

  return sql.compile(template, { placeholderValues });
}

// Usage examples
const activeUsersPage1 = createUserQuery({
  filters: { status: "active" },
  page: 1,
  pageSize: 20,
});

const allUsersUnpaginated = createUserQuery({});
```

### Multi-tenant Query Templates

```js
const TENANT_FILTER = Symbol("tenantFilter");

function createTenantAwareTemplate(tableName) {
  return sql`
    SELECT * FROM ${sql.identifier(tableName)}
    ${sql.placeholder(TENANT_FILTER)}
  `;
}

function compileTenantQuery(template, tenantId, additionalWhere) {
  const conditions = [sql`tenant_id = ${sql.value(tenantId)}`];

  if (additionalWhere) {
    conditions.push(additionalWhere);
  }

  return sql.compile(template, {
    placeholderValues: new Map([
      [TENANT_FILTER, sql`WHERE ${sql.join(conditions, " AND ")}`],
    ]),
  });
}

// Usage
const userTemplate = createTenantAwareTemplate("users");
const tenantUsers = compileTenantQuery(
  userTemplate,
  "tenant_123",
  sql`status = ${sql.value("active")}`,
);
```

### Complex Report Templates

```js
const DATE_FILTER = Symbol("dateFilter");
const GROUP_BY = Symbol("groupBy");
const METRICS = Symbol("metrics");

const reportTemplate = sql`
  WITH filtered_data AS (
    SELECT 
      user_id,
      order_date,
      amount,
      category
    FROM orders
    ${sql.placeholder(DATE_FILTER)}
  )
  SELECT 
    ${sql.placeholder(METRICS)},
    ${sql.placeholder(GROUP_BY)} as grouping_key
  FROM filtered_data
  GROUP BY ${sql.placeholder(GROUP_BY)}
  ORDER BY total_amount DESC
`;

function compileReport(dateRange, groupByField, includeCount = true) {
  const placeholderValues = new Map([
    [
      DATE_FILTER,
      sql`WHERE order_date BETWEEN ${sql.value(dateRange.start)} AND ${sql.value(dateRange.end)}`,
    ],
    [GROUP_BY, sql.identifier(groupByField)],
  ]);

  const metrics = [sql`SUM(amount) as total_amount`];
  if (includeCount) {
    metrics.push(sql`COUNT(*) as order_count`);
  }

  placeholderValues.set(METRICS, sql.join(metrics, ", "));

  return sql.compile(reportTemplate, { placeholderValues });
}
```

## Return Value

Returns a `SQLPlaceholderNode` that will be replaced during compilation if a replacement is provided, or will use the fallback if no replacement is given.

## Error Handling

```js
const REQUIRED_PLACEHOLDER = Symbol("required");

const template = sql`
  SELECT * FROM ${sql.placeholder(REQUIRED_PLACEHOLDER)}
`;

try {
  // This will throw if no replacement is provided and no fallback exists
  sql.compile(template);
} catch (error) {
  console.error("Missing required placeholder:", error.message);
}

// Provide replacement to avoid error
const query = sql.compile(template, {
  placeholderValues: new Map([[REQUIRED_PLACEHOLDER, sql.identifier("users")]]),
});
```

## Best Practices

1. **Use descriptive symbols** - Create symbols with meaningful names
2. **Provide fallbacks** - Include sensible defaults when possible
3. **Document placeholders** - Comment what each placeholder expects
4. **Validate replacements** - Ensure provided replacements are valid SQL
5. **Group related placeholders** - Organize placeholders logically in your code

## Common Patterns

### Plugin System

```js
// Define extension points in base queries
const extensionPoints = {
  ADDITIONAL_FIELDS: Symbol("additionalFields"),
  CUSTOM_JOINS: Symbol("customJoins"),
  EXTRA_CONDITIONS: Symbol("extraConditions"),
};

const baseQuery = sql`
  SELECT 
    id, name, email
    ${sql.placeholder(extensionPoints.ADDITIONAL_FIELDS, sql``)}
  FROM users u
  ${sql.placeholder(extensionPoints.CUSTOM_JOINS, sql``)}
  WHERE status = 'active'
    ${sql.placeholder(extensionPoints.EXTRA_CONDITIONS, sql``)}
`;

// Plugins can extend the base query
function addProfileExtension(query) {
  return sql.compile(query, {
    placeholderValues: new Map([
      [extensionPoints.ADDITIONAL_FIELDS, sql`, p.avatar, p.bio`],
      [
        extensionPoints.CUSTOM_JOINS,
        sql`LEFT JOIN profiles p ON u.id = p.user_id`,
      ],
    ]),
  });
}
```

## Notes

- Placeholders are resolved at compile time, not at runtime
- Each symbol should be unique to avoid conflicts
- Fallbacks are optional but recommended for flexibility
- Placeholders can contain any valid SQL fragment
- Useful for creating flexible, reusable query templates
