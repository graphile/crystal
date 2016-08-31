import test from 'ava'
import buildObject from '../buildObject'

test('will build an object out of key/value entries', t => {
  t.deepEqual(buildObject([['a', 1], ['b', 2], ['c', 3]]), { a: 1, b: 2, c: 3 })
})

test('will error if a key is defined twice', t => {
  t.notThrows(() => buildObject([['a', 1], ['b', 1]]))
  t.throws(() => buildObject([['a', 1], ['b', 2], ['a', 3]]))
})

test('will accept multiple entry argument arrays', t => {
  t.deepEqual(buildObject([['a', 1], ['b', 2]], [['c', 3], ['d', 4]], [['e', 5]]), { a: 1, b: 2, c: 3, d: 4, e: 5 })
})

test('will not tolerate duplicate keys in different arguments', t => {
  t.notThrows(() => buildObject([['a', 1]], [['b', 1]]))
  t.throws(() => buildObject([['a', 1], ['b', 2]], [['a', 3]]))
})
