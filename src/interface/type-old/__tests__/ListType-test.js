import ListType from '../ListType'

test('itemType will return the item type', () => {
  const itemType = Symbol('itemType')
  const listType = new ListType(itemType)
  expect(listType.itemType).toBe(itemType)
})
