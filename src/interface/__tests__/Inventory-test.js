import Inventory from '../Inventory'

function mockCollection (name) {
  return {
    getName: () => name,
    getType: () => ({
      getName: () => Symbol('collectionTypeName'),
    }),
  }
}

function mockRelation (tailCollection, headCollection) {
  return {
    getName: () => Symbol('relationName'),
    getTailCollection: () => tailCollection,
    getHeadCollectionKey: () => ({ getCollection: () => headCollection }),
  }
}

test('addCollection will add a collection', () => {
  const inventory = new Inventory()
  const collection = mockCollection('a')
  expect(inventory.hasCollection(collection)).toBe(false)
  inventory.addCollection(collection)
  expect(inventory.hasCollection(collection)).toBe(true)
})

test('addCollection will not add a collection with the same name', () => {
  const inventory = new Inventory()
  inventory.addCollection(mockCollection('a')).addCollection(mockCollection('b'))
  expect(() => inventory.addCollection(mockCollection('a'))).toThrow()
  expect(() => inventory.addCollection(mockCollection('b'))).toThrow()
  inventory.addCollection(mockCollection('c'))
  expect(() => inventory.addCollection(mockCollection('c'))).toThrow()
})

test('getCollections will return all collections added by addCollection', () => {
  const inventory = new Inventory()
  const collectionA = mockCollection('a')
  const collectionB = mockCollection('b')
  const collectionC = mockCollection('c')
  expect(inventory.getCollections()).toEqual([])
  inventory.addCollection(collectionA).addCollection(collectionB)
  expect(inventory.getCollections()).toEqual([collectionA, collectionB])
  inventory.addCollection(collectionC)
  expect(inventory.getCollections()).toEqual([collectionA, collectionB, collectionC])
})

test('getCollection will get a collection by name if it exists', () => {
  const inventory = new Inventory()
  expect(inventory.getCollection('a')).toBe(undefined)
  const collection = mockCollection('a')
  inventory.addCollection(collection)
  expect(inventory.getCollection('a')).toBe(collection)
})

test('hasCollection will return if the exact collection exists in the inventory', () => {
  const inventory = new Inventory()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('a')
  expect(inventory.hasCollection(collection1)).toBe(false)
  expect(inventory.hasCollection(collection2)).toBe(false)
  inventory.addCollection(collection1)
  expect(inventory.hasCollection(collection1)).toBe(true)
  expect(inventory.hasCollection(collection2)).toBe(false)
})

test('addRelation will fail unless both the head and tail collections exist in the inventory', () => {
  const inventory = new Inventory()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('b')
  const relation1 = mockRelation(collection1, collection2)
  const relation2 = mockRelation(collection2, collection1)
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
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('b')
  const relation1 = mockRelation(collection1, collection2)
  const relation2 = mockRelation(collection2, collection1)
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
