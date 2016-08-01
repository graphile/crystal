import test from 'ava'
import NamedType from '../../NamedType'
import integerType from '../integerType'

test('is a singleton NamedType', t => {
  t.true(integerType instanceof NamedType)
})

test('getName returns integer', t => {
  t.is(integerType.getName(), 'integer')
})

test('isTypeOf will be true for any integer', t => {
  t.false(integerType.isTypeOf(undefined))
  t.false(integerType.isTypeOf(null))
  t.false(integerType.isTypeOf(true))
  t.false(integerType.isTypeOf(false))
  t.true(integerType.isTypeOf(21))
  t.false(integerType.isTypeOf(3.1415))
  t.false(integerType.isTypeOf('hello'))
  t.false(integerType.isTypeOf({}))
  t.false(integerType.isTypeOf([]))
  t.false(integerType.isTypeOf(() => {}))
})
