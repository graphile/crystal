import test from 'ava'
import Collection from '../Collection'

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
