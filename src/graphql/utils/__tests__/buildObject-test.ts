import buildObject from '../buildObject'

test('will build an object out of key/value entries', () => {
  expect(buildObject([['a', 1], ['b', 2], ['c', 3]])).toEqual({ a: 1, b: 2, c: 3 })
})

test('will build an object out of key/value objects', () => {
  expect(buildObject([{ key: 'a', value: 1 }, { key: 'b', value: 2 }, { key: 'c', value: 3 }])).toEqual({ a: 1, b: 2, c: 3 })
})

test('will error if a key is defined twice', () => {
  expect(() => buildObject([['a', 1], ['b', 1]])).not.toThrow()
  expect(() => buildObject([['a', 1], ['b', 2], ['a', 3]])).toThrow()
})

test('will accept multiple entry argument arrays', () => {
  expect(buildObject([['a', 1], ['b', 2]], [['c', 3], ['d', 4]], [['e', 5]])).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 })
})

test('will not tolerate duplicate keys in different arguments', () => {
  expect(() => buildObject([['a', 1]], [['b', 1]])).not.toThrow()
  expect(() => buildObject([['a', 1], ['b', 2]], [['a', 3]])).toThrow()
})
