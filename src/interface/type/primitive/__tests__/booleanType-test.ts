import booleanType from '../booleanType'

test('name returns boolean', () => {
  expect(booleanType.name).toBe('boolean')
})

test('isTypeOf will be true for booleans', () => {
  expect(booleanType.isTypeOf(undefined)).toBe(false)
  expect(booleanType.isTypeOf(null)).toBe(false)
  expect(booleanType.isTypeOf(true)).toBe(true)
  expect(booleanType.isTypeOf(false)).toBe(true)
  expect(booleanType.isTypeOf(21)).toBe(false)
  expect(booleanType.isTypeOf(3.1415)).toBe(false)
  expect(booleanType.isTypeOf('hello')).toBe(false)
  expect(booleanType.isTypeOf({})).toBe(false)
  expect(booleanType.isTypeOf([])).toBe(false)
  expect(booleanType.isTypeOf(() => {})).toBe(false)
})
