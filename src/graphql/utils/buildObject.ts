/**
 * A utility function for easily building an object from lists *without*
 * tolerating duplicate keys. If any duplicate keys are seen an error will be
 * thrown.
 *
 * This is useful for when we are building map objects as is often done for
 * GraphQL configs.
 *
 * This is pretty much identical to the Lodash `_.fromPairs` function.
 *
 * ## Example:
 * ```js
 * const actual = buildObject(
 *   [
 *     ['a', 1],
 *     ['b', 2],
 *   ],
 *   [
 *     ['c', 3],
 *   ]
 * )
 *
 * const expected = {
 *   a: 1,
 *   b: 2,
 *   c: 3,
 * }
 *
 * assert.deepEqual(actual, expected)
 * ```
 */
export default function buildObject <T>(
  ...entries: Array<Array<[string, T] | { key: string, value: T } | undefined | null | false>>,
): { [key: string]: T } {
  const object = {}

  entries.forEach(entries => entries.forEach(entry => {
    if (!entry)
      return

    let key: string
    let value: T

    if (Array.isArray(entry)) {
      key = entry[0]
      value = entry[1]
    }
    else {
      key = entry.key
      value = entry.value
    }

    if (object.hasOwnProperty(key))
      throw new Error(`Naming conflict when building object. Cannot have two definitions for property '${key}'.`)

    object[key] = value
  }))

  return object
}
