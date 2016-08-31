import test from 'ava'
import Relation from '../Relation'

test('getName will get the relation’s name', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  t.is(relation.getName(), name)
})

test('getTailCollection will return the tail collection', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  t.is(relation.getTailCollection(), tailCollection)
})

test('getHeadCollectionKey will return the head collection key', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  t.is(relation.getHeadCollectionKey(), headCollectionKey)
})

test('getTailPaginator will return the passed paginator', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const tailPaginator = Symbol('tailPaginator')
  const relation = new Relation(name, tailCollection, headCollectionKey, tailPaginator)
  t.is(relation.getTailPaginator(), tailPaginator)
})
