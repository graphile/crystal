import test from 'ava'
import Collection from '../Collection'

test('getName will return the name', t => {
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(name, type)
  t.is(collection.getName(), name)
})

test('getType will return the type', t => {
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(name, type)
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
