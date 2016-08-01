import test from 'ava'
import Catalog from '../Catalog'

function mockCollection (catalog, name) {
  return {
    getCatalog: () => catalog,
    getName: () => name,
  }
}

function mockRelation (tailCollection, headCollection) {
  return {
    getTailCollection: () => tailCollection,
    getHeadCollectionKey: () => ({ getCollection: () => headCollection }),
  }
}

test('addCollection will not add a collection which has a different catalog', t => {
  const catalog1 = new Catalog()
  const catalog2 = new Catalog()
  const collection1 = mockCollection(catalog1, 'a')
  const collection2 = mockCollection(catalog2, 'b')
  catalog1.addCollection(collection1)
  t.throws(() => catalog1.addCollection(collection2))
  t.throws(() => catalog2.addCollection(collection1))
  catalog2.addCollection(collection2)
})

test('addCollection will not add a collection with the same name', t => {
  const catalog = new Catalog()
  catalog.addCollection(mockCollection(catalog, 'a')).addCollection(mockCollection(catalog, 'b'))
  t.throws(() => catalog.addCollection(mockCollection(catalog, 'a')))
  t.throws(() => catalog.addCollection(mockCollection(catalog, 'b')))
  catalog.addCollection(mockCollection(catalog, 'c'))
  t.throws(() => catalog.addCollection(mockCollection(catalog, 'c')))
})

test('getCollections will return all collections added by addCollection', t => {
  const catalog = new Catalog()
  const collectionA = mockCollection(catalog, 'a')
  const collectionB = mockCollection(catalog, 'b')
  const collectionC = mockCollection(catalog, 'c')
  t.deepEqual(catalog.getCollections(), [])
  catalog.addCollection(collectionA).addCollection(collectionB)
  t.deepEqual(catalog.getCollections(), [collectionA, collectionB])
  catalog.addCollection(collectionC)
  t.deepEqual(catalog.getCollections(), [collectionA, collectionB, collectionC])
})

test('getCollection will get a collection by name if it exists', t => {
  const catalog = new Catalog()
  t.is(catalog.getCollection('a'), undefined)
  const collection = mockCollection(catalog, 'a')
  catalog.addCollection(collection)
  t.is(catalog.getCollection('a'), collection)
})

test('hasCollection will return if the exact collection exists in the catalog', t => {
  const catalog = new Catalog()
  const collection1 = mockCollection(catalog, 'a')
  const collection2 = mockCollection(catalog, 'a')
  t.false(catalog.hasCollection(collection1))
  t.false(catalog.hasCollection(collection2))
  catalog.addCollection(collection1)
  t.true(catalog.hasCollection(collection1))
  t.false(catalog.hasCollection(collection2))
})

test('addRelation will fail unless both the head and tail collections exist in the catalog', t => {
  const catalog = new Catalog()
  const collection1 = mockCollection(catalog, 'a')
  const collection2 = mockCollection(catalog, 'b')
  const relation1 = mockRelation(collection1, collection2)
  const relation2 = mockRelation(collection2, collection1)
  t.throws(() => catalog.addRelation(relation1))
  t.throws(() => catalog.addRelation(relation2))
  catalog.addCollection(collection1)
  t.throws(() => catalog.addRelation(relation1))
  t.throws(() => catalog.addRelation(relation2))
  catalog.addCollection(collection2)
  catalog.addRelation(relation1)
  catalog.addRelation(relation2)
})

test('getRelations will get all of the relations that have been added to the catalog', t => {
  const catalog = new Catalog()
  const collection1 = mockCollection(catalog, 'a')
  const collection2 = mockCollection(catalog, 'b')
  const relation1 = mockRelation(collection1, collection2)
  const relation2 = mockRelation(collection2, collection1)
  t.deepEqual(catalog.getRelations(), [])
  t.throws(() => catalog.addRelation(relation1))
  t.throws(() => catalog.addRelation(relation2))
  t.deepEqual(catalog.getRelations(), [])
  catalog.addCollection(collection1)
  catalog.addCollection(collection2)
  catalog.addRelation(relation1)
  t.deepEqual(catalog.getRelations(), [relation1])
  catalog.addRelation(relation2)
  t.deepEqual(catalog.getRelations(), [relation1, relation2])
})
