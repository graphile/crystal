---
sidebar_position: 17
title: "sql.indentIf()"
---

# `sql.indentIf(condition, fragment)`

Conditionally adds indentation to SQL fragments based on a boolean condition.

## Syntax

```typescript
sql.indentIf(condition: boolean, fragment: SQL): SQL
```

## Parameters

- `condition` - Boolean condition that determines whether to apply indentation
- `fragment` - The SQL fragment to potentially indent

## Description

Returns an indented version of the fragment if the condition is `true`, otherwise returns the fragment unchanged. This is useful for applying formatting only in certain environments or configurations.

## Examples

### Development vs Production Formatting

```js
import sql from "pg-sql2";

const isDevelopment = process.env.NODE_ENV === "development";

const query = sql`
SELECT name, email
FROM users
${sql.indentIf(
  isDevelopment,
  sql`
  -- Development: include extra debugging fields
  , created_at
  , last_login
  , debug_info
`,
)}
WHERE status = ${sql.value("active")}
`;

// In development: includes indented extra fields
// In production: simpler query without extra indentation
```

### Conditional Debug Information

```js
const includeDebugInfo = process.env.SQL_DEBUG === "true";

function buildUserQuery(userId) {
  return sql`
    SELECT u.name, u.email
    FROM users u
    ${sql.indentIf(
      includeDebugInfo,
      sql`
      -- Debug: User lookup query
      -- Generated at: ${new Date().toISOString()}
      -- User ID: ${userId}
    `,
    )}
    WHERE u.id = ${sql.value(userId)}
  `;
}
```

### Feature Flags

```js
class QueryBuilder {
  constructor(options = {}) {
    this.enablePrettyPrint = options.enablePrettyPrint ?? false;
    this.includeComments = options.includeComments ?? false;
  }

  buildComplexQuery() {
    return sql`
      ${sql.indentIf(this.includeComments, sql`-- Complex analytical query`)}
      WITH user_stats AS (
      ${sql.indentIf(
        this.enablePrettyPrint,
        sql`
        SELECT 
          user_id,
          COUNT(*) as order_count,
          SUM(amount) as total_spent
        FROM orders
        GROUP BY user_id
      `,
      )}
      )
      SELECT * FROM user_stats
    `;
  }
}

// Different configurations
const devBuilder = new QueryBuilder({
  enablePrettyPrint: true,
  includeComments: true,
});

const prodBuilder = new QueryBuilder({
  enablePrettyPrint: false,
  includeComments: false,
});
```

### Conditional Complexity

```js
function createReportQuery(includeDetails = false) {
  return sql`
    SELECT 
      COUNT(*) as user_count,
      AVG(age) as avg_age
      ${sql.indentIf(
        includeDetails,
        sql`
        , MIN(created_at) as earliest_user
        , MAX(created_at) as latest_user
        , COUNT(CASE WHEN status = 'premium' THEN 1 END) as premium_count
      `,
      )}
    FROM users
    WHERE active = true
  `;
}

const basicReport = createReportQuery(false);
const detailedReport = createReportQuery(true);
```

### Environment-Specific Optimizations

```js
const isProduction = process.env.NODE_ENV === "production";
const enableOptimizations = process.env.ENABLE_SQL_OPTIMIZATIONS === "true";

function buildOptimizedQuery() {
  return sql`
    SELECT u.name, u.email
    FROM users u
    ${sql.indentIf(
      !isProduction,
      sql`
      -- Development hint: This query benefits from index on (status, created_at)
    `,
    )}
    ${sql.indentIf(
      enableOptimizations,
      sql`
      USE INDEX (idx_users_status_created)
    `,
    )}
    WHERE u.status = ${sql.value("active")}
      AND u.created_at > ${sql.value(thirtyDaysAgo)}
  `;
}
```

### Conditional Joins

```js
function buildUserQuery(includeProfile = false, includeOrders = false) {
  return sql`
    SELECT u.name, u.email
    ${sql.indentIf(
      includeProfile,
      sql`
      , p.avatar
      , p.bio
    `,
    )}
    ${sql.indentIf(
      includeOrders,
      sql`
      , COUNT(o.id) as order_count
    `,
    )}
    FROM users u
    ${sql.indentIf(
      includeProfile,
      sql`
      LEFT JOIN profiles p ON u.id = p.user_id
    `,
    )}
    ${sql.indentIf(
      includeOrders,
      sql`
      LEFT JOIN orders o ON u.id = o.user_id
    `,
    )}
    WHERE u.active = true
    ${sql.indentIf(
      includeOrders,
      sql`
      GROUP BY u.id, u.name, u.email
      ${sql.indentIf(includeProfile, sql`, p.avatar, p.bio`)}
    `,
    )}
  `;
}
```

### Testing and Debugging

```js
const isTestEnvironment = process.env.NODE_ENV === "test";
const verboseLogging = process.env.VERBOSE_SQL === "true";

function createTestableQuery(entityId) {
  return sql`
    ${sql.indentIf(
      isTestEnvironment,
      sql`
      -- TEST: Query for entity ${entityId}
      -- Expected to return exactly one row
    `,
    )}
    SELECT *
    FROM entities
    ${sql.indentIf(
      verboseLogging,
      sql`
      -- Verbose: Using primary key lookup
    `,
    )}
    WHERE id = ${sql.value(entityId)}
    ${sql.indentIf(
      isTestEnvironment,
      sql`
      -- TEST: Add LIMIT for safety in tests
      LIMIT 1
    `,
    )}
  `;
}
```

### Configuration-Driven Formatting

```js
class SqlFormatter {
  constructor(config) {
    this.prettyPrint = config.prettyPrint ?? false;
    this.includeComments = config.includeComments ?? false;
    this.includePerformanceHints = config.includePerformanceHints ?? false;
  }

  formatQuery(baseQuery, metadata = {}) {
    return sql`
      ${sql.indentIf(
        this.includeComments && metadata.description,
        sql.comment(metadata.description),
      )}
      
      ${sql.indentIf(
        this.includePerformanceHints && metadata.expectedRows,
        sql.comment(`Expected rows: ${metadata.expectedRows}`),
      )}
      
      ${sql.indentIf(this.prettyPrint, sql.indent(baseQuery))}
      ${sql.indentIf(!this.prettyPrint, baseQuery)}
    `;
  }
}

// Usage with different configurations
const devFormatter = new SqlFormatter({
  prettyPrint: true,
  includeComments: true,
  includePerformanceHints: true,
});

const prodFormatter = new SqlFormatter({
  prettyPrint: false,
  includeComments: false,
  includePerformanceHints: false,
});

const query = sql`SELECT * FROM users WHERE active = true`;
const metadata = {
  description: "Fetch all active users",
  expectedRows: "~1000",
};

const devQuery = devFormatter.formatQuery(query, metadata);
const prodQuery = prodFormatter.formatQuery(query, metadata);
```

### Dynamic Query Complexity

```js
function buildAnalyticsQuery(options = {}) {
  const {
    includeTimeBreakdown = false,
    includeGeography = false,
    includeUserSegments = false,
    formatForReporting = false,
  } = options;

  return sql`
    SELECT 
      DATE_TRUNC('day', created_at) as day,
      COUNT(*) as total_orders
      ${sql.indentIf(
        includeTimeBreakdown,
        sql`
        , EXTRACT(hour FROM created_at) as hour
        , COUNT(*) FILTER (WHERE EXTRACT(hour FROM created_at) BETWEEN 9 AND 17) as business_hours_orders
      `,
      )}
      ${sql.indentIf(
        includeGeography,
        sql`
        , country
        , state
        , COUNT(DISTINCT city) as unique_cities
      `,
      )}
      ${sql.indentIf(
        includeUserSegments,
        sql`
        , user_segment
        , AVG(order_value) as avg_order_value
        , PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_value) as median_order_value
      `,
      )}
    FROM orders o
    ${sql.indentIf(
      includeGeography,
      sql`
      JOIN addresses a ON o.shipping_address_id = a.id
    `,
    )}
    ${sql.indentIf(
      includeUserSegments,
      sql`
      JOIN users u ON o.user_id = u.id
    `,
    )}
    WHERE o.status = 'completed'
    GROUP BY 
      DATE_TRUNC('day', created_at)
      ${sql.indentIf(
        includeTimeBreakdown,
        sql`
        , EXTRACT(hour FROM created_at)
      `,
      )}
      ${sql.indentIf(
        includeGeography,
        sql`
        , country, state
      `,
      )}
      ${sql.indentIf(
        includeUserSegments,
        sql`
        , user_segment
      `,
      )}
    ${sql.indentIf(
      formatForReporting,
      sql`
      ORDER BY day DESC, hour ASC
    `,
    )}
  `;
}
```

## Return Value

Returns the `fragment` wrapped with indentation if `condition` is `true`, otherwise returns the `fragment` unchanged.

## Use Cases

1. **Environment-specific formatting** - Pretty-print only in development
2. **Feature flags** - Conditionally include query parts based on configuration
3. **Debug modes** - Add detailed formatting when debugging is enabled
4. **Performance modes** - Skip formatting in production for smaller SQL
5. **Testing** - Include test-specific formatting or comments
6. **User preferences** - Allow users to control query formatting

## Best Practices

1. **Use meaningful conditions** - Make the condition purpose clear
2. **Document conditional behavior** - Explain why formatting is conditional
3. **Consider performance** - Formatting has minimal overhead but can add up
4. **Test both paths** - Ensure queries work with and without indentation
5. **Keep it simple** - Don't overuse conditional formatting

## Notes

- No performance impact when condition is `false`
- Indentation is purely cosmetic and doesn't affect query execution
- Useful for maintaining clean production SQL while allowing development formatting
- Can be nested with other conditional logic
- Works well with environment variables and feature flags

## Related Functions

- [`sql.indent(fragment)`](./sql-indent.md) - Always apply indentation
- [`sql.comment(text)`](./sql-comment.md) - Add conditional comments
- Feature flags and environment-based query building patterns
