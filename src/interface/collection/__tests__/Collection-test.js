import Collection from '../Collection'

test('getName will return the name', () => {
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(name, type)
  expect(collection.getName()).toBe(name)
})

test('getType will return the type', () => {
  const name = Symbol('name')
  const type = Symbol('type')
  const collection = new Collection(name, type)
  expect(collection.getType()).toBe(type)
})

test('setDescription will set the description', () => {
  const description = Symbol('description')
  const collection = new Collection()
  expect(collection.getDescription()).toBe(undefined)
  collection.setDescription(description)
  expect(collection.getDescription()).toBe(description)
})

test('getKeys returns an empty list by default', () => {
  const collection = new Collection()
  expect(collection.getKeys()).toEqual([])
})

test('getPrimaryKey returns undefined by default', () => {
  const collection = new Collection()
  expect(collection.getPrimaryKey()).toBe(undefined)
})
