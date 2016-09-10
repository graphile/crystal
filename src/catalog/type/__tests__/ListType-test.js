import ListType from '../ListType'

test('getItemType will return the item type', () => {
  const itemType = Symbol('itemType')
  const listType = new ListType(itemType)
  expect(listType.getItemType()).toBe(itemType)
})

test('isTypeOf will be true for empty arrays', () => {
  const itemType = { isTypeOf: () => false }
  const listType = new ListType(itemType)
  expect(listType.isTypeOf([])).toBe(true)
})

test('isTypeOf will only be true if all items in an array pass the item isTypeOf', () => {
  const itemType = { isTypeOf: value => value === 5 }
  const listType = new ListType(itemType)
  expect(itemType.isTypeOf(5)).toBe(true)
  expect(itemType.isTypeOf(6)).toBe(false)
  expect(listType.isTypeOf([1, 2, 3, 5])).toBe(false)
  expect(listType.isTypeOf([5, 6, 5])).toBe(false)
  expect(listType.isTypeOf([5, 5, 5])).toBe(true)
  expect(listType.isTypeOf([5])).toBe(true)
  expect(listType.isTypeOf([1])).toBe(false)
  expect(listType.isTypeOf(Array(100).fill(5))).toBe(true)
})
