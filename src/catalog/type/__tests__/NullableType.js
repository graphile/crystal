import test from 'ava'
import NullableType from '../NullableType'

test('getBaseType will return the base type', t => {
  const baseType = Symbol('baseType')
  const nullableType = new NullableType(baseType)
  t.is(nullableType.getBaseType(), baseType)
})

test('isTypeOf will be true if the value is null', t => {
  const baseType = { isTypeOf: () => false }
  const nullableType = new NullableType(baseType)
  t.true(nullableType.isTypeOf(null))
  t.false(nullableType.isTypeOf(undefined))
})

test('isTypeOf will be true if the baseType isTypeOf is true', t => {
  const baseType = { isTypeOf: value => value === 5 }
  const nullableType = new NullableType(baseType)
  t.false(nullableType.isTypeOf(1))
  t.true(nullableType.isTypeOf(5))
  t.false(nullableType.isTypeOf(-5))
})

test('isTypeOf will be true if null or the baseType isTypeOf is true', t => {
  const baseType = { isTypeOf: value => value === 5 }
  const nullableType = new NullableType(baseType)
  t.false(nullableType.isTypeOf(1))
  t.true(nullableType.isTypeOf(5))
  t.false(nullableType.isTypeOf(-5))
  t.false(baseType.isTypeOf(null))
  t.true(nullableType.isTypeOf(null))
})
