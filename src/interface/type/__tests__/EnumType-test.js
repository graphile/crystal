import NamedType from '../NamedType'
import EnumType from '../EnumType'

test('is instance of NamedType', () => {
  expect(new EnumType() instanceof NamedType).toBe(true)
})

test('getVariants will return the variants', () => {
  const name = Symbol('name')
  const variants = ['a', 'b']
  const enumType = new EnumType(name, variants)
  expect(enumType.getVariants()).toEqual(variants)
})

test('getVariants will return a shallow copy of the variants', () => {
  const name = Symbol('name')
  const variants = ['a', 'b']
  const enumType = new EnumType(name, variants)
  expect(enumType.getVariants()).toEqual(variants)
  expect(enumType.getVariants()).not.toBe(variants)
  expect(enumType.getVariants()).toEqual(enumType.getVariants())
  expect(enumType.getVariants()).not.toBe(enumType.getVariants())
})
