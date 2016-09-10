import Catalog from '../Catalog'

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
  const catalog = new Catalog()
  const collection = mockCollection('a')
  expect(catalog.hasCollection(collection)).toBe(false)
  catalog.addCollection(collection)
  expect(catalog.hasCollection(collection)).toBe(true)
})

test('addCollection will not add a collection with the same name', () => {
  const catalog = new Catalog()
  catalog.addCollection(mockCollection('a')).addCollection(mockCollection('b'))
  expect(() => catalog.addCollection(mockCollection('a'))).toThrow()
  expect(() => catalog.addCollection(mockCollection('b'))).toThrow()
  catalog.addCollection(mockCollection('c'))
  expect(() => catalog.addCollection(mockCollection('c'))).toThrow()
})

test('getCollections will return all collections added by addCollection', () => {
  const catalog = new Catalog()
  const collectionA = mockCollection('a')
  const collectionB = mockCollection('b')
  const collectionC = mockCollection('c')
  expect(catalog.getCollections()).toEqual([])
  catalog.addCollection(collectionA).addCollection(collectionB)
  expect(catalog.getCollections()).toEqual([collectionA, collectionB])
  catalog.addCollection(collectionC)
  expect(catalog.getCollections()).toEqual([collectionA, collectionB, collectionC])
})

test('getCollection will get a collection by name if it exists', () => {
  const catalog = new Catalog()
  expect(catalog.getCollection('a')).toBe(undefined)
  const collection = mockCollection('a')
  catalog.addCollection(collection)
  expect(catalog.getCollection('a')).toBe(collection)
})

test('hasCollection will return if the exact collection exists in the catalog', () => {
  const catalog = new Catalog()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('a')
  expect(catalog.hasCollection(collection1)).toBe(false)
  expect(catalog.hasCollection(collection2)).toBe(false)
  catalog.addCollection(collection1)
  expect(catalog.hasCollection(collection1)).toBe(true)
  expect(catalog.hasCollection(collection2)).toBe(false)
})

test('addRelation will fail unless both the head and tail collections exist in the catalog', () => {
  const catalog = new Catalog()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('b')
  const relation1 = mockRelation(collection1, collection2)
  const relation2 = mockRelation(collection2, collection1)
  expect(() => catalog.addRelation(relation1)).toThrow()
  expect(() => catalog.addRelation(relation2)).toThrow()
  catalog.addCollection(collection1)
  expect(() => catalog.addRelation(relation1)).toThrow()
  expect(() => catalog.addRelation(relation2)).toThrow()
  catalog.addCollection(collection2)
  catalog.addRelation(relation1)
  catalog.addRelation(relation2)
})

test('getRelations will get all of the relations that have been added to the catalog', () => {
  const catalog = new Catalog()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('b')
  const relation1 = mockRelation(collection1, collection2)
  const relation2 = mockRelation(collection2, collection1)
  expect(catalog.getRelations()).toEqual([])
  expect(() => catalog.addRelation(relation1)).toThrow()
  expect(() => catalog.addRelation(relation2)).toThrow()
  expect(catalog.getRelations()).toEqual([])
  catalog.addCollection(collection1)
  catalog.addCollection(collection2)
  catalog.addRelation(relation1)
  expect(catalog.getRelations()).toEqual([relation1])
  catalog.addRelation(relation2)
  expect(catalog.getRelations()).toEqual([relation1, relation2])
})
