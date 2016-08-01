import test from 'ava'
import Collection from '../Collection'

test('will add self to catalog on construction', t => {
  t.plan(1)
  const catalog = { addCollection: () => t.pass() }
  const collection = new Collection(catalog)
})

test('getCatalog will return the catalog', t => {
  const catalog = Symbol('catalog')
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(catalog, name, type)
  t.is(collection.getCatalog(), catalog)
})

test('getName will return the name', t => {
  const catalog = Symbol('catalog')
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(catalog, name, type)
  t.is(collection.getName(), name)
})

test('getType will return the type', t => {
  const catalog = Symbol('catalog')
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(catalog, name, type)
  t.is(collection.getType(), type)
})

test('setDescription will set the description', t => {
  const description = Symbol('description')
  const collection = new Collection()
  t.is(collection.getDescription(), undefined)
  collection.setDescription(description)
  t.is(collection.getDescription(), description)
})

test('getKeys returns an empty list by default', t => {
  const collection = new Collection()
  t.deepEqual(collection.getKeys(), [])
})

test('getPrimaryKey returns undefined by default', t => {
  const collection = new Collection()
  t.is(collection.getPrimaryKey(), undefined)
})

test('getTailRelations will correctly get tail relations from a catalog', t => {
  let relations = []

  const catalog = {
    getRelations: () => relations,
  }

  function mockRelation (tailCollection, headCollection) {
    return {
      getTailCollection: () => tailCollection,
      getHeadCollectionKey: () => ({ getCollection: () => headCollection }),
    }
  }

  const collection1 = new Collection(catalog)
  const collection2 = new Collection(catalog)
  const collection3 = new Collection(catalog)

  relations = [
    mockRelation(collection1, collection2),
    mockRelation(collection1, collection3),
    mockRelation(collection3, collection2),
    mockRelation(collection1, collection1),
  ]

  t.deepEqual(collection1.getTailRelations(), [relations[0], relations[1], relations[3]])
  t.deepEqual(collection2.getTailRelations(), [])
  t.deepEqual(collection3.getTailRelations(), [relations[2]])
})

test('getHeadRelations will correctly get head relations from a catalog', t => {
  let relations = []

  const catalog = {
    getRelations: () => relations,
  }

  function mockRelation (tailCollection, headCollection) {
    return {
      getTailCollection: () => tailCollection,
      getHeadCollectionKey: () => ({ getCollection: () => headCollection }),
    }
  }

  const collection1 = new Collection(catalog)
  const collection2 = new Collection(catalog)
  const collection3 = new Collection(catalog)

  relations = [
    mockRelation(collection1, collection2),
    mockRelation(collection1, collection3),
    mockRelation(collection3, collection2),
    mockRelation(collection1, collection1),
  ]

  t.deepEqual(collection1.getHeadRelations(), [relations[3]])
  t.deepEqual(collection2.getHeadRelations(), [relations[0], relations[2]])
  t.deepEqual(collection3.getHeadRelations(), [relations[1]])
})

test('addKey will add a key to the collection', t => {
  const collection = new Collection()
  const key1 = { getCollection: () => collection }
  const key2 = { getCollection: () => collection }
  t.deepEqual(collection.getKeys(), [])
  collection.addKey(key1).addKey(key2)
  t.deepEqual(collection.getKeys(), [key1, key2])
})

test('addKey will throw an error if the key being added does not belong to the collection', t => {
  const collection1 = new Collection()
  const collection2 = new Collection()
  const key = { getCollection: () => collection1 }
  t.deepEqual(collection1.getKeys(), [])
  t.deepEqual(collection2.getKeys(), [])
  t.notThrows(() => collection1.addKey(key))
  t.throws(() => collection.addKey(key))
  t.deepEqual(collection1.getKeys(), [key])
  t.deepEqual(collection2.getKeys(), [])
})

test('setPrimaryKey will set the primary key', t => {
  const collection = new Collection()
  const key1 = { getCollection: () => collection }
  const key2 = { getCollection: () => collection }
  t.is(collection.getPrimaryKey(), undefined)
  collection.addKey(key1).addKey(key2)
  t.is(collection.getPrimaryKey(), undefined)
  collection.setPrimaryKey(key1)
  t.is(collection.getPrimaryKey(), key1)
})

test('setPrimaryKey will fail if the key has not been added', t => {
  const collection = new Collection()
  const key1 = { getCollection: () => collection }
  const key2 = { getCollection: () => collection }
  collection.addKey(key1)
  t.is(collection.getPrimaryKey(), undefined)
  t.throws(() => collection.setPrimaryKey(key2))
  t.is(collection.getPrimaryKey(), undefined)
  t.notThrows(() => collection.setPrimaryKey(key1))
  t.is(collection.getPrimaryKey(), key1)
})
