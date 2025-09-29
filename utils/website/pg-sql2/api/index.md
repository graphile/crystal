# API

pg-sql2 provides a comprehensive API for building SQL queries safely and
dynamically without risking SQL injection. All functions are available as
methods on the main `sql` export. It's designed for use with PostgreSQL, but
many features are applicable to other SQL databases as well.

## Core Functions

### Template Literal Function

- [`` sql`...` ``](./sql.md) - The main template literal function for building
  SQL queries, supports embedding other SQL fragments (only! no raw values)

### Value Handling

- [`sql.value(val)`](./sql-value.md) - Embed user values using placeholders. Be
  sure these values are scalars or arrays thereof
- [`sql.literal(val)`](./sql-literal.md) - Embed simple values directly if safe
  (think: pagination limits), otherwise fall back to placeholders

### Query Building

- [`sql.join(fragments, delimiter)`](./sql-join.md) - Join multiple SQL fragments together
- [`sql.identifier(...names)`](./sql-identifier.md) - Create safely escaped SQL identifiers
- [`sql.parens(fragment, force?)`](./sql-parens.md) - Add parentheses when needed
- [`sql.indent(fragment)`](./sql-indent.md) - Indent SQL for readability
- [`sql.indentIf(condition, fragment)`](./sql-indent-if.md) - Conditionally indent SQL

### Compilation

- [`sql.compile(query, options?)`](./sql-compile.md) - Compile SQL to `text` and `values` ready for execution

### Advanced Features

- [`sql.comment(text)`](./sql-comment.md) - Add SQL comments
- [`sql.isSQL(value)`](./sql-is-sql.md) - Check if a value is a SQL fragment
- [`sql.isEquivalent(sql1, sql2, options?)`](./sql-is-equivalent.md) - Compare SQL fragments for equivalence
- [`sql.placeholder(symbol, fallback?)`](./sql-placeholder.md) - Create replaceable placeholders
- [`sql.withTransformer(transformer, callback)`](./sql-with-transformer.md) - Use custom value transformers (to allow non-SQL values to be safely interpolated)
- [`sql.symbolAlias(symbol1, symbol2)`](./sql-symbol-alias.md) - Create symbol aliases (e.g. when merging fragments)
- [`sql.replaceSymbol(fragment, needle, replacement)`](./sql-replace-symbol.md) - Replace symbols in SQL fragments

### SQL-Injection-Enabling Escape Hatch

- [`sql.raw(text)`](./sql-raw.md) - **DO NOT USE** - Embed raw, dynamic, SQL text
