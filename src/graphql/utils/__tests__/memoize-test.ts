import { _memoize } from '../memoize'

test('_memoize will remember the result for functions with any number of arguments', () => {
  const results: Array<mixed> = []
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

  expect(results.length).toBe(0)
  expect(fn(a)).toBe(results[0])
  expect(fn(a)).toBe(results[0])
  expect(results.length).toBe(1)
  expect(fn(a, b)).toBe(results[1])
  expect(fn(a, b, c)).toBe(results[2])
  expect(fn(a)).toBe(results[0])
  expect(fn(a, b)).toBe(results[1])
  expect(fn(d)).toBe(results[3])
  expect(fn(d, e)).toBe(results[4])
  expect(fn(d, e, a)).toBe(results[5])
  expect(fn(b, f, e)).toBe(results[6])
  expect(fn(d, e)).toBe(results[4])
  expect(fn(a, b, c, d, e, f)).toBe(results[7])
  expect(fn(a, b, c, d, e, f)).toBe(results[7])
  expect(fn()).toBe(results[8])
  expect(fn(a, b, c, d, e, f)).toBe(results[7])
  expect(fn()).toBe(results[8])
  expect(fn()).toBe(results[8])
  expect(results.length).toBe(9)
})
