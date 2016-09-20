import mapToObject from '../mapToObject'

test('will turn a Map into a JavaScript object', () => {
  expect(mapToObject(new Map([['a', 1], ['b', 2], ['c', 3]]))).toEqual({ a: 1, b: 2, c: 3 })
})
