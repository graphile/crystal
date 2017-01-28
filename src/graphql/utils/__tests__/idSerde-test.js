jest.mock('../../../interface/Inventory')

import { Inventory, BasicObjectType, stringType } from '../../../interface'
import idSerde from '../idSerde'

const mockObjectType = () =>
  new BasicObjectType({
    name: 'hello-type',
    fields: new Map([
      ['b', { type: { isTypeOf: () => true } }],
      ['a', { type: { isTypeOf: () => true } }],
      ['c', { type: { isTypeOf: () => true } }],
    ]),
  })

test('serialize will create a base64 encoded key value for a collection key', () => {
  const collection = { name: 'hello', primaryKey: { keyType: stringType, getKeyFromValue: jest.fn(x => x) } }
  expect(idSerde.serialize(collection, 'world')).toEqual('WyJoZWxsbyIsIndvcmxkIl0=')
  expect(collection.primaryKey.getKeyFromValue.mock.calls).toEqual([['world']])
})

test('serialize will give object types a special treatment create a base64 encoded key value for a collection key', () => {
  const value = Symbol()
  const collection = {
    name: 'hello',
    primaryKey: { keyType: mockObjectType(), getKeyFromValue: jest.fn(() => ({ a: 1, b: 2, c: 3 })) },
  }
  expect(idSerde.serialize(collection, value)).toEqual('WyJoZWxsbyIsMiwxLDNd')
  expect(collection.primaryKey.getKeyFromValue.mock.calls).toEqual([[value]])
})

test('deserialize will turn an id into a collection key and key value', () => {
  const inventory = new Inventory()

  const collectionKey = { keyType: { kind: 'SCALAR' } }
  const collection = { primaryKey: collectionKey }

  inventory.getCollection.mockReturnValue(collection)

  expect(idSerde.deserialize(inventory, 'WyJoZWxsbyIsIndvcmxkIl0=')).toEqual({ collection, keyValue: 'world' })
  expect(inventory.getCollection.mock.calls).toEqual([['hello']])
})

test('deserialize will turn an id into a collection key and key value even if the key type is an object type', () => {
  const inventory = new Inventory()

  const collectionKey = { keyType: mockObjectType() }
  const collection = { primaryKey: collectionKey }

  inventory.getCollection.mockReturnValue(collection)
  collectionKey.keyType.isTypeOf = jest.fn(collectionKey.keyType.isTypeOf)

  expect(idSerde.deserialize(inventory, 'WyJoZWxsbyIsMiwxLDNd')).toEqual({ collection, keyValue: { b: 2, a: 1, c: 3 } })
  expect(inventory.getCollection.mock.calls).toEqual([['hello']])
})
