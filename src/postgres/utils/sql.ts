import { QueryConfig } from 'pg'
import * as minify from 'pg-minify'

namespace sql {
  type NestedArray<T> = Array<T> | Array<Array<T>> | Array<Array<Array<T>>> | Array<Array<Array<Array<T>>>>

  /**
   * Many `SqlItem`s make up a `Sql` query. Different types of items are used to
   * determine how the final query should be formatted.
   */
  export type SqlItem =
    { type: 'RAW', text: string } |
    { type: 'IDENTIFIER', names: Array<string | symbol> } |
    { type: 'VALUE', value: mixed }

  /**
   * An object that represents a dynamicly generated Sql query. This query needs
   * to be compiled before being sent to PostgreSql.
   */
  export type Sql = Array<SqlItem>

  /**
   * A template string tag that creates a `Sql` query out of some strings and
   * some values. Use this to construct all PostgreSql queries to avoid Sql
   * injection.
   *
   * Note that using this function, the user *must* specify if they are injecting
   * raw text. This makes a Sql injection vulnerability harder to create.
   */
  export function query (strings: TemplateStringsArray, ...values: Array<SqlItem | NestedArray<SqlItem>>): Array<SqlItem> {
    return strings.reduce<Array<SqlItem>>((items, text, i) =>
      !values[i]
        ? [...items, { type: 'RAW', text }]
        : [...items, { type: 'RAW', text }, ...flatten<SqlItem>(values[i])]
    , [])
  }

  /**
   * Compiles a Sql query (with an optional name) to a query that can be
   * executed by our PostgreSql driver. Escapes all of the relevant values.
   */
  export function compile (sql: Sql): QueryConfig {
    // Text holds the query string.
    let text = ''

    // Values hold the JavaScript values that are represented in the query
    // string by placeholders. They are eager because they were provided before
    // compile time.
    const values: Array<mixed> = []

    // When we come accross a symbol in our identifier, we create a unique
    // alias for it that shouldn’t be in the users schema. This helps maintain
    // sanity when constructing large Sql queries with many aliases.
    let nextSymbolId = 0
    const symbolToIdentifier = new Map<symbol, string>()

    for (const item of Array.isArray(sql) ? sql : [sql]) {
      switch (item.type) {
        case 'RAW':
          text += item.text
          break
        // TODO: Identifier escaping? I know `pg-promise` does some of this.
        // Most of the time identifiers are trusted, but this could be a source
        // of Sql injection. Replacing double quotes (") is the minimal
        // implementation.
        case 'IDENTIFIER':
          if (item.names.length === 0)
            throw new Error('Identifier must have a name')

          text += item.names.map(name => {
            if (typeof name === 'string')
              return escapeSqlIdentifier(name)

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
          throw new Error(`Unexpected Sql item type '${item['type']}'.`)
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
   * Creates a Sql item for some raw Sql text. Just plain ol‘ raw Sql. This
   * method is dangerous though because it involves no escaping, so proceed
   * with caution!
   */
  export const raw = (text: string): SqlItem => ({ type: 'RAW', text })

  /**
   * Creates a Sql item for a Sql identifier. A Sql identifier is anything like
   * a table, schema, or column name. An identifier may also have a namespace,
   * thus why many names are accepted.
   */
  export const identifier = (...names: Array<string | symbol>): SqlItem => ({ type: 'IDENTIFIER', names })

  /**
   * Creates a Sql item for a value that will be included in our final query.
   * This value will be added in a way which avoids Sql injection.
   */
  export const value = (val: mixed): SqlItem => ({ type: 'VALUE', value: val })

  /**
   * Join some Sql items together seperated by a string. Useful when dealing
   * with lists of Sql items that doesn’t make sense as a Sql query.
   */
  export const join = (items: NestedArray<SqlItem>, seperator?: string): Array<SqlItem> =>
    (items as Array<SqlItem>).reduce<Array<SqlItem>>((currentItems, item, i) =>
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
   * Escapes a Sql identifier. Adapted from the `pg` module.
   *
   * @private
   * @see https://github.com/brianc/node-postgres/blob/a536afb1a8baa6d584bd460e7c1286d75bb36fe3/lib/client.js#L255-L272
   */
  function escapeSqlIdentifier (str: string): string {
    let escaped = '"'

    for (const c of str) {
      if (c === '"') escaped += c + c
      else escaped += c
    }

    escaped += '"'

    return escaped
  }
}

export default sql
