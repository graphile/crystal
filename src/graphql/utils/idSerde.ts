import { Inventory, CollectionKey, ObjectType } from '../../interface'

namespace idSerde {
  /**
   * This function will take an id object and turn it into an opaque string
   * that can be deserialized. Type information is lost in serialization.
   */
  // TODO: `idSerde` should take collections, not collection keys.
  export function serialize <TKeyValue>(
    // A `primaryKey` is required whereas in a normal collection it is not
    // required.
    collectionKey: CollectionKey<TKeyValue>,
    keyValue: TKeyValue,
  ): string {
    const collectionName = collectionKey.collection.name
    const keyType = collectionKey.keyType

    // If the type is an object type, we convert the key into a tuple array
    // and spread it inside our array to save space.
    if (keyType instanceof ObjectType) {
      const keyTuple = Array.from(keyType.fields.keys()).map(fieldName => (keyValue as any).get(fieldName))
      return new Buffer(JSON.stringify([collectionName, ...keyTuple])).toString('base64')
    }
    // Otherwise, let’s just use the single key value.
    else {
      return new Buffer(JSON.stringify([collectionName, keyValue])).toString('base64')
    }
  }

  /**
   * This function will take a serialized `ID` object and deserialize the string
   * back into an ID object. Type information is lost in serialization and it
   * doesn’t come back in deserialization.
   */
  export function deserialize <T>(inventory: Inventory, idString: string): { collectionKey: CollectionKey<T>, keyValue: T } {
    const [collectionName, ...keyTuple] = JSON.parse(new Buffer(idString, 'base64').toString())

    const collection = inventory.getCollection(collectionName)

    if (!collection)
      throw new Error(`A collection named '${collectionName}' does not exist.`)

    if (!collection.primaryKey)
      throw new Error(`Collection named '${collectionName}' does not have a primary key.`)

    const collectionKey = collection.primaryKey
    let keyValue: any

    // If the key type is an object type, we spread out the values in the id,
    // so we have to reconstruct the key value.
    if (collectionKey.keyType instanceof ObjectType) {
      keyValue = new Map(Array.from(collectionKey.keyType.fields.keys()).map<[string, mixed]>((fieldName, i) => [fieldName, keyTuple[i]]))
    }
    // Otherwise, the first item in the key tuple is the correct value.
    else {
      keyValue = keyTuple[0]
    }

    // Make sure to check the type of this value. If its not the correct type
    // we need to throw an error.
    if (!collectionKey.keyType.isTypeOf(keyValue))
      throw new Error('Key provided in id is not of the correct type.')

    return { collectionKey, keyValue } as any
  }
}

export default idSerde
