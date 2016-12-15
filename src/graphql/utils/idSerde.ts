import { Inventory, Collection, CollectionKey, ObjectType, switchType } from '../../interface'

namespace idSerde {
  /**
   * This function will take an id object and turn it into an opaque string
   * that can be deserialized. Type information is lost in serialization.
   */
  export function serialize <TValue, TKey>(
    // A `primaryKey` is required whereas in a normal collection it is not
    // required.
    collection: Collection<TValue>,
    value: TValue,
  ): string {
    const primaryKey = collection.primaryKey as CollectionKey<TValue, TKey> | null | undefined

    // If there is no primary key, error.
    if (!primaryKey)
      throw new Error(`A primary key is required for collection '${collection.name}' to create an id.`)

    const keyType = primaryKey.keyType
    const keyValue = primaryKey.getKeyFromValue(value)

    if (keyValue == null)
      throw new Error('Could not get a key from the value.')

    const defaultCase = () => new Buffer(JSON.stringify([collection.name, keyValue])).toString('base64')

    return switchType<string>(keyType, {
      // If the type is an object type, we convert the key into a tuple array
      // and spread it inside our array to save space.
      object: (type: ObjectType<TKey>): string => {
        const keyTuple = Array.from(type.fields.values()).map(field => field.getValue(keyValue))
        return new Buffer(JSON.stringify([collection.name, ...keyTuple])).toString('base64')
      },

      // Otherwise, let’s just use the single key value.
      nullable: defaultCase,
      list: defaultCase,
      alias: defaultCase,
      enum: defaultCase,
      scalar: defaultCase,
    })
  }

  /**
   * This function will take a serialized `ID` object and deserialize the string
   * back into an ID object. Type information is lost in serialization and it
   * doesn’t come back in deserialization.
   */
  export function deserialize <TValue, TKey>(inventory: Inventory, idString: string): { collection: Collection<TValue>, keyValue: TKey } {
    const [collectionName, ...keyTuple] = JSON.parse(new Buffer(idString, 'base64').toString())

    const collection = inventory.getCollection(collectionName) as Collection<TValue> | undefined

    if (!collection)
      throw new Error(`A collection named '${collectionName}' does not exist.`)

    if (!collection.primaryKey)
      throw new Error(`Collection named '${collectionName}' does not have a primary key.`)

    const collectionKey = collection.primaryKey as CollectionKey<TValue, TKey>

    const defaultCase = () => keyTuple[0]

    const keyValue = switchType<TKey>(collectionKey.keyType, {
      // If the key type is an object type, we spread out the values in the id,
      // so we have to reconstruct the key value.
      object: (keyType: ObjectType<TKey>): TKey =>
        keyType.fromFields(new Map(Array.from(keyType.fields.keys()).map<[string, mixed]>((fieldName, i) => [fieldName, keyTuple[i]]))),

      // Otherwise, the first item in the key tuple is the correct value.
      nullable: defaultCase,
      list: defaultCase,
      alias: defaultCase,
      enum: defaultCase,
      scalar: defaultCase,
    })

    return { collection, keyValue }
  }
}

export default idSerde
