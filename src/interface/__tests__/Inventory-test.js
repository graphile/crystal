import stringType from '../type/primitive/stringType'
import Inventory from '../Inventory'

test('addCollection will add a collection', () => {
  const inventory = new Inventory()
  const collection = {}
  expect(inventory.hasCollection(collection)).toBe(false)
  inventory.addCollection(collection)
  expect(inventory.hasCollection(collection)).toBe(true)
})

test('addCollection will not add a collection with the same name', () => {
  const inventory = new Inventory()
    .addCollection({ name: 'a' })
    .addCollection({ name: 'b' })

  expect(() => inventory.addCollection({ name: 'a' })).toThrow()
  expect(() => inventory.addCollection({ name: 'b' })).toThrow()
  inventory.addCollection({ name: 'c' })
  expect(() => inventory.addCollection({ name: 'c' })).toThrow()
})

test('getCollections will return all collections added by addCollection', () => {
  const inventory = new Inventory()
  const collectionA = { name: 'a' }
  const collectionB = { name: 'b' }
  const collectionC = { name: 'c' }
  expect(inventory.getCollections()).toEqual([])
  inventory.addCollection(collectionA).addCollection(collectionB)
  expect(inventory.getCollections()).toEqual([collectionA, collectionB])
  inventory.addCollection(collectionC)
  expect(inventory.getCollections()).toEqual([collectionA, collectionB, collectionC])
})

test('getCollection will get a collection by name if it exists', () => {
  const inventory = new Inventory()
  expect(inventory.getCollection('a')).toBeFalsy()
  const collection = { name: 'a' }
  inventory.addCollection(collection)
  expect(inventory.getCollection('a')).toBe(collection)
})

test('hasCollection will return if the exact collection exists in the inventory', () => {
  const inventory = new Inventory()
  const collection1 = { name: 'a' }
  const collection2 = { name: 'a' }
  expect(inventory.hasCollection(collection1)).toBe(false)
  expect(inventory.hasCollection(collection2)).toBe(false)
  inventory.addCollection(collection1)
  expect(inventory.hasCollection(collection1)).toBe(true)
  expect(inventory.hasCollection(collection2)).toBe(false)
})

test('addRelation will fail if a key is not in the head collection keys', () => {
  const inventory = new Inventory()
  const collectionKey1 = { name: 'a' }
  const collectionKey2 = { name: 'b' }
  const collection1 = { name: 'a', keys: new Set([collectionKey1]) }
  const collection2 = { name: 'b', keys: new Set([collectionKey2]) }
  const relation1 = { name: 'a', tailCollection: collection1, headCollection: collection2, headCollectionKey: collectionKey1 }
  const relation2 = { name: 'b', tailCollection: collection2, headCollection: collection1, headCollectionKey: collectionKey1 }
  inventory.addCollection(collection1).addCollection(collection2)
  expect(() => inventory.addRelation(relation1)).toThrow()
  expect(() => inventory.addRelation(relation2)).not.toThrow()
})

test('addRelation will fail unless both the head and tail collections exist in the inventory', () => {
  const inventory = new Inventory()
  const collection1 = { name: 'a' }
  const collection2 = { name: 'b' }
  const relation1 = { name: 'a', tailCollection: collection1, headCollection: collection2 }
  const relation2 = { name: 'b', tailCollection: collection2, headCollection: collection1 }
  expect(() => inventory.addRelation(relation1)).toThrow()
  expect(() => inventory.addRelation(relation2)).toThrow()
  inventory.addCollection(collection1)
  expect(() => inventory.addRelation(relation1)).toThrow()
  expect(() => inventory.addRelation(relation2)).toThrow()
  inventory.addCollection(collection2)
  inventory.addRelation(relation1)
  inventory.addRelation(relation2)
})

test('getRelations will get all of the relations that have been added to the inventory', () => {
  const inventory = new Inventory()
  const collection1 = { name: 'a' }
  const collection2 = { name: 'b' }
  const relation1 = { name: 'a', tailCollection: collection1, headCollection: collection2 }
  const relation2 = { name: 'b', tailCollection: collection2, headCollection: collection1 }
  expect(inventory.getRelations()).toEqual([])
  expect(() => inventory.addRelation(relation1)).toThrow()
  expect(() => inventory.addRelation(relation2)).toThrow()
  expect(inventory.getRelations()).toEqual([])
  inventory.addCollection(collection1)
  inventory.addCollection(collection2)
  inventory.addRelation(relation1)
  expect(inventory.getRelations()).toEqual([relation1])
  inventory.addRelation(relation2)
  expect(inventory.getRelations()).toEqual([relation1, relation2])
})
