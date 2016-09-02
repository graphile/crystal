import test from 'ava'
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

test('addCollection will add a collection', t => {
  const catalog = new Catalog()
  const collection = mockCollection('a')
  t.false(catalog.hasCollection(collection))
  catalog.addCollection(collection)
  t.true(catalog.hasCollection(collection))
})

test('addCollection will not add a collection with the same name', t => {
  const catalog = new Catalog()
  catalog.addCollection(mockCollection('a')).addCollection(mockCollection('b'))
  t.throws(() => catalog.addCollection(mockCollection('a')))
  t.throws(() => catalog.addCollection(mockCollection('b')))
  catalog.addCollection(mockCollection('c'))
  t.throws(() => catalog.addCollection(mockCollection('c')))
})

test('getCollections will return all collections added by addCollection', t => {
  const catalog = new Catalog()
  const collectionA = mockCollection('a')
  const collectionB = mockCollection('b')
  const collectionC = mockCollection('c')
  t.deepEqual(catalog.getCollections(), [])
  catalog.addCollection(collectionA).addCollection(collectionB)
  t.deepEqual(catalog.getCollections(), [collectionA, collectionB])
  catalog.addCollection(collectionC)
  t.deepEqual(catalog.getCollections(), [collectionA, collectionB, collectionC])
})

test('getCollection will get a collection by name if it exists', t => {
  const catalog = new Catalog()
  t.is(catalog.getCollection('a'), undefined)
  const collection = mockCollection('a')
  catalog.addCollection(collection)
  t.is(catalog.getCollection('a'), collection)
})

test('hasCollection will return if the exact collection exists in the catalog', t => {
  const catalog = new Catalog()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('a')
  t.false(catalog.hasCollection(collection1))
  t.false(catalog.hasCollection(collection2))
  catalog.addCollection(collection1)
  t.true(catalog.hasCollection(collection1))
  t.false(catalog.hasCollection(collection2))
})

test('addRelation will fail unless both the head and tail collections exist in the catalog', t => {
  const catalog = new Catalog()
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('b')
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
  const collection1 = mockCollection('a')
  const collection2 = mockCollection('b')
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
