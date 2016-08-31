import test from 'ava'
import NamedType from '../../NamedType'
import booleanType from '../booleanType'

test('is a singleton NamedType', t => {
  t.true(booleanType instanceof NamedType)
})

test('getName returns boolean', t => {
  t.is(booleanType.getName(), 'boolean')
})

test('isTypeOf will be true for booleans', t => {
  t.false(booleanType.isTypeOf(undefined))
  t.false(booleanType.isTypeOf(null))
  t.true(booleanType.isTypeOf(true))
  t.true(booleanType.isTypeOf(false))
  t.false(booleanType.isTypeOf(21))
  t.false(booleanType.isTypeOf(3.1415))
  t.false(booleanType.isTypeOf('hello'))
  t.false(booleanType.isTypeOf({}))
  t.false(booleanType.isTypeOf([]))
  t.false(booleanType.isTypeOf(() => {}))
})
