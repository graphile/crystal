import NullableType from '../NullableType'

test('getBaseType will return the base type', () => {
  const baseType = Symbol('baseType')
  const nullableType = new NullableType(baseType)
  expect(nullableType.getNonNullType()).toBe(baseType)
})
