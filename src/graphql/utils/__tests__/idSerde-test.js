jest.mock('../../../interface/Inventory')

import ObjectType from '../../../interface/type/ObjectType'
import Inventory from '../../../interface/Inventory'
import idSerde from '../idSerde'

const mockObjectType = () =>
  new ObjectType({
    name: 'hello-type',
    fields: new Map([
      ['b', { type: { isTypeOf: () => true } }],
      ['a', { type: { isTypeOf: () => true } }],
      ['c', { type: { isTypeOf: () => true } }],
    ]),
  })

test('serialize will create a base64 encoded key value for a collection key', () => {
  const collection = { name: 'hello', primaryKey: { keyType: null, getKeyFromValue: jest.fn(x => x) } }
  expect(idSerde.serialize(collection, 'world')).toEqual('WyJoZWxsbyIsIndvcmxkIl0=')
  expect(collection.primaryKey.getKeyFromValue.mock.calls).toEqual([['world']])
})

test('serialize will give object types a special treatment create a base64 encoded key value for a collection key', () => {
  const value = Symbol()
  const collection = {
    name: 'hello',
    primaryKey: { keyType: mockObjectType(), getKeyFromValue: jest.fn(() => new Map([['a', 1], ['b', 2], ['c', 3]])) },
  }
  expect(idSerde.serialize(collection, value)).toEqual('WyJoZWxsbyIsMiwxLDNd')
  expect(collection.primaryKey.getKeyFromValue.mock.calls).toEqual([[value]])
})

test('deserialize will turn an id into a collection key and key value', () => {
  const inventory = new Inventory()

  const collectionKey = { keyType: { isTypeOf: jest.fn(() => true) } }
  const collection = { primaryKey: collectionKey }

  inventory.getCollection.mockReturnValue(collection)

  expect(idSerde.deserialize(inventory, 'WyJoZWxsbyIsIndvcmxkIl0=')).toEqual({ collection, keyValue: 'world' })
  expect(inventory.getCollection.mock.calls).toEqual([['hello']])
  expect(collectionKey.keyType.isTypeOf.mock.calls).toEqual([['world']])
})

test('deserialize will turn an id into a collection key and key value even if the key type is an object type', () => {
  const inventory = new Inventory()

  const collectionKey = { keyType: mockObjectType() }
  const collection = { primaryKey: collectionKey }

  inventory.getCollection.mockReturnValue(collection)
  collectionKey.keyType.isTypeOf = jest.fn(collectionKey.keyType.isTypeOf)

  expect(idSerde.deserialize(inventory, 'WyJoZWxsbyIsMiwxLDNd')).toEqual({ collection, keyValue: new Map([['b', 2], ['a', 1], ['c', 3]]) })
  expect(inventory.getCollection.mock.calls).toEqual([['hello']])
  expect(collectionKey.keyType.isTypeOf.mock.calls).toEqual([[new Map([['b', 2], ['a', 1], ['c', 3]])]])
})
