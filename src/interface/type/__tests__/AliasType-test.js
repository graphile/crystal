import NamedType from '../NamedType'
import AliasType from '../AliasType'

test('is a named type', () => {
  expect(new AliasType() instanceof NamedType).toBe(true)
})

test('getBaseType will return the base type', () => {
  const name = Symbol('name')
  const baseType = Symbol('baseType')
  const aliasType = new AliasType(name, baseType)
  expect(aliasType.getBaseType()).toBe(baseType)
})

test('isTypeOf will use the base type isTypeOf', () => {
  const name = Symbol('name')
  const baseType = { isTypeOf: value => value === 5 }
  const aliasType = new AliasType(name, baseType)
  expect(aliasType.isTypeOf(-5)).toBe(false)
  expect(aliasType.isTypeOf(6)).toBe(false)
  expect(aliasType.isTypeOf(5)).toBe(true)
  expect(aliasType.isTypeOf(undefined)).toBe(false)
  expect(aliasType.isTypeOf(null)).toBe(false)
  expect(aliasType.isTypeOf('a')).toBe(false)
  expect(aliasType.isTypeOf(true)).toBe(false)
  expect(aliasType.isTypeOf({})).toBe(false)
  expect(aliasType.isTypeOf([])).toBe(false)
  expect(aliasType.isTypeOf(() => {})).toBe(false)
})
