import { QueryConfig } from 'pg'

/**
 * Many `SQLItem`s make up a `SQL` query. Different types of items are used to
 * determine how the final query should be formatted.
 */
export type SQLItem =
  { type: 'RAW', text: string } |
  { type: 'IDENTIFIER', names: string[] } |
  { type: 'VALUE_EAGER', value: any } |
  { type: 'VALUE_LAZY', name: string }

/**
 * An object that represents a dynamicly generated SQL query. This query needs
 * to be compiled before being sent to PostgreSQL.
 */
export type SQL = SQLItem[]

/**
 * A template string tag that creates a `SQL` query out of some strings and
 * some values. Use this to construct all PostgreSQL queries to avoid SQL
 * injection.
 *
 * Note that using this function, the user *must* specify if they are injecting
 * raw text. This makes a SQL injection vulnerability harder to create.
 */
export function query (strings: string[], ...values: (SQLItem | SQLItem[])[]): SQL {
  return strings.reduce<SQL>((items, string, i) => {
    const value = values[i]

    if (!value)
      return [...items, { type: 'RAW', text: string }]
    else if (Array.isArray(value))
      return [...items, { type: 'RAW', text: string }, ...value]
    else
      return [...items, { type: 'RAW', text: string }, value]
  }, [])
}

/**
 * Compiles a SQL query (with an optional name) to a query that can be
 * executed by our PostgreSQL driver. Escapes all of the relevant values.
 */
export function compile (sql: SQL): (values: { [name: string]: any }) => QueryConfig
export function compile (name: string, sql: SQL): (values: { [name: string]: any }) => QueryConfig
export function compile (sqlOrName: SQL | string, maybeSQL?: SQL): (values: { [name: string]: any }) => QueryConfig {
  let name: string | undefined
  let sql: SQL

  // Massage parameters into the correct format. JavaScript is awesome.
  if (typeof sqlOrName === 'string') {
    if (!maybeSQL)
      throw new Error('Must pass a SQL argument.')

    name = sqlOrName
    sql = maybeSQL
  }
  else {
    sql = sqlOrName
  }

  // Text holds the query string.
  let text: string = ''

  // Values hold the JavaScript values that are represented in the query
  // string by placeholders. They are eager because they were provided before
  // compile time.
  const eagerValues: any[] = []

  // The lazy indexes map holds a reference of lazy value names to their index
  // in the `eagerValues` array. This way later on when we get our lazy values
  // we can replace the `null` placeholders in `eagerValues` with actual
  // values.
  const lazyIndexes: Map<string, number> = new Map()

  for (const item of sql) {
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

        text += item.names.map(name => `"${name.replace('"', '')}"`).join('.')
        break
      case 'VALUE_EAGER':
        eagerValues.push(item.value)
        text += `$${eagerValues.length}`
        break
      case 'VALUE_LAZY':
        eagerValues.push(null)
        lazyIndexes.set(item.name, eagerValues.length - 1)
        text += `$${eagerValues.length}`
        break
    }
  }

  return (lazyValues: { [name: string]: any } = {}): QueryConfig => {
    // Make a shallow copy of `eagerValues` so we can mutate it.
    const values = [...eagerValues]

    // Add our lazy values to our shallow copy of `eagerValues`.
    for (const name of Object.keys(lazyValues))
      if (lazyIndexes.has(name))
        values[lazyIndexes.get(name)!] = lazyValues[name]

    return {
      name,
      text,
      values,
    }
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
export const identifier = (...names: string[]): SQLItem => ({ type: 'IDENTIFIER', names })

/**
 * Creates a SQL item for a value that will be included in our final query.
 * This value will be added in a way which avoids SQL injection.
 */
export const value = (value: any): SQLItem => ({ type: 'VALUE_EAGER', value })

/**
 * Creates a SQL item for a value that we will exist when we execute this
 * query, but we do not yet have the value for.
 *
 * This is helpful for lazily injecting values into a query.
 */
export const placeholder = (name: string): SQLItem => ({ type: 'VALUE_LAZY', name })

/**
 * Join some SQL items together seperated by a string. Useful when dealing
 * with lists of SQL items that doesn’t make sense as a SQL query.
 */
export const join = (items: SQLItem[] | SQLItem[][], seperator?: string): SQLItem[] =>
  (items as SQLItem[]).reduce<SQLItem[]>((currentItems, item, i) =>
    i === 0 || !seperator
      ? [...currentItems, ...flatten(item)]
      : [...currentItems, { type: 'RAW', text: seperator }, ...flatten(item)]
  , [])

/**
 * Flattens a deeply nested array.
 *
 * @private
 */
function flatten <T>(array: T | T[] | T[][]): T[] {
  if (!Array.isArray(array))
    return [array]

  // Type cheats ahead! Making TypeScript compile here is more important then
  // making the code statically correct.
  return (array as T[]).reduce<T[]>((currentArray, item) =>
    Array.isArray(item)
      ? [...currentArray, ...flatten(item)]
      : [...currentArray, item]
  , [])
}
