import CollectionKey from '../CollectionKey'

test('getName will get the key name', () => {
  const name = Symbol('name')
  const collection = Symbol('collection')
  const collectionKey = new CollectionKey(collection, name)
  expect(collectionKey.getName()).toBe(name)
})

test('getCollection will get the key collection', () => {
  const name = Symbol('name')
  const collection = Symbol('collection')
  const collectionKey = new CollectionKey(collection, name)
  expect(collectionKey.getCollection()).toBe(collection)
})

test('setDescription will set the description', () => {
  const description = Symbol('description')
  const collectionKey = new CollectionKey()
  expect(collectionKey.getDescription()).toBe(undefined)
  collectionKey.setDescription(description)
  expect(collectionKey.getDescription()).toBe(description)
})
