/**
 * A utility function for easily building an object from lists *without*
 * tolerating duplicate keys. If any duplicate keys are seen an error will be
 * thrown.
 *
 * This is useful for when we are building maps object as is often done for
 * GraphQL configs and we have multiple sources.
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
 * const expected = { a: 1, b: 2, c: 3 }
 *
 * assert.deepEqual(actual, expected)
 * ```
 */
export default function buildObject <T>(
  ...entriess: Array<Array<[string, T] | undefined>>
): { [key: string]: T } {
  const object = {}

  entriess.forEach(entries => entries.forEach(entry => {
    if (!entry)
      return

    const [key, value] = entry

    if (object.hasOwnProperty(key))
      throw new Error(`Naming conflict. Cannot have two definitions for key '${key}'.`)

    object[key] = value
  }))

  return object
}
