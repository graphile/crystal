import NullableType from '../NullableType'

test('getBaseType will return the base type', () => {
  const baseType = Symbol('baseType')
  const nullableType = new NullableType(baseType)
  expect(nullableType.getBaseType()).toBe(baseType)
})

test('isTypeOf will be true if the value is null', () => {
  const baseType = { isTypeOf: () => false }
  const nullableType = new NullableType(baseType)
  expect(nullableType.isTypeOf(null)).toBe(true)
  expect(nullableType.isTypeOf(undefined)).toBe(false)
})

test('isTypeOf will be true if the baseType isTypeOf is true', () => {
  const baseType = { isTypeOf: value => value === 5 }
  const nullableType = new NullableType(baseType)
  expect(nullableType.isTypeOf(1)).toBe(false)
  expect(nullableType.isTypeOf(5)).toBe(true)
  expect(nullableType.isTypeOf(-5)).toBe(false)
})

test('isTypeOf will be true if null or the baseType isTypeOf is true', () => {
  const baseType = { isTypeOf: value => value === 5 }
  const nullableType = new NullableType(baseType)
  expect(nullableType.isTypeOf(1)).toBe(false)
  expect(nullableType.isTypeOf(5)).toBe(true)
  expect(nullableType.isTypeOf(-5)).toBe(false)
  expect(baseType.isTypeOf(null)).toBe(false)
  expect(nullableType.isTypeOf(null)).toBe(true)
})
