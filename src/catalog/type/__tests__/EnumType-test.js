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

test('isTypeOf will return false for non-strings', () => {
  const enumType = new EnumType()
  expect(enumType.isTypeOf(null)).toBe(false)
  expect(enumType.isTypeOf(undefined)).toBe(false)
  expect(enumType.isTypeOf(true)).toBe(false)
  expect(enumType.isTypeOf(42)).toBe(false)
  expect(enumType.isTypeOf({})).toBe(false)
  expect(enumType.isTypeOf([])).toBe(false)
  expect(enumType.isTypeOf(() => {})).toBe(false)
})

test('isTypeOf will be true if the string value is one of the enum’s variants', () => {
  const name = Symbol('name')
  const variants = ['a', 'b']
  const enumType = new EnumType(name, variants)
  expect(enumType.isTypeOf('a')).toBe(true)
  expect(enumType.isTypeOf('b')).toBe(true)
  expect(enumType.isTypeOf('c')).toBe(false)
  expect(enumType.isTypeOf('ab')).toBe(false)
  expect(enumType.isTypeOf('abc')).toBe(false)
})
