import stringType from '../stringType'

test('name returns string', () => {
  expect(stringType.name).toBe('string')
})

test('isTypeOf will be true for any string', () => {
  expect(stringType.isTypeOf(undefined)).toBe(false)
  expect(stringType.isTypeOf(null)).toBe(false)
  expect(stringType.isTypeOf(true)).toBe(false)
  expect(stringType.isTypeOf(false)).toBe(false)
  expect(stringType.isTypeOf(21)).toBe(false)
  expect(stringType.isTypeOf(3.1415)).toBe(false)
  expect(stringType.isTypeOf('hello')).toBe(true)
  expect(stringType.isTypeOf({})).toBe(false)
  expect(stringType.isTypeOf([])).toBe(false)
  expect(stringType.isTypeOf(() => {})).toBe(false)
})
