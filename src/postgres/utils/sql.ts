import { QueryConfig } from 'pg'
import minify = require('pg-minify')

namespace sql {
  type NestedArray<T> = Array<T> | Array<Array<T>> | Array<Array<Array<T>>> | Array<Array<Array<Array<T>>>>

  /**
   * Many `SQLItem`s make up a `SQL` query. Different types of items are used to
   * determine how the final query should be formatted.
   */
  export type SQLItem =
    { type: 'RAW', text: string } |
    { type: 'IDENTIFIER', names: Array<string | Symbol> } |
    { type: 'VALUE', value: mixed }

  /**
   * An object that represents a dynamicly generated SQL query. This query needs
   * to be compiled before being sent to PostgreSQL.
   */
  export type SQL = Array<SQLItem>

  /**
   * A template string tag that creates a `SQL` query out of some strings and
   * some values. Use this to construct all PostgreSQL queries to avoid SQL
   * injection.
   *
   * Note that using this function, the user *must* specify if they are injecting
   * raw text. This makes a SQL injection vulnerability harder to create.
   */
  export function query (strings: TemplateStringsArray, ...values: Array<SQLItem | NestedArray<SQLItem>>): Array<SQLItem> {
    return strings.reduce<Array<SQLItem>>((items, text, i) =>
      !values[i]
        ? [...items, { type: 'RAW', text }]
        : [...items, { type: 'RAW', text }, ...flatten<SQLItem>(values[i])]
    , [])
  }

  /**
   * Compiles a SQL query (with an optional name) to a query that can be
   * executed by our PostgreSQL driver. Escapes all of the relevant values.
   */
  export function compile (sql: SQL): QueryConfig {
    // Text holds the query string.
    let text = ''

    // Values hold the JavaScript values that are represented in the query
    // string by placeholders. They are eager because they were provided before
    // compile time.
    const values: Array<mixed> = []

    // When we come accross a symbol in our identifier, we create a unique
    // alias for it that shouldn’t be in the users schema. This helps maintain
    // sanity when constructing large SQL queries with many aliases.
    let nextSymbolId = 0
    const symbolToIdentifier = new Map<Symbol, string>()

    for (const item of Array.isArray(sql) ? sql : [sql]) {
      switch (item.type) {
        case 'RAW':
          text += item.text
          break
        // TODO: Identifier escaping? I know `pg-promise` does some of this.
        // Most of the time identifiers are trusted, but this could be a source
        // of SQL injection. Replacing double quotes (") is the minimal
        // implementation.
        case 'IDENTIFIER':
          if (item.names.length === 0)
            throw new Error('Identifier must have a name')

          text += item.names.map(name => {
            if (typeof name === 'string')
              return escapeSQLIdentifier(name)

            // Get the correct identifier string for this symbol.
            let identifier = symbolToIdentifier.get(name)

            // If there is no identifier, create one and set it.
            if (!identifier) {
              identifier = `__local_${nextSymbolId++}__`
              symbolToIdentifier.set(name, identifier)
            }

            // Return the identifier. Since we create it, we won’t have to
            // escape it because we know all of the characters are fine.
            return identifier
          }).join('.')
          break
        case 'VALUE':
          values.push(item.value)
          text += `$${values.length}`
          break
        default:
          throw new Error(`Unexpected SQL item type '${item['type']}'.`)
      }
    }

    // Finally, minify our query text.
    text = minify(text)

    return {
      text,
      values,
    }
  }

  /**
   * Creates a SQL item for some raw SQL text. Just plain ol‘ raw SQL. This
   * method is dangerous though because it involves no escaping, so proceed
   * with caution!
   */
  export const raw = (text: string): SQLItem => ({ type: 'RAW', text })

  /**
   * Creates a SQL item for a SQL identifier. A SQL identifier is anything like
   * a table, schema, or column name. An identifier may also have a namespace,
   * thus why many names are accepted.
   */
  export const identifier = (...names: Array<string | Symbol>): SQLItem => ({ type: 'IDENTIFIER', names })

  /**
   * Creates a SQL item for a value that will be included in our final query.
   * This value will be added in a way which avoids SQL injection.
   */
  export const value = (val: mixed): SQLItem => ({ type: 'VALUE', value: val })

  /**
   * Join some SQL items together seperated by a string. Useful when dealing
   * with lists of SQL items that doesn’t make sense as a SQL query.
   */
  export const join = (items: NestedArray<SQLItem>, seperator?: string): Array<SQLItem> =>
    (items as Array<SQLItem>).reduce<Array<SQLItem>>((currentItems, item, i) =>
      i === 0 || !seperator
        ? [...currentItems, ...flatten(item)]
        : [...currentItems, { type: 'RAW', text: seperator }, ...flatten(item)]
    , [])

  /**
   * Flattens a deeply nested array.
   *
   * @private
   */
  function flatten <T>(array: T | NestedArray<T>): Array<T> {
    if (!Array.isArray(array))
      return [array]

    // Type cheats ahead! Making TypeScript compile here is more important then
    // making the code statically correct.
    return (array as Array<T>).reduce<Array<T>>((currentArray, item) =>
      Array.isArray(item)
        ? [...currentArray, ...flatten(item)]
        : [...currentArray, item]
    , [])
  }

  /**
   * Escapes a SQL identifier. Adapted from the `pg` module.
   *
   * @private
   * @see https://github.com/brianc/node-postgres/blob/a536afb1a8baa6d584bd460e7c1286d75bb36fe3/lib/client.js#L255-L272
   */
  function escapeSQLIdentifier (str: string): string {
    let escaped = '"'

    for (let i = 0; i < str.length; i++) {
      let c = str[i]
      if (c === '"') escaped += c + c
      else escaped += c
    }

    escaped += '"'

    return escaped
  }
}

export default sql
