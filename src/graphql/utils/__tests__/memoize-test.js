import test from 'ava'
import { _memoize } from '../memoize'

test('_memoize will remember the result for functions with any number of arguments', t => {
  const results = []
  const a = Symbol('a')
  const b = Symbol('b')
  const c = Symbol('c')
  const d = {}
  const e = {}
  const f = {}

  const fn = _memoize(() => {
    const result = Symbol()
    results.push(result)
    return result
  })

  t.is(results.length, 0)
  t.is(fn(a), results[0])
  t.is(fn(a), results[0])
  t.is(results.length, 1)
  t.is(fn(a, b), results[1])
  t.is(fn(a, b, c), results[2])
  t.is(fn(a), results[0])
  t.is(fn(a, b), results[1])
  t.is(fn(d), results[3])
  t.is(fn(d, e), results[4])
  t.is(fn(d, e, a), results[5])
  t.is(fn(b, f, e), results[6])
  t.is(fn(d, e), results[4])
  t.is(fn(a, b, c, d, e, f), results[7])
  t.is(fn(a, b, c, d, e, f), results[7])
  t.is(fn(), results[8])
  t.is(fn(a, b, c, d, e, f), results[7])
  t.is(fn(), results[8])
  t.is(fn(), results[8])
  t.is(results.length, 9)
})
