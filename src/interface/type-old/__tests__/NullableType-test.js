import NullableType from '../NullableType'

test('nonNullType will return the base type', () => {
  const baseType = Symbol('baseType')
  const nullableType = new NullableType(baseType)
  expect(nullableType.nonNullType).toBe(baseType)
})
