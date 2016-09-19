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
