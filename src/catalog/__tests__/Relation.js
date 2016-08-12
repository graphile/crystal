import test from 'ava'
import Relation from '../Relation'

test('getName will get the relation’s name', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const getHeadKeyFromTailValue = Symbol('getHeadKeyFromTailValue')
  const relation = new Relation(name, tailCollection, headCollectionKey, getHeadKeyFromTailValue)
  t.is(relation.getName(), name)
})

test('getTailCollection will return the tail collection', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const getHeadKeyFromTailValue = Symbol('getHeadKeyFromTailValue')
  const relation = new Relation(name, tailCollection, headCollectionKey, getHeadKeyFromTailValue)
  t.is(relation.getTailCollection(), tailCollection)
})

test('getHeadCollectionKey will return the head collection key', t => {
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const getHeadKeyFromTailValue = Symbol('getHeadKeyFromTailValue')
  const relation = new Relation(name, tailCollection, headCollectionKey, getHeadKeyFromTailValue)
  t.is(relation.getHeadCollectionKey(), headCollectionKey)
})

test('getHeadKeyFromTailValue will use the passed function', t => {
  t.plan(2)
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const value = Symbol('value')
  const headKey = Symbol('headKey')
  const getHeadKeyFromTailValue = param => {
    t.is(param, value)
    return headKey
  }
  const relation = new Relation(name, tailCollection, headCollectionKey, getHeadKeyFromTailValue)
  t.is(relation.getHeadKeyFromTailValue(value), headKey)
})

test('getTailConditionFromHeadValue will used the passed function', t => {
  t.plan(2)
  const name = Symbol('name')
  const tailCollection = Symbol('tailCollection')
  const headCollectionKey = Symbol('headCollectionKey')
  const getHeadKeyFromTailValue = Symbol('getHeadKeyFromTailValue')
  const headKey = Symbol('headKey')
  const condition = Symbol('condition')
  const getTailConditionFromHeadValue = param => {
    t.is(param, headKey)
    return condition
  }
  const relation = new Relation(name, tailCollection, headCollectionKey, getHeadKeyFromTailValue, getTailConditionFromHeadValue)
  t.is(relation.getTailConditionFromHeadValue(headKey), condition)
})
