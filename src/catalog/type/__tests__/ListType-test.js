import test from 'ava'
import ListType from '../ListType'

test('getItemType will return the item type', t => {
  const itemType = Symbol('itemType')
  const listType = new ListType(itemType)
  t.is(listType.getItemType(), itemType)
})

test('isTypeOf will be true for empty arrays', t => {
  const itemType = { isTypeOf: () => false }
  const listType = new ListType(itemType)
  t.true(listType.isTypeOf([]))
})

test('isTypeOf will only be true if all items in an array pass the item isTypeOf', t => {
  const itemType = { isTypeOf: value => value === 5 }
  const listType = new ListType(itemType)
  t.true(itemType.isTypeOf(5))
  t.false(itemType.isTypeOf(6))
  t.false(listType.isTypeOf([1, 2, 3, 5]))
  t.false(listType.isTypeOf([5, 6, 5]))
  t.true(listType.isTypeOf([5, 5, 5]))
  t.true(listType.isTypeOf([5]))
  t.false(listType.isTypeOf([1]))
  t.true(listType.isTypeOf(Array(100).fill(5)))
})
