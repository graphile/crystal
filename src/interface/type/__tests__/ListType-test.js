import ListType from '../ListType'

test('getItemType will return the item type', () => {
  const itemType = Symbol('itemType')
  const listType = new ListType(itemType)
  expect(listType.getItemType()).toBe(itemType)
})
