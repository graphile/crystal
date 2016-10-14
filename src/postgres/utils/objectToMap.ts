/**
 * Converts a JavaScript object into an ES6 map.
 */
export default function objectToMap (object: { [key: string]: mixed }): Map<string, mixed> {
  const map = new Map<string, mixed>()

  for (const key of Object.keys(object))
    map.set(key, object[key])

  return map
}
