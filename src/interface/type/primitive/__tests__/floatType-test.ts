import floatType from '../floatType'

test('name returns float', () => {
  expect(floatType.name).toBe('float')
})

test('isTypeOf will be true for any number', () => {
  expect(floatType.isTypeOf(undefined)).toBe(false)
  expect(floatType.isTypeOf(null)).toBe(false)
  expect(floatType.isTypeOf(true)).toBe(false)
  expect(floatType.isTypeOf(false)).toBe(false)
  expect(floatType.isTypeOf(21)).toBe(true)
  expect(floatType.isTypeOf(3.1415)).toBe(true)
  expect(floatType.isTypeOf('hello')).toBe(false)
  expect(floatType.isTypeOf({})).toBe(false)
  expect(floatType.isTypeOf([])).toBe(false)
  expect(floatType.isTypeOf(() => { /* noop */ })).toBe(false)
})
