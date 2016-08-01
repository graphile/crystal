/**
 * The type of ids internal to our system. An id has two properties, a `name`
 * and a `key`. `name` is just the collection name that the value this id
 * identifies belongs to. The `key` property is the unique identifier of the
 * value in the collection. Because a collection may have multiple unique keys,
 * the key here will always be used with the collection’s primary key. If a
 * primary key does not exist on the collection named, the id is invalid.
 *
 * Also keep in mind that when the id is serialized, `key` will be turned into
 * JSON so it will lose any prototype information.
 */
export type Type = {
  name: string,
  key: any,
}

/**
 * This function will take an id object and turn it into an opaque string
 * that can be deserialized. Type information is lost in serialization.
 */
export function serialize ({ name, key }: Type): string {
  return new Buffer(JSON.stringify([name, key])).toString('base64')
}

/**
 * This function will take a serialized `ID` object and deserialize the string
 * back into an ID object. Type information is lost in serialization and it
 * doesn’t come back in deserialization.
 */
export function deserialize (idString: string): Type {
  const [name, key] = JSON.parse(new Buffer(idString, 'base64').toString())
  return { name, key }
}
