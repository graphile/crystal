import { Inventory, Collection, CollectionKey, ObjectType } from '../../interface'

namespace idSerde {
  /**
   * This function will take an id object and turn it into an opaque string
   * that can be deserialized. Type information is lost in serialization.
   */
  export function serialize <TKeyValue>(
    // A `primaryKey` is required whereas in a normal collection it is not
    // required.
    collection: Collection,
    value: ObjectType.Value,
  ): string {
    const primaryKey = collection.primaryKey as CollectionKey<TKeyValue> | null | undefined

    // If there is no primary key, error.
    if (!primaryKey)
      throw new Error(`A primary key is required for collection '${collection.name}' to create an id.`)

    const keyType = primaryKey.keyType
    const keyValue = primaryKey.getKeyFromValue(value)

    if (keyValue == null)
      throw new Error('Could not get a key from the value.')

    // If the type is an object type, we convert the key into a tuple array
    // and spread it inside our array to save space.
    if (keyType instanceof ObjectType && keyValue instanceof Map) {
      const keyTuple = Array.from(keyType.fields.keys()).map(fieldName => keyValue.get(fieldName))
      return new Buffer(JSON.stringify([collection.name, ...keyTuple])).toString('base64')
    }
    // Otherwise, let’s just use the single key value.
    else {
      return new Buffer(JSON.stringify([collection.name, keyValue])).toString('base64')
    }
  }

  /**
   * This function will take a serialized `ID` object and deserialize the string
   * back into an ID object. Type information is lost in serialization and it
   * doesn’t come back in deserialization.
   */
  export function deserialize <TKeyValue>(inventory: Inventory, idString: string): { collection: Collection, keyValue: mixed } {
    const [collectionName, ...keyTuple] = JSON.parse(new Buffer(idString, 'base64').toString())

    const collection = inventory.getCollection(collectionName)

    if (!collection)
      throw new Error(`A collection named '${collectionName}' does not exist.`)

    if (!collection.primaryKey)
      throw new Error(`Collection named '${collectionName}' does not have a primary key.`)

    const collectionKey = collection.primaryKey as CollectionKey<TKeyValue>
    let keyValue: TKeyValue

    // If the key type is an object type, we spread out the values in the id,
    // so we have to reconstruct the key value.
    if (collectionKey.keyType instanceof ObjectType) {
      // tslint:disable-next-line no-any
      keyValue = new Map(Array.from(collectionKey.keyType.fields.keys()).map<[string, mixed]>((fieldName, i) => [fieldName, keyTuple[i]])) as any
    }
    // Otherwise, the first item in the key tuple is the correct value.
    else {
      keyValue = keyTuple[0]
    }

    // Make sure to check the type of this value. If its not the correct type
    // we need to throw an error.
    if (!collectionKey.keyType.isTypeOf(keyValue))
      throw new Error('Key provided in id is not of the correct type.')

    return { collection, keyValue }
  }
}

export default idSerde
