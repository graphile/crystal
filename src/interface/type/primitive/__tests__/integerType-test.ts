import integerType from '../integerType'

test('name returns integer', () => {
  expect(integerType.name).toBe('integer')
})

test('isTypeOf will be true for any integer', () => {
  expect(integerType.isTypeOf(undefined)).toBe(false)
  expect(integerType.isTypeOf(null)).toBe(false)
  expect(integerType.isTypeOf(true)).toBe(false)
  expect(integerType.isTypeOf(false)).toBe(false)
  expect(integerType.isTypeOf(21)).toBe(true)
  expect(integerType.isTypeOf(3.1415)).toBe(false)
  expect(integerType.isTypeOf('hello')).toBe(false)
  expect(integerType.isTypeOf({})).toBe(false)
  expect(integerType.isTypeOf([])).toBe(false)
  expect(integerType.isTypeOf(() => { /* noop */ })).toBe(false)
})
