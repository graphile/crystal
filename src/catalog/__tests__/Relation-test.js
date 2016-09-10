import Relation from '../Relation'

test('getName will get the relation’s name', () => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  expect(relation.getName()).toBe(name)
})

test('getTailCollection will return the tail collection', () => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  expect(relation.getTailCollection()).toBe(tailCollection)
})

test('getHeadCollectionKey will return the head collection key', () => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  expect(relation.getHeadCollectionKey()).toBe(headCollectionKey)
})

test('getTailPaginator will return the passed paginator', () => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  expect(relation.getTailPaginator()).toBe(tailPaginator)
})
