import test from 'ava'
import NamedType from '../NamedType'
import EnumType from '../EnumType'

test('is instance of NamedType', t => {
  t.true(new EnumType() instanceof NamedType)
})

test('getVariants will return the variants', t => {
  const name = Symbol('name')
  const variants = ['a', 'b']
  const enumType = new EnumType(name, variants)
  t.deepEqual(enumType.getVariants(), variants)
})

test('getVariants will return a shallow copy of the variants', t => {
  const name = Symbol('name')
  const variants = ['a', 'b']
  const enumType = new EnumType(name, variants)
  t.deepEqual(enumType.getVariants(), variants)
  t.not(enumType.getVariants(), variants)
  t.not(enumType.getVariants(), enumType.getVariants())
  t.deepEqual(enumType.getVariants(), enumType.getVariants())
})

test('isTypeOf will return false for non-strings', t => {
  const enumType = new EnumType()
  t.false(enumType.isTypeOf(null))
  t.false(enumType.isTypeOf(undefined))
  t.false(enumType.isTypeOf(true))
  t.false(enumType.isTypeOf(42))
  t.false(enumType.isTypeOf({}))
  t.false(enumType.isTypeOf([]))
  t.false(enumType.isTypeOf(() => {}))
})

test('isTypeOf will be true if the string value is one of the enum’s variants', t => {
  const name = Symbol('name')
  const variants = ['a', 'b']
  const enumType = new EnumType(name, variants)
  t.true(enumType.isTypeOf('a'))
  t.true(enumType.isTypeOf('b'))
  t.false(enumType.isTypeOf('c'))
  t.false(enumType.isTypeOf('ab'))
  t.false(enumType.isTypeOf('abc'))
})
