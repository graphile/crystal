/**
 * Converts an ES6 Map into a JavaScript object.
 */
export default function mapToObject (map: Map<string, mixed>): { [key: string]: mixed } {
  const object = {}

  for (const [key, value] of Array.from(map))
    object[key] = value

  return object
}
