import test from 'ava'
import NamedType from '../NamedType'
import AliasType from '../AliasType'

test('is a named type', t => {
  t.true(new AliasType() instanceof NamedType)
})

test('getBaseType will return the base type', t => {
  const name = Symbol('name')
  const baseType = Symbol('baseType')
  const aliasType = new AliasType(name, baseType)
  t.is(aliasType.getBaseType(), baseType)
})

test('isTypeOf will use the base type isTypeOf', t => {
  const name = Symbol('name')
  const baseType = { isTypeOf: value => value === 5 }
  const aliasType = new AliasType(name, baseType)
  t.false(aliasType.isTypeOf(-5))
  t.false(aliasType.isTypeOf(6))
  t.true(aliasType.isTypeOf(5))
  t.false(aliasType.isTypeOf(undefined))
  t.false(aliasType.isTypeOf(null))
  t.false(aliasType.isTypeOf('a'))
  t.false(aliasType.isTypeOf(true))
  t.false(aliasType.isTypeOf({}))
  t.false(aliasType.isTypeOf([]))
  t.false(aliasType.isTypeOf(() => {}))
})
