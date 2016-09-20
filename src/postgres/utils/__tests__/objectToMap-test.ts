import objectToMap from '../objectToMap'

test('will turn a JavaScript object into a Map', () => {
  expect(objectToMap({ a: 1, b: 2, c: 3 })).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]))
})
