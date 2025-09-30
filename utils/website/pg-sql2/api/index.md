# API

pg-sql2 provides a comprehensive API for building SQL queries safely and
dynamically without risking SQL injection. All functions are available as
methods on the main `sql` export. It's designed for use with PostgreSQL, but
many features are applicable to other SQL databases as well.

## Core functions

### Template literal function

- [`` sql`...` ``](./sql.md) - The main template literal function for building
  SQL queries, supports embedding other SQL fragments (only! no raw values)

### Compilation

- [`sql.compile(query, options?)`](./sql-compile.md) - Compile SQL to `text` and `values` ready for execution

### Value handling

- [`sql.value(val)`](./sql-value.md) - Embed user values using placeholders
  (avoid SQLi)
- [`sql.literal(val)`](./sql-literal.md) - Embed simple values directly if safe; fall back to `sql.value(val)` otherwise

### Common expressions

- `sql.true` - equivalent to ``sql`true` ``
- `sql.false` - equivalent to ``sql`false` ``
- `sql.null` - equivalent to ``sql`null` ``
- `sql.blank` - equivalent to `sql`` `

### Query building

- [`sql.join(fragments, delimiter)`](./sql-join.md) - Join multiple SQL fragments together
- [`sql.identifier(...names)`](./sql-identifier.md) - Create safely escaped SQL identifiers
- [`sql.parens(fragment, force?)`](./sql-parens.md) - Add parentheses when needed
- [`sql.indent(fragment)`](./sql-indent.md) - Indent SQL for readability
- [`sql.indentIf(condition, fragment)`](./sql-indent-if.md) - Conditionally indent SQL

### Advanced features

Most users won't need these, but they are available for advanced use cases:

- [`sql.comment(text)`](./sql-comment.md) - Add SQL comments
- [`sql.placeholder(symbol, fallback?)`](./sql-placeholder.md) - Create replaceable placeholders
- [`sql.withTransformer(transformer, callback)`](./sql-with-transformer.md) - Allow non-SQL values to be interpolated
- [`sql.isSQL(value)`](./sql-is-sql.md) - Check if a value is a SQL fragment
- [`sql.isEquivalent(sql1, sql2, options?)`](./sql-is-equivalent.md) - Compare SQL fragments for equivalence
- [`sql.symbolAlias(symbol1, symbol2)`](./sql-symbol-alias.md) - Create symbol aliases (e.g. when merging fragments)
- [`sql.replaceSymbol(fragment, needle, replacement)`](./sql-replace-symbol.md) - Replace symbols in SQL fragments

### Escape hatch

:::danger[HIGHLY DISCOURAGED]

This method bypasses all SQL injection protections. There are almost always
better solutions. If you use `sql.raw` you're defeating the purpose of the
library and opening yourself up to SQL injection vulnerabilities.

**EXTREME CAUTION ADVISED.**

:::

- [`sql.raw(text)`](./sql-raw.md) - ⚠️ **DANGER** ⚠️ Embed raw, dynamic, SQL text
