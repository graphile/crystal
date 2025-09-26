# API

pg-sql2 provides a comprehensive API for building SQL queries safely and dynamically. All functions are available as methods on the main `sql` export.

## Core Functions

### Template Literal Functions

- [`` sql`...` ``](./sql.md) - The main template literal function for building SQL queries
- [`sql.raw(text)`](./sql-raw.md) - Embed raw SQL text (use with extreme caution)

### Value Handling

- [`sql.identifier(...names)`](./sql-identifier.md) - Create safely escaped SQL identifiers
- [`sql.value(val)`](./sql-value.md) - Embed values using placeholders
- [`sql.literal(val)`](./sql-literal.md) - Embed simple trusted values directly

### Query Building

- [`sql.join(fragments, delimiter)`](./sql-join.md) - Join multiple SQL fragments
- [`sql.parens(fragment, force?)`](./sql-parens.md) - Add parentheses when needed
- [`sql.indent(fragment)`](./sql-indent.md) - Indent SQL for readability
- [`sql.indentIf(condition, fragment)`](./sql-indent-if.md) - Conditionally indent SQL
- [`sql.comment(text)`](./sql-comment.md) - Add SQL comments

### Compilation

- [`sql.compile(query, options?)`](./sql-complie.md) - Compile SQL to text and values

### Advanced Features

- [`sql.withTransformer(transformer, callback)`](./sql-with-transformer.md) - Use custom value transformers
- [`sql.placeholder(symbol, fallback?)`](./sql-placeholder.md) - Create replaceable placeholders
- [`sql.symbolAlias(symbol1, symbol2)`](./sql-symbol-alias.md) - Create symbol aliases

### Utility Functions

- [`sql.isSQL(value)`](./sql-is-sql.md) - Check if a value is a SQL fragment
- [`sql.isEquivalent(sql1, sql2, options?)`](./sql-is-equivalent.md) - Compare SQL fragments for equivalence
- [`sql.replaceSymbol(fragment, needle, replacement)`](./sql-replace-symbol.md) - Replace symbols in SQL fragments
